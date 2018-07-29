# (E of SL) Ch. 4 Notes, 1



## Notation
$x \in \mathcal{X}\subset{\mathbb{R}}^p$, feature vector, take N samples, we have $\displaystyle X = \{x_i^T\}_{i=1}^N$

$\mathcal{G}= \{1,...,K\}$, set of categories, where $g(x) \in \mathcal{G}$. Alternatively, we can also denote the class of $x$ as $y$, where $y \in \{e_k\}$, $e_k$ is the a n-vector with $1$ in the $k$-th dimension, and $0$ elsewhere.

$\delta_k(x)$: discriminant function (methods of this kind will classify to the argmax on $k$). A linear discriminant function (in $x$) will result in a linear decision boundary. The rationale of using argmax comes from categorical distribution (where $E(y|x) = p$)

## Recap
### The 0-1 loss
In Ch.2, with a binary loss function [ $\displaystyle l(f,y) = 1 - \mathbf{bool}(f=y)$, $\mathbf{bool}$ is the boolean operator ] , we will have the Bayes classifier. Here we brief review the relationship:

$g(x) = k \Leftrightarrow y=e_k$

Then:
$l(f,y) = y^TL\cdot f$, where $L$ is a matrix with $0$ on its diagonal and $1$ elsewhere, i.e., $L = 11^T- I_n$

The Bayesian classifier:

$$\displaystyle \min_{f:x\rightarrow y}\mathbf{R} = \int_{y,x}y^TLf(x)\;d{\bf P}(x,y)$$

since $f$ unconstrained, pointwise minimization, $\displaystyle \forall x$:\
$\displaystyle {\bf R_{x}} = \int_{y|x} y_x^TL\cdot fd{\bf P}(y|x)$\
$\displaystyle \;\;\; = \int_{y|x} y_x^Td{\bf P}(y|x)\cdot{\bf L}\cdot f= \mathbf{E}(y|x)^T \cdot({\bf 11^T - I_n})\cdot f\cdot$\
$\displaystyle \;\;\; =1 - \mathbf{E}\big(y|x\big)^Tf$, thus we have $\forall x$ in the support:

$$f = \text{arg}\max_k\big(\mathbf{E}(y_k)|x\big)=\text{arg}\max_k\big(\mathbf{P}(y_k=1)|x\big)$$

we will classify class of $x$, $\hat{y}=f(x)$ to the most probable class, or the dominant class in $N(x)$, $N$ is some neighborhood.

## Logistic Regression

Assumption: with comparison class $K$ we assume

$$\log\frac{\mathbf{P}(G=j|x)}{\mathbf{P}(G=K|x)}=\beta_j^T x$$

$\Rightarrow$ 

$$\mathbf{P}(G=j|x) = \frac{\exp (\beta_j^T x) }{1+\sum_i^{K-1} \exp(\beta_i^T x)}
$$
we do **maximum likelihood**: 
$$\log L(\{\beta_i\}) = \sum_j \log \mathbf{P}(g_i | x_i)$$ 

> Interesting notes
- A stackexchange question: [What makes the formula for fitting logistic regression models in Hastie et al “maximum likelihood”?](https://stats.stackexchange.com/questions/16410/what-makes-the-formula-for-fitting-logistic-regression-models-in-hastie-et-al-m?rq=1)
- ML here should be a MAP.
### Binary case

if $K =2$, then the max problem reduce to:

$$\max_{\{\beta_i\}} \log L = \sum_i^N y_i \log P(y_i=1|x_i) + (1-y_i)\log P(y_i=0|x_i)$$

$\max \log L = \sum_j - y_j \log(1+\sum\exp(...)) + (1-y_j)\beta^Tx_j + (y_j -1 )\log(1+...)$

$$ = \displaystyle \sum_j (1-y_j)\beta^Tx_j - \log(1+...)$$

$\displaystyle\frac{\partial \log L}{\partial \beta} = \sum_j - y_jx_j - x_j\frac {\exp(\beta^T x_j)}{1 + ...} = \sum_j x_j (1 - p_j(1)-y_j)$

let $p$ be the vector of conditional probability being 1 [ $\mathbf P(G=1|x)$ ]

then $\log L' =  X^T(1-p-y)$,

let $\displaystyle\frac{\partial \log L}{\partial \beta\beta^T} = H = - \sum_j \frac{x_jx_j^T\exp(\beta^Tx_j)}{(1+...)^2} = X^TWX$

w.t. $\displaystyle W=\mathbf{diag}\big [p_1(1-p_1), p_2(1-p_2), ...,  p_N(1-p_N)\big ]$

[ notice $H$ is always negative definite ]



#### multiclass
...