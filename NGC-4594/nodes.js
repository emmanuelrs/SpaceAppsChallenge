
// http://blog.thomsonreuters.com/index.php/mobile-patent-suits-graphic-of-the-day/
var links = [
  {source: "Microsoft", target: "Amazon", type: "licensing", id: 1},
  {source: "Microsoft", target: "HTC", type: "licensing", id: 1},
  {source: "Samsung", target: "Apple", type: "suit", id: 1},
  {source: "Motorola", target: "Apple", type: "suit", id: 1},
  {source: "Nokia", target: "Apple", type: "resolved", id: 1},
  {source: "HTC", target: "Apple", type: "suit", id: 1},
  {source: "Kodak", target: "Apple", type: "suit", id: 1},
  {source: "Microsoft", target: "Barnes & Noble", type: "suit", id: 1},
  {source: "Microsoft", target: "Foxconn", type: "suit", id: 1},
  {source: "Oracle", target: "Google", type: "suit", id: 1},
  {source: "Apple", target: "HTC", type: "suit", id: 1},
  {source: "Microsoft", target: "Inventec", type: "suit", id: 1},
  {source: "Samsung", target: "Kodak", type: "resolved", id: 1},
  {source: "LG", target: "Kodak", type: "resolved", id: 1},
  {source: "RIM", target: "Kodak", type: "suit", id: 1},
  {source: "Sony", target: "LG", type: "suit", id: 1},
  {source: "Kodak", target: "LG", type: "resolved", id: 1},
  {source: "Apple", target: "Nokia", type: "resolved", id: 1},
  {source: "Qualcomm", target: "Nokia", type: "resolved", id: 1},
  {source: "Apple", target: "Motorola", type: "suit", id: 1},
  {source: "Microsoft", target: "Motorola", type: "suit", id: 1},
  {source: "Motorola", target: "Microsoft", type: "suit", id: 1},
  {source: "Huawei", target: "ZTE", type: "suit", id: 1},
  {source: "Ericsson", target: "ZTE", type: "suit", id: 1},
  {source: "Kodak", target: "Samsung", type: "resolved", id: 1},
  {source: "Apple", target: "Samsung", type: "suit", id: 1},
  {source: "Kodak", target: "RIM", type: "suit", id: 1},
  {source: "Nokia", target: "Qualcomm", target: "Apple", type: "suit", type: "resolved", id: 1}
];

var nodes = {};

// Compute the distinct nodes from the links.
links.forEach(function(link) {
  link.source = nodes[link.source] || (nodes[link.source] = {name: link.source, id: link.id});
  link.target = nodes[link.target] || (nodes[link.target] = {name: link.target, id: link.id});
});


var width = 1366,
    height = 768;

var force = d3.layout.force()
    .nodes(d3.values(nodes))
    .links(links)
    .size([width, height])
    .linkDistance(300)
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
  .enter().append("circle").style("fill",function(d,i){return color(i);})
    .attr("r", 30)
    .attr("name", function(d,i){return d.name;})
    .attr("id", function(d,i){return d.id;})
    .on('dblclick', function(){
      console.log(this.getAttribute("name"))
    })
    .call(force.drag);

var text = svg.append("g").selectAll("text")
    .data(force.nodes())
  .enter().append("text")
    .attr("x", 8)
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
