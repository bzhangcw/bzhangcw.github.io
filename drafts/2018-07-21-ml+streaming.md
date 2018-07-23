---
layout: post
title:  "Combine [Kafka, Spark, TensorFlow] in one job"
date:   2018-07-21 22:37:59 +0800
categories: coding
---
> Notes on ML in streaming system, with Spark, Kafka, and TensorFlow

- [Background](#background)
- [主流程](#%E4%B8%BB%E6%B5%81%E7%A8%8B)
  - [预处理: Kafka + Spark Streaming](#%E9%A2%84%E5%A4%84%E7%90%86-%08kafka--spark-streaming)
  - [执行预测: 请求模型服务](#%E6%89%A7%E8%A1%8C%E9%A2%84%E6%B5%8B-%E8%AF%B7%E6%B1%82%E6%A8%A1%E5%9E%8B%E6%9C%8D%E5%8A%A1)

## Background

今年一月时开始正式开始接触TensorFlow, 版本正好是r1.4, 因为公司要上图像识别系统, 没有现成的图像工程师, 顶上. 到3月底整个模型训练系统（包括简单的迁移学习, 目标识别, OCR, 标注工具, 爬虫采集, 版本更新等）初见规模; 新的训练数据集加入后便可更新模型版本。后来花了一月做部署任务, 同样也用 Google 的gRPC + Protobuf, 为扩大规模使用 k8s + docker 来处理记录. 

另一方面，之前已经对 Spark 2.0 有了一定了解, 利用一些内置的功能跑着日常的挖掘工作 (human learning). 大多数的工作还是在做离线计算, 对其不足之处有了一些领悟:
- 有些数据根本不需要reduce操作, 处理流程完全独立, 完全可以实时map; 数据到达时已经自然形成了“group”, 但由于hdfs分区, MR 或 groupBy 时其实浪费了本来的结构, 产生了额外代价
- 离线处理起来跑不动 (同事抢资源) [我要常驻在进程里占住资源???]
- 由于离线计算的等待时间, 实在不便与快速实现一个思路
- 做模型的prototype时，往往需要取具有实效性的sample, 每次测试都要拉一边数据库
- 实现实时监控的效果 [做demo, 实时统计等]

streaming的优点在于:
- 中间结果推到独立的topic, 便于复用;
- 基本上不需要额外的脚本来管理hdfs中的数据, 做定期任务, 或者执行极为复杂的 workflow (流程管理是真的烦, 想象一下你的数据都可以通过一个 topic list 拉取, 你不需要关心执行计算时数据是否可用)
- 隐约觉得 scala 和 streaming 莫名契合, 难道是因为函数式?

streaming 大法好. 恰好, 三月末上面给了任务, 要对全新的日志来源做分析, 正好要求后端改成 streaming. 考量之下, 为了和同事一起踩坑, 放弃 Scala 向的 Akka, 采用Kafka传回, 如此试水之旅开始.

初步研究, 大概需要做如下几个方面的事情: 
- 任务 `task`: streaming 实时处理 (Spark + Kafka), 设计模型预测 (TF + gRPC), 中间数据序列化 (最好跨平台 => protobuf) 存储 (MySQL/Hbase/Redis/...)
- 设计的流程 `pipeline`:
    - 主流程 main: 通过Kakfa实时处理"源"topic `s0` => 推到预处理后的topic `s1` => 推到模型的RPC Service 获得预测结果 => 推到结果(inference) topic `s2` 
    - 存储: `s2` => 数据库等...
    - 模型流程 modeling: `s1` => training/evaluation => 模型版本控制及更新
    - API & Front-end: query from API => web-app

## 主流程

### 预处理: Kafka + Spark Streaming

> target: `s0` -> `s1` 大致预处理一下数据, 根据模型需要计算一下统计量
 
处理方式因数据是否有无状态分为两种. 比较简单的是无状态数据 (stateless), 因为数据之间没有依赖, 没有开始及结束, 每条数据的处理方法都一样. 

有状态 (stateful) 麻烦一点. 比如, 假设我们要根据用户在网页访问的 session 来设计模型, 理想条件下我们需要等待用户结束 session 后才能计算. 当然也可以根据 key-value 结构进行离线处理, 设定滑动时间窗“模拟”, 但都没有实现 ["stateful streaming"](https://databricks.com/session/deep-dive-into-stateful-stream-processing-in-structured-streaming) (除了 spark streaming, Akka 也有类似现成的机制). 本来想把系统做成 stateful, 但坑也没有踩通. 暂且用 stateless. 基本的代码如下:

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

TensorFlow serving 需要一个 gRPC client, 跟你对应的模型相关, 这里可以参见tensorflow 的官方教程走一遍流程. 设计模型 => 训练 => export (SavedModel) => tensorflow serving, 一言难尽, 此处略过...=> 快进: 假设我们已经有这样一个server.

如果进行预测的服务采用 python语言，可以直接使用tensorflow的官方API [tensorflow-serving API](https://github.com/tensorflow/serving). 这里我加上了 PySpark (Spark Python) 读取Kafka topic@`s1`, 便于在 Spark 集群中执行 gRPC request, 然后推送到新的结果topic@`s2`, 大致需要如下的模块:

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

pyspark 缺少大部分的 python 运行环境，一种做法试打包 conda/virtualenv 环境（配好你的依赖），执行 spark 任务时上传依赖并附加软链。可以参考hortonworks提供的[教程](https://community.hortonworks.com/articles/58418/running-pyspark-with-conda-env.html)