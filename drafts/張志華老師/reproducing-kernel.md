# 2 - Reproducing Kernels
> 搬运2014年张志华老师在交大的机器学习系列课程笔记。与"(E. of SL) The Elements of Statistical Learning" 读书笔记同步更新～
- [Intro: Why kernel method](#intro-why-kernel-method)
    - [Cover’s Theorem](#cover%E2%80%99s-theorem)
- [Kernels and PD Kernels](#kernels-and-pd-kernels)
    - [定义及性质](#%E5%AE%9A%E4%B9%89%E5%8F%8A%E6%80%A7%E8%B4%A8)
        - [Theorem 1](#theorem-1)
        - [Theorem 2](#theorem-2)
        - [Theorem 3](#theorem-3)
    - [正定核例子及说明](#%E6%AD%A3%E5%AE%9A%E6%A0%B8%08%E4%BE%8B%E5%AD%90%E5%8F%8A%08%E8%AF%B4%E6%98%8E)
        - [(minus - ) Euclidean](#minus---%08euclidean)
        - [Gaussian kernel (RBF Kernel)](#gaussian-kernel-rbf-kernel)
        - [Laplacian kernel](#laplacian-kernel)
        - [Linear kernel](#linear-kernel)
        - [Polynomial kernel](#polynomial-kernel)
        - [Kernel Generating Sobolev spaces](#kernel-generating-sobolev-spaces)
        - [Kernel Generating Paley-Wiener space](#kernel-generating-paley-wiener-space)
        - [Kernels defined by histograms](#kernels-defined-by-histograms)
- [RKHS](#rkhs)
    - [标准定义:](#%E6%A0%87%E5%87%86%E5%AE%9A%E4%B9%89)
- [Proof](#proof)
    - [PF 1](#pf-1)
    - [PF 2](#pf-2)


## Intro: Why kernel method
`REMARK` 解决低维空间下不可分的问题时，可以将这些样本 $\bf X$ 投射至高维甚至无限维空间中; 对应的空间往往更易分.(Cover's Theorem[$\dagger$](#cover%E2%80%99s-theorem))  这种思想的一大问题是如何求解变换映射 $\phi:\mathbf X\rightarrow \bf \Phi$。

核方法利用一个二元的核函数，$K(i,j)$ 代替 $\bf \Phi$ 空间的内积来衡量样本间的相似程度。在特征空间$\bf \Phi$中，我们只需要知道这些样本间的相似程度，便可以构建分类器，并不需要显式地定义函数$\phi$。这种思想称为 [kernel trick](https://en.wikipedia.org/wiki/Kernel_method#Mathematics:_the_kernel_trick). 由于一切正定核函数都对应某希尔伯特空间中的内积，我们一般要求核函数的正定性。(除此之外，一般提到的核都是对称核，这与一般问题中所指（半）正定矩阵的习惯相似)

确定核函数K的正定性时，最简单的方法有两种，一是直接利用特征空间$\bf \Phi$，若该函数可以表示为内积，则可证其正定性。而是利用[定义及性质](#%E5%AE%9A%E4%B9%89%E5%8F%8A%E6%80%A7%E8%B4%A8)中的三个定理，运用负定及正定核的相互关系来进行证明。下面列出的[正定核例子](#%E6%AD%A3%E5%AE%9A%E6%A0%B8%08%E4%BE%8B%E5%AD%90%E5%8F%8A%08%E8%AF%B4%E6%98%8E)，都可以直接验证。

常用的相似度函数中，cosine实际是原空间的线性核。由于线性核的正定性（内积正定），多项式核的正定型也很容易证明，可作为一类。 由欧几里得范数构成的核是负定的, 所以一般使用负范数;  而 Gaussian (RBF), Laplacian，以及关于计数型数据的核函数[$\dagger$](#kernels-defined-by-histograms)可以看作是对范数, 距离 (metric) 的推广，可由`Theorem 2` 证明其正定性。

### Cover’s Theorem
* A complex pattern-classiﬁcation problem cast in a highdimensional space nonlinearly is more likely to be linearly separable than in a low-dimensional space.[$\dagger$](https://en.wikipedia.org/wiki/Cover%27s_theorem)
* Cover's theorem 表明高维空间下数据更可能“线性可分”(linearly separable)
    * suppose $\exists \phi,\; s.t.\;\; \phi:\mathbf X \subset \mathbb{R}^p \rightarrow \phi(\mathbf X) \subset \mathbb{R}^r, r>p$
    * $\phi$ is more likely to be separated

## Kernels and PD Kernels

### 定义及性质
$x \in \mathbb{R}^p, \mathbf X$ is nonempty
* symmetric by default: $K(i,j) = K(j,i)$
* p(s).d if:
    $\displaystyle\sum_{j,k=1}^n\alpha_i\alpha_jK(x_i,x_j) \ge 0$, $\forall n \in \mathbb{N}_+, \{x_i,x_j\}\in \mathcal X, \{\alpha_i\} \subset \mathbb{R}$
    
    Using Gramian matrix $\bf K$: 
    ${\bf \alpha^T K \alpha} \ge 0$
* conditional p.d if: ${\bf \alpha^T K \alpha} \ge 0\;\; \forall n\ge2,\;\alpha^T1=0$
* n.d if $-K$ is c.p.d 
* K p.d. $\Rightarrow K(x,x)\ge 0$
    * Moreover, if ${\displaystyle H}$ is a Hilbert space, then its corresponding inner product ${\displaystyle (\cdot ,\cdot )_{H}:H\times H\to \mathbb {R} }$  is a p.d. kernel.
* if $K(x,y) = \langle f(x),f(y)\rangle$, K is p.d. (**Proof** easy to verify: $\bf K = FF^T$ p.d)

* `Combination` of p.s.d. kernels
由正定核序列$\{K_n\}$可诱导出新的正定核，如:
    * 线性组合 (w.t. $\lambda \ge 0$)
    * 幂组合(${K}^{a_n}_n$) $\Leftrightarrow$ 泰勒级数
    * pointwise limit: $\displaystyle K = \lim_n K_n$, if ***lim*** exists.
    * "subsets" $K_0$ of $K$ on a small set $\mathbf X_0 \times \mathbf X_0$
#### Theorem 1 

Suppose $\bf X$ is nonempty, $x_0\in \bf X$:
for kernel $\varphi$ and define another kernel $K(x,y) = \varphi(x,x_0)+\varphi(y,x_0)-\varphi(x,y)-\varphi(x_0,x_0)$, 
then:

 $$K \text{ p.s.d iff  } \phi \text{   n.d}$$

`P.F.`see [P.F 1](#pf-1)

#### Theorem 2

$\varphi$ is n.d iff $\displaystyle e^{-t\varphi}$ is p.d $\forall t>0$

`P.F.` see [P.F 2](#pf-2)

#### Theorem 3 
define probability measure $\mathbf F$ over $\mathbb R_+$ with positive finite expectation, i.e.:

$$0< \int_{s\in \mathbb R_+}sd \mathbf F < \infty$$
$\varphi$ is n.d. iff $\mathcal L_{\mathbf F} [-t\varphi]$ is p.d. $\forall t>0$, where $\mathcal L_{\mathbf F}[\cdot]$ is the Laplace transform 

### 正定核例子及说明

#### (minus - ) Euclidean
$K(x,y) = ||x-y||_2^2$ is n.d.

`P.F.`
use Theorem 1:

$K(x,x_0)+K(y,x_0)-K(x,y)-K(x_0,x_0)$

$= 2x^Ty+2x_0^T x_0-2x^Tx_0-2y^Tx_0$

$= 2^{1/2}(x-x_0)^T2^{1/2}(y-x_0)$ is a inner product, thus p.s.d; so we have the Euclidean distance "Kernel" is n.d

`Remark` Use $K = - ||x-y||_2^2$ as a p.s.d Kernel
#### Gaussian kernel (RBF Kernel)
${\displaystyle K(x,y)=e^{-{\frac {\|x-y\|^{2}}{2\sigma ^{2}}}},x,y\in \mathbb {R} ^{d},\sigma >0}$
#### Laplacian kernel
${\displaystyle K(x,y)=e^{-\alpha \|x-y\|},x,y\in \mathbb {R} ^{d},\alpha >0}$
#### Linear kernel 
${\displaystyle K(x,y)=x^{T}y,x,y\in \mathbb {R} ^{d}}$

`remark` $\cos(x,y) = \frac{x^{T}y}{||x||\cdot ||y||}$ 使用cos => 线性核
#### Polynomial kernel
${\displaystyle K(x,y)=(x^{T}y+r)^{n},x,y\in \mathbb {R} ^{d},r>0}$
#### Kernel Generating Sobolev spaces 
${\displaystyle W_{2}^{k}(\mathbb {R} ^{d})}: {\displaystyle K(x,y)=\|x-y\|_{2}^{k-{\frac {d}{2}}}B_{k-{\frac {d}{2}}}(\|x-y\|_{2})}$, where ${\displaystyle B_{\nu }}$ is the Bessel function of third kind.
#### Kernel Generating Paley-Wiener space
${\displaystyle K(x,y)={\bf sinc}(\alpha (x-y)),x,y\in \mathbb {R} ,\alpha >0}$
#### Kernels defined by histograms 
${\displaystyle \psi _{JD}=H\left({\frac {\theta +\theta '}{2}}\right)-{\frac {H(\theta )+H(\theta ')}{2}},}$

${\displaystyle \psi _{\chi ^{2}}=\sum _{i}{\frac {(\theta _{i}-\theta _{i}')^{2}}{\theta _{i}+\theta _{i}'}}}$

$\psi _{TV}=\sum _{i}|\theta _{i}-\theta _{i}'|$ 

can be used to define p.d. kernels using the following formula

${\displaystyle K(\theta ,\theta ')=e^{-\alpha \psi (\theta ,\theta ')},\alpha >0}$

## RKHS
* [wiki page](https://en.wikipedia.org/wiki/Reproducing_kernel_Hilbert_space)

### 标准定义:
* Suppose $\mathcal H$ is a Hilbert space of functions on $\mathcal X$, define **evaluation functional** over $\bf \mathcal H$ at each point $x$, $L_x : f \rightarrow f(x)\;\; \forall f \in \mathcal H$
* Then $\mathcal H$ is a RKHS if $\forall x \in \mathcal X, L_x$ is cont. at each $f$ (i.e., bounded)
* wiki页面中解释"feature maps"的部分好懂一点
* Feature map: $\phi : \bf \mathcal X \rightarrow \mathcal F$ (Hilbert space: feature space)
* Kernel functions: $K(x,y) = \langle\phi(x),\phi(y)\rangle_{\mathcal{F}},\langle\cdot,\cdot\rangle_{\mathcal F}$ is the inner-product


## Proof
### PF 1
let $a \in \mathbb R^n.\;\;x_0,x_1,...,x_n \in \mathbf X$, for kernel $\varphi$, we have corresponding matrix of kernel: $\mathbf \Phi$. notice: $(\mathbf 1|\mathbf 0)$ is a matrix with first column as 1 vector

$K = [K(i,j)] = (\mathbf 1|\mathbf 0)\mathbf \Phi + \mathbf \Phi\Big(\displaystyle \frac {\mathbf 1^T}  {\mathbf 0} \Big) - \mathbf \Phi - \varphi(x_0,x_0)\mathbf{11}^T$

$\therefore a^T\mathbf K a = (a^T1,0,...)\mathbf \Phi a + a^T\mathbf \Phi(a^T1,0,...)^T - a^T\mathbf \Phi a - \varphi(x_0,x_0)(a^T1)^2$    $(*)$

$\dagger$ Sufficiency:

if K is p.d, then take $\forall a$ s.t. $a^T1=0$, we have $(*): \;\;\ge 0$:

$(*):(a^T1,0,...)\mathbf \Phi a + a^T\mathbf \Phi(a^T1,0,...)^T - a^T\mathbf \Phi a - \varphi(x_0,x_0)(a^T1)^2=-a^T\mathbf \Phi a\ge 0 \Rightarrow \mathbf \Phi \text{ n.d}$.

$\dagger$ Necessity: let first column of $\mathbf\Phi$ be $\mathbf\Phi_0$

$(*):(a^T1,0,...)\mathbf \Phi a + a^T\mathbf \Phi(1,0,...)^T - a^T\mathbf \Phi a - \varphi(x_0,x_0)(a^T1)^2$

$=2(a^T1)a^T\mathbf\Phi_0-a^T\mathbf\Phi a - \varphi(x_0,x_0)(a^T1)^2$, take RHS as $L(a,\bf \Phi)$ 
  
Since $K$ is p.d. is equivalent to:\
$\Leftrightarrow L= 2(a^T1)a^T\mathbf\Phi_0-a^T\mathbf\Phi a - \varphi(x_0,x_0)(a^T1)^2 \ge 0,$ at each $a$

$\displaystyle \Leftrightarrow L= \Big(a-(a^T1)[1,0,0...]^T\Big)^T(- \mathbf \Phi)\Big(a-(a^T1)[1,0,0...]^T\Big)\ge 0$ at each $a$

$\displaystyle \Leftrightarrow - \mathbf  \Phi \succeq 0, \;\;\forall a\in \mathbb{R}^{n+1}$ 

we notice: $\Big(a-(a^T1)[1,0,0...]^T\Big)^T1=0$, i.e., 

$\displaystyle \Leftrightarrow - \mathbf  \Phi \succeq 0, \;\;\forall \nu\in \mathbb{R}^{n+1}$ such that $\nu^T1=0$. The proof is complete.



### PF 2
$\dagger$ Necessity

Notice sequence $\displaystyle\Big\{\frac{1-\exp(-t\varphi)}{t}\Big\}_t$:

$\displaystyle\lim_{t\to 0} \frac{1-\exp(-t\varphi)}{t} =\varphi$, the point-wise limit exists, hence $\varphi$ is n.d

$\dagger$ Sufficiency

Suppose $\varphi$ is n.d, by P.F.1 we have:

$K(x,y) = \varphi(x,x_0)+\varphi(y,x_0)-\varphi(x,y)-\varphi(x_0,x_0)$ is p.d , given point $x_0$ 

By Taylor series, it's easy to verify $\exp(tK)$ is p.d, hence:

$\exp(tK) = \exp(t\varphi(x,x_0))\exp(t\varphi(y,x_0))\exp(-t\varphi(x,y))\exp(-t\varphi(x_0,x_0))$

$= \langle\exp(t\varphi(x,x_0)),\exp(t\varphi(y,x_0))\rangle \cdot\exp(-t\varphi(x,y))\succeq 0 \Rightarrow \exp(-t\varphi(x,y))\succeq 0$

The PF is complete


