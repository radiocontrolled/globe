var height = $(window).height();
var width = $(window).width();

// append SVG
var globe = d3.select("section")
	.append("svg")
	.attr({
		"width": width,
		"height": height
	});
	

// define map projection
var projection = d3.geo.orthographic()
	.scale(width/5)
	.translate([width/2, height/2]) // center the projection
	.rotate([0,0])
	.clipAngle(90);

var path = d3.geo.path()
  .projection(projection);
  

globe.append("path")
      .datum({type: "Sphere"})
      .attr("class", "sphere")
      .attr("d", path)



var graticule = d3.geo.graticule()

groupPaths.append("path")
	.datum(graticule)
	.attr("class", "graticule")
	.attr("d", path)

  