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
  
/* create a globe */
globe.append("path")
	.datum({type: "Sphere"})
	.attr("class", "water")
	.attr("d", path);


/* load and display data */
queue()
	.defer(d3.json, "countries.json") /* topjson */
	.await(countries);
  
function countries(error, worldTopo){
	var countriesData = topojson.feature(worldTopo, worldTopo.objects.countries).features;
	
	var world = globe.selectAll("path.land")
		.data(countriesData)
		.enter().append("path")
		.attr("class", "country")
		.attr("d", path);
}


d3.select(window).on('resize', resize);

function resize() {
	
}