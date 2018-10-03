---
layout: page
title: Building trees
---

{% include toc.html %}

## What is a phylogeny?

A phylogeny is a tree that represents how different populations are related by their common ancestors back in time. 
Each population is represented by a tip of the tree. 
To me, it is important to clarify that each tip represents a population, which encompasses a species or an infection, and not a single individual.
A tree that relates individuals instead of populations should be referred to as a *geneaology*, not a phylogeny.
The rationale is that individuals do not evolve - populations do. 
Although the descent of individuals from their ancestors can also be represented by a tree, there is no evolutionary process unfolding along its branches.
This distinction can be confusing because we often reconstruct the phylogenetic tree by sequencing individual representatives from each population or species.

Another way to think about the distinction between a phylogeny and a genealogy is that they are shaped by processes that operate on different time scales. 
A geneaology traces the ancestry within a population. 
Eventually, we reach an ancestor for all of the individuals whom we selected from the population. 
Frequently, that ancestor will be more recent than the time that the population became distinct from other populations. 
For example, suppose we pick two people (representatives of *Homo sapiens*). 
If we trace their ancestry back using their [mitochondrial DNA](https://en.wikipedia.org/wiki/Mitochondrial_DNA), the furthest back in time we will get is "[mitochondrial Eve](https://en.wikipedia.org/wiki/Mitochondrial_Eve)", an ancestor from roughly 150,000 years ago. 
The common ancestor of *Homo sapiens* and *H. erectus* is placed in the phylogeny roughly 315,000 years ago. 
If we choose two people who live in the same town, there is a fair possibility that they will have a great-great-grandmother in common, and we will fall well short of mitochondrial Eve. 

For another species, it is *possible* that their "Eve" predates their split from another species in the phylogeny.


### Anatomy of a phylogeny
As we follow the branch from the tip down the tree, we will eventually reach its junction with one or more other branches that represents a common ancestor. 
This juncture is called an *ancestral node* or a *split*. 
Eventually, we reach the deepest node in the tree that may represent the most recent common ancestor or *root*. 
However, a tree may be unrooted so that the meaning of the deepest node is more ambiguous (more on this later).

The branches of the tree may be dimensionless, so that they contain no other information than the hypothesis that two nodes are directly related as an ancestor and descendant pair.
Since length is meaningless in this case, we usually draw the branches with integer lengths that are consistent with their ancestral node's [height](https://en.wikipedia.org/wiki/Node_(computer_science)) in the tree, where the height is the largest number of nodes (including this ancestor) along the path to one of its descendant tips.
Such a tree is called a *cladogram* or simply an "unscaled" tree.

{% include helloworld.html %}


### Counting trees

Even if we only consider unscaled trees, the number of trees that can relate a given number of tips is enormous!
For just 10 tips, there are already over 2 million possible unrooted binary trees, and 17 times as many rooted trees (an unrooted binary tree with 10 tips has 17 branches).
Try changing the number of tips in this calculator to see how the numbers of different types of trees grows:
{% include numtrees.html %}

When we are dealing with inconceivably large numbers such as these, we often start turning to rough analogies such as "the number of grains of sand on planet Earth" (about 7&times;10<sup>18</sup>, or about 19 tips) or "the number of atoms in the universe" (roughly 10<sup>80</sup>, or about 52 tips). 
Think about this: nowadays, we routinely work with trees that have thousands, or even tens of thousands of tips!

### Polytomies

If there are always exactly two branches that descend from every ancestral node in the tree, then we say that it is a *binary* or *bifurcating* tree.
We make the implicit assumption that the biological process underlying splits in the tree, *e.g.,* speciation or transmission, is not so rapid that two events occur at the same instant in time.
For example, rapid speciation could theoretically result in more than two child branches from an ancestral node.

When we attempt to reconstruct a tree from sequences, however, it is not always possible to reconstruct binary splits throughout the tree. 
For example, we might not have enough data to reconstruct the branching order at a split. 
As a result, we would draw three or more branches descending from the ancestral node. 
This outcome is called a *polytomy*. 
A polytomy is *soft* if the true tree is binary and there is insufficient data to distinguish the true branching order from the other possibilities. 
Otherwise, we assume that it is a *hard* polytomy that represents a genuinely multiple split.


## Distance-based trees

How can we determine whether two sequences are related by a more recent common ancestor than another pair? 
Since we usually cannot directly observe the descent of populations from ancestors, we have to infer the order of events from the pattern of similarity among the populations that we *can* directly observe. 
As we learned in a [previous chapter](Clustering.html#genetic-distances), there are many ways of measuring how different two sequences are using a genetic distance function, and similarity is simply the opposite of distance. 
By applying the distance function to every pair of sequences in our data set, we can generate a symmetrical, square matrix that we call a *pairwise distance matrix*.

Trees are often used as a [graphical representation](https://en.wikipedia.org/wiki/Dendrogram) of a pairwise distance matrix.
In this application, a tree is usually an approximate representation because it frequently impossible for the total branch lengths between tips in the tree to be proportional to the correpsonding distances.
Suppose, for example, we have the following distance matrix:

|  | A | B | C |
|--|---|---|---|
| A | 0 | 0.1 | 0.2 |
| B | 0.1 | 0 | 0.31 |
| C | 0.2 | 0.31 | 0 |

This matrix indicates that **A** and **B** are the most closely related sequences, so they should be the first tips to be joined by branches to a common ancestor.
This implies the following rooted tree topology (ignoring branch lengths for now):

<center>
<img src="/public/img/simple-tree.svg"/>
</center>

However, if we want the branch lengths in the tree to be congruent to the distances, then we are in a bind! 
I deliberate chose pairwise distances that makes this impossible. 
This highly simplified scenario could arise if, for example, we have the following sequences:
```
>A 
ACGT...
>B 
ACAT...
>C 
GCCT...
```
and transversions between `A` and `C` are disproportionately rare.

There are several clustering algorithms that can be used to transform a distance matrix into a tree.
Rather than review a selection of these algorithms, I am only going to talk about the algorithm that is the most widely used today: neighbor-joining.

### Neighbor-joining trees

The neighbor-joining (NJ) method was introduced by Saitou and Nei in 1987.


## Likelihood


## Maximum likelihood trees


## Software


## Further readings

* 




