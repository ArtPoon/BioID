// use IIFE to isolate namespace
(function rootingCharts() {
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
      width = 400,
      height = 400,
      svg = d3.select("div#unrooted")
              .append("svg")
              .attr("width", width)
              .attr("height", height)
              .append("g");

  var width2 = 400,
      height2 = 400;

  var svg2 = d3.select("div#rooted")
               .append("svg")
               .attr("width", width2)
               .attr("height", height2)
               .append("g");


  // set up plotting scales
  var xValue = function(d) { return d.x; },
      xScale = d3.scale.linear().range([0, width]),
      xMap = function(d) { return xScale(xValue(d)); },  // points
      xMap1 = function(d) { return xScale(d.x1); },  // lines
      xMap2 = function(d) { return xScale(d.x2); },
      xAxis = d3.svg.axis().scale(xScale).orient("bottom");

  var yValue = function(d) { return d.y; },
      yScale = d3.scale.linear().range([height, 0]),
      yMap = function(d) { return yScale(yValue(d)); },
      yMap1 = function(d) { return yScale(d.y1); },
      yMap2 = function(d) { return yScale(d.y2); },
      yAxis = d3.svg.axis().scale(yScale).orient("left");


  // set up plotting scales
  var x2Scale = d3.scale.linear().range([0, width2]),  // map domain to range
      x2Map = function(d) { return x2Scale(xValue(d)); },
      x2Map1 = function(d) { return x2Scale(d.x1); },
      x2Map2 = function(d) { return x2Scale(d.x2); },
      x2Axis = d3.svg.axis().scale(x2Scale).orient("bottom");  // draw axis

  var y2Scale = d3.scale.linear().range([height2, 0]),
      y2Map = function(d) { return y2Scale(yValue(d)); },
      y2Map1 = function(d) { return y2Scale(d.y1); },
      y2Map2 = function(d) { return y2Scale(d.y2); },
      y2Axis = d3.svg.axis().scale(y2Scale).orient("left");


  // color palette
  var palette = d3.scale.category20();

  var tree = readTree(example);
  equalAngleLayout(tree);

  var data = fortify(tree, sort=true),
      edgeset = edges(data);

  // add buffer to data domain
  xScale.domain([
      d3.min(data, xValue)-1, d3.max(data, xValue)+1
  ])
  yScale.domain([
      d3.min(data, yValue)-1, d3.max(data, yValue)+1
  ])

  // draw x-axis
  svg.append("g")
     .attr("class", "x axis")
     .attr("transform", "translate(0," + height + ")")
     .call(xAxis);

  // draw y-axis
  svg.append("g")
     .attr("class", "y axis")
     .call(yAxis);

  // draw lines
  svg.selectAll("lines")
     .data(edgeset)
     .enter().append("line")
     .attr("class", "lines")
     .attr("x1", xMap1)
     .attr("y1", yMap1)
     .attr("x2", xMap2)
     .attr("y2", yMap2)
     .attr("stroke-width", 3)
     .attr("stroke", "#777");


   // draw points
   svg.selectAll(".dot")
      .data(data)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", function(d) {
        if (d.isTip) {
          return(6);
        } else {
          return(4);
        }
      })
      .attr("cx", xMap)
      .attr("cy", yMap)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", function(d) {
        if (d.isTip) {
          return(palette(d.thisId));
        } else {
          return("white");
        };
      });

  // TODO: draw tip labels (years)

  // draw the meatball
  var circle1 = svg.append("circle")
                  .attr("cx", xScale(0))
                  .attr("cy", yScale(0))
                  .attr("r", 10)
                  .attr("stroke", "black")
                  .attr("stroke-width", 2)
                  .attr("fill", "gold");

  // draw initial rooted tree
  var rootedTree = rerootTree( closestEdge([xScale(0), yScale(0)]) );
  rootedLayout(rootedTree);
  drawRootedTree(rootedTree);


  // check if mouse button is pressed
  var mouseDown = false;
  document.body.onmousedown = function() { mouseDown = true; }
  document.body.onmouseup = function() { mouseDown = false; }

  // add interface layer
  svg.append("rect")
     .attr("width", width)
     .attr("height", height)
     .on("mousemove", function() {
         if (mouseDown) {
          var m = d3.mouse(this),
              p = closestEdge(m),
              rootedTree;

           // move the root
           circle1.attr("cx", xScale(p.x))
                  .attr("cy", yScale(p.y));

           // update nodes
           rootedTree = rerootTree(p);
           rootedLayout(rootedTree);
           //console.log(rootedTree);

           // update rooted tree
           updateRootedTree(rootedTree);
         }
     });

  // find closest edge to mouse
  function closestEdge(ptr) {
      // unpack mouse coordinates
      var px = ptr[0],
          py = ptr[1],
          dx, dy,
          adj1, adj2,  // adjacent
          hyp1, hyp2,  // hypoteneuse
          part, blen,  // partition of branch length
          dist, mindist = Infinity,
          minpart, minblen, closest;

      for (const e of edgeset) {
        // first, calculate the hypoteneuse (distance
        // from ptr to each node)
        dx = px - xScale(e.x1);
        dy = py - yScale(e.y1);
        hyp1 = dx*dx + dy*dy;  // no sqrt

        dx = px - xScale(e.x2);
        dy = py - yScale(e.y2);
        hyp2 = dx*dx + dy*dy;  // no sqrt

        // branch length at user scale
        dx = xScale(e.x1) - xScale(e.x2);
        dy = yScale(e.y1) - yScale(e.y2);
        blen = Math.sqrt(dx*dx + dy*dy);

        // next, calculate branch length part
        // note we left hyp1 and hyp2 squared
        part = (hyp1 - hyp2 + blen*blen) /
                (2*blen);
        if (part < 0 || part > blen) {
            continue;
        }

        // finally calculate distance to branch
        dist = Math.sqrt(hyp1 - part*part);
        //console.log(part, blen, dist);

        if (dist < mindist) {
            mindist = dist;
            minpart = part;  // this is useful
            minblen = blen;
            closest = e;
        }
      }

      // solve for coordinates of point on closest edge
      var p = minpart/minblen;

      return ({
          x: (1-p)*closest.x1 + p*closest.x2,
          y: (1-p)*closest.y1 + p*closest.y2,
          p: p, child: closest.id1, parent: closest.id2
      });
  }

  //============================================================//
  // to plot the rooted tree, we need to calculate the cumulative
  // branch lengths


  function rerootTree(p) {
    var nodes = JSON.parse(JSON.stringify(data)),  // deep copy
        row, parent, child, root, blen;

    // append root node to array
    root = {
      parentId: undefined,
      parentLabel: undefined,
      thisId: nodes.length,
      thisLabel: "root",
      children: [p.parent, p.child],
      angle: 0,
      branchLength: 0.,
      x: p.x,
      y: p.y
    };
    nodes.push(root);

    // root becomes parent of child node
    row = nodes[p.child];
    row.parentId = root.thisId;
    row.parentLabel = root.thisLabel;
    blen = row.branchLength;
    row.branchLength = blen*p.p;

    // reverse flow from parent node to original root
    row = nodes[p.parent];
    var queue = [p.parent];
    while (row.thisId != (nodes.length-2)) {
      parent = row.parentId;
      queue.push(parent);
      row = nodes[parent];
    }
    // now, starting from the root...
    for (var i=queue.length; i>1; i--) {
      parent = nodes[queue[i-1]];
      child = nodes[queue[i-2]];

      child.children.push(parent.thisId);
      parent.parentId = child.thisId;
      parent.children.splice(parent.children.indexOf(child.thisId), 1);
    }

    // root becomes parent of parent node
    row = nodes[p.parent];
    row.parentId = root.thisId;
    row.parentLabel = root.thisLabel;
    row.branchLength = blen*(1-p.p);

    // child node removed from parent node's children
    row.children.splice(row.children.indexOf(p.child), 1);

    return(nodes);
  }


  function nodeDepth(idx, nodes) {
    /*
     *  Calculate the distance of each node from the root.
     */
    var node = nodes[idx],
        parent;

    if (node.parentId === undefined) {
      // root
      node.x = 0;
    } else {
      parent = nodes[node.parentId];
      node.x = parent.x + node.branchLength;
    }

    for (const child of node.children) {
      // recursion
      nodeDepth(child, nodes);
    }
  }


  function countTips(idx, nodes) {
    // recursive function to annotate nodes with number of tips
    var node = nodes[idx],
        child;

    if (node.isTip) {
      node.ntips = 1;
    }
    else {
      node.ntips = 0;
      for (const childIdx of node.children) {
        node.ntips += countTips(childIdx, nodes);
      }
    }
    return (node.ntips);
  }

  function postOrderByIndex(idx, nodes, list=[]) {
    // recursive function to generate a list of node indices
    // that orders children before parents
    var node = nodes[idx],
        temp = [],
        child;

    // sort children by number of tips
    for (const childIdx of node.children) {
      child = nodes[childIdx];
      temp.push(child);
    }
    temp.sort(function(a, b) {
        return a.ntips - b.ntips;
    })

    for (const childIdx of temp.map(x=>x.thisId)) {
      // append child indices to list
      list = postOrderByIndex(childIdx, nodes, list);
    }
    list.push(node);
    return(list);
  }

  function getTips(nodeIndex, nodes) {
    // recursive function to annotate nodes with the
    // y-position of tips
    var node = nodes[nodeIndex],
        child;
    if (node.isTip) {
      node.y = [node.y];
      return(node.y);
    }

    node.y = [];
    for (const childIdx of node.children) {
      node.y = node.y.concat(getTips(childIdx, nodes));
    }
    return(node.y);
  }


  function rootedLayout(nodes) {
    // calculates (x,y) coordinates for tips
    // TODO: calculate coordinates for internal nodes
    //
    // @param nodes: return value from rerootTree()
    var rootIdx = nodes.length-1;

    // calculate node depths - populates node.x
    nodeDepth(rootIdx, nodes);

    // count tips per nodes to ladderize tree
    countTips(rootIdx, nodes);

    // order tips by postorder traversal
    var orderedNodes = [];
    postOrderByIndex(rootIdx, nodes, orderedNodes);

    var tips = orderedNodes.filter(node=>node.isTip),
        ntips = tips.length;
    for (var i=0; i<ntips; i++) {
      tips[i].y = (i+0.5)/ntips;  // this is carried over to nodes
    }

    // calculate vertical location of internal nodes
    getTips(rootIdx, nodes);
    for (var node of nodes) {
      var temp = 0;
      for (const y of node.y) {
        temp += y;
      }
      node.y = temp / node.y.length;
    }
  }


  function drawRootedTree(nodes) {
    // update SVG with rooted tree layout
    // @param nodes: return value from rootedLayout()
    var rootedEdges = edges(nodes, rectangular=true);

    // scale tree to SVG - make extra room for rooting on longest branch
    x2Scale.domain([
      d3.min(nodes, xValue)-1, d3.max(nodes, xValue)+13
    ]);
    y2Scale.domain([
      d3.min(nodes, yValue)-0.1, d3.max(nodes, yValue)+0.1
    ]);


    // draw lines
    svg2.selectAll("lines")
        .data(rootedEdges)
        .enter().append("line")
        .attr("class", "lines")
        .attr("x1", x2Map1)
        .attr("y1", y2Map1)
        .attr("x2", x2Map2)
        .attr("y2", y2Map2)
        .attr("stroke-width", 3)
        .attr("stroke", "#777")
        .attr("stroke-linecap", "square");

    svg2.selectAll(".dot")
        .data(nodes)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", function(d) {
          if (d.isTip) {
            return(6);
          } else {
            return(4);
          }
        })
        .attr("cx", x2Map)
        .attr("cy", y2Map)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("fill", function(d) {
          if (d.isTip) {
            return(palette(d.thisId));
          } else {
            return("white");
          }
        });
  }


  function updateRootedTree(nodes) {
    // call to update
    var rootedEdges = edges(nodes, rectangular=true);
    //console.log(rootedEdges);

    // update svg2 domain
    /*
    x2Scale.domain([
      d3.min(nodes, xValue)-1, d3.max(nodes, xValue)+1
    ]);
    y2Scale.domain([
      d3.min(nodes, yValue)-0.1, d3.max(nodes, yValue)+0.1
    ]);
    */

    /*
    svg2.selectAll(".dot")
        .data(nodes)
        .transition().duration(100)
        .attr("cx", x2Map)
        .attr("cy", y2Map);
    */

    svg2.selectAll(".lines")
        .data(rootedEdges)
        .transition().duration(100)
        .ease('linear')
        .attr("x1", x2Map1)
        .attr("y1", y2Map1)
        .attr("x2", x2Map2)
        .attr("y2", y2Map2);

    svg2.selectAll(".dot")
        .data(nodes)
        .transition().duration(100)
        .ease('linear')
        .attr("cx", x2Map)
        .attr("cy", y2Map);
    //svg2.selectAll("")
  }
}());
