const margin = {top: 20, right: 30, bottom: 30, left: 60},
    width = document.getElementById("container").offsetWidth * 0.95 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const parseTime = d3.timeParse("%d/%m/%Y");
const dateFormat = d3.timeFormat("%Y");

const x = d3.scaleTime()
    .range([0, width]);

const y = d3.scaleLinear()
    .range([height, 0]);

const line = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.volume); });

const svg = d3.select("#chart").append("svg")
    .attr("id", "svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// On demande à D3JS de charger notre fichier
// On déclare également une map qui servira un peu plus bas pour l'affichage du tooltip
var map = {};
var planets = [];
var period = exoPlanets[0].discovered
var nb = 0;
var total = 0;
exoPlanets.sort(function(a, b) {
	return a.discovered - b.discovered;
});

// Conversion des données du fichier, parsing des dates et '+' pour expliciter une valeur numérique.
exoPlanets.forEach(function(d, i) {
	if (d.discovered != period) {
		var planet = {};
		
		planet.date = parseTime("01/01/"+d.discovered);
		planet.period = period;
		planet.nb = (i+1) - nb;
		planet.volume = (i+1);
		planets.push(planet);
		map[period] = planet; // sauvegarde sous forme de hashmap de nos données.
		nb = (i+1);
	}
	period = d.discovered;
	total = (i+1);
});

var planet = {};
planet.date=parseTime("01/01/"+period);
planet.nb = total - planets[planets.length-1].volume;
planet.volume = total;
planets.push(planet);
map[period] = planet; // sauvegarde sous forme de hashmap de nos données.

console.log(planets)
//console.info(planets);
// Contrairement au tutoriel Bar Chart, plutôt que de prendre un range entre 0 et le max on demande 
// directement à D3JS de nous donner le min et le max avec la fonction 'd3.extent', pour la date comme 
   // pour le cours de fermeture (close).
x.domain(d3.extent(planets, function(d) { return d.date; }));
y.domain(d3.extent(planets, function(d) { return d.volume; }));

// Ajout de l'axe X
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
    
// Ajout de l'axe Y et du texte associé pour la légende
svg.append("g")
    .call(d3.axisLeft(y))
    .append("text")
    .attr("fill", "#000")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "0.71em")
    .style("text-anchor", "end")
    .text("");
    
// Ajout de la grille horizontale (pour l'axe Y donc). Pour chaque tiret (ticks), on ajoute une ligne qui va 
// de la gauche à la droite du graphique et qui se situe à la bonne hauteur.
svg.selectAll("y axis").data(y.ticks(10)).enter()
    .append("line")
    .attr("class", "horizontalGrid")
    .attr("x1", 0)
    .attr("x2", width)
    .attr("y1", function(d){ return y(d);})
    .attr("y2", function(d){ return y(d);});
    
// Ajout d'un path calculé par la fonction line à partir des données de notre fichier.
svg.append("path")
    .datum(planets)
    .attr("class", "line")
    .attr("d", line);
//});

var div = d3.select("body").append("div")   
    .attr("class", "tooltip")
    .attr("x", width - 300)
    .attr("y", 0)
    .style("opacity", 0);

var verticalLine = svg.append("line")
    .attr("class", "verticalLine")
    .attr("x1",0)
    .attr("y1",0)
    .attr("x2",0)
    .attr("y2",height)
    .style("opacity", 0);

d3.select("#chart").on("mousemove", function() {
    // Récupération de la position X & Y de la souris.
    var mouse_x = d3.mouse(this)[0];
    var mouse_y = d3.mouse(this)[1];
    
    // Si la position de la souris est en dehors de la zone du graphique, on arrête le traitement
    if (mouse_x < margin.left || mouse_x > (width + margin.left) || mouse_y < margin.top || mouse_y > (400 - margin.bottom)) {
        return ;
    }
    
    // Grâce à la fonction 'invert' nous récupérons la date correspondant à notre position
    // A noter, il faut soustraire la marge à gauche pour que la valeur soit correct.
    var selectedDate = x.invert(mouse_x - margin.left);
    
    // Positionnement de la barre verticale toujours en tenant compte de la marge
    verticalLine.attr("x1", mouse_x - margin.left);
    verticalLine.attr("x2", mouse_x - margin.left);
    verticalLine.style("opacity", 1);
    
    var entry = map[selectedDate.getFullYear()];
    if (typeof entry === "undefined") {
        return ;
    }
    // Si une entrée existe pour la date sélectionnée nous pouvons afficher les données.
    
    // Le comportement est équivalent aux précédents exemples pour le tooltip.
    div.style("opacity", .9);
    div.style("left", (d3.event.pageX + 30) + "px")     
        .style("top", (d3.event.pageY - 60) + "px")
        .html("<b>Année : </b>" + dateFormat(entry.date) + "<br>"
        + "<b>Découvertes : </b>" + entry.nb + "<br>"
        + "<b>Total : </b>" + entry.volume + "<br>");
}).on("mouseout", function() {
    var mouse_x = d3.mouse(this)[0];
    var mouse_y = d3.mouse(this)[1];

    // Si la position de la souris est en dehors de la zone du graphique, on masque la ligne et le tooltip
    if (mouse_x < margin.left || mouse_x > (width + margin.left) || mouse_y < margin.top || mouse_y > (400 - margin.bottom)) {
        div.style("opacity", 0);
        verticalLine.style("opacity", 0);
    }
});