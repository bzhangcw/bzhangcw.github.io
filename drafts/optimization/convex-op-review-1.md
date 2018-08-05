# A review on convex optimization, 1

>  prepare for a upcoming interview
## I. Intro

1. standard form of optimization problems:
   $$\min_x f(x) $$

s.t.    
$$h_i(x) = 0, i =1,2,...$$
$$f_i(x) \le  0, i=1,2,...$$

- infeasible/unbounded if $D$ domain of $x$ is empty, say $f(x) =\infty$; $f(x) = -\infty$ then unbounded below
- globally optimal, $x' \Rightarrow f(x')\le f(x), \forall x \in D$ 
- locally optimal, $x' \Rightarrow f(x')\le f(x), \forall x \in \mathbf{N}(x,r)$ 
- equivalent, e.g. you get a bijection from $D$ to another problem $D'$
- convex problem in standard form: $f, \{f_i\}$ are convex functions

$$\min_x f(x) $$
s.t.    
$$ a_i^T x= b_i, i =1,2,...$$
$$f_i(x) \le  0, i=1,2,...$$

## II. Convex sets
2. Affine set
    - affine transformation: $\lambda \in \mathbb{R}^n$ with unit size: $\lambda^T 1 = 1$ then $X\lambda$ is a affine transformation, $\sum_j \lambda_j x_j$ for infinite series.
    - say set $C$ is affine if for any $\{x_i\} \subset C, \sum_j \lambda_j x_j \in C$
        - also you get affine hull $C^*$ for $\{x_i\}$ that contains all affine transformation (and affine itself) 
    - relative interior: called $\text{relint}C$ contains all interior points in its affine hull. (balls of them also in $C$)
        - [interior and relative interior](https://math.stackexchange.com/questions/1144750/whats-the-difference-between-interior-and-relative-interior) 
1. Convex set
   - affine and $\lambda \ge 0$
   - line segments of two points are always subsets of $C$
   - note for infinite series, $\sum_j\lambda_jx_j \in C$ if converge; similarly, $\int_C xdp \in C$ if the integral exists and $\int_p dp = 1$, for example, expectation $\mathbf{E}$

2. Special set:
    - hyperplane: $a^Tx =b$
        - of dim $n-1$, defines set of point with constant inner product
        - half-space: $a^Tx \le b$
    - balls by norm
        - $\displaystyle\{||x||\le r\}$ whereas norm should be convex itself. for $\mathcal{L}_p$ norm, for example, $p \ge 1$
    - ellipsoid $\displaystyle ||x-x_0||_P = \{x | (x-x_0)^TP^{-1}(x-x_0) \le r\}$ where $P$ should be p.s.d
    - polyhedron: $\{x| Ax \le b\}$ important for linear optimization

3. Separating hyperplane

Two disjoint convex set $C$, $D$ has a separating hyperplane

- PF. suppose $C$, $D$ are closed, for minimization problem: 
  $$\min f=||x-y||_2, x\in C, y\in D$$
  $||\cdot|| \ge 0$ and solution set is non-empty. minimizer $x',y'$ exists.
  so we take the hyperplane:
  $$\mathbf{H} = \big\{(x,y)\big |(x'-y')^T(x-x')=0\big \}$$
  $\forall x\in C$, $\displaystyle (x'-y')^T(x-x') = (x'-y')^T(x-y'+y'-x')$

  $\displaystyle = -||x'-y'||^2 + ... \ge 0$


  since $y',x'$ minimize $f$.

  $\forall y\in D$, $\displaystyle (x'-y')^T(y-x') \le -||x'-y'||^2$, this completes the proof. For $C$, $D$ that are not closed, should be strict inequalities. (no attainment)

- supporting hyperplane: separating hyperplane that passes some $x_0 \in \textbf{bd}(C)$, $\textbf{bd}$ for border.