---
layout: post
title:  "Working Notes: Combine [Kafka, Spark, TensorFlow] in one job"
date:   2018-07-21 22:37:59 +0800
categories: coding
---

- [Background](#background)
- [主流程](#%E4%B8%BB%E6%B5%81%E7%A8%8B)
  - [预处理: Kafka + Spark Streaming](#%E9%A2%84%E5%A4%84%E7%90%86-%08kafka--spark-streaming)
  - [执行预测: 请求模型服务](#%E6%89%A7%E8%A1%8C%E9%A2%84%E6%B5%8B-%E8%AF%B7%E6%B1%82%E6%A8%A1%E5%9E%8B%E6%9C%8D%E5%8A%A1)

## Background

今年初做模型时第一次接触到DL, 咬牙抛弃了Keras之类的“高级”API, 从0开始上TensorFlow, 也算是入了CV的坑。除去使用和学习 (fork) Google的代码带来的巨大提升，期间部署服务，制作管理docker镜像，推动运维部门做k8s服务都带来了极大收获。

另一方面，之前已经对 Spark 2.0 有了一定了解, 利用一些内置的功能跑着日常的挖掘工作 (human learning). 很自然，想到了把TF扔在Spark里跑的点子，挥之不去。初步研究有两种做法：

a. 原汁原味地打包TF环境并配好分布式应用需要的环境。

b. 将模型做成gRPC服务在Spark job中请求 [ TensorFlow-serving 号称可跑MR job，亲测可用 ]

最后踩通a. 仍不满意。由于需要TF的模块实际上在处理大批堆积起来的离线日志，跑起来代价还是很大。很自然想到之前听说的流式计算大法，据传主流有Akka/Kafka. 看到空闲的数台大内存服务器按捺不住。考量之下, 为了和同事一起 (帮我debug), 放弃 Scala 向的 Akka, 采用 Kafka + Spark Streaming, 如此试水之旅开始.

初步研究, 大概需要做如下几个方面的事情: 
- 任务 `task`: streaming 实时处理 (Spark + Kafka), 设计模型预测 (TF + gRPC), 中间数据序列化 (最好跨平台 => protobuf) 存储 (MySQL/Hbase/Redis/...) 可能需要的中间件 (Redis)
- 设计的流程 `pipeline`:
    - 主流程 main: 通过Kakfa实时处理"源"topic `s0` => 推到预处理后的topic `s1` => 推到模型的RPC Service 获得预测结果 => 推到结果(inference) topic `s2` 
    - 存储: `s2` => 数据库等...
    - 模型流程 modeling: `s1` => training/evaluation => 模型版本控制及更新
    - API & Front-end

## 主流程

### 预处理: Kafka + Spark Streaming

> target: `s0` -> `s1` 大致预处理一下数据, 根据模型需要计算一下统计量
 
处理方式因数据是否有无状态分为两种. 比较简单的是无状态数据 (stateless), 因为数据之间没有依赖, 没有开始及结束, 每条数据的处理方法都一样. 

有状态 (stateful) 麻烦一点. 比如, 假设我们要根据用户在网页访问的 session 来设计模型, 理想条件下我们需要等待用户结束 session 后才能计算. 当然也可以根据 key-value 结构进行离线处理, 设定滑动时间窗“模拟”, 但都没有实现 ["stateful streaming"](https://databricks.com/session/deep-dive-into-stateful-stream-processing-in-structured-streaming) (除了 spark streaming, Akka 也有类似现成的机制). 本来想把系统做成 stateful, 但坑也没有踩通. 暂且用 stateless. (update: 用Redis做缓存做了一个基本stateful) 基本的代码如下:

```scala
val TOPIC = "1231"
def main(args: Array[String]): Unit = {
    val spark = SparkSession
      .builder()
      .appName(s"kafka streaming from s0 to s1")
      .getOrCreate()
    // streaming context
    val ssc = new StreamingContext(spark.sparkContext, BATCH_TIME)
    // config kafka producer & streaming context
    // 配置 kafka streaming context (source) 及 kafka producer
    val kafkaProducer = getOutputKafkaBroadcast(ssc)
    val stream = getStreamAsGroup(ssc, "group1")
    stream.map(record => (record.key, record.value)).
      // map to k,v
      map { record =>
      // TODO
      // do your process here
      // 处理你的数据
    }.
      // do some extra operation
      // 作额外的操作
      // filter(true).
      // mapValues(_).
      // map(_).
      // produce by each partition
      foreachRDD { rdd =>
      rdd.foreachPartition { partitionOfRecords =>
        val metadata: Stream[Future[RecordMetadata]] = partitionOfRecords.map { record =>
          kafkaProducer.value.send(TOPIC, record._1, record._2);
        }.toStream
        metadata.foreach { metadata => metadata.get() }
      }
    }
    ssc.checkpoint(s"/tmp/kafka-sink-checkpoint-${TOPIC.toLowerCase}")
    ssc.start
    ssc.awaitTermination()
  }
```
Spark streaming 需要的依赖: (我用 Spark 2.2.0, Kafka API 0.10+, Scala 2.11)
```xml
<!-- kafka -->
<dependency>
    <groupId>org.apache.spark</groupId>
    <artifactId>spark-sql-kafka-0-10_2.11</artifactId>
    <version>2.2.0</version>
</dependency>
<dependency>
    <groupId>org.apache.spark</groupId>
    <artifactId>spark-streaming-kafka-0-10_2.11</artifactId>
    <version>2.2.0</version>
</dependency>
<!-- kafka already harmonized by spark-streaming-kafka -->
<!--<dependency>
    <groupId>org.apache.kafka</groupId>
    <artifactId>kafka-clients</artifactId>
    <version>0.10.0.0</version>
</dependency>-->
```
```scala
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.clients.producer.{KafkaProducer, ProducerRecord, RecordMetadata}
import org.apache.kafka.common.serialization.{StringDeserializer, StringSerializer}
import org.apache.spark.broadcast.Broadcast
import org.apache.spark.streaming.StreamingContext
import org.apache.spark.streaming.dstream.InputDStream
import org.apache.spark.streaming.kafka010.ConsumerStrategies.Subscribe
import org.apache.spark.streaming.kafka010.LocationStrategies.PreferConsistent
import org.apache.spark.streaming.kafka010.{KafkaUtils => SparkKafkaUtils}
```
预处理部分完全可以用纯 kakfa (spark-free) 实现, 如下:
```scala

// companion obj
object ProcConsumer {
  val server: String = "192.168.1.1:8888"
  val group: String = "group1"
  var log: Logger = LoggerFactory.getLogger(classOf[...])
  var topics = Array("topic1", "topic2", "topic3") 
  var mstrLogs: Seq[Logger] = topic.map(x => LoggerFactory.getLogger(x))

  def main(args: Array[String]): Unit = {
    val offsetFile = args(0)
    System.out.println("server: " + server)
    System.out.println("group: " + group)
    System.out.println("offsetFile: " + offsetFile)

    val consumer = KafkaUtils.getKafkaConsumer(server, group, false, "10485760")
    try {
      KafkaUtils.assignParts(consumer, topic, offsetFile)
      val offsetMap = new java.util.HashMap[String, PartitionVO]
      offsetMap.keySet().toArray.foreach(println)
      val run = true
      while (run)
        try {
          val records = consumer.poll(10000)
          import scala.collection.JavaConversions._
          for (record <- records) {
            // process here
            // 处理你的数据
          }
        } catch {
          case e: Exception =>
            log.error("", e)
            try
              Thread.sleep(10000)
            catch {
              case e1: InterruptedException =>
                e1.printStackTrace()
            }
        }
    } catch {
      case e: Exception =>
        log.error("exit system.", e)
    } finally if (consumer != null) consumer.close()
  }
```
你甚至可以用 python, 比如 kafka-python
```bash
pip install kafka-python==1.4
```
### 执行预测: 请求模型服务

首先要将针对`s1`的模型已经做好了, 部署在localhost/Docker中.

TensorFlow serving 需要一个 gRPC client, 这里可以参见tensorflow 的官方教程走一遍流程. 设计模型 => 训练 => export (SavedModel) => tensorflow serving, 一言难尽, 此处略过...=> 快进: 假设我们已经有这样一个server.

如果进行预测的服务采用 python语言，可以直接使用tensorflow的官方API [tensorflow-serving API](https://github.com/tensorflow/serving). 当然 gRPC 本身可以用其他语言发起请求，客户端完全可以写成 Scala/Python/C++，只需要编译tensorflow/tf-serving 对应的protobuf即可。
这里我加上了 PySpark (Spark Python) 读取Kafka topic@`s1`, 便于在 Spark 集群中执行 gRPC request, 然后推送到新的结果topic@`s2`, 大致需要如下的模块:

```python
"""
...
"""
import argparse
import json
import logging

import numpy as np
import tensorflow as tf
from grpc.beta import implementations
from kafka import KafkaProducer
from tensorflow_serving.apis import predict_pb2
from tensorflow_serving.apis import prediction_service_pb2

from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils

NAME = "..."
FORMAT = '[%(levelname)s:%(name)s] [%(asctime)s] %(message)s'
logging.basicConfig(level=logging.INFO, format=FORMAT, datefmt='%m/%d/%Y %I:%M:%S %p')
logging.getLogger(NAME)

parser = argparse.ArgumentParser()

# parser.add_argument(...)

args = parser.parse_args()


def _kafka_handler(rdd, out_topic, server):
	producer = KafkaProducer(bootstrap_servers=server)

	for result in rdd.collect():
        # process result
        # 处理输出, 如序列化..
        # msg = func(result)
        producer.send(out_topic, msg)
        producer.flush()

def _grade_line(line, stub=None):
	"""
	:param line: line of the Kafka message
        - TODO: put each part to async
	:param stub: model TF stub; none (preferable, get a new instance)
	:return: 
        - model inference
	"""
  # get a tensorflow serving stub
  if stub is None:
      host, port = args._server.split(":")
      channel = implementations.insecure_channel(host, int(port))
      stub = prediction_service_pb2.beta_create_PredictionService_stub(channel)
	# line parsing try-catch; fail then return None;
	try:
		# do parsing line
    line_decoded = parse_line(line)
	except Exception as e:
		logging.info(e.message)
		return None
	
	try:
    # process your data
    # input1, input2, ... = function(line_decoded)
    # get data ready; make a rpc call
    # serialize and copy to request.input

    request = predict_pb2.PredictRequest()
    request.model_spec.name = "_"
    request.model_spec.signature_name = "predict"
    request.inputs["input1"].CopyFrom(tf.contrib.util.make_tensor_proto(input1, shape=None))
    request.inputs["input2"].CopyFrom(tf.contrib.util.make_tensor_proto(input2, shape=None))
    ...
    request.inputs["inputn"].CopyFrom(tf.contrib.util.make_tensor_proto(inputn, shape=None))
    result = stub.Predict(request, 10.0)
	except Exception as e:
		logging.info("_ event none or inference error")
	return result


def main():
	args = parser.parse_args()
	print args
	...
	sc = SparkContext(appName="...")
	sc.setLogLevel("WARN")
	ssc = StreamingContext(sc, _batch_["batch_size"])
	ssc.checkpoint("/tmp/pyspark-stream2")
	kvs = KafkaUtils.createDirectStream(ssc, [topic], {"group.id": "good boy tom", "bootstrap.servers": brokers})

	"""
	=== decoded message push back to Kafka
	"""
	lines = kvs.map(lambda line: _grade_line(line, stub=None))

	lines.foreachRDD(lambda x: _kafka_handler(x, "output_topic", server=server))
	ssc.start()
	ssc.awaitTermination()


if __name__ == "__main__":
	main()
``` 