---
layout: page
title: Clustering
---

{% include toc.html %}

## What are clusters?

A cluster is a subset of objects that are more similar to each other than they are to objects that are not in the cluster.
The amount of similarity that is sufficient to define a cluster is subjective, and clusters can occur entirely by chance. 
If you drop a handful of jellybeans in a bowl, your eyes will naturally be drawn to what you perceive as patterns.

<!-- jellybean bowl animation -->
{% include example.html %}

Clusters are useful because they can reveal underlying processes that shape the data.
There is also an intuitive appeal to clustering, since we are naturally inclined to impose order on our sensory inputs.

A clustering method is a formal set of rules (an algorithm) for defining which observations will be grouped together.
There are an endless number of clustering methods, so it helps to cluster them into distinct categories (ha!). 
Clustering methods can be *supervised* or *unsupervised*. 
A method is supervised if you tip off the algorithm with a number of examples that you have assigned to clusters.
Otherwise, the algorithm has to figure out for itself how many clusters exist in the data, and needs to assign data to those clusters without any help.

Clustering methods can be *nonparametric* or *parametric*. 
A nonparametric method uses only the observed distribution of characteristics in the data to make decisions about clusters.
For example, 

Clustering methods can be *agglomerative* or *dissortative*.
Agglomerative (or hierarchical, bottom-up) methods begin with every observation belonging to its own cluster of one. 
Next, the algorithm attempts to merge two clusters A and B together to form a new cluster AB.
Generally speaking, the next pair of clusters we want to merge should be the most similar. However similarity is not a trivial thing to measure. 
What if each data point has a large number of characteristics? 
Do we pick one characteristic on which to cluster the data?
How do we combine information from multiple characteristics?
Furthermore, it's up to the algorithm to decide what AB is going to "look like" when comparing it to other clusters.
At some point it will need to decide whether to merge AB with another cluster.

Dissortative (top-down) methods begin with every observation belonging to a single cluster, and then separates data points within a cluster to form two or more new clusters.


## Clusters and infectious diseases


### Diversity




### Epidemiology


## Genetic distances

In order to declare that two sequences are similar, we need to have some way of measuring that similarity.


## Nonparametric clustering

### Distance-based clustering


### Tree-based clustering


## Parametric clustering



