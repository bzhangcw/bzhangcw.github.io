---
layout: about
title: Research
permalink: /research
---

My research interests include:
- Second-order optimization methods (SOMs) and general nonlinear programming.
- Mixed-integer optimization with real-world applications in the industry. This track is heavily motivated from the experiences at Cardinal. 
  - See work on [High-Speed Railway](https://doi.org/10.1109/TPAMI.2024.3416514), [Maintenance Scheduling for Airlines](#)
- Optimization solvers and packages. 
  - I involved in a few linear conic optimization solvers, including [ABIP](https://github.com/INFORMSJoC/2023.0017), [cuPDLP-C](https://github.com/COPT-Public/cuPDLP-C)
  - My PhD thesis is accompanied by a Julia package implementing second-order methods, which is now publicly available at the [COPT-Public organization](https://github.com/COPT-Public/DRSOM.jl). My personal fork, which is more frequently updated, can be found at [DRSOM.jl](https://github.com/bzhangcw/DRSOM.jl).
- Public-sector operations research.

## Selected Publications

> SOMs

|                                                                                                                                                                                                               |                                                      |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------: |
| **A Universal Trust-Region Method for Convex and Nonconvex Optimization.**                                                                                                                                    |                                       Revision, 2023 |
| with Chang He, Yuntian Jiang, [Dongdong Ge](https://www.acem.sjtu.edu.cn/en/faculty/gedongdong.html), [Bo Jiang](https://sites.google.com/site/isyebojiang/), and [Yinyu Ye](https://web.stanford.edu/~yyye/) |           [[arXiv]](http://arxiv.org/abs/2311.11489) |
|                                                                                                                                                                                                               |                                                      |
| **A Homogeneous Second-Order Descent Method for Nonconvex Optimization**                                                                                                                                      |                                        Revision,2023 |
| with ___                                                                                                                                                                                                      | [[arXiv]](https://doi.org/10.48550/arXiv.2306.17516) |
|                                                                                                                                                                                                               |                                                      |
| **Homogeneous Second-Order Descent Framework: A Fast Alternative to Newton-Type Methods**                                                                                                                     |                                       Revision, 2023 |
| with ___                                                                                                                                                                                                      |           [[arXiv]](http://arxiv.org/abs/2211.08212) |
|                                                                                                                                                                                                               |                                                      |
| **DRSOM: A Dimension Reduced Second-Order Method.**                                                                                                                                                           |                                        Revision,2022 |
| with ___                                                                                                                                                                                                      |           [[arXiv]](http://arxiv.org/abs/2208.00208) |


> Mixed-Integer Optimization & Applications

|                                                                                                                                     |                                                                 |
| :---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------: |
| **A Customized Augmented Lagrangian Method for Block-Structured Integer Programming**                                               | [IEEE TPAMI., 2024](https://doi.org/10.1109/TPAMI.2024.3416514) |
| with Rui Wang, Shanwen Pu, Jianjun Gao, [Zaiwen Wen](http://faculty.bicmr.pku.edu.cn/~wenzw)                                        |                                                                 |
|                                                                                                                                     |                                                                 |
| **An Approximate Dynamic Programming Approach for Solving Aircraft Fleet Engine Maintenance Problem: Methodology and A Case Study** |                                                   Revision,2023 |
| with Miao Zhang, Jingyuan Yang, Simai He, Huikang Liu, and Zizhuo Wang                                                              |                                                                 |

> Optimization Solvers

|                                                                                            |                                                              |
| :----------------------------------------------------------------------------------------- | -----------------------------------------------------------: |
| **An Enhanced ADMM-based Interior Point Method for Linear and Conic Optimization**         | [INFORMS JOC., 2024](https://doi.org/10.1287/ijoc.2023.0017) |
| with [the Leaves Group](#https://github.com/leavesgrp)                                     |          [[GitHub]](https://github.com/INFORMSJoC/2023.0017) |
|                                                                                            |                                                              |
| **cuPDLP-C: A Strengthened Implementation of cuPDLP for Linear Programming by C language** |                                                         2024 |
| with [H. Lu (Chicago Booth) and the COPT team](https://arxiv.org/abs/2312.14832)           |          [[GitHub]](https://github.com/COPT-Public/cuPDLP-C) |

## Conference

|                                                                                            |                                                                      |
| :----------------------------------------------------------------------------------------- | -------------------------------------------------------------------: |
| **Trust Region Methods for Nonconvex Stochastic Optimization beyond Lipschitz Smoothness** | [AAAI, 2024](https://ojs.aaai.org/index.php/AAAI/article/view/29537) |
| with Chenghan Xie, Chenxi Li, Qi Deng, Dongdong Ge, Yinyu Ye                               |