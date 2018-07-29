# (E of SL) Ch. 4 Exercises


## 4.2 (P. 135)

Suppose we have $x \in \mathbb{R}^p$, a 2-class response, with size $N_1, N_2$, and the target coded as $-N/N_1$, $N/N_2$, OLS estimate by:
$$\min \sum_{i=1}^{N} (y_i - \beta_0 - \beta^T X)^2$$

> (b) show OLS $\hat{\beta}$ satisfies:

$$\big[(N-2)\hat{\Sigma} + N\hat{\Sigma}_B\big] \beta = N(\hat{\mu_2} - \hat{\mu_1})$$

`PF.`

Notice OLS estimate:
$$\hat \beta_0 = \frac{1}{N} \mathbf{1}^T (y - X\hat \beta) $$

$$X^T C_N X \hat \beta = X^TC_N y = X^Ty $$ 

where $C_N$ is $N$-d centering matrix, and $y^T1 = 0$

hence:

The estimate for LDA covariance matrix:

$\displaystyle \hat{\Sigma} =  \frac{1}{N-K} \sum_k^K X^TP_k(I_N-\frac{11^T}{N_k})P_k^TX$

where $P_k$ is a selection binary matrix for class $k$, $P_k(ii) = 1$ if $G_i = k$ and 0 else where, we notice:

$$P_k = P_k^T, P_k^{(n)}=P_k$$
in that sense: 
$$\displaystyle (N-K) \hat{\Sigma} =  \sum_k^K X^TP_k(I_N-\frac{11^T}{N_k})X$$

$$\displaystyle  = X^T (I_N-\sum_k^K P_k\frac{11^T}{N_k})X$$
$$\displaystyle  = X^TX-\sum_k N_k \hat{\mu}_k \hat{\mu}_k^T$$
for our case $k=2$:

$$(N-2) \hat{\Sigma} = X^TX - N_1 \hat{\mu}_1\hat{\mu}_1^T-N_2\hat{\mu}_2\hat{\mu}_2 $$

hence:

$\displaystyle\big[(N-2)\hat{\Sigma} + N\hat{\Sigma}_B\big]  = X^TX - \frac{N_1^2 \hat{\mu}_1\hat{\mu}_1^T+N_2^2\hat{\mu}_2\hat{\mu}_2^T+N_1N_2(\hat{\mu}_1\hat{\mu}_2^T+\hat{\mu}_2\hat{\mu}_1^T)}{N}$

$\displaystyle\big[(N-2)\hat{\Sigma} + N\hat{\Sigma}_B\big] = X^TX - \frac{(N_1\hat{\mu}_1+N_2\hat{\mu}_2)(N_1\hat{\mu}_1+N_2\hat{\mu}_2)^T}{N} = X^TC_NX$

LHS:

$= X^TC_Ny = X^Ty$

RHS:

$N(\hat{\mu}_2-\hat{\mu}_1) = N(X^TP_2\cdot1/N_2-X^TP_1\cdot1/N_1) =X^TP_2y+X^TP_1y = X^Ty$

This completes the proof.

> (c) show $\displaystyle \;\;\hat \Sigma_B\beta\;\;$  is in the direction $\;\;\hat{\mu_2} - \hat{\mu_1}$ 

`PF.`

let $Q = X^TC_NX$ s.t. $Q^T=Q$, let $q=X^Ty$ so we have:

$$Q\hat{\beta} = q$$

notice: ($C_0$ is some constant)

$$\hat \Sigma_B = C_0 qq^T$$

we have:

$\hat\Sigma_B\hat\beta = C_0Q\hat\beta\hat\beta^TQ^T\hat\beta = C_0Q\hat\beta\hat\beta^TQ\hat\beta = C_0(\hat\beta,q)q$  is in the direction of $q$ => ($\hat{\mu_2} - \hat{\mu_1}$)

This comes to an interesting result as OLS $\hat \beta$ (without interception) is identical to LDA

> (d) show that this result holds for any (distinct) coding of two classes

`PF.`
