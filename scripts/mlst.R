
require(ape)

mlst <- read.dna('~/git/BioID/data/MLST-aligned.fa', format='fasta')

res <- dist.dna(mlst[1:10,], model='TN93')
