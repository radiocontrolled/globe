var height = $(window).height() * 0.9999,
	width = $(window).width()* 0.9999,
	manualRotationActivated = false,
	sens = 0.25,
	globe;


var λ = d3.scale.linear()
    .domain([0, width])
    .range([-180, 180]);

var φ = d3.scale.linear()
    .domain([0, height])
    .range([90, -90]);

globe = d3.select("section")
	.append("svg")
	.attr({
		"width": width,
		"height": height
	});
	



// define map projection
var projection = d3.geo.orthographic()
	.scale(width/5)
	.translate([width/2, height/2]) // center the projection
	.rotate([0, -15, 0])
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

	world
		.call(d3.behavior.drag()
		.origin(function() { var r = projection.rotate(); return {x: r[0] / sens, y: -r[1] / sens}; })
		.on("drag", function() {
			var rotate = projection.rotate();
			projection.rotate([d3.event.x * sens, -d3.event.y * sens, rotate[2]]);
			globe.selectAll("path").attr("d", path);
		  }));
}


d3.select(window).on('resize', resize);

function resize(globe) {
	
	
}