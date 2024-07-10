///////////////////////////////////////////////////////////////////////////
///////////////////////// Initiate elements ///////////////////////////////
///////////////////////////////////////////////////////////////////////////
function sortByPlanetName(a, b) {
    return a.name.localeCompare(b.name);
}

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

var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = (w.innerWidth || e.clientWidth || g.clientWidth) - 50,
	x = $("#planetarium").width() -50;
	y = (w.innerHeight|| e.clientHeight|| g.clientHeight) - 50;

var svg;
var container;

var zoomMajor;
var zoomRadius;

function initSystem(star) {

  dropSVG();
  var planets = exoPlanets.filter(planet => planet.star == star);
	
  var major = planets[0].major;
  var e = planets[0].e;
  var minor = major * Math.sqrt(1-e*e);
  var c = Math.sqrt(major*major - minor*minor);
  
  zoomMajor=coefMajor(planets);
  zoomRadius=coefRadius(planets);
  
  planets = planets.sort(sortByPlanetName);
  planets.forEach(function(planet, i) {
	e = (planet.e == null ? 0 : planet.e);
	rayon = (planet.rayon == 0 ? 1 : planet.rayon);
	rayon = (planet.rayon == NaN ? 1 : rayon);
  	planet.rayon = rayon*zoomRadius;
  	planet.major = planet.major*zoomMajor;
  	planet.minor = planet.major * Math.sqrt(1-e*e);
  	planet.c = Math.sqrt(planet.major*planet.major - planet.minor*planet.minor);
  	planet.focus = planet.c;
  	planet.r = planet.major+planet.focus;
  	planet.x = planet.r;
  	planet.y = 0;
  	planet.cx = 0;
  	planet.cy = 0;
  	planet.theta = 0;
  	planet.isShow = false;
  
  	$("#listePlanetes").append('<a class="list-group-item" onmouseover="showEllipse(\''+planet.name+'\', '+i+', 0.6)" onmouseout="showEllipse(\''+planet.name+'\', '+i+', 0)" onclick="setEllipse(\''+planet.name+'\', '+i+')"><span style="text-align: left"><i class="glyphicon glyphicon-globe"></i></span> ' + planet.name + '</a>');
  });
  	$("#listePlanetes").append('<a class="list-group-item" onmouseover="showZH(0.2)" onmouseout="showZH(0)" onclick="showZH(0.6)"><span style="text-align: left"><i class="glyphicon glyphicon-globe"></i></span> Zone habitable</a>');
  
  initSVG();
  initStar(planets);
  initOrbit(planets);
  initPlanet(planets);
  speedUp=getSpeedUp(planets);
  movePlanets();
}

function initSVG() {

  //Create SVG
  svg = d3.select("#planetarium")
		  .append("svg")
		  .attr("width", x)
		  .attr("height", y);
}

function dropSVG() {
  $("#listePlanetes").html("");
  $("#planetarium").html("");
  //svg.remove();
}

function initStar(planets) {
  var spectre = planets[0].spectre.substr(0,1);
  var imgStar = "";
  
  switch(spectre) {
	case "A":
		imgStar = "img/A.jpg";
		break;
	case "B":
		imgStar = "img/B.jpg";
		break;
	case "G":
		imgStar = "img/G.jpg";
		break;
	case "K":
		imgStar = "img/K.jpg";
		break;
	case "M":
		imgStar = "img/M.jpg";
		break;
	case "O":
		imgStar = "img/O.jpg";
		break;
	default:
		imgStar = "img/M.jpg";
  }
	
	
  

  //Create a container for everything with the centre in the middle
  container = svg.append("g").attr("class","container")
  				 .attr("transform", "translate(" + x/2 + "," + y/2 + ")")

  //Create star in the Middle - scaled to the orbits
  //Radius of our Sun in these coordinates (taking into account size of circle inside image)
  var ImageWidth = radiusSun/au * 3000 * (2.7/1.5);
  container.append("svg:image")
		   .attr("x", -ImageWidth)
		   .attr("y", -ImageWidth)
		   .attr("class", "sun")
		   .attr("xlink:href", imgStar)
		   .attr("width", ImageWidth*2)
		   .attr("height", ImageWidth*2)
		   .attr("text-anchor", "middle");
}

function initOrbit(planets) {
  //Drawing a line for the orbit
  var orbitsContainer = container.append("g").attr("class","orbitsContainer");
  var orbits = orbitsContainer.selectAll("g.orbit")
							  .data(planets).enter().append("ellipse")
						      .attr("id", function(d,i) {return "o-"+i;})
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
  var zh = coefZH(planets[0]);
  zh *= zoomMajor;

  var zhCircle = orbitsContainer.append("circle")
							    .attr("id", "zhCircle")
								.attr("cx", 0)
								.attr("cy", 0)
								.attr("r", zh*((0.953+1.577)/2))
								.style("fill", "green")
								.style("fill-opacity", 0)
								.style("stroke-opacity", 0)
								.style("stroke-width", zh*(1.577-0.953))
								.style("stroke", "blue");
}

function initPlanet(planets) {
  //Drawing the planets			
  var planetContainer = container.append("g").attr("class","planetContainer");
  var planets = planetContainer.selectAll("g.planet")
							   .data(planets).enter()
							   .append("circle")
						       .attr("id", function(d,i) {return "p-"+i;})
							   .attr("class", "planet")
							   .attr("r", function(d) {return radiusSizer*d.rayon;})//rScale(d.radius);})
							   .attr("cx", function(d) {return d.x;})
							   .attr("cy", function(d) {return d.y;})
							   .style("fill", "#6363FF")
							   //.style("fill", "blue")
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
							   

}

function getSpeedUp(planets) {
	var maxPeriode=+0;
	
	planets.forEach(function(planet, i) {
		if (planet.periode>maxPeriode) {
			maxPeriode=planet.periode;
		}
	});

	return 10000 / maxPeriode;
}
function coefMajor(planets) {
	var maxMajor=0;
	planets.forEach(function(planet, i) {
		if (planet.major>maxMajor) {
			maxMajor=planet.major;
		}
	});

	return 300 / maxMajor;
}
	
function coefRadius(planets) {
	var maxRadius=0;
	planets.forEach(function(planet, i) {
		rayon = (planet.rayon == null ? 0.1 : planet.rayon);
		if (rayon>maxRadius) {
			maxRadius=rayon;
		}
	});

	return 5 / maxRadius;
}

function coefZH(star) {
	var tSun=5750;
	var tStar=star.tStar;
	var rStar=star.rStar;
	var cstStefanBoltzmann=5.670374;

	var lStar = getLuminosite(rStar, tStar);
	var lSun = getLuminosite(1,tSun);
	return Math.sqrt(lStar/lSun);
}


function getLuminosite(rayon, temp) {
	var cstStefanBoltzmann=5.670374;

	return 4*Math.PI*Math.pow(rayon,2)*cstStefanBoltzmann*Math.pow(temp,4);
}

function showZH(opacity) {
	svg.selectAll("#zhCircle")
	   .transition().duration(opacity == 0 ? 2500 : 1000)
	   .style("stroke-opacity", opacity);
}