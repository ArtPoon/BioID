/**
 * Parse a Newick tree string into a doubly-linked
 * list of JS Objects.  Assigns node labels, branch 
 * lengths and node IDs (numbering terminal before 
 * internal nodes).
 * @param {string} text Newick tree string.
 * @return {object} Root of tree.
 */
function readTree(text) {
    // remove whitespace
    text = text.replace(/ \t/g, '');

    var tokens = text.split(/(;|\(|\)|,)/),
        root = {'parent': null, 'children':[]}, 
        curnode = root,
        nodeId = 0;

    for (const token of tokens) {
        if (token == "" || token == ';') {
            continue
        }
        //console.log(token);
        if (token == '(') {
            // add a child to current node
            var child = {
                'parent': curnode, 
                'children': []
            };
            curnode.children.push(child);
            curnode = child;  // climb up
        }
        else if (token == ',') {
            // climb down, add another child to parent
            curnode = curnode.parent;
            var child = {
                'parent': curnode,
                'children': []
            }
            curnode.children.push(child);
            curnode = child;  // climb up
        }
        else if (token == ')') {
            // climb down twice
            curnode = curnode.parent;
            if (curnode === null) {
                break;
            }
        }
        else {
            var nodeinfo = token.split(':');

            if (nodeinfo.length==1) {
                if (token.startsWith(':')) {
                    curnode.label = "";
                    curnode.branch_length = parseFloat(nodeinfo[0]);
                } else {
                    curnode.label = nodeinfo[0];
                    curnode.branch_length = null;
                }
            }
            else if (nodeinfo.length==2) {
                curnode.label = nodeinfo[0];
                curnode.branch_length = parseFloat(nodeinfo[1]);
            }
            else {
                // TODO: handle edge cases with >1 ":"
                console.warn(token, "I don't know what to do with two colons!");
            }
            curnode.id = nodeId++;  // assign then increment   
        }
    }
    return(root);
}

//var s = "(A:0.1,B:0.2,(C:0.3,D:0.4)E:0.5)F;";
//readTree(s);

/**
 * Recursive function for pre-order traversal of tree 
 * (output parent before children).
 * @param {object} node 
 * @param {Array} list An Array of nodes
 * @return An Array of nodes in pre-order
 */
function preorder(node, list=[]) {
    list.push(node);
    for (var i=0; i < node.children.length; i++) {
        list = preorder(node.children[i], list);
    }
    return(list);
}

function postorder(node, list=[]) {
    for (var i=0; i < node.children.length; i++) {
        list = preorder(node.children[i], list);
    }
    list.push(node);
    return(list);
}


/**
 * Convert parsed Newick tree from readTree() into data 
 * frame.
 * @param {object} tree Return value of readTree
 * @return Array of Objects
 */
function fortify(tree) {
    var df = [];

    for (const node of preorder(tree)) {
        if (node.parent === null) {
            // skip the root node
            continue;
        }
        df.push({
            'parentId': node.parent.id,
            'parentLabel': node.parent.label,
            'childId': node.id, 
            'childLabel': node.label, 
            'branchLength': node.branch_length,
            'isTip': (node.children.length==0)
        })
    }
    return(df);
}


/**
 * Equal-angle layout algorithm for unrooted trees.
 * Ported from ggtree::tree-utilities.R
 */
function layoutEqualAngle(tree) {
    var root = tree.id,
        df = fortify(tree),
        N = df.length,
        brlen = Array(df.length);

    // sort rows in ascending order of childId
    df = df.sort(function(a, b) {
        return a.childId - b.childId;
    })

    for (const row of df) {
        brlen[row.childId] = row.branch_length;

        // initialize new values
        row.x = null;
        row.y = null;
        row.start = null;  // start angle of segment
        row.end = null;  // end angle
        row.angle = null;  // orthogonal angle for tip labels
    }

    // initialize root values
    row = df[root];
    row.x = 0;
    row.y = 0;
    row.start = 0;
    row.end = 2;  // 360 degrees

    // get number of tips for each node in tree

}
