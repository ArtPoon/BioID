---
layout: page
title: Databases
---

{% include toc.html %}

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
As the pile of paper gets higher, it becomes more and more difficult to retrieve a specific page.  

This section is going to focus mainly on genetic sequence databases.
There are many other kinds of [biological databases](https://en.wikipedia.org/wiki/List_of_biological_databases), such as the [Protein Data 
Bank](https://www.rcsb.org/) that stores the coordinate data of three-dimensional protein structures, the increasing commoditization of next-generatoin sequencing has caused genetic sequence data to supercede other sources of biological data.
For instance, microarrays were the primary technology for measuring gene expression until the advent of [RNA-Seq](https://en.wikipedia.org/wiki/RNA-Seq).
Similarly, [16S ribosomal RNA](https://en.wikipedia.org/wiki/16S_ribosomal_RNA) sequencing has largely superceded indirect assays of 16S variation such as [gradient gel eletrophoresis](https://en.wikipedia.org/wiki/RNA-Seq) to quantify the composition of microbial communities.


### GenBank

The National Center for Biotechnology Information (NCBI) is the home of GenBank, arguably the largest public repository of genetic sequence information in the world.
The predecessor of GenBank, the Atlas of Protein Sequence and Structure, was initiated and maintained by [Dr. Margaret Oakley Dayhoff](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5037978/), a pioneer of bioinformatics who also created some of its foundational computational methods.
The Atlas was essentially a stack of printed pages that collated the known protein sequences into a book.
How many pages would it take to record the current contents of GenBank?
As of [October 2018](https://www.ncbi.nlm.nih.gov/genbank/statistics/), GenBank contained about $$\mathsf{3.72\times 10^{12}}$$ nucleotides of data.
Suppose we can fit about 5,000 characters representing nucleotides on a printed page, and we use both sides.  
We can use a bit of Python to do the math:

```python
>>> a = 3444172142207 + 279668290132  # nt for whole-genome and standard seqs
>>> a/10000.
372384043.2339
>>> b = a/10000.
>>> b
372384043.2339
>>> '{:1.2e}'.format(b)  # scientific notation
'3.72e+08'
>>> b * 0.005  # suppose one sheet weights 5g
1861920.2161695
```

This would take about 1.8 thousand kilograms (metric tonnes) of paper! 
(That's equivalent to about two dozen [fully-loaded Boeing 737s](https://en.wikipedia.org/wiki/List_of_airliners_by_maximum_takeoff_weight).)


### Other databases

There are countless other public databases with genetic sequences that you can access on the web.
Many of these databases focus on a specific organism (*e.g.,* human immunodeficiency virus type 1) or genomic feature ([microsatellites](https://en.wikipedia.org/wiki/Microsatellite)).
Changes are that for your research interest, there is already a database out there catering to your needs.

The following table is *not* a comprehensive listing of public sequence databases.
(It's mostly a place for me to record ones that I've come across while preparing these course readings.)
Share and Enjoy:

| Name | URL | Description |
|------|-----|-------------|
| The RNase P database | <http://www.mbio.ncsu.edu/RNaseP> | RNase P sequences, secondary structures, and more. | 
| MicroSatellite DataBase (MSDB) | <http://tdb.ccmb.res.in/msdb> | A collection of simple sequence repeats |
| miRBase | <http://www.mirbase.org/index.shtml> | A searchable database of published microRNA sequences. |
| LANL HIV Databases | <https://www.hiv.lanl.gov> | A repository of HIV and SIV sequence data curated by scientists at the Los Alamos National Laboratory. |
| LANL HCV Databases | <https://hcv.lanl.gov/content/index> | A sister site to the HIV databases that is no longer funded and maintained. |


## How do we organize data?

### Primary keys
Even if we used the digital equivalent of a stack of paper and accumulated these sequence records in a single text file, the end result would be far more compact but still not terribly useful &mdash; we need a way to retrieve a particular record from this file.
First, we need some way of identifying a specific record.  
It wouldn't be sufficient, for example, to say "give me the sequence of the [&beta; subunit of the bacterial RNA polymerase](https://en.wikipedia.org/wiki/RpoB) for [*Vibrio cholerae*](https://en.wikipedia.org/wiki/Vibrio_cholerae).
(For one thing, the computer won't understand what you're talking about.)
This request is far too arbitrary: we could have asked for "Vibrio cholerae's RNA polymerase beta subunit", or "V. cholerae rpoB".
It's even worse if there are multiple sequences of this gene and bacterial species in the database! 
Instead, we need to agree on a formal standard system for requesting records.
A [primary key](https://en.wikipedia.org/wiki/Primary_key) is some datum (usually a number or string) that uniquely identifies a record in the database. 
We could settle on a consistent system for composing a key from a given sequence record. 
For example, we could imagine a text file that contains the key `Vibrio_cholerae_RNA_polymerase _beta_subunit_rpoB_1` on one line that is immediately followed by the gene sequence.

However, having a primary key still doesn't help us locate a particular record without exhaustively searching through the entire text file. 
This would be like trying to find your friend's phone number in a [phone book](https://en.wikipedia.org/wiki/Telephone_directory) by starting at the first page - horribly inefficient! 
Of course, a phone book organizes its records (pairs of names and phone numbers) by region and alphabetical order, but this is still inefficient in the context of organisms and genes since there are potentially enormous numbers of each category.

{% include image.html file="Telefonbog_ubt-0.JPG" width="300px" description="Remember these?" %}


### Database indices

Imagine that we're still trying to sift through an enormous text file with our primary key in hand.  (Yes, we could open the text file in an [text editor](https://en.wikipedia.org/wiki/Text_editor) application and use a find function to locate the record, but that is offloading the problem to someone else's program and it is not always feasible to load the entire contents of a text file into a text editor.)
Suppose that the record we're looking for starts on the 7,612,910-th line of the plain text file.
It would be much more efficient if we skim through an index of primary keys paired with line numbers instead of scanning through the entire contents of the file.
This is essentially the role of a [database index](https://en.wikipedia.org/wiki/Database_index): a specialized data structure that makes look-up operations more efficient.

> The concept of indices will come up again for the alignment of next-generation sequences to a reference genome.  In this case, we use a fragment of our query sequence as the key to retrieve a location in the reference genome from the index.  You can read more about this in the [Alignment](Alignment.md) document.

A database that needs to deal with a large number of text documents will often make use of indexes to facilitate [text searches](https://en.wikipedia.org/wiki/Full-text_search).
The NCBI databases employ an integrated search and retrieval system called [Entrez](https://www.ncbi.nlm.nih.gov/search/).
It is essentially a Google search engine for the enormous repositories of genomic and medical information stored in the public NCBI databases.
We will learn more about working with Entrez in the practical session associated with this topic.


## File formats

So far we have been talking about databases as plain text files where records are indexed by some system of keys.
There is no particular structure to one of these plain text files. 
For instance, we could simply have a line containing the record's key, followed by as many lines as needed to write the nucleotide sequence associated with that key:
```
KP728283.1 Zaire ebolavirus isolate Ebola virus/H.sapiens-wt/CHE/2014/Makona-GE1, complete genome
GGATCTTTTGTGTGCGAATAACTATGAGGAAGATTAATAATTTTCCTCTCATTGAAATTTATATCGGAAT
TTAAATTGAAATTGTTACTGTAATCATACCTGGTTTGTTTCAGAGCCATATCACCAAGATAGAGAACAAC
CTAGGTCTCCGGAGGGGGCAAGGGCATCAGTGTGCTCAGTTGAAAATCCCTTGTCAACATCTAGGCCTTA
```

A [file format](https://en.wikipedia.org/wiki/File_format) is a formal specification (*i.e.,* set of rules) of how data should be encoded in a file. 
If a computer program or user doesn't adhere to this specification then there is no guarantee that the same program or another program will successfully restore the original data from the file.

>The web page that you're reading right now was generated by an algorithm that converted a plain text file into [HTML](https://en.wikipedia.org/wiki/HTML) (another file format!) because the contents of that file adhered to a file format called [Markdown](https://en.wikipedia.org/wiki/Markdown).

A file that does not follow any particular specification is sometimes referred to as [*unstructured data*](https://en.wikipedia.org/wiki/Unstructured_data).
The plain text content of a newspaper or a journal article can be considered to be unstructured data.
It is difficult to have a computer program extract information from unstructured data because there is no consistent scheme that the program can use to map portions of text to labels such as "title" or "publication date".



#### FASTA
In fact, this is already very similar to a widespread standard format for storing sequences in a plain text file called `FASTA`.
[FASTA](https://en.wikipedia.org/wiki/FASTA) is a defunct computer program that was developed in the 1980s to search a sequence database for entries that are similar to the user's query sequence. 
Although this program is no longer in use, its format for storing sequences in plain text files is possibly the most common format in use today. 
The [FASTA format](https://en.wikipedia.org/wiki/FASTA_format) uses a `>` character prefix to indicate the start of a new record. 
All of the [header](https://en.wikipedia.org/wiki/Header_(computing)) information is stored in the same line prefixed by `>`.  
All subsequent lines are assumed to contain nucleotide or protein sequence (not both) data associated with that record, until the start of the next record on a new line.
Thus, the above example can be converted into a FASTA format simply by the addition of one character:
```
>KP728283.1 Zaire ebolavirus isolate Ebola virus/H.sapiens-wt/CHE/2014/Makona-GE1, complete genome
GGATCTTTTGTGTGCGAATAACTATGAGGAAGATTAATAATTTTCCTCTCATTGAAATTTATATCGGAAT
```

Here is a more complete example of four partial RNase P gene sequences from different species of gammaproteobacteria:
```
>AF084930.1 Proteus vulgaris RNase P RNA subunit (rnpB) gene, partial
GGATCCGGGGAGGAAAGTCCGGGCTCCACAGGGCAGGGTGCCAGATAACGTCTGGGAGGCGCGAGCCTAC
GACAAGTGCAGCAGAGAGTAAACCGCCGATGGCCTGTTTACAGGATCAGGTAAGGGTGAAAGGGTGCGGT
>P.aeruginosa RNase P RNA
AGAGUCGAUUGGACAGUCGCUGUCGCGCAAUAGCGCGGUGGAGGAAAGUCCGGGCUCCAUAGGGCAGAGU
GCCAGGUAACGCCUGGGAGGCGCGAGCCUACGGAAAGUGCCACAGAAAAUAACCGCCUAAGCGCAACAGC
>M10889.1 S.typhimurium gene for RNA subunit (M1 RNA) of ribonuclease 
CGACAGGATGAATGACTGTCCACGACGCTATACCCAAAAGAAAGCGGCTTATCGGTCAGTATCATCACTT
CATAAAACCCGTCAGTGTAAGCTGGCGGGTTTTTGCTTTTACAGGGCGGCAGGATGAATGACTGTCCACG
>M33657.1 E.agglomerans RNA component of ribonuclease P gene
GAAGCTGACCAGACAGTCGCCGCTTCGTCGTCGTCCTCCTTCGGGGGGAGACGGGCGGAGGGGAGGAAAG
TCCGGGCTCCATAGGGCAAGGTGCCAGGTAACGCCTGGGGGGTGTCACGACCCACGACCAGTGCAACAGA
```


The FASTA format is appealing because of its simplicity, but it also makes it difficult to store other information ([metadata](https://en.wikipedia.org/wiki/Metadata)) in a consistent and readily accessible way.
Not surprisingly, there are dozens of other file formats for storing sequence data.
A nice comparison of these file formats can be found [here](https://www.hiv.lanl.gov/content/sequence/HelpDocs/SEQsamples.html).


#### NEXUS

The [NEXUS](https://en.wikipedia.org/wiki/Nexus_file) file format is a highly structured file format. 
It is designed to accommodate a more diverse set of information, such as a phylogenetic tree that has been reconstructed from the sequences contained in the file.
Although there have been several software packages that support the NEXUS format, the specification has not been consistently implemented from one program to another.
>It doesn't help that the field of crystallography *also* has a NeXus file format.

Data in a NEXUS formatted file are organized into blocks.
Each block is delimited by a `begin` and `end` tag. 
Below, I've pasted in the result from converting the previous FASTA file contents into a NEXUS format with the program [AliView](http://www.ormbunkar.se/aliview/):
```
#NEXUS

BEGIN DATA;
DIMENSIONS  NTAX=4 NCHAR=140;
FORMAT DATATYPE=DNA GAP=- MISSING=?;
MATRIX

AF084930.1 Proteus vulgaris  GGATCCGGGGAGGAAAGTCCGGGCTCC...
P.aeruginosa RNase P RNA     AGAGUCGAUUGGACAGUCGCUGUCGCG...
M10889.1 S.typhimurium       CGACAGGATGAATGACTGTCCACGACG...
M33657.1 E.agglomerans       GAAGCTGACCAGACAGTCGCCGCTTCG...
;

END;

BEGIN ASSUMPTIONS;
EXSET * UNTITLED  = ;
END;

BEGIN CODONS;
CODONPOSSET * CodonPositions =
 N:,
 1: 1-139\3,
 2: 2-140\3,
 3: 3-138\3;
CODESET  * UNTITLED = Universal: all ;
END;

BEGIN SETS;
END;
```
Note that I've truncated both the sequence headers (labels) and the nucleotide sequences (...) so that the web page doesn't [soft wrap](https://en.wikipedia.org/wiki/Line_wrap_and_word_wrap#Soft_and_hard_returns) these entries onto multiple lines. 
This makes it easier to see that:
1. Each sequence label appears on the left, followed by enough spaces to align the nucleotide sequences together.
2. Each sequence is contained on a single line.
3. That *AliView* embeds additional information in this file, such as the assumed genetic code.

As mentioned above, there are several variants on the NEXUS format. 
For example, an interleaved NEXUS file will display a only set number of nucleotides per line, followed by as many additional data blocks as necessary to run through the entire sequence lengths:
```
#NEXUS

BEGIN DATA;
DIMENSIONS  NTAX=4 NCHAR=140;
FORMAT DATATYPE=DNA GAP=- MISSING=? INTERLEAVE=YES;
MATRIX

AF084930.1 Proteus vulgaris  GGATCCGGGG
P.aeruginosa RNase P RNA     AGAGUCGAUU
M10889.1 S.typhimurium       CGACAGGATG
M33657.1 E.agglomerans       GAAGCTGACC

AF084930.1 Proteus vulgaris  AGGAAAGTCC
P.aeruginosa RNase P RNA     GGACAGUCGC
M10889.1 S.typhimurium       AATGACTGTC
M33657.1 E.agglomerans       AGACAGTCGC
```

In practice, you are unlikely to encounter the NEXUS format unless you are using a specialized phylogenetic tree reconstruction (*e.g.*, [MrBayes](http://nbisweden.github.io/MrBayes/)) or sequence analysis (*e.g.*, [Mesquite](https://www.mesquiteproject.org/)) program.
Nowadays you're more likely to encounter next-generation sequence file formats, which we'll cover in the section on [NGS](NGS.html).



## Flat files

Not all the data that we deal with in bioinformatics is based on genetic sequences.
In bioinformatics, you will frequently be dealing with [flat files](https://en.wikipedia.org/wiki/Flat-file_database), where all the information is stored as a plain text file.
For example, the [comma-separated values](https://en.wikipedia.org/wiki/Comma-separated_values) (CSV) format is widely used to store tabular data, where values are arranged in [tables](https://en.wikipedia.org/wiki/Table_(information)) with rows and columns like a [spreadsheet](https://en.wikipedia.org/wiki/Spreadsheet).
By convention, each row corresponds to an observation and each column represents a kind of measurement (variable).

To illustrate, I've reproduced a portion of a table from a publication in the British Medical Journal from 1965 ([Graph and Table of Infectious Disease](https://www.ncbi.nlm.nih.gov/pubmed/20790782)):
 
| Cases | Eng. & Wales | Grt. Lnd | Scot. | N.Ire. | [Eire](https://en.wikipedia.org/wiki/%C3%89ire) |
|-------|--------------|----------|-------|--------|------|
| Diptheria | 0 | 0 | 1 | 0 |  |
| Dysentry  | 482 | 85 | 136 | 5 | 2 |
| Encephatlis, acute | 2 | 0 |   | 0 |   |
| Enteric fever, typhoid | 3 | 1 | 4 | 1 |   |
| Measles | 3268 | 153 | 37 | 40 | 73 |

and here are the same data in a CSV format:
```CSV
Cases,Eng. & Wales,Grt. Lnd,Scot.,N.Ire.,Eire
Diptheria,0,0,1,0,
Dysentry,482,85,136,5,2
"Encephatlis, acute",2,0,,0,,
"Enteric fever, typhoid",3,1,4,1,
Measles,3268,153,37,40,73
```


## Relational databases

When you are doing something online that involves transferring information, you are usually interacting with a database.  





