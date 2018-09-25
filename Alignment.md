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

Below, I've embedded an interactive JavaScript animation that was written by [Mostafa Abdelraouf](https://github.com/drdrsh) that implements the Needleman-Wunsch algorithm:
{% include needleman.html %}




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


### Alignment programs


## Readings
* Durbin R, Eddy SR, Krogh A, Mitchison G. Biological sequence analysis: probabilistic models of proteins and nucleic acids. Cambridge University Press; 1998 Apr 23.


