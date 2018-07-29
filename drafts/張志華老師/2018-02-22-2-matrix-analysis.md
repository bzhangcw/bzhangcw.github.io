# 2 - Matrices and analysis 
> The notes taken from the course by Zhihua Zhang, 2014@SJTU

- [2 - Matrices and analysis](#2---matrices-and-analysis)
    - [Matrices and matrix norms](#matrices-and-matrix-norms)
        - [Matrices](#matrices)
        - [Norms](#norms)
            - [Operator norm](#operator-norm)
            - [Schatten (p) norms](#schatten-p-norms)
                - [Nuclear Norm: p=1](#nuclear-norm-p1)
                - [Frobenius Norm](#frobenius-norm)
    - [Derivatives](#derivatives)
        - [Directional derivative & Gâteaux differentiable](#directional-derivative--g%C3%A2teaux-differentiable)
        - [Subgradient](#subgradient)
## Matrices and matrix norms
### Matrices
* Hermitian or self-adjoint if $A = A_H$, i.e., ${\displaystyle a_{ij}={\overline {a_{ji}}}}$ (real then say it's **symmetric**).
* skew Hermitian or anti-hermitian if $A=-A^H$,
* normal if $A^HA = AA^H$. (not equivalent to unitary`!`)
* Orthogonal/Unitary (酉): $A^T$/$A^H$
    * A square matrix in $\mathbb C^{n\times n}$ is ... if $A^HA=I=AA^H$
* $A^HA$,$AA^H$ is always Hermitian and positive semi-definite (p.s.d)
* Singular value decomposition (SVD):
    *  $A = U\Sigma V^H$; note the differences between full/thin SVD
    *  generally this could be done to any matrix, while the eigenvalue decomposition may not be computed
* QR decomposition, also a eigenvalue related method, there are a group methods to do this. recap the numerical mathematics.
### Norms
A norm is called:
* unitarily invariant / isometrically invariant `ui` if $||UTV||=||T||$ 
* sub-multiplicative `sm` if $||ST||\leq||S||\cdot||T||$
* consistent with vector norm $||.||$ if for $x$: $||Ax|| \leq||A||\cdot||x||$
#### Operator norm
induced $p$-norm: $p=2$ spectral norm is also a Schatten norm
#### Schatten (p) norms
Schattens are `ui` and `sm`

$${\displaystyle \|A\|_{p}=\left(\sum _{i=1}^{\min\{m,\,n\}}\sigma _{i}^{p}(A)\right)^{1/p}.\,}$$

##### Nuclear Norm: p=1
$${\displaystyle \|A\|_{*}=\sum _i \sigma _{i}(A)\,}$$
##### Frobenius Norm

$${\displaystyle \|A\|_{F}=\left(\sum _i \sigma _{i}^2(A)\right)^{1/2}\,}$$

$${\displaystyle \|A\|_{F}^2= {\sum _{i=1}^{m}\sum _{j=1}^{n}|a_{ij}|^{2}}= {tr (A^{\dagger }A)}= {\sum _{i=1}\sigma _{i}^{2}(A)}}$$

invariant under rotation: for any unitary matrix $R$ (etc.: rotation, orthonormal basis, $U,V$ in SVD)

$${\displaystyle \|AR\|_{\rm {F}}^{2}=tr \left(R^{\rm {T}}A^{\rm {T}}AR\right)=tr \left(RR^{\rm {T}}A^{\rm {T}}A\right)=tr \left(A^{\rm {T}}A\right)=\|A\|_{\rm {F}}^{2}}$$
## Derivatives

### Directional derivative & Gâteaux differentiable
Let $f : \bf E \rightarrow R$, the directional derivative of a function $f$ at $x$ in a direction $d \in E$ is the limit:

$$f'(x,d) = \lim_{t \searrow 0} \frac{f(x+c\cdot d)-f(x)}{t}$$

if the limit exits. if $f'$ is linear in $d$, s.t., $f'=\left< a,d \right>$ (inner-product), Then, we say $f$ is (Gâteaux) differentiable at x with (Gâteaux) derivative $a$.
* Example:
    * $f(X) = \log |X|$ find $f'(X;Y)$ where $X,Y\in\mathscr S_{++}$

    * `Solution`

    $\displaystyle\lim_{t\rightarrow 0}\frac{ \log|X+tY| - log|X|}{t} = \lim_{t\rightarrow 0} \frac{1}{t} \log|I+tX^{-1}Y|$

    do spectral decomposition on $X^{-1}Y$, since $X,Y\in\mathscr S_{++}$: $X^{-1}Y = Q\Lambda Q^T$, where $\Lambda = diag(\lambda)$  are eigenvalues.

    $\Rightarrow \log|I+tX^{-1}Y| = \log|Q(I+t\Lambda)Q^T|$

    $=\log\prod_i 1+t\lambda_i = \sum_i log(1+t\lambda_i)$

    $f'(X;Y) = \displaystyle \lim_{t \searrow 0} \sum_i \frac{\lambda_i}{(1+t\lambda_i)} = \sum_i \lambda_i = tr(X^{-1}Y) =\left<X^{-1},Y^T\right>=\left<X^{-1},Y\right>$, $f' = X^{-1}$  
### Subgradient
> more see convex analysis

$\phi$ is said to be a subgradient of $f(x)$ at $x_0$, if it satisfies $\left<\phi,x-x_0\right> \le f(x) - f(x_0),\;\;\forall x \in E$. $E$ is a convex open set. the set of subgradients is called subdifferential at $x_0$ and is denoted $\partial f(x_0)$. 
* The subdifferential is always a nonempty convex compact set.
* A convex function $f:I\rightarrow \bf R$ is differentiable at $x_0$ if and only if the subdifferential is made up of only one point, which is the derivative at $x_0$
* A point $x_0$ is a global minimum of a convex function $f$ iff $0\in \partial f(x_0)$
* Example
    * $f(x)=\frac{1}{2}(y-a)^2+\lambda|y|$, find the subdifferential at $y=0$
    * -> and find the $\displaystyle\inf_y f$
    * `Solution`

    $\displaystyle \partial f = (y-a)+\lambda\partial|y|$  

    $\partial \phi\cdot y\le |y|$, we have subgradient of $|y|:\partial \phi\in [-1,1]$

    $\displaystyle \partial f = (y-a)+\partial\phi=[y-a-\lambda,y-a+\lambda]=\left\{y-a+\lambda sgn(y)\right\}$  
    we notice $f$ convex (easy to verify)
    if $\hat y$ is the minimizer
    ; then $0 \in \{\hat y-a+\lambda\partial|\hat y|\}\Rightarrow a-\hat y\in \lambda\partial|\hat y|$ 
    
    if $\hat y = 0$, $a\in [-\lambda,\lambda]$

    if $\hat y \neq 0$, $a - \hat y =\lambda \mathbf{sign}(\hat y)$
