var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 500,
    height = 500,
    svg = d3.select("div#unrooted")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

// set up plotting scales
var xValue = function(d) { return d.x; },
    xScale = d3.scale.linear().range([0, width]),
    xMap = function(d) { return xScale(xValue(d)); },
    xMap1 = function(d) { return xScale(d.x1); },
    xMap2 = function(d) { return xScale(d.x2); },
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

var yValue = function(d) { return d.y; },
    yScale = d3.scale.linear().range([height, 0]),
    yMap = function(d) { return yScale(yValue(d)); },
    yMap1 = function(d) { return yScale(d.y1); },
    yMap2 = function(d) { return yScale(d.y2); },
    yAxis = d3.svg.axis().scale(yScale).orient("left");

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
    .attr("r", 5)
    .attr("cx", xMap)
    .attr("cy", yMap)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", function(d) {
      if (d.isTip) {
        return("#777");
      } else {
        return("white");
      };
    });

// TODO: draw tip labels (years)

// add circle
var circle1 = svg.append("circle")
                .attr("cx", xScale(0))
                .attr("cy", yScale(0))
                .attr("r", 10)
                .attr("fill", "red");

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

         // update rooted tree
         drawRootedTree(rootedTree);
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

    //console.log(mindist, minpart, minblen);

    // solve for coordinates of point on closest edge
    var p = minpart/minblen;

    // TODO: update edges with (1) distance from root
    // (2) new edge induced by rooting

    return ({
        x: (1-p)*closest.x1 + p*closest.x2,
        y: (1-p)*closest.y1 + p*closest.y2,
        p: p, parent: closest.id1, child: closest.id2
    });
}

//============================================================//
// to plot the rooted tree, we need to calculate the cumulative
// branch lengths

var width2 = 500,
    height2 = 500;

var svg2 = d3.select("div#rooted")
             .append("svg")
             .attr("width", width2)
             .attr("height", height2)
             .append("g");
/*
// set up plotting scales
var xValue = function(d) { return d.x; },
    xScale = d3.scale.linear().range([0, width]),
    xMap = function(d) { return xScale(xValue(d)); },
    xAxis = d3.svg.axis().scale(xScale).orient("bottom");

var yValue = function(d) { return d.y; },
    yScale = d3.scale.linear().range([height, 0]),
    yMap = function(d) { return yScale(yValue(d)); },
    yAxis = d3.svg.axis().scale(yScale).orient("left");

xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1])
yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1])
*/



function rerootTree(p) {
  var nodes = JSON.parse(JSON.stringify(data)),  // deep copy
      row, parent, root, blen;

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

  // redirect flow from root (i.e., some parents become children)
  var lastRoot = nodes[nodes.length-2];
  if (lastRoot.parentId !== null) {
    console.log(nodes);
    alert("rerootTree(): failed to locate previous root");
  }

  // P2 ---> *P* ---> [root] ---> C
  row = nodes[p.parent];
  while (true) {
    parent = nodes[row.parentId];
    parent.parentId = row.thisId;  // P2 <-- P
    parent.children.splice(parent.children.indexOf(row.thisId), 1);

    // stopping criterion
    if (parent.thisId == lastRoot.thisId) {
      break;
    }
    row = parent;
  }

  // P <-- [root]
  row.parentId = root.thisId;
  //row.children.splice(row.children.indexOf(p.child), 1);
  //root.children.push(p.child);
  row.parentLabel = root.thisLabel;
  blen = row.branchLength;
  row.branchLength = blen*(1-p.p);

  row = nodes[p.child];
  row.parentId = root.thisId;
  row.parentLabel = root.thisLabel;
  row.branchLength = blen*p.p;

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


function postOrderByIndex(idx, nodes, list=[]) {
    var node = nodes[idx];

    for (const childIdx of node.children) {
        list = postOrderByIndex(childIdx, nodes, list);
    }
    list.push(node);
    return(list);
}


function drawRootedTree(nodes) {
  var rootIdx = nodes.length-1;

  // calculate node depths
  nodeDepth(rootIdx, nodes);

  // order tips by postorder traversal
  var orderedNodes = [];
  postOrderByIndex(rootIdx, nodes, orderedNodes);

  var tips = orderedNodes.filter(node=>node.isTip),
      ntips = tips.length;
  for (var i=0; i<ntips; i++) {
    tips[i].y = i/ntips;
  }

  // ancestors should be located at mean of child nodes
  var queue = [];
  while (true) {

  }

}
