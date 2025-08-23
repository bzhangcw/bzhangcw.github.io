---
title: How to inverse demand?
subtitle: A few sufficient conditions and reading notes.
tags: [economics]
category: economics
date: 2025-07-12 10:45
layout: post
---

# Introduction

Invertibility of demand is important for existence of an inverse demand function or (in an exchange economy) uniqueness of Walrasian equilibrium prices. In fact, it is also used in estimation of demand systems and testing of revealed preference, which would no longer limit demand shifters to prices.

In the context of general equilibrium theory [^mas1995], **Invertibility of demand** refers to whether the mapping from prices to demands, $x(p)$, is one-to-one. If so, given a demand vector, we can recover the corresponding prices. Generally, existence of the market equilibrium is warranted by *Brouwer's fixed-point theorem*, while uniqueness of it can be ensured by invertibility of demand. Granted, uniqueness may still be true without invertibility — the system may have a single solution even if it is degenerate somewhere. For example, for a linear Arrow-Debreu system, 


# Starting Example: CES Demand 

The **CES utility** with weights $c_i>0$ is  $u(x) = \left(\sum_{i=1}^n c_i x_i^{\rho}\right)^{1/\rho},
\quad \sigma = \frac{1}{1 - \rho}~$ is the elasticity of demand.

<table class="post-table">
  <thead>
    <tr>
      <th>$\sigma$ value</th>
      <th>Utility type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>$\sigma = 1$</td>
      <td><strong>Cobb–Douglas</strong></td>
    </tr>
    <tr>
      <td>$\sigma \to \infty$</td>
      <td><strong>Linear substitutes</strong> (perfect substitutes)</td>
    </tr>
    <tr>
      <td>$\sigma \to 0$</td>
      <td><strong>Leontief complements</strong></td>
    </tr>
  </tbody>
</table>

Given prices $p$ and expenditure $m>0$, the Marshallian demand is  
$$
x(p,w) = \frac{w\,\gamma_j(p)}{p_j}, 
\qquad 
\gamma_j(p)=\frac{c_j\,p_j^{\,1-\sigma}}{\sum_k c_k\,p_k^{\,1-\sigma}},
\quad \sum_j \gamma_i=1.
$$

# Invertibility via $P$-Mappings

Mathematically, if $\nabla x(p) = \frac{\partial x(p)}{\partial p}$
is the Jacobian, then local invertibility requires  $\det(\nabla x) \neq 0.$


## $P$-matrices and Global Injectivity

A $P$-matrix [^fiedler62] is a square matrix whose **all principal minors are positive**:

$$
M ~\text{is a $P$-matrix} \quad \Longleftrightarrow \quad \det(M_{I,I})>0 \quad \forall I \subseteq \{1,\dots,n\}.
$$

If the inequality is not strict, it is called $P_0$ matrix.
By Gale–Nikaidô theorem [^gale65], $P$-functions are *globally univalent* (i.e., injective on $\mathbb{R}^n$).

$$-\nabla x(p) ~\text{is a $P$-matrix} \quad \Longrightarrow \quad x(p)\ \text{is globally invertible}. $$

Known facts,
- If the Jacobian $ -\nabla x(p)$ is a $P$-matrix for all $p$, the demand map is a **$P$-function**.
- 
- Economically, **gross substitutability** often ensures $-J(p)$ is a $P$-matrix, so equilibrium prices are unique.
## The Fisher model: monetary endowment
 
In this case $w > 0$ is a fixed constant, then it is easy to see the Jacobian reads,

$$
-\nabla x(p)=w P^{-1}\big[\ \sigma \Gamma +(1-\sigma)\,\gamma\gamma^\top\ \big] P^{-1}.
$$

I found this can actually be done easily by logarithmic homogeneity (see [^zhang2025]), a concept known for self-concordant barriers of self-scaled cones. For the Fisher case, $x(p)$ is always monotone. Actually, one could show,

$$\| P ( x ( p + q )- x ( p )-\nabla x ( p )[ q ])\| \leq \mathcal O\left(\frac{\|P^{-1}q\|^2}{2(1-\|P^{-1}q\|)}\right)$$


## Arrow-Debreu trading setting

Now income becomes $w(p)=b^\top p$.   Hence, the Jacobian should be written as,

$$
-\nabla x(p) = \underbrace{w P^{-1}\big[\ \sigma \Gamma +(1-\sigma)\,\gamma\gamma^\top\ \big] P^{-1}}_{A}
 - P^{-1}\gamma b^\top
$$

**Walras’ law / homogeneity.** 

$$(-\nabla x(p))p=w P^{-1}\big[\ \sigma \Gamma +(1-\sigma)\,\gamma\gamma^\top\ \big] P^{-1}
 - P^{-1}\gamma b^\top p-P^{-1}\gamma b^\top p=0$$  

Thus $\det(-\nabla x(p))=0$: the kernel is $\mathrm{span}\\{p\\}$. Work on the normalized price simplex (drop one price or restrict to the tangent space $\{x:\,p^\top x=0\}$).

**Principal minors (rank-one formula).** For any $I\subsetneq[n]$,

$$
\det\big((-\nabla x(p))_{I,I}\big)=\det(A_{I,I})\Big(1-b_I^\top (A_{I,I})^{-1}(P^{-1}\gamma)_I\Big).
$$

A Sherman–Morrison calculation yields

$$
(A_{I,I})^{-1}(P^{-1}\gamma)_I
=\frac{1}{w}\,\frac{p_I}{\sigma+(1-\sigma)\,\gamma_I^\top\mathbf 1},
$$

This means 

$$
\boxed{\;\det\!\big((-\nabla x(p))_{I,I}\big)>0\iff b_I^\top p_I<w\,[\,\sigma+(1-\sigma)\gamma_I^\top\mathbf 1\,].\;}
$$

> Consequences.

If $\sigma\ge1$, then $-\nabla x(p)$ is a $P_0$–matrix. 
For any proper $I \subsetneq [n]$, $\sigma+(1-\sigma)\gamma_I^\top\mathbf1\ge1$ and $b_I^\top p_I<w$, every proper principal minor is positive. The full determinant is $0$ (numéraire). 

If $0<\sigma<1$: the inequality can fail for some $I$ (small $\gamma_I^\top\mathbf1$, large $b_I^\top p_I$), so the $P$–property on the simplex need not hold; multiplicity can occur. See the counter example below.

> Counter example: multiple disconnected equilibria when $\sigma < 0.5$ [^chipman10]

Consider an Arrow–Debreu exchange market with two agents and two goods.   Let both agents have $\rho_i = \rho = -3$ and  $\sigma = \frac{1}{1 - \rho} = \frac{1}{4}.$ 
Their endowments and preferences are defined by

$$
b =
\begin{bmatrix}
    1 & 0 \\
    0 & 1
\end{bmatrix},
c =
\begin{bmatrix}
    a & 1 \\
    1 & a
\end{bmatrix},
\quad
a = \frac{2}{\Bigl(1 - 2\sigma\Bigr)^{\frac{1}{\sigma}}}.
$$

Under the normalization $p_1 + p_2 = 1$, there are three disconnected equilibrium prices. (The symbol $z(p)$ is the excess, 0 indicates the equilibria prices.)
<div class="post-fig">
  <img src="/assets/img/posts/2dmultiple.png" alt="Market excess depiction">
</div>


# References

[^hurwicz1969]: Leonid Hurwicz. On the concept and possibility of informational decentralization. *The American Economic Review*, 59(2):513--524, 1969.

[^mas1995]: Mas-Colell, A., Whinston, M.D., Green, J.R.: Microeconomic Theory. Oxford Univ. Press, New York, NY (1995)

[^fiedler62]: Fiedler, M., Pták, V.: On matrices with non-positive off-diagonal elements and positive principal minors. Czechoslovak Mathematical Journal. 12, 382–400 (1962)

[^berry13]: Berry, S., Gandhi, A., Haile, P.: Connected substitutes and invertibility of demand. Econometrica. 81, 2087–2111 (2013). https://doi.org/10.3982/ECTA10135

[^gale65]: Gale, D., Nikaido, H.: The Jacobian matrix and global univalence of mappings. Math. Ann. 159, 81–93 (1965). https://doi.org/10.1007/BF01360282

[^zhang2025]: Zhang, C., He, C., Jiang, B., Ye, Y.: The implicit barrier of utility maximization: An interior-point approach for market equilibria, http://arxiv.org/abs/2508.04822, (2025)

[^chipman10]: Chipman, J.S.: Multiple equilibrium under ces preferences. Econ Theory. 45, 129–145 (2010). https://doi.org/10.1007/s00199-009-0435-3
