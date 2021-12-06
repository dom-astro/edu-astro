//Width and Height of the SVG
var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = (w.innerWidth || e.clientWidth || g.clientWidth) - 50,
	y = (w.innerHeight|| e.clientHeight|| g.clientHeight) - 50;

var isPlay=false;

window.onresize = updateWindow;

var planetes = ["Soleil", "Mercure", "Venus", "Terre", "Lune", "Mars", "Jupiter", "Saturne", "Uranus", "Neptune"];
var iPlanete = 0;
var imgWidth = Math.min(x,y)/3;

var haut = $("#imgHaut");
var bas = $("#imgBas");
var gauche = $("#imgGauche");
var droite = $("#imgDroite");

var imgs = [];
imgs.push(haut);
imgs.push(bas);
imgs.push(gauche);
imgs.push(droite);

setSource("Soleil.jpg");
setSize(imgWidth);

setPosition(haut,(x-imgWidth)/2, (y-3*imgWidth)/2+50);
setPosition(droite,(x+imgWidth)/2, (y-imgWidth)/2+50);
setPosition(bas,(x-imgWidth)/2, (y+imgWidth)/2+50);
setPosition(gauche,(x-3*imgWidth)/2, (y-imgWidth)/2+50);

function setSize(size) {
  imgs.forEach(function(img) {
    img.attr("width", size);
  });
}

function setSource(nomImage) {
  imgs.forEach(function(img) {
    img.attr("src", "img/"+nomImage);
  });
}

function setPosition(el, x, y) {
	el.css({position: "absolute",left:x,top:y});
}

function setPlanete(planete) {
  setSource(planete+".jpg");
  iPlanete=planetes.indexOf(planete);
  resetPlanetes();
  $("#"+planete).html("* "+planete);
  isPlay = false;
}

function resetPlanetes() {
  planetes.forEach(function(planete) {
	$("#"+planete).html(planete);
  });
  $("#Play").html("Play");
}

function updateWindow() {
	w = window;
	d = document;
	e = d.documentElement;
	g = d.getElementsByTagName('body')[0];
	x = (w.innerWidth || e.clientWidth || g.clientWidth) - 50;
	y = (w.innerHeight|| e.clientHeight|| g.clientHeight) - 50;
	
	imgWidth = Math.min(x,y)/3;

//setSource("Soleil.jpg");
setSize(imgWidth);

setPosition(haut,(x-imgWidth)/2, (y-3*imgWidth)/2);
setPosition(droite,(x+imgWidth)/2, (y-imgWidth)/2);
setPosition(bas,(x-imgWidth)/2, (y+imgWidth)/2);
setPosition(gauche,(x-3*imgWidth)/2, (y-imgWidth)/2);
}

document.addEventListener('keypress', (event) => {
  const nomTouche = event.key;

  if (nomTouche=="p") {
	  iPlanete = (iPlanete + 1) % 10;
	  setPlanete(planetes[iPlanete]);
  }
  if (nomTouche=="o") {
	  iPlanete = (iPlanete - 1) % 10;
	  if (iPlanete== -1) {
		  iPlanete=9;
	  }
	  setPlanete(planetes[iPlanete]);
  }
  if (nomTouche=="s") {
	  iPlanete = 0;
	  setPlanete(planetes[iPlanete]);
  }
  //alert('Évènement keypress\n\n' + 'touche : ' + nomTouche);
});

//Create SVG
/*var svg = d3.select("#pyramide").append("svg")
	.attr("width", x)
	.attr("height", y);

//Create a container for everything with the centre in the middle
var container = svg.append("g").attr("class","container")
					.attr("transform", "translate(" + x/2 + "," + y/2 + ")")
  
//Create star in the Middle - scaled to the orbits
//Radius of our Sun in these coordinates (taking into account size of circle inside image)
var ImageWidth = 50;
container.
append("svg:image")
	.attr("x", -ImageWidth)
	.attr("y", -ImageWidth)
	.attr("class", "sun")
	.attr("xlink:href", "img/mercure.jpg")
	.attr("width", ImageWidth*2)
	.attr("height", ImageWidth*2)
	.attr("text-anchor", "middle");*/
