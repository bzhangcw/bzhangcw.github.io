---
title: "First try in Julia"
subtitle: "packages, projects, and references"
tags: [julia]
category: Julia
date: 2020-04-08
# 
layout: post
---

## First project
I started with JuliaOpt to model quadratic problems (an outlier selection problem, regression). The code can be found in [arto/lr_with_outlier@github](https://github.com/brentian/arto/tree/master/notes/lr_with_outlier). Refer to [previous post](/2020/04/06/lr-with-outlier.html) for the formulation.


## Speed up
Run a script (actually content of it) inside a loaded REPL is quite fast, this means you have started the REPL, then run the code for once already.
```bash
0.345772 seconds (421.40 k allocations: 26.201 MiB, 6.92% gc time)
```
Otherwise, like following:
```bash
# this somehow decreases startup time by 30s
$ time julia main.jl  
62.35s user 0.88s system 98% cpu 1:04.05 total
```
This takes a lot of time (actually on start-up, pre-compiling, etc.)

### via sysimage

```bash
# produce a output object
julia --startup-file=no --output-o lr.o \
    -J"/Applications/Julia-1.4.app/Contents/Resources/julia/lib/julia/sys.dylib"\
    compile.jl 
# produce a shared lib
clang -shared -o lr.dylib \
    -Wl,-all_load lr.o \
    -L"/Applications/Julia-1.4.app/Contents/Resources/julia/lib" \
    -ljulia
# run the main script by the created lib:
julia --sysimage lr.dylib main.jl

# this somehow decreases startup time by 30s
time julia main.jl  
62.35s user 0.88s system 98% cpu 1:04.05 total
time julia --sysimage lr.dylib main.jl  
37.00s user 0.53s system 98% cpu 38.243 total
```

The sysimage do part of the "non-main" stuff in advance, still not good enough.

### into a program
This part refers to [PackageCompiler](https://julialang.github.io/PackageCompiler.jl/dev/devdocs/binaries_part_2/)

```bash
JULIA_PATH=/Applications/Julia-1.4.app/Contents/Resources/julia
# create trace compile
julia --startup-file=no --trace-compile=app_precompile.jl main.jl

# create sys image
julia --startup-file=no \
  -J/Applications/Julia-1.4.app/Contents/Resources/julia/lib/julia/sys.dylib \
  --output-o main.o create_sysimage.jl

# to dylib
clang -shared \
  -o main.dylib -Wl,-all_load main.o \
  -L${JULIA_PATH}/lib \
  -ljulia

# build binary
gcc -DJULIAC_PROGRAM_LIBNAME=\"main.dylib\" -o main main.c main.dylib -O2 -fPIE \
  -I${JULIA_PATH}/include/julia \
  -L${JULIA_PATH}/lib \
  -ljulia \
  -Wl,-rpath,${JULIA_PATH}/lib
```
Then try the fresh `main`:
```bash
$time ./main
./main  1.04s user 0.27s system 92% cpu 1.418 total
```

HOORAY!