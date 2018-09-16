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


## Papers and data sets

| Section | Title (URL) | Data set |
|---------|-------------|----------|
| 1       |             |          |
| 2       | [Sequence-Based Prediction of Type III Secreted Proteins](http://journals.plos.org/plospathogens/article?id=10.1371/journal.ppat.1000376)   |          |
| 3 | [Whole-genome sequencing for analysis of an outbreak of meticillin-resistant Staphylococcus aureus: a descriptive study](https://www.sciencedirect.com/science/article/pii/S1473309912702773) |  |
| 4 | [Reduced diversity of faecal microbiota in Crohn’s disease revealed by a metagenomic approach](https://gut.bmj.com/content/gutjnl/55/2/205.full.pdf) | [FASTA](data/Manichanh-Crohns.fa) [FASTA](data/Manichanh-healthy.fa) |
| 5 | [The first T cell response to transmitted/founder virus contributes to the control of acute viremia in HIV-1 infection](http://jem.rupress.org/content/206/6/1253.full) | [FASTA](data/Fraser.gb) |
| 6 | [Out-of-Africa migration and Neolithic coexpansion of Mycobacterium tuberculosis with modern humans](https://www.nature.com/articles/ng.2744) |  |
| 7 | [Pandemic Potential of a Strain of Influenza A (H1N1): Early Findings](http://science.sciencemag.org/content/sci/early/2009/05/14/science.1176062.full.pdf) |   |
| 8 | [The primary transcriptome of the major human pathogen Helicobacter pylori](https://www.nature.com/articles/nature08756) |   |
| 9 | [A highly abundant bacteriophage discovered in the unknown sequences of human faecal metagenomes](https://www.nature.com/articles/ncomms5498) |   |


## GitHub repository

All code used to implement this website can be obtained on [GitHub]({{ site.github_repo }}).

## License

These course materials, with the exception of the data sets associated with publications from other parties, are released into the public domain under the [Creative Commons Attribution-ShareAlike 4.0](https://creativecommons.org/licenses/by-sa/4.0/) license, under which you are free to copy, modify and redistribute this content, even for commercial purposes, so long as that derived content is distributed under this same license.


   
