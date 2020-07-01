---
layout: post
title: "Brief intro of optimization under uncertainty"
date: 2020-06-30 22:37:59 +0800
tags: [optimization, robust optimization]
author: "brentian"
comments_id: 3
---


## Elements of Robustness

For optimization problems with uncertain data, the objective and constraint functions are only assumed to belong to certain sets in function space (the so-called “*uncertainty sets*”).

If one assumes the data for the parameterization of uncertainty set is *random*, in which case one usually deal with expectation objectives under chance constraints as done in **stochastic programming**.

In more *conservative* **robust optimization**, the goal is to make a decision that is feasible no matter what the constraints turn out to be, and optimal for the worst-case objective function.

The clear gap can be mostly captured by characterization of the *uncertainty sets*.

### Uncertainty set

the uncertainty set $\mathfrak U$ envelopes the uncertain realizations $u$ (the *support*) of the dataset.

#### Statically Robust

Traditional robust optimization (RO) is in some sense deterministic, which in no way is stochastic but yet remains uncertain, and usually is considering the **worst-case** objective.

For example, suppose we have the LP here.

$$\begin{aligned}
\min_x \qquad& c' x \\
s.t. \qquad & a_{i}' x \leq b_{i}, i=1, \ldots, m\\
&\forall a_{i} \in \mathfrak U_i
\end{aligned}$$

 
  - options for $\mathfrak U_i$ could be :

$$\begin{aligned}
\text{polyhedra:} & \quad a_i \in \{a_i: D_i a_i \le q_i\}\\
\mathcal{L}_p \text{ balls:} & \quad a_i \in \{a_i: ||a_i||_p \le q_i \}
\end{aligned}$$

The robustness version is

$$\begin{gathered}
\mathbf{(RO)}  & \begin{aligned}
\min_x \max_{a_i\in \in \mathfrak U_i}\qquad& c' x \\
s.t. \qquad & a_{i}' x \leq b_{i}, i=1, \ldots, m
\end{aligned}
\end{gathered}$$

#### Stochastic

if $u \in \mathfrak{U}$ somehow is random, then the problem belongs to traditionally called stochastic programming or stochastic optimization (SO). By the word stochastic we introduce the probability space $(\Omega, \mathcal F, P)$.

The uncertain set is then characterized the probabilities, also the objective is less **conservative** then the worse-case ones, like, expectations.

An descriptive example using the previous LP could be

$$\begin{gathered}
\mathbf{(SO)}  & \begin{aligned}
\min_x \mathbb E_{a: a_i \in \mathfrak U_i}\qquad& c' x \\
s.t. \qquad & a_{i}' x \leq b_{i}, i=1, \ldots, m
\end{aligned}
\end{gathered}$$

- *Chance constraints*. the constraints could also be probabilistic.

- *Ambiguity set*. a distribution (probability) is hardly known, and a set of distributions form the *ambiguity set*.

- *Risk-averse*. 
  - Risk measures, Mean & Dispersion
  - CVaR, Semideviations, ...
  
#### Distributionally Robust Optimization


DRO is relatively a new comer to combine the scope of [robust](#statically-robust) and [stochastic](#stochastic) optimization by admitting *partially* known uncertainty sets.

By the word *known* we mean the uncertainty set is known exactly or known by the probabilistic nature, i.e. for DRO: the distribution analog is unknown.

DRO works with ambiguous uncertainty set, which declares a set of probability distribution $\mathcal P = \{P_u\}$

$$\begin{gathered}
\mathbf{(DRO)} & \max_{x} \min _{P \in \mathcal P} \mathbb E_{P}[f(x , u)]  
\end{gathered}$$

From the [talk](http://www.stanford.edu/~yyye/DRSP.pdf) by Prof. Ye one can found the selected references devote to DRO

- First introduced by Scarf [1958] in the context of inventory control problem with a single random demand variable. 
- Distribution set based on moments: Dupacova [1987], Prekopa [1995], Bertsimas and Popescu [2005], Delage and Y [2007], etc 
- Distribution set based on Likelihood/Divergences: Nilim and El Ghaoui [2005], Iyanger [2005], Wang, Glynn and Y [2012], etc 
- Distribution set based on Wasserstein ambiguity set: Mohajerin Esfahani and Kuhn [2015], Blanchet, Kang, Murthy [2016], Duchi and Namkoong [2016] 
- Axiomatic motivation for DRO: Delage et al. [2017]; Ambiguous Joint Chance Constraints Under Mean and Dispersion Information: Hanasusanto et al. [2017] 
- Lagoa and Barmish [2002] and Shapiro [2006] simply considers a set containing unimodal distributions, Kleinberg et al. [1997] and M’ohring et al. [1999] considers the product distribution

