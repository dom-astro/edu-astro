///////////////////////////////////////////////////////////////////////////
/////////////////////////// Other functions ///////////////////////////////
///////////////////////////////////////////////////////////////////////////	

//Change x and y location of each planet
function movePlanets() {
  d3.timer(function() {       		
  		//Move the planet - DO NOT USE TRANSITION
  		d3.selectAll(".planet")
  			.attr("cx", locate("x"))
  			.attr("cy", locate("y"))
  			.attr("transform", function(d) {
  				return "rotate(" + (d.theta%360) + "," + d.x + "," + d.y + ")";
  			})
  			;				
  });
}
	
//Calculate the new x or y position per planet
function locate(coord) {
	return function(d){
		var k = 360 * d.major * (d.major * Math.sqrt(1-d.e*d.e)) / (d.periode * resolution * speedUp);
		
		for (var i = 0; i < resolution; i++) {
			d.theta += k / (d.r * d.r);
			d.r = d.major * (1 - d.e * d.e) / (1 - d.e * Math.cos(toRadians(d.theta)));   
		}// for
				
		var x1 = d.r * Math.cos(toRadians(d.theta)) - d.focus;
		var y1 = d.r * Math.sin(toRadians(d.theta));
		
		if (d.theta > 360) {d.theta -= 360;}
				
		if (coord == "x") {
			//New x coordinates
			newX = d.cx + x1 * Math.cos(toRadians(phi)) - y1 * Math.sin(toRadians(phi));
			d.x = newX;
			return newX;
		} else if (coord == "y") {
			newY = d.cy + x1 * Math.sin(toRadians(phi)) + y1 * Math.cos(toRadians(phi));
			d.y = newY;
			return newY;
		}
	};
}//function locate

//Show the total orbit of the hovered over planet
function showEllipse(d, i, opacity) {
	var planet = i;
	//console.log(d);
	var duration = (opacity == 0) ? 2500 : 100; //If the opacity is zero slowly remove the orbit line
		
	//Highlight the chosen planet
	/*svg.selectAll(".planet")
	   .filter(function(d, i) {
		 if (i==planet) {
		   return d.isShow;
		 }
		 return i == planet;
	})*/
	svg.selectAll("#p-"+i)
	.transition().duration(duration)
		.style("stroke-opacity", opacity * 1.25);
		
	//Select the orbit with the same index as the planet
	/*svg.selectAll(".orbit")
		.filter(function(d, i) {return i == planet;})*/
	svg.selectAll("#o-"+i)
		.transition().duration(duration)
		.style("stroke-opacity", opacity)
		.style("fill-opacity", opacity/3);
}//showEllipse	
	
function setEllipse(isShow, i) {
	var planet = i;
	//console.log(d);
    isShow = (isShow == false);
	opacity = isShow ? 0.6 : 0;
	var duration = (opacity == 0) ? 2000 : 100; //If the opacity is zero slowly remove the orbit line
	
	//Highlight the chosen planet
	svg.selectAll(".planet")
		.filter(function(d, i) {
			if (i==planet) {
				d.isShow = isShow;
			}
			return i == planet;
		})
		.transition().duration(duration)
		.style("stroke-opacity", opacity * 1.25);
	
	//Select the orbit with the same index as the planet
	svg.selectAll(".orbit")
		.filter(function(d, i) {return i == planet;})
		.transition().duration(duration)
		.style("stroke-opacity", opacity)
		.style("fill-opacity", opacity/3);

}

//Decrease opacity of non selected stellar classes when hovering in Legend	
function classSelect(opacity) {
	return function(d, i) {
		stopTooltip = true;	
		var chosen = d.sClass;
		svg.selectAll(".planet")
			.filter(function(d) { return d.class != chosen; })
			.transition()
			.style("opacity", opacity);
	};
}//function classSelect
	
//Turn degrees into radians
function toRadians (angle) { return angle * (Math.PI / 180);}

//Remove all events
function removeEvents() {
	//Remove event listeners during examples
	d3.selectAll('.planet').on('mouseover', null).on('mouseout', null);
	d3.selectAll('.legend').on('mouseover', null).on('mouseout', null);
	d3.select("svg").on("click", null);
}//function removeEvents
	
//Reset all events
function resetEvents() {	
	//Replace planet events
	d3.selectAll('.planet')
		.on("mouseover", function(d, i) {
			stopTooltip = false					
			showTooltip(d);
			showEllipse(d, i, 0.8);
		})
		.on("mouseout", function(d, i) {
			showEllipse(d, i, 0);
		});
	
	//Replace Legend events
	d3.selectAll('.legend')
		.on("mouseover", classSelect(0.04))
		.on("mouseout", classSelect(planetOpacity));  
		
	//Replace click event
	d3.select("svg")
		.on("click", function(d) {stopTooltip = true;});
}


//Highlight the chosen planet and its orbit
function highlight(planet, delayTime){

	if(typeof(delayTime)==='undefined') delayTime = 0;
	//if(typeof(tooltip)==='undefined') tooltip = true;
	var time = 1000;
	
	//Highlight the chosen planet
	svg.selectAll(".planet")
		.filter(function(d, i) {return i == planet;})
		.transition().delay(700 * delayTime).duration(time)
		.style("stroke-opacity", 1)
		.style("opacity", 0.95)
		//.transition()
		//.each(function(d) {if (tooltip == true) {showTooltip(d);}})
		;
	
	//Select the orbit with the same index as the planet
	svg.selectAll(".orbit")
		.filter(function(d, i) {return i == planet;})
		.transition().delay(700 * delayTime).duration(time)
		.style("stroke-opacity", 0.8)
		.style("fill-opacity", 0.2);
	
}//function highlight


//Function to bring opacity back of all planets
function bringBack(opacity, delayTime){

	if(typeof(delayTime)==='undefined') delayTime = 0;
	var time = 500;
	
	//Change opacity of all
	svg.selectAll(".planet")
		.transition().delay(700 * delayTime).duration(time)
		.style("opacity", opacity);
	
}//function bringBack


//Dim all other planets (and orbits)
function dimOne(planet, delayTime) {

	if(typeof(delayTime)==='undefined') delayTime = 0;
	var time = 500;
	
	//Dim all other planets
	svg.selectAll(".planet")
		.filter(function(d, i) {return i == planet;})
		.transition().delay(700 * delayTime).duration(time)
		.style("stroke-opacity", 0)
		.style("opacity", 0.1);	
		
	//Select the orbit with the same index as the planet
	svg.selectAll(".orbit")
		.filter(function(d, i) {return i == planet;})
		.transition().delay(700 * delayTime).duration(time)
		.style("stroke-opacity", 0)
		.style("fill-opacity", 0);
		
}//function dim


//Dim all planets (and orbits)
function dim(delayTime) {

	if(typeof(delayTime)==='undefined') delayTime = 0;
	var time = 1000;
	
	//Dim all other planets
	svg.selectAll(".planet")
		.transition().delay(700 * delayTime).duration(time)
		.style("stroke-opacity", 0)
		.style("opacity", 0.1);	
		
	//Select the orbit with the same index as the planet
	svg.selectAll(".orbit")
		.transition().delay(700 * delayTime).duration(time)
		.style("stroke-opacity", 0)
		.style("fill-opacity", 0);
		
}//function dim

		
//Taken from http://bl.ocks.org/mbostock/7555321
//Wraps SVG text	
function wrap(text, width) {
	var text = d3.select(this[0][0]),
		words = text.text().split(/\s+/).reverse(),
		word,
		line = [],
		lineNumber = 0,
		lineHeight = 1.4, // ems
		y = text.attr("y"),
		x = text.attr("x"),
		dy = parseFloat(text.attr("dy")),
		tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");
		
	while (word = words.pop()) {
	  line.push(word);
	  tspan.text(line.join(" "));
	  if (tspan.node().getComputedTextLength() > width) {
		line.pop();
		tspan.text(line.join(" "));
		line = [word];
		tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
	  }
	}  
};

//Taken from https://groups.google.com/forum/#!msg/d3-js/WC_7Xi6VV50/j1HK0vIWI-EJ
//Calls a function only after the total transition ends
function endall(transition, callback) { 
	var n = 0; 
	transition 
		.each(function() { ++n; }) 
		.each("end", function() { if (!--n) callback.apply(this, arguments); }); 
}

//Outline taken from http://stackoverflow.com/questions/16265123/resize-svg-when-window-is-resized-in-d3-js
function updateWindow(){
	x = (w.innerWidth || e.clientWidth || g.clientWidth) - 50;
	y = (w.innerHeight|| e.clientHeight|| g.clientHeight) - 50;

	svg.attr("width", x).attr("height", y);
	d3.selectAll(".container").attr("transform", "translate(" + x/2 + "," + y/2 + ")");
	d3.selectAll(".legendContainer").attr("transform", "translate(" + 30 + "," + (y - 90) + ")");
	d3.select("#crazy").style("left", (x/2 - 112/2 + 6) + "px").style("top", (y/2 - 100) + "px");
}//updateWindow