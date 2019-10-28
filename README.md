---
layout: page
title: About
---

This undergraduate course is designed to cover a broad domain of bioinformatics as it is applied to the study of infectious diseases.  The course is structured by different topics that are anchored by recent, high-impact papers in the scientific literature.  For each paper, we will cover the overall theme, the context of the specific study, the underlying model and algorithm, and then run a simplified version of the analysis in the laboratory section.


## Learning objectives
* To develop a fundamental understanding of the concepts underlying the analysis of genetic sequence variation from infectious disease outbreaks (genetic distances, maximum likelihood).
* To gain basic command-line literacy.
* To become acquainted with popular software tools used for the analysis of infectious disease sequence data.

## Outline
1. [Databases](Databases.md)
   * NCBI GenBank
   * scoring matrices
   * BLAST queries
2. [Alignment](Alignment.md)
   * Smith-Waterman and related algorithms
   * homology search and domain prediction
3. [Genetic diversity](Clustering.md)
   * measures of diversity (entropy)
   * genetic distances
   * virus nomenclature
   * molecular epidemiology (genetic clustering)
4. [Building trees](Trees.md)
   * Distance-based methods (neighbor-joining)
   * Rooting (outgroup, midpoint)
   * 16S rRNA
5. [Measuring rates of evolution](Rates.md)
   * Markov chain models (Jukes-Cantor)
   * Rates of evolution
   * Probability and maximum likelihood
   * Detecting selection
6. [Molecular clocks](Clocks.md)
   * Rescaling trees
   * Root-to-tip methods
   * Dating zoonoses
7. [Modeling epidemics](Models.md)
   * Compartmental models
   * Kingman's coalescent
   * Bayesian inference
   * Demographic growth models (skylines)
8. [Next-generation sequencing](NGS.md)
   * NGS data formats
   * Short-read mapping
   * RNA-Seq analysis
9. [Genomics](Ecology.md)
   * de novo assembly of NGS data
   * metagenomics
   * novel pathogens


## GitHub repository

All code used to implement this website can be obtained on [GitHub]({{ site.github_repo }}).

## License

These course materials, with the exception of the data sets associated with publications from other parties, are released into the public domain under the [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/) license, under which you are free to copy, modify and redistribute this content, even for commercial purposes, so long as that derived content is distributed under this same license.


   
