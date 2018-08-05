# A review on convex optimization, 2

## IV. Lagrangian and Dual

1. definition of dual


   standard form of optimization problems:
   $$\min_x f(x) $$

s.t.    
$$h_i(x) = 0, i =1,2,...$$
$$f_i(x) \le  0, i=1,2,...$$

- feasible over set of $x$: $\mathcal{X} = \{H=0,F\le 0\}$
- The lagrangian function $L$: [ $F,H$ are vector-valued functions of $x:\{f_j,h_j\}_j$ ]

$$L(x,\lambda,\mu) =  f + \lambda^TF+\nu^TH$$

- {Lagrange} dual function $\displaystyle g(\lambda, \nu) = \inf_x L$

- notice: w.t. $\lambda\ge 0$

$$g(\lambda, \nu)  \le L \le f, \forall x \text{  feasible}$$
$$\Rightarrow \sup_{\lambda \ge 0} g \le \inf_{H=0, F\le 0} f$$

- g is the minimum over the set of $x$, thus concave [ like a piecewise affine function with possibly infinite pieces ... ]
- e.g:
    - minimize norm over a polyhedron
        $$\min_x x^Tx, Ax=b$$
        $$g = \min x^Tx + \lambda^T(Ax-b)$$
        $$\frac{\partial L}{\partial x} = 2x + A^T\lambda$$
        $$\frac{\partial L}{\partial x \partial x^T} = 2I_n$$ 
        thus $x^* = - A^T\lambda/2$
        $$ g(\lambda) = \frac{-\lambda AA^T\lambda}{4} - \lambda^Tb$$ 
        concave since $\displaystyle\mathbf{H} = \frac{-AA^T}{2}$

    - linear programs
        $$\min c^Tx, Ax=b, x\ge 0$$
        $$L = c^Tx + \lambda^T(Ax -b) - x^T\nu$$
        $$g =  \begin{cases} 
        -b^T\lambda & A^T\lambda +c -\nu = 0 \\
        -\infty & \text{else}  
        \end{cases}$$
        also linear programs

2. weak duality and strong duality

From previous definition we have the weak duality:

$$g(\lambda,\nu) \le \inf f, \text{feasible}$$

the weak is to be strong if some conditions hold. some common qualifications for **SD**:
- if the problem is convex and Slater's condition holds. 
- primal problem is a LP
- also, **SD** can hold for nonconvex problems.
    - e.g. single constraint quadratic problem


3. Geometric interpretation

Define:
$$\mathcal{G} = \big\{(u,v,t)|u=F,v=H,t=f, x\in D\big\}$$

be value set of the problem, the optimal value is then:

$$f_* = \inf_t \{(u,v,t) \in \mathcal{G}, \;u\le 0, v = 0\}$$

Also define extended set:

$$\mathcal{A} = \big\{(u,v,t)|u\ge F,v=H,t\ge f, x\in D\big\} $$

Lagrange: $L = (\lambda,\mu,\gamma)^T(u,v,t)$


Dual: $g(\lambda,\mu) = \inf L$ (weak duality)

