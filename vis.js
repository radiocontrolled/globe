var height = $(window).height() - 10,
	width = $(window).width() - 10,
	manualRotationActivated = false,
	k = 0.25,
	globe,
	projection,
	path;

	
var setup = function(w,h) {
	globe = d3.select("section")
		.append("svg")
		.attr("id", "globe")
		.style("width", w + 'px')
		.style("height", h + 'px');
		
		
	// define map projection
	projection = d3.geo.orthographic()
		.scale(w/5)
		.translate([w/2, h/2]) // center the projection
		.rotate([0, -15, 0])
		.clipAngle(90);
	
	
	path = d3.geo.path()
		.projection(projection);
  
	/* create a globe */
	globe.append("path")
		.datum({type: "Sphere"})
		.attr("class", "water")
		.attr("d", path);
	
};

setup(width,height);


/* load and display data */
queue()
	.defer(d3.json, "countries.json") /* topjson */
	.defer(d3.csv, "nominees.csv") /* nominees*/
	.await(countries);
  
function countries(error, worldTopo, nominees){

	/* populate nominee list */
	/*
	var legend = d3.select("#legend");
	for(var name in nominees){
		legend
			.append("li")
			.text(function(){
				return nominees[name]["nominee"]; // don't make a functin in a loop!
			})
	}*/
	
	

	
	var countriesData = topojson.feature(worldTopo, worldTopo.objects.countries).features;
		
		
	for(var i = 0, geo = countriesData; i < geo.length; i++){
	
		for(var x = 0; x < nominees.length; x++){
			
			if(nominees[x].country ==  geo[i].properties.name){
				geo[i].properties.cls = "hasNominee";
				
			}
		}
	}
			
	
	var world = globe.selectAll("path.land")
		.data(countriesData)
		.enter().append("path")
		//.attr("class", "country")
		.attr("class", function(d){
			var cls = "country " + d.properties.cls;
			return cls;
		})
		.attr("d", path);



	world
		.call(d3.behavior.drag()
		.origin(function() { var r = projection.rotate(); return {x: r[0] / k, y: -r[1] / k}; })
		.on("drag", function() {
			var rotate = projection.rotate();
			projection.rotate([d3.event.x * k, -d3.event.y * k, rotate[2]]);
			globe.selectAll("path").attr("d", path);
		  }));
}


d3.select(window).on('resize', resize);

function resize(globe) {
	height = $(window).height() - 10;
	width = $(window).width() - 10;
	projection
		.scale(width/5)
		.translate([width/2, height/2]); // center the projection
	
	path = d3.geo.path()
		.projection(projection);
	
	
	// resize the SVG containing the globe
	d3.select("#globe")
		.style("height", height + "px")
		.style("width", width + "px");
	

	d3.select(".water").attr('d', path);
	d3.selectAll(".country").attr('d', path);


	
}

