# 3 - PCA系列方法
> 搬运2014年张志华老师在交大的机器学习系列课程笔记, 略加整理, 加入查阅的笔记, 自己证明了一遍。与"(E. of SL) The Elements of Statistical Learning" 读书笔记同步更新～
- [Population & sample PCA](#population-sample-pca)
    - [Population to sample](#population-to-sample)
    - [Principle coordinate analysis: PCO](#principle-coordinate-analysis-pco)
    - [Connection between PCA/PCO:](#connection-between-pcapco)
- [(Linear) PCA/PCO to kernel PCA](#linear-pcapco-to-kernel-pca)
- [(Probabilistic) PCA](#%08probabilistic-pca)
    - [closed-form approach](#closed-form-approach)
## Population & sample PCA
### Population to sample
if $\mathbf x \in \mathbb{R}^p$ with population mean $\bf \mu$ and variance $\bf \Sigma$, PC transform is defined:

$$\bf y= V^T(x-\mu)$$

where $\bf \displaystyle \Sigma = V \Lambda V^T$ is the spectral decomposition, w.t. $\bf \Lambda = diag\big(\lambda_1 ,\lambda_2,...\lambda_p\big)$ is **sorted**, i.e., $\lambda_1 \ge \lambda_2\ge ...\ge \lambda_p \ge 0$

Since $\bf \mu$ and variance $\bf \Sigma$ is usually unknown, we have the estimators ($\mathbf H = \mathbf I_n - \mathbf{11}^T$ is the **centering matrix**) 

$$\mathbf{\bar{x}}, \mathbf {S} =\frac{1}{n} \bf X^THX$$

$\displaystyle \mathbf S = \mathbf{VLV}^T \Rightarrow y = \mathbf{V}^T(x-\bar x), \mathbf V \in \mathbb R^{p\times p}$, the principle component tranformation for samples $\bf X$:

$$\bf Y= HXV$$

traditional PCA use $k$-degree approximation:
* sort  eigenvalues in $\mathbf L$, choose largest $k$ eigenvalues and corresponding eigenvectors, denote as $\mathbf L_k, \mathbf V_k$
* do approximation: 

$$\mathbf Y= \mathbf {HXV}_k$$

do eigen-decomposition to $\bf T$, we have:

### Principle coordinate analysis: PCO
instead of using $\mathbf {S} = \bf X^THX$ (drop $\frac{1}{n}$ here), let $\mathbf T = \mathbf{HXX}^T\mathbf H$, it's easy to verify $\bf S, T$ share the **spectrum**. Suppose SVD on $\bf HX$:

$$\mathbf{HX} = \mathbf{U\Gamma V}^T$$

### Connection between PCA/PCO:
* $\mathbf S = \mathbf{V\Gamma}^2 \mathbf V^T, \mathbf T = \mathbf{U\Gamma}^2\mathbf U^T$
* Transformed "samples" $\bf Y=U\Gamma = HXV$, $k$-degree approximation: $\bf \tilde Y=U_k\Gamma_k = HXV_k$
* $S: p\times p$ suitable for $p$ relatively small, 
* $T: n\times n$ suitable for large $p$ but small $n$
* why PCA? [The Eckart-Young Theorem](https://en.wikipedia.org/wiki/Low-rank_approximation) PCA gives the best $k$-degree approximation respect to Frobenius norm.

## (Linear) PCA/PCO to kernel PCA
Using kernel methods in PCA? Magnificent. Suppose we have a non-linear/linear mapping $\phi$, as previously discussed, mapping $x \in \mathbb{R}^p$ to higher dimensional space $\mathbb{R}^r$ such that we have corresponding samples:

$$\bf X \rightarrow F$$

The kernel $K$ is constructed by $\mathbf{FF}^T$, it's obvious to see: $\mathbf{HFF}^T\mathbf{H} = \bf HKH$ and $\mathbf F^T\mathbf{HHF}$ has the same eigenvalues, so we do decomposition on $\bf HKH$:

$$\mathbf{HKH} = \mathbf{ULU}^T$$

Transformed $\bf \tilde Y_k = U_kL_k$ if use $k$-order approximation

## (Probabilistic) PCA
PPCA supposes the linear tranformation. Quote the notes: "Traditional PCA is often formulated as a projection from the data space onto some linear subspace. However, probabilistic PCA is often formulated as a mapping from the latent space into the data space."

Suppose data variable, data matrix, latent variable, data matrix $\bf x, X, z, Z$, where latent variable $z$ is normal:

$$\mathbf z\sim \mathcal N(0,I_q)$$

assume linear model $\bf W$ with error $\mathbf \epsilon \sim \mathcal N(0,I_p)$:

$$\mathbf{ x = Wz + \mu} + \sigma \epsilon, \;\mathbf z\text{ ind. of  }\epsilon, \text{i.e., } \mathbf z \perp \epsilon $$

thus we should have: $\bf x-\mu  \sim \mathcal N(0,C), C=WW^T+\tau I$, $\tau=\sigma^2$

take estimation of variance:
$\bf S= X^THX$

ignore the constants in log-likelihood, we have:

$$\mathbf {F}(W,\tau)=\frac{2}{n}\log\mathbf{L}=\log|C|+tr\big({C^{-1}S}\big)$$

we try to find the MLE of $\mathbf{W},\tau$
### closed-form approach
* see the [notes](http://bcmi.sjtu.edu.cn/log/files/lecture_notes/ml_2014_spring_ieee/lecture6.pdf) of Lecture 6 by Prof. Zhang ->

MLE of $\mathbf{W},\tau$:
    
$$τ= \frac{1}{p-q}\sum_{j=q+1}^p\theta_j$$


$$W=\mathbf{\Phi_q(\Theta_q-\tau I_q})^{1/2}\mathbf{V}^T$$

where $\bf \Phi_q, \Theta_q$ comes from the spetral decomposition of $\bf S$ with $k$-degree approximation:

$$\mathbf {S\Phi} = \mathbf{\Phi\Theta} \Leftrightarrow \mathbf S = \mathbf{\Phi\Theta\Phi}^T  $$

and in practice, $\bf V$ is usually taken as $I$ for simplicity.




