//Width and Height of the SVG
var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = (w.innerWidth || e.clientWidth || g.clientWidth) - 50,
	y = (w.innerHeight|| e.clientHeight|| g.clientHeight) - 50;

window.onresize = updateWindow;

var planetes = ["Soleil", "Mercure", "Venus", "Terre", "Lune", "Mars", "Jupiter", "Saturne", "Uranus", "Neptune", "m31", "m57", "m87", "Alphea6CL"];
var iPlanete = 0;
var imgWidth = Math.min(x,y)/3;

var bas = {
	id: {
		img: $("#imgBas"),
		video: $("#videoBas")
	},
	x: (x-imgWidth)/2,
	y: (y-3*imgWidth)/2+50,
	offset: {x:0, y:-1}
};
var haut = {
	id: {
		img: $("#imgHaut"),
		video: $("#videoHaut")
	},
	x: (x-imgWidth)/2,
	y: (y+imgWidth)/2+50,
	offset: {x:0, y:1}
};
var droite = {
	id: {
		img: $("#imgDroite"),
		video: $("#videoDroite")
	},
	x: (x+imgWidth)/2,
	y: (y-imgWidth)/2+50,
	offset: {x:1, y:0}
};
var gauche = {
	id: {
		img: $("#imgGauche"),
		video: $("#videoGauche")
	},
	x: (x-3*imgWidth)/2,
	y: (y-imgWidth)/2+50,
	offset: {x:-1, y:0}
};

var elts = [];
elts.push(haut);
elts.push(bas);
elts.push(gauche);
elts.push(droite);

setSource("Soleil.jpg");
setSize(imgWidth);

setPosition(0);
/*setPosition(haut,(x-imgWidth)/2, (y-3*imgWidth)/2+50);
setPosition(droite,(x+imgWidth)/2, (y-imgWidth)/2+50);
setPosition(bas,(x-imgWidth)/2, (y+imgWidth)/2+50);
setPosition(gauche,(x-3*imgWidth)/2, (y-imgWidth)/2+50);*/

function setSize(size) {
  elts.forEach(function(elt) {
    elt.id.img.attr("width", size);
    elt.id.video.attr("width", size);
  });
}

function setSource(nomImage) {
  elts.forEach(function(elt) {
    elt.id.img.attr("src", "img/"+nomImage);
  });
}

function setPosition(offset) {
  elts.forEach(function(elt) {
	elt.x += offset*elt.offset.x;
	elt.y += offset*elt.offset.y;
	elt.id.img.css({position: "absolute", left:elt.x, top:elt.y});
	elt.id.video.css({position: "absolute", left:elt.x, top:elt.y});
  });
}

/*function setPosition(el, x, y) {
	el.css({position: "absolute",left:x,top:y});
}*/

function setPlanete(planete) {
  setSource(planete+".jpg");
  iPlanete=planetes.indexOf(planete);
  resetPlanetes();
  $("#"+planete).html("* "+planete);
}

function resetPlanetes() {
  planetes.forEach(function(planete) {
	$("#"+planete).html(planete);
  });
}

function hideImages() {
  elts.forEach(function(elt) {
    elt.id.img.hide();
  });
}

function showImages() {
  elts.forEach(function(elt) {
    elt.id.img.show();
  });
}

function setVideo() {
  setVideoSource(video+".mp4");
  iPlanete=planetes.indexOf(video);
  resetPlanetes();
  $("#"+video).html("* "+video);
}

function showVideo() {
	nomVideo = planetes[iPlanete];
	elts.forEach(function(elt) {
		elt.id.video.attr("src", "videos/"+nomVideo+".mp4");
		elt.id.video.show();
		elt.id.video.get(0).play(); 
	});
}

function hideVideo() {
	elts.forEach(function(elt) {
		elt.id.video.attr("src", "");
		//elt.id.video.pause();
		elt.id.video.hide();
	});
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
setPosition(0);
/*setPosition(haut,(x-imgWidth)/2, (y-3*imgWidth)/2);
setPosition(droite,(x+imgWidth)/2, (y-imgWidth)/2);
setPosition(bas,(x-imgWidth)/2, (y+imgWidth)/2);
setPosition(gauche,(x-3*imgWidth)/2, (y-imgWidth)/2);*/
}

document.addEventListener('keypress', (event) => {
  const nomTouche = event.key;

  switch (nomTouche) {
	  case "p":
		iPlanete = (iPlanete + 1) % 14;
		setPlanete(planetes[iPlanete]);
		break;
	  case "o":
		iPlanete = (iPlanete - 1) % 14;
		if (iPlanete== -1) {
			iPlanete=13;
		}
		setPlanete(planetes[iPlanete]);
		break;
	  case "s":
		iPlanete = 0;
		setPlanete(planetes[iPlanete]);
		break;
	  case "m":
		setPosition(1);
		break;
	  case "l":
		setPosition(-1);
		break;
	  case ":":
		imgWidth += 1;
		setSize(imgWidth);
		break;
	  case ";":
		imgWidth -= 1;
		setSize(imgWidth);
		break;
	  case "v":
		hideImages();
		showVideo();
		break;
	  case "i":
		showImages();
		hideVideo();
  }
  //alert('Évènement keypress\n\n' + 'touche : ' + nomTouche);
});