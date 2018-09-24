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


