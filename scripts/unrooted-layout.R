require(ggtree)
require(ape)
require(treeio)
require(tidytree)
require(dplyr)

has.slot <- treeio:::has.slot
getNodeNum <- treeio:::getNodeNum
getRoot <- tidytree:::rootnode
get.tree <- treeio::get.tree
drop.tip <- treeio::drop.tip
get.fields <- treeio::get.fields


##' @importFrom ape reorder.phylo
getNodes_by_postorder <- function(tree) {
  tree <- reorder.phylo(tree, "postorder")
  unique(rev(as.vector(t(tree$edge[,c(2,1)]))))
}

# from ggtree
layoutEqualAngle <- function(model){
  tree <- as.phylo(model)
  
  brlen <- numeric(getNodeNum(tree))
  brlen[tree$edge[,2]] <- tree$edge.length
  
  root <- getRoot(tree)
  ## Convert Phylo tree to data.frame.
  ## df <- as.data.frame.phylo_(tree)
  df <- as_tibble(model) %>%
    mutate_(isTip = ~(! node %in% parent))
  
  ## NOTE: Angles (start, end, angle) are in half-rotation units (radians/pi or degrees/180)
  
  ## create and assign NA to the following fields.
  df$x <- NA
  df$y <- NA
  df$start <- NA # Start angle of segment of subtree.
  df$end   <- NA # End angle of segment of subtree
  df$angle <- NA # Orthogonal angle to beta for tip labels.
  ## Initialize root node position and angles.
  df[root, "x"] <- 0
  df[root, "y"] <- 0
  df[root, "start"] <- 0 # 0-degrees
  df[root, "end"]   <- 2 # 360-degrees
  df[root, "angle"] <- 0 # Angle label.
  
  df$branch.length <- brlen[df$node] # for cladogram
  
  
  N <- getNodeNum(tree)
  
  ## Get number of tips for each node in tree.
  ## nb.sp <- sapply(1:N, function(i) length(get.offspring.tip(tree, i)))
  ## self_include = TRUE to return itself if the input node is a tip
  nb.sp <- sapply(1:N, function(i) length(offspring(tree, i, tiponly = TRUE, self_include = TRUE)))
  ## Get list of node id's.
  nodes <- getNodes_by_postorder(tree)
  
  for(curNode in nodes) {
    ## Get number of tips for current node.
    curNtip <- nb.sp[curNode]
    ## Get array of child node indexes of current node.
    ## children <- getChild(tree, curNode)
    children <- treeio::child(tree, curNode)
    
    ## Get "start" and "end" angles of a segment for current node in the data.frame.
    start <- df[curNode, "start"]
    end <- df[curNode, "end"]
    cur_x = df[curNode, "x"]
    cur_y = df[curNode, "y"]
    for (child in children) {
      ## Get the number of tips for child node.
      ntip.child <- nb.sp[child]

            ## Calculated in half radians.
            ## alpha: angle of segment for i-th child with ntips_ij tips.
            ## alpha = (left_angle - right_angle) * (ntips_ij)/(ntips_current)
            alpha <- (end - start) * ntip.child / curNtip
            ## beta = angle of line from parent node to i-th child.
            beta <- start + alpha / 2

            length.child <- df[child, "branch.length"]

            ## update geometry of data.frame.
            ## Calculate (x,y) position of the i-th child node from current node.
            df[child, "x"] <- cur_x + cospi(beta) * length.child
            df[child, "y"] <- cur_y + sinpi(beta) * length.child
            ## Calculate orthogonal angle to beta for tip label.
            df[child, "angle"] <- -90 - 180 * beta * sign(beta - 1)
            ## Update the start and end angles of the childs segment.
            df[child, "start"] <- start
            df[child, "end"] <- start + alpha
            start <- start + alpha
        }
    }
  tree_df <- as_tibble(df)
  class(tree_df) <- c("tbl_tree", class(tree_df))
  return(tree_df)
}


tr <- rtree(50)

