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
The International Council on the Taxonomy of Viruses recently passed a resolution to accept a new virus species definition based solely on a cluster of sequence variation in an environmental sample. <!-- ref? -->
Thus, a taxonomy or nomenclature of microbial species can be proposed by finding clusters of genetic similarity.
For example, a recent study by <!- JC paper with Eddie Holmes -> performed extensive next generation sequencing of RNA from a large number of underrepresented host taxonomic groups, including fish and ...



<!-- examples of clustering for taxonomy -->

<!- what is this? -> 


### Epidemiology

* subtypes and genotypes - HIV is easy, are there bacterial examples?
* E.coli?


## Genetic distances

In order to declare that two sequences are similar, we need to have some way of measuring that similarity.
A genetic distance is any method that takes two sequences as inputs and yields a number that is meant to quantify how different they are.
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
One way of thinking about this is that the set of all possible sequences that is within a distance of 0.1 to some other sequence is infinitely large (think about it!).

* Lempel-Ziv

* Levenshtein distance

* k-mer distance
  * examples


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

<!-- divergence simulator -->


## Nonparametric clustering

### Distance-based clustering


### Tree-based clustering


## Parametric clustering



