---
layout: page
title: Alignment
---

{% include toc.html %}


## What is alignment?

A sequence alignment is a detailed model about how two or more sequences are related to each other.
It's detailed in the sense that, whereas the underlying assumption that the sequences are related *overall* holds true for different alignments, an alignment takes this further to make assertions about how specific nucleotides or amino acids are copies from the same residue in the common ancestor.
For example, here is an alignment of two short nucleotide sequences:
```
1 ACGT
  | ||
2 A-GT
```
By convention, the vertical pipe character `|` emphasizes the associations between specific nucleotides in the two sequences. 
The dash character `-` indicates where there is a "gap" in one of the sequences because of an insertion or a deletion of nucleotides since the sequences descended from their common ancestor. 
We can't be certain whether it was an insertion or deletion (or both!) that occurred to result in this gap, since either scenario can produce this outcome.


### Pairwise sequence alignment

Algorithms for aligning pairs of sequences are a cornerstone of bioinformatics. 
If two sequences have descended from a common ancestor, then there is some unknown number of mutations (substitutions, insertions and deletions) that have caused these sequences to become different from each other. 
For closely related sequences, it may be feasible to reconstruct these mutational events (see [Thorne *et al.* 1991](https://link.springer.com/article/10.1007%2FBF02193625)), but the complexity of this reconstruction problem grows rapidly with divergence time.
Consequently, instead of explicitly modeling these mutations, we usually use a [heuristic method](https://en.wikipedia.org/wiki/Heuristic) to estimate how the sequences are related to each other.
A heuristic is an algorithm for solving a problem that has no theoretical guarantee of accuracy or efficiency, but instead is convenient and yields a "good enough" solution in practice.

Generally, the heuristic algorithms that we use for pairwise alignment rely on a concept from computer science called [dynamic programming](https://en.wikipedia.org/wiki/Dynamic_programming), in which a complex problem can be broken down into a sequence of much smaller, simpler recursive problems.
Perhaps the earliest example of a dynamic programming algorithm for aligning two sequences was described by Needleman and Wunsch in 1970. 
Their algorithm (now known as the Needleman-Wunsch algorithm) produces a "global" alignment in which the two sequences are assumed to be homologous over their entire lengths. 


#### Score matrices
First, we are required to decide how to score matched and mismatched residues. 
These scores can be parameterized from a pre-existing alignment of sequences - for example, the [BLOSUM]() matrices quantify the empirical frequencies of amino acid substitutions in a database of trusted protein alignments (see this course's readings on [databases](Databases.md)).
By convention, these scores are assigned integer values. 
Positive scores are used to reward an alignment for lining up matching nucleotides or amino acids.
Conversley, negative scores are used to penalize an alignment for lining up unmatched residues. 
For the nucleotides, the score matrix has 4 rows and 4 columns.
It is more common to parameterize the nucleotide score matrix with two values (one for a match, and a second for a mismatch) than to base these values on empirical frequencies.
For example, if we use a `5` for a match and `-4` for a mismatch, then we have the following score matrix:

|   | A | C | G | T |
|---|---|---|---|---|
| **A** | `5` | `-4` | `-4` | `-4` |
| **C** | `-4` | `5` | `-4` | `-4` |
| **G** | `-4` | `-4` | `5` | `-4` |
| **T** | `-4` | `-4` | `-4` | `5` |


#### Gap penalties
Next, we need to decide how to penalize an alignment for padding sequences with gap characters (`-`).
If an alignment can add gaps at no cost, then there is no reason not to favour an alignment that looks like this:
```
A-C-G-T
-A-C-T-
```
Like score matrices, it is conventional to assign an integer value as the gap penalty.
Generally speaking, the average score for matching residues will determine the scale for gap penalties &mdash; a gap penalty of `-5` could be substantial for a score matrix that consists mostly of `1`s, but not so much for a matrix of `10`s.
There is no universal rule that determines the optimal gap penalty, and this is a subjective decision that is left to the user's judgement. 

Further, there are different methods for penalizing a gap that spans two or more residues.
Let's denote the length of a gap by $$l$$.
The linear gap penalty is simply the product $$-ld$$, where $$d$$ is some constant 'per-gap' penalty.
A slightly more complex approach is the affine gap penalty, where we make a distinction between the cost of adding the first gap (the *gap open penalty*) and the cost for each additional gap (the *gap extension penalty*). 
Using $$d$$ and $$e$$ to refer to these respective penalties, the affine penalty is given by the formula $$-d-(l-1)e$$.
Usually one sets *e*<*d*.


#### Scoring and traceback

Now we have all the parameters required to populate the dynamic programming matrix, which we'll denote with the symbol *F*.
For two sequences with lengths *m* and *n*, F is a matrix with *m*+1 rows and *n*+1 columns, or vice versa.
We write a `0` in the upper left element of *F* (row 0, column 0).
The other entries come from the following formula:

$$
F(i,j)= \max \left\{ 
  \begin{array}{l}
    F(i-1,j-1) + s(x_i, y_j),\\
    F(i-1,j)-d,\\
    F(i, j-1)-d\\
  \end{array}
  \right.
$$

$$x_i$$ is the *i*-th residue in sequence *x*, $$y_j$$ is the *j*-th residue in sequence *y*, and *s* is our score matrix.
$$F(i,j)$$ represents the alignment score for the partial sequences up to positions *i* and *j*, respectively.
*F* is undefined for *i*<`0` or *j*<`0`, and we simply drop these cases from the above formula.
In other words, we are gradually building up the total alignment score from shorter alignments (this is where the dynamic programming comes in).

While we're filling out the *F* matrix, we have to keep track of which case gave the maximum value at each point.
This enables us to take the final step of retracing these choices back to the origin at $$F(0,0)$$, which is called the *traceback*. 
An upward step in the traceback results in a gap in the top sequence, and a leftward step adds a gap to the left sequence.

Below, I've embedded an interactive JavaScript animation that was written by [Mostafa Abdelraouf](https://github.com/drdrsh) that implements the Needleman-Wunsch algorithm.
Try modifying the match, mismatch and gap penalty settings (note that this algorithm uses the linear gap penalty).
You can also click on *Custom Path* and enter your own traceback to make a suboptimal alignment!

{% include needleman.html %}


#### Local and global alignment

The Needleman-Wunsch method is a global alignment algorithm - it aligns the sequences end-to-end, so that both sequences have at least one residue at the extreme left and right of the alignment.
This greatly simplifies the problem of aligning sequences, but it is not appropriate for all situations.
For example, what happens if we want to align two sequences where one sequence is much shorter than the other, not because of many deletions but because we didn't sequence the entire target (*e.g.*, gene)?
We can adjust for this by allowing the alignment to add terminal gap penalties at no cost.

Terminal gap penalties are applied to gaps that occur at the extreme left or extreme right of a sequence in the alignment.
For example, the alignment on the left contains terminal gaps, but the alignment on the right does not:
```
--ACG  A--CG
TTAC-  ATTCG
```
If we know beforehand that one of the sequences is nested within the other &mdash; for example, if one of the sequences is incomplete &mdash; then we might want to avoid penalizing terminal gaps.
Otherwise, we may end up scattering fragments of the shorter sequence across the longer sequence with the same total gap penalty:
```
A----C-----G
ATGCACGTTATG
```

The most well known algorithm for generating a local pairwise alignment is the [Smith-Waterman algorithm](https://en.wikipedia.org/wiki/Smith%E2%80%93Waterman_algorithm). 
It is derived from the Needleman-Wunsch algorithm but it is more complex to calculate, in part because the start and end points of the alignment are no longer constrained to the lower-right and upper-left corners of the matrix.
The sequence alignment programs that we use today generally implement some offshoot of the Smith-Waterman algorithm, with refinements to optimize the speed of calculation or output multiple alignments when there are multiple solutions with the same alignment score.


### Querying a database by sequence similarity


Some times we do not have the luxury of querying a database by high level information such as the name of a gene or organism.
For instance, there are many bioinformatic applications where all that we have to work with is a partial nucleotide sequence.




### Multiple sequence alignment

A *pairwise* alignment comprises two sequences, and a *multiple* sequence alignment (MSA) comprises three or more sequences.
Generally, an MSA is built up by carrying out a series of pairwise alignments.
This is not a trivial task because we have to reconcile the placement of gaps in any number of pairwise alignments such that the MSA makes sense.
To illustrate, here is another pairwise alignment of the top sequence against a third longer sequence:
```
1 AC-GT
  || ||
3 ACAGT
```
and next we're going to naively stack these pairwise alignments together:
```
1 ACGT
2 A-GT
3 ACAGT
```
Clearly, sequence (3) is not aligned with (1) and (2).

There is an enormous number of possible MSAs, and it is essentially impossible to reconstruct the "correct" MSA with a high degree of confidence.
To quote from Richard Durbin *et al.* (2005):
> .... we must keep in mind that there is no objective way to define an unambiguously correct alignment. [...] Asking a sequence alignment program to produce *exactly* the same alignment... means building in the same meaningless biases about how to 'align' structurally unalignable regions.


#### Guide trees

Most methods for generating an MSA use a progressive alignment heurstic, where the problem is broken down into a series of pairwise alignments.
We are then faced with the problem of how to selct pairs of sequences from the data set.
The most common approach to resolving this problem is to use a binary *guide tree*.
A binary tree is a tree where each split results in no more than two branches.
Usually, building a tree from a set of sequences requires that those sequences are aligned, which seems like a [chicken-and-egg problem](https://en.wikipedia.org/wiki/Chicken_or_the_egg).
One solution is to build all possible pairwise alignments to calculate the [genetic distances]() and then run a clustering method such as [neighbor-joining]() on the resulting distance matrix - this is the approach taken by the program [CLUSTALW](https://en.wikipedia.org/wiki/Clustal#ClustalW).
However, performing all these pairwise alignments just to generate a guide tree is really ineffiocient!
Instead, more recent alignment programs tend to make use of [alignment-free distances](Clustering.html#alignment-free-distances)) to avoid this lengthy process.


#### Iterative alignment

The use of a guide tree to determine the order of pairwise alignments in a progressive alignment algorithm suggests that we could take the resulting MSA and then use it to make a better guide tree!
This is an old idea - one of the earliest studies to use this approach was published in [1987](https://www.sciencedirect.com/science/article/pii/0022283687903160)) - and iterative refinement of an alignment is now employed in several modern alignment programs, such as [MUSCLE](https://www.drive5.com/muscle/) (see next section).
For example, this approach plays a central role in the program SAT&eacute;, which iteratively uses a maximum likelihood tree reconstruction as the guide tree for the next alignment.


### Alignment programs

This table briefly summarizes a number of open-source or freeware programs for generating an MSA from a set of homologous sequences.
You can click on the program name to follow the link to the program's official webpage where binaries or source code may be downloaded.
The release year is based on the earliest publication associated with the software.

| Name | Release year | Description |
|------|-------|-------------|
| [CLUSTALW](http://www.clustal.org/clustal2/) | [1994](https://academic.oup.com/nar/article-abstract/22/22/4673/2400290) | One of the first MSA programs to achieve widespread popularity. Compared to more recent programs, CLUSTALW is the least accurate. |
| [T-coffee](http://www.tcoffee.org/Projects/tcoffee/) | [2000](https://www.sciencedirect.com/science/article/pii/S0022283600940427) | Like CLUSTALW, T-coffee initially performs pairwise alignments of the sequences, but uses a mix of local and global alignments. |
| [MAFFT](https://mafft.cbrc.jp/alignment/software/) | [2002](https://academic.oup.com/nar/article/30/14/3059/2904316) | MAFFT uses a fast Fourier transform to identify homologous regions between sequences. A [Fourier transform](https://en.wikipedia.org/wiki/Fourier_transform) on a nucleotide sequence is a technique where the sequence is transformed into a set of four binary vectors for each nucleotide, and we calculate the number of matches for each vector from two sequences, where one vector is offset by some amount *k*. |
| [MUSCLE](https://www.drive5.com/muscle/) | [2004](https://academic.oup.com/nar/article/32/5/1792/2380623) | MUSCLE uses an alignment-free *k*-mer based distance to generate a guide tree, and iteratively refines the alignment by partitioning the tree into subtrees. |
| [BAli-Phy](http://www.bali-phy.org/) | [2006](https://academic.oup.com/bioinformatics/article/22/16/2047/207824) | As software names go, "BAli-Phy" is not your traditional abbreviation. Instead it underscores the key points, in that it uses Bayesian sampling to jointly estimate the alignment and the phylogeny.  We nearly always assume the alignment is a known, fixed quantity when reconstructing the phylogeny.  BAli-Phy takes the extraordinary step of inferring the alignment and the tree *at the same time* - in a sense, it is taking the concept of iterative alignment to its logical conclusion.  This approach is computationally challenging and I would not expect to be able to run this program on many more than 100 sequences, although recent publications have evidently done so. |
| [PRANK](http://wasabiapp.org/software/prank/) | [2008](http://science.sciencemag.org/content/320/5883/1632) | PRANK takes an innovative approach to the placement of gaps in the MSA, recognizing that sequence insertions usually lack evolutionary homology to other insertions. Put another way, think about this question: where does an insertion come from?  Is there any reason why two insertions, which are distinct (independent) evolutionary events, share a common ancestor?  In my experience, PRANK tends to spread insertions out to such an extreme that the resulting alignment becomes a sparse scaffold of isolated insertions. |


## Further readings

* Durbin R, Eddy SR, Krogh A, Mitchison G. *Biological sequence analysis: probabilistic models of proteins and nucleic acids.* Cambridge University Press; 2005 (8th printing).
* Thompson JD, Linard B, Lecompte O, Poch O. *A comprehensive benchmark study of multiple sequence alignment methods: current challenges and future perspectives.* PLoS ONE. 2011 Mar 31;6(3):e18093.

