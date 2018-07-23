# (E of SL) Ch. 1~2 笔记
- [(E of SL) Ch. 1~2 笔记](#e-of-sl-ch-12-%E7%AC%94%E8%AE%B0)
    - [statistical decision theory](#statistical-decision-theory)
        - [Concepts: loss, risk (expected prediction error, EPE)](#concepts-loss-risk-expected-prediction-error-epe)
        - [The loss function](#the-loss-function)
            - [the squared loss](#the-squared-loss)
            - [0-1 loss in classification](#0-1-loss-in-classification)
            - [Remark](#remark)
    - [miscellanea](#miscellanea)
        - [Mean square error and residual sum of square:](#mean-square-error-and-residual-sum-of-square)
    - [P.F](#pf)
        - [Ch1](#ch1)

> **REMARK** E.of.SL Chapter 1,2 读书笔记\
主要涉及一些基本知识, 尤其是第二章堪称经典。

1. 首先是将统计学习的方法大致分为两类
    * “参数/模型”化的，即指定模型函数的具体形式，限制函数空间, 如线性函数, 多项式, 及衍生的basis expansion方法.
    * "局部化"邻域型的方法，与之相关的样本间距离的“相似”测度 (similarity metric)
    * 综合"局部化" + “参数化” 的思想，e.g.: partition the population of X, y; on each "local subset", use a parametric model. 
2. 然后介绍了统计学习的基本框架
    * [2.4 ~ 2.6]这几个部分从经典点估计／函数估计／统计决策理论的角度阐述机器学习（统计学习）的大致内容
    * 在统计决策中，我们常常采用"loss function  + risk"的方法评价"决策"(参数估计)的质量。类似地, SL (supervised learning) 中，同样可以采用这个思路。 
3. Summarize problems in "1."
## statistical decision theory
### Concepts: loss, risk (expected prediction error, EPE)
* **@true fact**, EPE notation used in "The Elements in Statistical Learning" is basically a frequentist's risk.
### The loss function
#### the squared loss
* $f(x) = \mathbf E(y|x);\;\forall x$, if $f$ is unconstrained, $f \in \mathbb{C}_0(\mathbb{R}^m)$
* if $f \in \mathbb{C}_0$, we have the estimation:
    * $\bf{\beta} = \bf{\mathbf{E}}(xx')^{-1}\mathbf{E}(x'y)$
        * P.F see [P.F 1.1](#pf-11)
* if $f$ is a neighborhood-type method: 
    * the k-nearest-neighbor is very similar to [**simple functions**](https://en.wikipedia.org/wiki/Simple_function), where $f=\mathbf{E}(y|x\in \bf{N}(x))$
    
#### 0-1 loss in classification
* for bayesian classifier if discrete y (categorical)
* where:
    * $\displaystyle \bf{L = 11' - I_n}$, we have:
    * $f(x) = e_k$, where $k = \text{argmax}_k(P(y_k=1|x))$
        * P.F see [P.F 1.3](#pf-13)
    * K-classification: equivalence of $\mathcal{L}_2$ for regression and 0-1 loss for bayesian classifition
        * P.F see [P.F 1.4](#pf-14)
    
#### Remark
* if f additive model:
        * It turns out that the optimal estimate for the additive model uses techniques such as k-nearest neighbors to approximate univariate conditional expectations simultaneously for each of the coordinate functions
        * P.F 1.4
* use l = absolute-loss 
        * $f(x) = \text{median}(y|x)$

       
## miscellanea
### Mean square error and residual sum of square:

* https://stats.stackexchange.com/questions/73540/mean-squared-error-and-residual-sum-of-squares
* MSE :->> (usually frequentist) risk function: estimator to population quantities e.g. $\bar{x} - \mu$
* RSS/SSE :->> not a risk function: estimator to real samples, e.g. $\bar{x} - x_i$
* https://en.wikipedia.org/wiki/Errors_and_residuals

## P.F
### Ch1
##### P.F 1.1
$\displaystyle \mathbf{R} = \int_{y,x}(y-f(x))^2\;d{\bf P}(x,y)$, pointwise minimization **CANNOT BE USED**:\
$\displaystyle \mathbf{R} = \int_{y,x}(y-\beta'x)^2\;d{\bf P}(x,y)$ convex in $\beta$\
$\displaystyle \partial \mathbf{R} /\partial \beta = \int_{y|x}2x(y-x'\beta)\;d{\bf P}(x,y) = 0\Rightarrow \mathbf{E}(xy) = \mathbf{E}(xx')\beta$\
$\beta = \mathbf{E}(xx')^{-1}\mathbf{E}(xy)$

***注***：$\mathbf{E}(xx')$ may not  be invertible
##### P.F 1.3
The Bayesian classifier:\
$\displaystyle \mathbf{R} = \int_{y,x}y'Lf(x)\;d{\bf P}(x,y)$, pointwise minimization, $\displaystyle \forall x$:\
$\displaystyle {\bf R_{x}} = \int_{y|x} y_x'L\cdot fd{\bf P}(y|x)$\
$\displaystyle \;\;\; = \int_{y|x} y_x'd{\bf P}(y|x)\cdot{\bf L}\cdot f= \mathbf{E}(y|x)' \cdot({\bf 11' - I_n})\cdot f\cdot$\
$\displaystyle \;\;\; =1 - \mathbf{E}\big(y|x\big)'f$, thus we have $\forall x$ in the support:

$$f = \text{arg}\max_k\big(\mathbf{E}(y_k)|x\big)=\text{arg}\max_k\big(\mathbf{P}(y_k=1)|x\big)$$
##### P.F. 1.4
Consider regression model for k-classification using $\mathcal{L}_2$ loss:\
$\displaystyle \mathbf{R} = \int_{y,x}||y-f(x)||\; d{\bf P}(x,y)$\
In this case, function $f$ maps $\mathcal{X} \subseteq \mathbb{R}^m$ to set of $y \in \{\mathbf e_k\}_{k=1}^{K}$\
$f=\mathbf E(y|x)$, the result is **exact**

$\Lambda$ fdasdr

$$\theta$$

