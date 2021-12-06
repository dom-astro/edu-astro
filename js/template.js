function sortByDateAscending(a, b) {
    return a.star_name - b.star_name;
}

function getMaxDate(refDate, currentDate) {
	var ref = new Date(refDate);
	var current = new Date(currentDate);
	
	if (current>ref) {
		return currentDate;
	} else {
		return refDate;
	}
}

/*d3.csv('exoplanet.eu_catalog.csv',function (data) {
  var exoPlanets = data.sort(sortByDateAscending);

  var stats = {};
  stats.nbStar = +0;
  stats.system = [];
  var star="";
  var nbPlanete=0;
  var majDate="01/01/1900";
  exoPlanets.forEach(function(exoPlanet,i) {
	nbPlanete += 1;
	majDate=getMaxDate(majDate, exoPlanet.updated);
	if (star != exoPlanet.star_name) {
		stats.nbStar += 1;
	}
  });
  
	$("#dateMAJ").append(majDate);
});  */

//Width and Height of the SVG
var 
	w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = (w.innerWidth || e.clientWidth || g.clientWidth) - 50,
	y = (w.innerHeight|| e.clientHeight|| g.clientHeight) - 50;

window.onresize = updateWindow;

var major = Trappist[0].major;
var e = Trappist[0].e;
var minor = major * Math.sqrt(1-e*e);
var c = Math.sqrt(major*major - minor*minor);

var zoomMajor=coefMajor();
var zoomRadius=coefRadius();

$("#listePlanetes").append('<a class="list-group-item"><span style="text-align: left"><i class="glyphicon glyphicon-star"></i></span> ' + Trappist[0].star + '</a><br>');
Trappist.forEach(function(exoPlanet, i) {
	exoPlanet.radius = exoPlanet.radius*zoomRadius;
	exoPlanet.major = exoPlanet.major*zoomMajor;
	exoPlanet.minor = exoPlanet.major * Math.sqrt(1-exoPlanet.e*exoPlanet.e);
	exoPlanet.c = Math.sqrt(exoPlanet.major*exoPlanet.major - exoPlanet.minor*exoPlanet.minor);
	exoPlanet.focus = exoPlanet.c;
	exoPlanet.r = exoPlanet.major+exoPlanet.focus;
	exoPlanet.x = exoPlanet.r;
	exoPlanet.y = 0;
	exoPlanet.cx = 0;
	exoPlanet.cy = 0;
	exoPlanet.theta = 0;
	exoPlanet.isShow = false;

	$("#listePlanetes").append('<a class="list-group-item" onmouseover="showEllipse('+exoPlanet.isShow+', '+i+', 0.6)" onmouseout="showEllipse('+exoPlanet.isShow+', '+i+', 0)" onclick="setEllipse('+exoPlanet.isShow+', '+i+')"><span style="text-align: left"><i class="glyphicon glyphicon-globe"></i></span> ' + exoPlanet.name + '</a>');
});

$("#listePlanetes").append('<br><a class="list-group-item" onmouseover="showZH(0.2)" onmouseout="showZH(0)"><span style="text-align: left"><i class="glyphicon glyphicon-record"></i></span> Zone habitable</a>');

///////////////////////////////////////////////////////////////////////////
///////////////////////// Initiate elements ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

var stopTooltip = false;	
//Planet orbit variables
//The larger this is the more accurate the speed is
var resolution = 1, //perhaps make slider?
	speedUp = 500,
	au = 149597871, //km
	radiusSun = 695800, //km
	radiusJupiter = 69911, //km
	phi = 0, //rotation of ellipses
	radiusSizer = 1, //Size increaser of radii of planets
	planetOpacity = 0.6;

//Create SVG
var svg = d3.select("#planetarium").append("svg")
	.attr("width", x)
	.attr("height", y);

//Create a container for everything with the centre in the middle
var container = svg.append("g").attr("class","container")
					.attr("transform", "translate(" + x/2 + "," + y/2 + ")")
  
//Create star in the Middle - scaled to the orbits
//Radius of our Sun in these coordinates (taking into account size of circle inside image)
var ImageWidth = radiusSun/au * 3000 * (2.7/1.5);
container.
append("svg:image")
	.attr("x", -ImageWidth)
	.attr("y", -ImageWidth)
	.attr("class", "sun")
	.attr("xlink:href", "img/naine_rouge.jpg")
	.attr("width", ImageWidth*2)
	.attr("height", ImageWidth*2)
	.attr("text-anchor", "middle");
	

//d3.json("exoplanets.json", function(error, planets) {

///////////////////////////////////////////////////////////////////////////
//////////////////////////// Create Scales ////////////////////////////////
///////////////////////////////////////////////////////////////////////////

//Create color gradient for planets based on the temperature of the star that they orbit
//var colors = ["#FB1108","#FD150B","#FA7806","#FBE426","#FCFB8F","#F3F5E7","#C7E4EA","#ABD6E6","#9AD2E1","#42A1C1","#1C5FA5", "#172484"];
//var colorScale = d3.scale.linear()
//	  .domain([2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 14000, 20000, 30000]) // Temperatures
//	  .range(colors);
	
//Set scale for radius of circles
var rScale = d3.scale.linear()
	.range([1, 20])
	.domain([0, d3.max(Trappist, function(d) { return d.radius; })]);	

	//Format with 2 decimals
var formatSI = d3.format(".2f");

///////////////////////////////////////////////////////////////////////////
/////////////////////////// Plot and move planets /////////////////////////
///////////////////////////////////////////////////////////////////////////

//Drawing a line for the orbit
var orbitsContainer = container.append("g").attr("class","orbitsContainer");
var orbits = orbitsContainer.selectAll("g.orbit")
				.data(Trappist).enter().append("ellipse")
				.attr("class", "orbit")
				.attr("cx", function(d) {return d.cx;})
				.attr("cy", function(d) {return d.cy;})
				.attr("rx", function(d) {return d.major;})
				.attr("ry", function(d) {return d.major * Math.sqrt(1-d.e*d.e);})
				.style("fill", "#3E5968")
				.style("fill-opacity", 0)
				.style("stroke", "white")
				.style("stroke-opacity", 0);

// Draw the Circle
var zh = coefZH();
zh *= zoomMajor;
/*var minZH = orbitsContainer.append("circle")
                         .attr("cx", 0)
                         .attr("cy", 0)
						 .attr("r", zh*0.953)
						 .style("fill", "red")
						 .style("fill-opacity", 0)
						 .style("stroke-opacity", 1)
						 .style("stroke", "red");*/

var zhCircle = orbitsContainer.append("circle")
                         .attr("cx", 0)
                         .attr("cy", 0)
						 .attr("r", zh*((0.953+1.577)/2))
						 .style("fill", "green")
						 .style("fill-opacity", 0)
						 .style("stroke-opacity", 0)
						 .style("stroke-width", zh*(1.577-0.953))
						 .style("stroke", "blue");

/*var maxZH = orbitsContainer.append("circle")
                         .attr("cx", 0)
                         .attr("cy", 0)
						 .attr("r", zh*1.577)
						 .style("fill", "blue")
						 .style("fill-opacity", 0)
						 .style("stroke-opacity", 1)
						 .style("stroke", "blue");*/

//Drawing the planets			
var planetContainer = container.append("g").attr("class","planetContainer");
var planets = planetContainer.selectAll("g.planet")
				.data(Trappist).enter()
				//.append("g")
				//.attr("class", "planetWrap")					
				.append("circle")
				.attr("class", "planet")
				.attr("r", function(d) {return radiusSizer*d.radius;})//rScale(d.radius);})
				.attr("cx", function(d) {return d.x;})
				.attr("cy", function(d) {return d.y;})
				.style("fill", "#6363FF")
				.style("opacity", planetOpacity)
				.style("stroke-opacity", 0)
				.style("stroke-width", "3px")
				.style("stroke", "white")
				.on("mouseover", function(d, i) {
					showEllipse(d, i, 0.6);
				})
				.on("mouseout", function(d, i) {
					showEllipse(d, i, 0);
				});

///////////////////////////////////////////////////////////////////////////
//////////////////////// Set up pointer events ////////////////////////////
///////////////////////////////////////////////////////////////////////////	
//Reload page
d3.select("#reset").on("click", function(e) {location.reload();});

//Scale planets accordingly
var scale = false;
d3.select("#scale")
	.on("click", function(e) {
			
	if (scale == false) {
		d3.select("#scale").text("unscale planets");

		d3.selectAll(".planet")
			.transition().duration(2000)
			.attr("r", function(d) {
				var newRadius = radiusJupiter/au*3000*d.radius;
				if  (newRadius < 1) {return 0;}
				else {return newRadius;}
			});
		
		scale = true;
	} else if (scale == true) {
		d3.select("#scale").text("scale planets");

		d3.selectAll(".planet")
			.transition().duration(2000)
			.attr("r", function(d) {return radiusSizer * d.radius;});	
		
		scale = false;			
	}//else if
});
