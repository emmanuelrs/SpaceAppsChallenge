$("#home").on('click', function(){
  window.location.replace('index.html')
})

// http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/
var links = [
  {source: "Dark Matter", target: "Dark Matter", type: "licensing", id: 1},
  {source: "Matter", target: "Matter", type: "licensing", id: 1}
];

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, id: link.id});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, id: link.id});
});


var width = 200,
    height = 300;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(100)
    .charge(-300)
    .on("tick", tick)
    .start();

var svg = d3.select("#searchDiv").append("svg")
    .attr("width", width)
    .attr("height", height);

// Per-type markers, as they don't inherit styles.
svg.append("defs").selectAll("marker")
    .data(["suit", "licensing", "resolved"])
  .enter().append("marker")
    .attr("id", function(d) { return d; })
    .attr("viewBox", "0 -5 10 10")
    .attr("refX", 35)
    .attr("refY", -1.5)
    .attr("markerWidth", 8)
    .attr("markerHeight", 8)
    .attr("orient", "auto")
  .append("path")
    .attr("d", "M0,-5L10,0L0,5");

var path = svg.append("g").selectAll("path")
    .data(force.links())
  .enter().append("path")
    .attr("class", function(d) { return "link " + d.type; })
    .attr("marker-end", function(d) { return "url(#" + d.type + ")"; });


var color = d3.scale.category20();

var circle = svg.append("g").selectAll("circle")
    .data(force.nodes())
  .enter().append("circle").style("fill","#1f77b4")
    .attr("r", 40)
    .attr("name", function(d,i){return d.name;})
    .attr("id", function(d,i){return d.id;})
    .on('dblclick', function(){
    })
    .call(force.drag);

var text = svg.append("g").selectAll("text")
    .data(force.nodes())
  .enter().append("text")
    .attr("x", -15)
    .attr("y", ".31em")
    .text(function(d) { return d.name; });

// Use elliptical arc path segments to doubly-encode directionality.
function tick() {
  path.attr("d", linkArc);
  circle.attr("transform", transform);
  text.attr("transform", transform);
}

function linkArc(d) {
  var dx = d.target.x - d.source.x,
      dy = d.target.y - d.source.y,
      dr = Math.sqrt(dx * dx + dy * dy);
  return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
}

function transform(d) {
  return "translate(" + d.x + "," + d.y + ")";
}
