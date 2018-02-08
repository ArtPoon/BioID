---
layout: page
---

{% include toc.html %}

# Databases

## Bioinformatics is about data
Bioinformatics exists because it has become increasingly more afforadble, faster and easier to generate massive amounts of complex biological data sets.  Presently, we can measure "mass" in [gigabytes](https://en.wikipedia.org/wiki/Gigabyte), although this unit will likely become outdated in a number of years, and storage devices begin to be issued with capacities measured in petabytes instead of terabytes.  To put this in context, a plain text file containing the consensus sequence for chromosome 2 of the human genome reference assembly *hg38* takes up about a quarter of a gigabyte:

```bash
# retrieve the sequence file from the UCSC Genome Browser server
$ wget ftp://hgdownload.cse.ucsc.edu/goldenPath/hg38/chromosomes/chr2.fa.gz
--2017-12-19 16:11:35--  ftp://hgdownload.cse.ucsc.edu/goldenPath/hg38/chromosomes/chr2.fa.gz
           => ‘chr2.fa.gz’
Resolving hgdownload.cse.ucsc.edu... 128.114.119.163
Connecting to hgdownload.cse.ucsc.edu|128.114.119.163|:21... connected.
Logging in as anonymous ... Logged in!
==> SYST ... done.    ==> PWD ... done.
==> TYPE I ... done.  ==> CWD (1) /goldenPath/hg38/chromosomes ... done.
==> SIZE chr2.fa.gz ... 78561132
==> PASV ... done.    ==> RETR chr2.fa.gz ... done.
Length: 78561132 (75M) (unauthoritative)

chr2.fa.gz          100%[===================>]  74.92M  2.94MB/s    in 38s     

2017-12-19 16:12:14 (1.95 MB/s) - ‘chr2.fa.gz’ saved [78561132]

# uncompress the file with the GNU unzip program, but leave a copy of the original compressed version
$ gunzip --keep chr2.fa.gz

# give me a long list of all files that start with "chr2", with "human readable" file size info
$ ls -lh chr2*
-rw-r--r--  1 artpoon  staff   236M Dec 19 16:12 chr2.fa
-rw-r--r--@ 1 artpoon  staff    75M Dec 19 16:12 chr2.fa.gz
```
> ![](https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Gnome-help-about.svg/48px-Gnome-help-about.svg.png) **What is this code stuff above?**  Throughout these documents, I'm going to embed bits of code that I used to obtain or analyze data.  Although learning how to code is *not* a primary objective of the course, I'd like you to be able to see *how* these things are done with code (and, better yet, to try out on your own computer!).  
>
> This particular excerpt comes from a command-line interface session with a UNIX-like operating system.  Commands that I have entered start with a `$` symbol.  I have added comments that start with a `#` symbol to explain the purpose of each command.  Any other line that does not start with either `$` or `#` is output returned by the computer.  

The directory listing command `ls` tells us that the text file containing the *hg38* chromosome 2 sequence is 236 megabytes (about a quarter of a billion bytes) in size.  Nucleotide sequences compress pretty well because they are comprised almost entirely of the [IUPAC] standard symbols for unambiguous nucleotides (`A`, `C`, `G` and `T`) and we can expect a fair amount of redundancy from repeating symbols, so the compressed file that we downloaded was roughly a third of the size.

This course is about infectious diseases, so we're generally not going to be dealing with genomes on the scale of human chromosomes.  However, we *are* going to be dealing with very large *numbers* of sequences.  Cumulatively, sequences derived from viruses with even the smallest genomes (comprising only a few thousand nucleotides) can readily attain file sizes measured in gigabytes, because we often want to characterise a large number of sequences from a diverse population of viruses that have been sampled from an infection.


## What is a database?

A database is a systematic collection of data. 
Under this broad definition, a stack of papers on my desk is a database if I add papers to the top of the pile to maintain a chronological order - it's just not a terribly useful database.
However, this is not that different from how data from the initial era of genetic sequencing was compiled into a reference archive.


* sequences used to be kept in books
* Margaret Oakley Dayhoff
* how many printed pages would it take to record the current contents of Genbank? - calculate in Python (variable assignment and arithmetic)

* genbank

* annotations - 

* searching - storage isn't enough 
* how to query a sequence database, distance matrices
* BLAST

* local BLAST
