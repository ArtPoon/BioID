# expected number of substitutions
t <- seq(0, 2, length.out=50)

# Jukes-Cantor distance
jc <- 3/4*(1-exp(-4/3*t))

plot(t,jc)

# p-distance


write.csv(data.frame(time=t, dist=jc), 
          file='~/git/BioID/data/jukes.csv', 
          quote=F, row.names=F)

