# 1 - Introduction and Distributions
> The notes taken from the course by Zhihua Zhang, 2014@SJTU

## Gaussian

#### Definition:
A R.V. $\mathbf{x} \in \mathbb{R}^n$ is said to have the multivariate normal distribution with mean vector $\mathbf{\mu}$, and covariance $\mathbf{\Sigma}$, i.e.,  $\mathbf{x} \sim \mathcal{N}({\mathbf{\mu},\mathbf{\Sigma}})$ with probability measure:

>$$\displaystyle f_{\mathbf{x}}(x)=\frac{1}{2\pi^{-1/n}\mathbf|{\Sigma}|}\exp\{-\frac{1}{2}(x-\mu)^T\mathbf{\Sigma^{-1}}(x-\mu)\}$$
where:

>$$\mu = \mathbb{E}[\mathbf{x}];\;\;\mathbf{\Sigma}=\mathbb{E}[(\mathbf{x}-\mu)(\mathbf{x}-\mu)^T] \succeq 0$$

the inverse matrix of $\mathbf{\Sigma}$ is also referred to as precision, concentration matrix.
#### Property:

##### Semi-definiteness: 
As being said, $\mathbf{\Sigma} \succeq 0$. A normal distribution is said to be **non-degenerate** *if* $\mathbf{\Sigma}$  is positive-definite, such that $\displaystyle|\mathbf{\Sigma}|$ is the determinant: $\mathbf{det(\Sigma)}$. Otherwise the inverse and determinant should be defined as their pseudo generalized ones.

##### Affine transformation

if R.V. $\mathbf{x} \in \mathbb{R}^n \sim \mathcal{N}({\mathbf{\mu},\mathbf{\Sigma}})$, $b \in \mathbb{R}^k, \; \mathbf{B}\in \mathbb{R}^{k \times n}$ such that $\mathbf{B}\mathbf{\Sigma}\mathbf{B}'$ is non-singular (thus semi-definite), we have:
> if $\mathbf{z} =\mathbf{B}\mathbf{x}+b$, $\mathbf{z} \in \mathbb{R}^k \sim \mathcal{N}({\mathbf{B\mu+b},\mathbf{B\Sigma B'}})$

##### The covariance
Since $\mathbf{\Sigma}'= \mathbf{\Sigma} \succeq 0$; 
Suppose spectral decomposition (eigenvalue-decomposition): $\mathbf{\Sigma} = \mathbf{U\Lambda U}$ where $\mathbf{U}$ unitary, we have:
>$$\mathbf{\Sigma}^{-1/2} = \mathbf{U\Lambda^{-1/2}U}$$
There is an interesting section referring to its [geometric interpretations](https://en.wikipedia.org/wiki/Multivariate_normal_distribution).

#### Conditional Distributions and block diagonalization
If we define the partition of R.V.: $\displaystyle{\bold x}=\begin{pmatrix}{\bold x_1}\\ {\bold x_2}\end{pmatrix}$, where $\mathbf{x_1} \in \mathbb{R}^k,\mathbf{x_2} \in \mathbb{R}^{n-k}$. Following the same partition, suppose:

>$$\displaystyle \mu=\begin{pmatrix} \mu_1\\ \mu_2\end{pmatrix},\mathbf{\Sigma}=\begin{pmatrix}\mathbf{\Sigma_{11}}&\mathbf{\Sigma_{12}}\\ \mathbf{\Sigma_{21}}&\mathbf{\Sigma_{22}}\end{pmatrix}$$














