//Create SVG
function taille(value) {
	/*var svg = d3.select("#planetarium")
				.selectAll("svg")
				.selectAll("g.orbit");*/
	console.log("Valeur: "+ value);

	d3.select(".planet")
			.transition().duration(1)
			.attr("r", value);

}

function ellipse(value) {

	d3.select(".orbit")
	  .transition().duration(1000)
	  .style("stroke-opacity", value)
	  .style("fill-opacity", value/3);
}

function setMajor(value) {
	//d3.select(".planet").remove();
	Trappist[0].major = value;
	//Trappist[0].e = value;

	refreshPlanet();
	test();
}

function setMinor(value) {
	Trappist[0].minor = value;

	refreshPlanet();
}

function setE(value) {
	Trappist[0].e = value;

	svg.selectAll(".orbit")
	//		.filter(function(d, i) {return i == planet;})
	   .transition().delay(100)
	   .attr("ry", function(d) {return d.major * Math.sqrt(1-value*value);});
	
	refreshPlanet();
}

function refreshPlanet() {

		d3.selectAll(".planet")
	.data(Trappist).enter()
	//.append("g")
	//.attr("class", "planetWrap")					
	.append("circle")
	.attr("class", "planet")
	.attr("r", function(d) {return radiusSizer*d.radius;})//rScale(d.radius);})
	.attr("cx", function(d) {return d.x;})
	.attr("cy", function(d) {return d.y;})
	.style("fill", "6363FF")
	.style("opacity", planetOpacity)
	.style("stroke-opacity", 0)
	.style("stroke-width", "3px")
	.style("stroke", "white");

	refreshOrbit();
/*	d3.interval(function() {       		
		//Move the planet - DO NOT USE TRANSITION
		d3.selectAll(".planet")
			.attr("cx", locate("x"))
			.attr("cy", locate("y"))
			.attr("transform", function(d) {
				sleep
				return "rotate(" + (d.theta%360) + "," + d.x + "," + d.y + ")";
			})
			;
	});*/
}

function refreshOrbit() {

	/*svg.selectAll(".orbit")
	//		.filter(function(d, i) {return i == planet;})
	   .transition().delay(100)
	   .attr("ry", function(d) {return d.major * Math.sqrt(1-value*value);});*/

	   svg.selectAll(".orbit")
	  //.data(Trappist).enter()
	  //.append("ellipse")
	  //.attr("class", "orbit")
	  .attr("cx", function(d) {return d.cx;})
	  .attr("cy", function(d) {return d.cy;})
	  .attr("rx", function(d) {return d.major;})
	  .attr("ry", function(d) {return d.major * Math.sqrt(1-d.e*d.e);})
	  .style("fill", "#3E5968")
	  .style("fill-opacity", 0)
	  .style("stroke", "white")
	  .style("stroke-opacity", 0);
}

function test() {
	planetContainer.selectAll("g.planet2")
	.data(Trappist).enter()
	//.append("g")
	//.attr("class", "planetWrap")					
	.append("circle")
	.attr("class", "planet")
	.attr("r", function(d) {return radiusSizer*d.radius;})//rScale(d.radius);})
	.attr("cx", function(d) {return d.x;})
	.attr("cy", function(d) {return d.y;})
	.style("fill", "6363FF")
	.style("opacity", planetOpacity)
	.style("stroke-opacity", 0)
	.style("stroke-width", "3px")
	.style("stroke", "white")	
}

function coefZoom() {
	var minMajor=10000;
	var maxMajor=0;
	Trappist.forEach(function(exoPlanet, i) {
		if (exoPlanet.major>maxMajor) {
			maxMajor=exoPlanet.major;
		}
	});

	return 300 / maxMajor;
}


function coefMajor() {
	var maxMajor=0;
	Trappist.forEach(function(exoPlanet, i) {
		if (exoPlanet.major>maxMajor) {
			maxMajor=exoPlanet.major;
		}
	});

	return 300 / maxMajor;
}

function coefRadius() {
	var maxRadius=0;
	Trappist.forEach(function(exoPlanet, i) {
		if (exoPlanet.radius>maxRadius) {
			maxRadius=exoPlanet.radius;
		}
	});

	return 5 / maxRadius;
}

function coefZH() {
	var tSun=5750;
	var tStar=Trappist[0].tStar;
	var rStar=Trappist[0].rStar;
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
	zhCircle.transition().duration(2000)
	  .style("stroke-opacity", opacity);
}