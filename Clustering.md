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
<center>
{% include example.html %}
</center>

Clusters are useful because they can reveal underlying processes that shape the data.
There is also an intuitive appeal to clustering, since we are naturally inclined to impose order on our sensory inputs.

A clustering method is a formal set of rules (an algorithm) for defining which observations will be grouped together.
There are an endless number of clustering methods, so it helps to cluster them into distinct categories (ha!). 
Clustering methods can be *supervised* or *unsupervised*. 
A method is supervised if you tip off the algorithm with a number of examples that you have assigned to clusters.
Otherwise, the algorithm has to figure out for itself how many clusters exist in the data, and needs to assign data to those clusters without any help.

Clustering methods can be *nonparametric* or *parametric*. 
A nonparametric method uses only the observed distribution of characteristics in the data to make decisions about clusters.
For example, suppose we take the time between cars that pass some point on a highway. 
This gives us some distribution that might look something like this:
<!-- negative binomial distribution here? or mixture model? -->
If we draw a line through this distribution and 

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
Many infectious diseases, such as bacteria or viruses, are difficult to categorize into groups like *species* because conventional [species concepts](), such as [reproductive isolation](), do not readily apply.
For example, bacteria can exchange genetic material with other bacteria, which are otherwise evolutionarily unrelated, by some method of [horizontal transfer](http://wikipedia.org/...).
Even so, it is convenient -- if not a scientific or clinical imperative -- to be able to refer to a particular virus as belonging to one species or another.
Since many pathogens lack a large number of measurable characteristics, it has become increasingly acceptable to define a species based on its genetic dissimilarity to others alone.
The [International Committee on the Taxonomy of Viruses] (ICTV) recently passed a resolution to accept a new virus species definition based solely on a cluster of sequence variation in an environmental sample. <!-- ref? -->
Thus, a taxonomy of microbial species can be proposed by finding clusters of genetic similarity.
For example, a recent study by <!-- JC paper with Eddie Holmes --> performed extensive next generation sequencing of RNA from a large number of underrepresented host taxonomic groups, including fish and ...



<!-- examples of clustering for taxonomy -->
Below the species level, clustering can also be used to define a nomenclature of subtypes or genotypes within a species.
Loosely defined, a subtype is a genetically-distinct cluster that share a common ancestor.
Subtypes tend to have a characteristic global distribution that may be attributed to a founder effect, where a particular variant seeds a new epidemic in a relatively isolated population (such as a continent) with limited migration with the source population.


### Epidemiology



## Genetic distances

In order to declare that two sequences are similar, we need to have some way of measuring that similarity.
A genetic distance is any method that takes two sequences as inputs and yields a number that is meant to quantify how different they are.
The distance of a sequence to itself should always be zero, and it should always return a non-negative number otherwise.
There is a countless number of possible genetic distances and you will encounter at least several of these in this course alone.
A broad categorization for distances is to make a distinction between distances that require the sequences to be [aligned](Alignment.md) to each other, and distances that do not.


### Alignment-free distances

Genetic distances that does not require the sequences to be aligned can be useful because they are often fast to calculate, and pairwise alignment is a computationally complex problem that becomes more time consuming with longer sequences.
If we are dealing with extremely long genome sequences, for example, we might opt to use an alignment-free distance to establish a rough estimate of which sequences are the most similar without attempting any alignment.
One example of an extremely simple alignment-free distance is to take the difference in the proportions of each sequence consisting of G's or C's.
We can refer to this proportion as the GC-content.
Instead of trying to compare *specific* G's and C's that could be directly descended from the same nucleotide in a common ancestor, we're just going to count them.

Here's a quick Python script for implementing this distance:
```python
import sys
s1, s2 = sys.argv[1:3]  # take two string arguments from cmd line
def gc(s):
    s = s.upper()  # convert to upper case
    return (s.count('C') + s.count('G')) / float(len(s))
result = abs(gc(s1) - gc(s2))  # take absolute difference
print(result)
```

If we call this script on the command line and start feeding it some arbitrary sequences, we can get a feel for how the distance behaves:
```shell
art@Misato:~/git/bioid/scripts$ python gcdist.py ACCAGTAGCTAG GTGATCGACTAGCA
0.0
art@Misato:~/git/bioid/scripts$ python gcdist.py ACCAGTAGCTAG AAAAAAAAAAAA
0.5
art@Misato:~/git/bioid/scripts$ python gcdist.py AATTTATATATATAT CGCGCGCGCGCGCGCGCG
1.0
```
In the first case, I chose sequences that have the exact same GC content (50%), so the distance is 0. 
Next, I set the second input to a string of A's (zero GC content), so the distance increased to 0.5.
Finally, I compared one sequence with zero GC content to a second sequence made up entirely of G's and C's to obtain the maximum possible distance of 1.

This genetic distance is intuitive and was fairly easy to implement if you know a bit of Python - but it's also not terribly informative.
One way of thinking about this is that the set of all possible sequences that is within a distance of 0.1 to some other sequence is infinitely large.
For example, the sequence `ACCAGTCAGCTAG` has the same distance from `AC`, `AACC`, `AAACCC` and so on with an infinite number of permutations.
Here I briefly review some alignment-free distances from the literature that actually see some use in practice:

* The [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) is the minimum number of operations (replace, add or delete a letter) to transform one sequence into another. 
  For example the Levenshtein distance between the sequences `ACGT` and `CGTA` is 2, but the Hamming distance is 4. 
  Since we can add or remove letters, the Levenshtein distance is defined for sequences with different lengths (*e.g.*, `ACGT` and `CGT`), but the [Hamming distance](https://en.wikipedia.org/wiki/Hamming_distance) is not. 

* A [k-mer]() distance can be calculated by breaking each sequence down to all strings of length *k*. 
  For example, the sequence `ACGTA` can be broken down into three 3-mers (k=3): `ACG`, `CGT` and `GTA`.
  Next, we do the same operation for a second sequence `GTACGTA`, which gives us the 3-mers `GTA`, `TAC`, `ACG`, `CGT` and `GTA`.
  Suppose we next make a table with all possible nucleotide 3-mers, all the way from `AAA` to `TTT`, and tabulate the frequencies for the two sequences:
  
  | 3-mer | seq 1 | seq 2 |
  |-------|-------|-------|
  | `AAA` | 0     | 0     |
  | `ACG` | 1     | 1     |
  | `CGT` | 1     | 1     |
  | `GTA` | 1     | 2     |
  | `TAC` | 0     | 1     |
  
  Note that I've omitted many rows with zero counts in both sequences for brevity.
  Now we can extract a distance from this table using one of several different methods.
  



### Distances on aligned sequences

Whereas alignment-free distances tend to be fast but with limited information, distances on aligned sequences tend to be slower but more detailed.
With aligned sequences, we can compare "apples to apples". 
Put another way, we're *not only* checking to see if the other sequence also has an "A", we want to know if it has *the same* "A".
(Sameness as in [evolutionary homology]() -- that the nucleotides are copies that descend from the same nucleotide in a common ancestor.)

Given that the input sequences are aligned, genetic distances will tend to operate on the related nucleotides that are different.
A very simple distance is the Hamming distance, which counts the number of nucleotide differences in the aligned sequences.
Here is a Python script that implements a Hamming distance:
```python
import sys
s1, s2 = sys.argv[1:3]  # should be aligned!
ndiffs = 0.
for i, nt1 in enumerate(s1):
    nt2 = s2[i]  # use <i> counter to index into other sequence
    if nt1 != nt2:
        ndiffs += 1  # add one to result
print(ndiffs)
```
and here it is in action:
```
art@Misato:~/git/bioid/scripts$ python hamming1.py AGGTCAG ATGGACC
5
```

Note that this distance will tend to assume larger values when we compare longer sequences. 
This usually isn't desirable behavior for a genetic distance, because we may want to ask whether two shorter sequences are more genetically similar than two longer sequences.
An easy way to fix this issue is to rescale the Hamming distance by the sequence length, which we can do by replacing `print(ndiffs)` with `print(ndiffs/len(s1))`. 
(Since s1 should have the same length as s2, it doesn't matter which length appears in the denominator.)
This scaled distance is often called the *p-distance*:
```python
art@Misato:~/git/bioid/scripts$ python pdist.py AGGTCAG ATGGACC
0.714285714286
```

The Hamming distance and p-distance are easy to understand and fairly straight-forward to calculate.
However, we don't often see them getting used, because they have a big problem when we are dealing with long evolutionary time scales --- or when we're working with rapidly-evolving pathogens.


### Adjusting for multiple hits

If we are considering a pair of sequences that are fairly long, then the probability that mutations hit the same nucleotide more than once ("lightning strikes twice") will be fairly low. 
Suppose we start with a single ancestral sequence `AAAAAAAAAA`.
This ancestor has two descendant lineages.
As we follow these descendants forward in time, they will start to accumulate random mutations. 
The first mutation makes one of the sites different - now one of the sequence might look like this: `AAAGAAAAAA`.
The p-distance is now 0.1.
All things being equal, there is now a 1/10 chance that the *next* mutation affects the same site.

What happens if the next mutation *does* hit the same site as the first mutation?
The first thing to realize is that the p-distance remains exactly the same, even though two mutations have now occurred.
Second, it doesn't matter *which* sequence gets the second mutation - the end result will the same as far as the distance is concerned, *e.g.,*:
* `AAACAAAAAA` and `AAAGAAAAAA`
* `AAAAAAAAAA` and `AAATAAAAAA`

Third, it doesn't matter whether the mutation causes the nucleotide to revert back to the ancestral state, or to a different nucleotide.
The situation gets worse as more sites mutate away from the ancestor.

Another way to think about this is that the distance cannot increase indefinitely.
At some point, the sequences that are accumualating mutations at random will not get any further apart on average.
To illustrate, let's assume that the four nucleotides are always at equal frequencies, *e.g.,* on average, 25% of the nucleotides in a sequence will be "A", and so on.
As the sequences evolve apart, they will eventually become so distantly related that one sequence is equivalent to drawing nucleotides completely at random, as far as the number of differences from the other sequence is concerned.

The first study to derive a formula to correct the p-distance for multiple hits was published by Jukes and Cantor (1969).
This formula makes a number of assumptions:
1. that the four nucleotides exist at equal frequencies;
2. that substitutions occur at the same rate between any two nucleotides;
3. that the substitution rates are constant over time; and
4. that the substitution rates are the same for every site in the genome.

Under these assumptions, the Jukes-Cantor model predicts that the number of substitutions that *actually* occurred between two sequences with a p-distance of *p* is:

$$d = -\frac{3}{4}\ln\left(1-\frac{4}{3}p\right)$$

where $$\ln$$ is the [natural logarithm](https://en.wikipedia.org/wiki/Natural_logarithm).

Here is what this formula looks like:

<center>
{% include jukes-cantor.html %}
</center>


### Named nucleotide distances

Jukes and Cantor's landmark paper was followed by a number of refinements on their basic model that reduce one or more of the assumptions. 

* Kimura 2-parameter (K2P) adds a parameter to distinguish between transition and transversion rates.  
  Transitions are substitutions between [purines](https://en.wikipedia.org/wiki/Purine) (A's and G's) or between [pyridmidines](https://en.wikipedia.org/wiki/Pyrimidine) (C's and T's).
  These tend to occur faster than transitions (substitutions between a purine and pyrimidine, or vice versa), in part because transitions are less likely to cause an amino acid substitution given the [genetic code](https://en.wikipedia.org/wiki/Genetic_code) &mdash; this is sometimes referred to as the transition bias.
* Tajima-Nei (1984) distance allows for unequal equilibrium base frequencies.
  We assume that an evolving nucleotide sequence will eventually comprise nucleotides at these frequencies, given sufficient time to converge to this equilibrium.
* The Tamura 3-parameter (1992) distance combines the transition bias of the K2P distance with the unequal base frequencies of the Tajima-Nei distance.
* Tamura-Nei (1993; TN93) extends the Tamura 3-parameter distance by adding a fourth parameter to differentiate between the two types of transitions (those involving A and G, and involving C and T).




## Distance-based clustering

Genetic distances provide a straight-forward basis for clustering sequences.
First, we need to select a genetic distance and then compute this distance for every pair of sequences in the data.
The complete set of all pairwise distances can be arranged as a table where the sequences are arranged in the same order along the rows and columns:

|   | seq1 | seq2 | seq3 |
|---|------|------|------|
| seq1 | 0 | 0.12 | 0.31 |
| seq2 | 0.12 | 0 | 0.40 |
| seq3 | 0.31 | 0.40 | 0 |

This table is equivalent to a symmetric matrix and we often refer to it as the [distance matrix](https://en.wikipedia.org/wiki/Distance_matrix).

Next, we select a distance cutoff.
Any pair of sequences with a distance below this cutoff are assigned to the same cluster.
This is frequently visualized as a network, more formally known as a [graph](https://en.wikipedia.org/wiki/Graph_(discrete_mathematics)).
Thus, every sequence is represented by a node in the graph, and each connection between nodes indicates that the respective infections are within the cutoff distance of each other.

<center>
{% include cluster.html %}
</center>


## Tree-based clustering

We will explore the topic of reconstructing phylogenetic trees more fully in [another section](Trees.md).
However, we're going to get a bit ahead of ourselves so that we can talk about the other major class of nonparametric clustering methods that are based on trees.
A tree is a model of how different populations are related by common ancestors.
When we're using trees to cluster infections of a certain pathogen, each tip of the tree represents an infection.
Infections that are connected by one common ancestor in the tree are more closely related to each other than to any other infection in the tree.
For example, the tree below indicates that humans are more closely related to chimpanzees than apes.

<center>
  <img src="/public/img/chimpanzee.svg" width="300px"/>
</center>

(Note that I've used the same branch lengths to emphasize that the only information we are using here is the branching order.)
The premise that an ancestral node separates the tree into more closely related groups is an important concept for using trees to cluster sequences.


### Bootstrapping

When we reconstruct tree from a multiple sequence alignment, we cannot be certain that any single tree produced by the reconstruction method is the *correct* tree.
How can we determine our [confidence level](https://en.wikipedia.org/wiki/Confidence_interval) in specific features in our reconstructed tree (such as the assertion that A is more closely related to B)?
One possible approach is to collect replicate data sets - that is, sequence additional loci from the same taxa.
In practice, however, it is often not feasible to replicate the entire data set over different loci many times or even once!
For this reason, [Joe Felsenstein](https://en.wikipedia.org/wiki/Joseph_Felsenstein) applied a concept from [computational statistics](https://en.wikipedia.org/wiki/Category:Computational_statistics) known as bootstrapping.

The basic idea behind bootstrapping is that, without the availability of any additional data, our only recourse is to "pull ourselves up by our own bootstraps".
We take the data we already have, and then we pretend that it is the source of all possible data.
By making this strange assumption, we can sample observations from the data [at random with replacement](https://en.wikipedia.org/wiki/Sample_(statistics)), which artificially makes the original data set unlimited in size.
In the case of assessing our confidence in a reconstructed tree, we take the original alignment and sample columns from this alignment at random with replacement until we can assemble a new alignment with the same dimensions as the original (*e.g.,* the same number of rows and columns).
Using this resampled alignment, we use the same process to reconstruct a tree that was used for the original alignment, and repeat the process until we have a new collection of trees.

Suppose we want to measure our confidence level that taxon A is the most closely related to B.
We can accomplish this by counting the number of trees in our bootstrap sample set where this assertion is true.


### Branch lengths

The branches that connect the tips to common ancestors are often scaled so that a branch's length approximates the elapsed time.



## References

* Jukes Cantor


