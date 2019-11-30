---
layout: page
title: Building trees
---


<!-- Table of contents -->
{% include toc.html %}

<!-- Required for d3 animations -->
{% include loadD3.html %}


## What is a phylogeny?

A phylogeny is a hypothesis about how different populations are related by their common ancestors back in time.
Phylogenies are usually expressed as trees.
Each population is represented by a tip of the tree.
These tips are connected by the branches that comprise the tree.
If we follow two branches from their respective tips down toward the base of the tree, we will eventually encounter a point at which those branches converge.
This branching point is often called a *node* or a *split*, and it represents the common ancestor of the tips.


>To me, it is important to clarify that each tip represents a population, which encompasses a species or an infection, and not a single individual.
A tree that relates individuals instead of populations should be referred to as a *genealogy*, not a phylogeny.
Although the descent of individuals from their ancestors can also be represented by a tree, there is no evolutionary process unfolding along its branches.
Individuals do not evolve; populations do.
This distinction can be confusing because we often reconstruct the phylogenetic tree by sequencing individual representatives from each population or species.
(I concede that not everyone would agree with this interpretation!)





## Why do we need phylogenies?

In the field of infectious disease and molecular epidemiology, phylogenies provide a rigorous framework for the systematic classification of related infections.
Because characteristics (phenotypes) tend to be more similar between populations that are more closely related, mapping an infection to a phylogeny can provide an accurate and cost-effective prediction of clinically-significant phenotypes that would otherwise require weeks of laboratory processing to measure.


Phylogenies also enable us to address the problem that when we sample infections from a population, we are never working with a random sample of observed characteristics.
For example, if we find that a number of infections that carry a specific mutation are also resistant to a particular drug, we are inclined to assume that this mutation is directly involved in the drug resistance phenotype.
However, those infections could also happen to be closely related and, by chance, inherited the same mutation from their common ancestor.











## Counting trees

Even if we only consider unscaled trees, the number of trees that can relate a given number of tips is enormous!
For just 10 tips, there are already over 2 million possible unrooted binary trees, and 17 times as many rooted trees (an unrooted binary tree with 10 tips has 17 branches).

**Try changing the number of tips in this calculator to see how the numbers of different types of trees grows:**
{% include numtrees.html %}

When we are dealing with inconceivably large numbers such as these, we often start turning to rough analogies such as "the number of grains of sand on planet Earth" (about 7&times;10<sup>18</sup>, or about 19 tips) or "the number of atoms in the universe" (roughly 10<sup>80</sup>, or about 52 tips).
Think about this: nowadays, we routinely work with trees that have thousands, or even tens of thousands of tips!


## The anatomy of phylogenies

### Rooted and unrooted trees

My description of following branches from the tips down towards the base of the tree implicitly assumes that the tree is arranged so that the oldest nodes are always "down".
This requires knowledge about the earliest point in time on the tree, which we call the *root*.
Placing a root on the phylogenetic tree is not a trivial task!
By definition, it is the deepest node in the evolutionary history of the sampled populations, and so it is the most difficult to accurately reconstruct.
The root is an enormously significant component of the phylogenetic tree because it controls the direction that time flows along its branches.
Evolution always proceeds outwards from the root towards the tips.

To illustrate, here is an interactive animation that depicts a phylogenetic tree that I reconstructed from some Ebola virus genome sequences.

**Use your mouse to grab the big yellow dot that represents the root on the unrooted tree, and slide it around to reroot the tree on the right**
{% include rooting.html %}


It is difficult to locate the root.
{% include rtt.html %}


### Scaled and unscaled trees
The branches of the tree may be dimensionless, so that they contain no other information than the hypothesis that two nodes are directly related as an ancestor and descendant pair.
Since length is meaningless in this case, we usually draw the branches with lengths that are multiples of some constant amount.
Here's an example:
<center>
<img src="https://upload.wikimedia.org/wikipedia/commons/3/31/Cladogram-example1.svg" width="300px"/>
</center>
Note that the branch that connects "beetles" to the root is 3 times the length of the branches from either "butterflies and moths" or "flies" to their common ancestor.
Such a tree is called a *cladogram* or simply an "unscaled" tree.


### Rotating branches and ladderizing



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


## Building trees


### Distance-based trees

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
<img src="{{ site.baseurl }}/public/img/simple-tree.svg"/>
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
Rather than review a selection of these algorithms, I am only going to talk about the clustering algorithm that is the most widely used today: neighbor-joining.
The neighbor-joining (NJ) method was introduced by [Saitou and Nei](https://academic.oup.com/mbe/article/4/4/406/1029664) in 1987.
This method starts with a star phylogeny, where every sequence in the data set is directly descended from the same single common ancestor (so it literally looks like a tree!).
The objective of the subsequent steps is to progressively add ancestral nodes in such a way that minimizes the total branch length of the tree.

**Click "Step!" to make the animation proceed through one step of the NJ algorithm.**
{% include njtree.html %}




### Maximum likelihood


### Bayesian inference



## Software


## Further readings
* Felsenstein, J. (2004). Inferring Phylogenies. Sunderland, MA: Sinauer Associates.
