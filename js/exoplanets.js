function sortByStarName(a, b) {
	aName = a.star+"-"+a.name;
	bName = b.star+"-"+b.name;
	
    return aName.localeCompare(bName);
}

function sortByDiscoveryDate(a, b) {
    return a.discovered - b.discovered;
}

function getMaxDate(refDate, currentDate) {
	if (currentDate>refDate) {
		return currentDate;
	} else {
		return refDate;
	}
}

function getDensite(exoPlanet) {
	var rJup = +6.9911*Math.pow(10,7);
	var mJup = +1.8986*Math.pow(10,27);
	
	var m = exoPlanet.masse*mJup;
	var v = (4/3)*Math.PI*Math.pow(exoPlanet.rayon*rJup,3);
	
	return (m == 0 ? 0 : (v == 0 ? 0 : (m/v/1000).toFixed(2)));
}

function getType(exoPlanet) {
	
	if (exoPlanet.densite>2) return "Rocheuse";
	if (exoPlanet.densite>0) return "Gazeuse";

	return "NA";
}

var stats = {};
var nbStar = +0;
var systemes = [0, 0, 0, 0, 0, 0, 0, 0];
var star="";
var majDate="1900-01-01";
var tailleSysteme=+0;
var nbSystem=+0;
var nbExoPlanet=+0;
var exoPlanets = [];
var barres = [];
var annee = 1900;

$("#linediv").hide();
$("#donutdiv").hide();
$("#timelinediv").hide();
$("#starList").hide();

datas.forEach(function(data,i) {
	var exoPlanet = {};
	exoPlanet.name = data.name;
	exoPlanet.star = (data.star_name = undefined ? "" : data.star_name);
	if (data.discovered == null) {
		exoPlanet.discovered = data.updated.substring(0,4);
	} else {
		exoPlanet.discovered = data.discovered;
	}
	exoPlanet.masse = data.mass*317.62; // conversion en masse terrestre
	//exoPlanet.rayon = data.radius == null ? 10 : data.radius;
	exoPlanet.rayon = data.radius*11.2; // conversion en rayon terrestre//(data.radius == null ? 0.1 : data.radius);
	exoPlanet.periode = data.orbital_period;
	exoPlanet.distance = data.star_distance;
	exoPlanet.updated = data.updated;
	exoPlanet.detection = data.detection_type;
	exoPlanet.magnitude = data.mag_v;
	exoPlanet.ra = data.ra;
	exoPlanet.dec = data.dec;
	exoPlanet.star_k = data.star_teff;
	exoPlanet.spectre = data.star_sp_type;
	exoPlanet.major = data.semi_major_axis;
	exoPlanet.e = data.eccentricity; //(data.eccentricity == null ? 0 : data.eccentricity);
	exoPlanet.tStar = data.star_teff;
	exoPlanet.rStar = data.star_radius;
	exoPlanet.densite = +getDensite(exoPlanet);
	exoPlanet.type = getType(exoPlanet);
	
	exoPlanets.push(exoPlanet);
	/*if (exoPlanet.discovered>=1995) {
		exoPlanets.push(exoPlanet);
	}*/
});

// Effacement des données initiales
datas = [];

exoPlanets = exoPlanets.sort(sortByDiscoveryDate);
exoPlanets.forEach(function(exoPlanet,i) {
	if (exoPlanet.discovered>annee) {
		annee = exoPlanet.discovered;
		var barre = {};
		barre.annee = annee;
		barre.nbPlanete = i+1;
		barre.nbDiscovered = +1;
		barres.push(barre);
	} else {
		barres[barres.length-1].nbDiscovered += 1;
		barres[barres.length-1].nbPlanete = i+1;
	}
});

exoPlanets = exoPlanets.sort(sortByStarName);
exoPlanets.forEach(function(exoPlanet,i) {
	majDate=getMaxDate(majDate, exoPlanet.updated);
	if (star != exoPlanet.star) {
		systemes[tailleSysteme]+=1;
		star = exoPlanet.star;
		if (exoPlanet.star != "" || exoPlanet.star != undefined) {
			nbStar += 1;
		}
		if (tailleSysteme>0) {
			nbSystem += 1;
		}
		tailleSysteme=+0;
	} else {
		tailleSysteme+=1;
	}
});
//console.info(info);

nbExoPlanet=exoPlanets.length;
/*$("#dateMaj").append("Données au "+majDate); 
$("#nbExo").append("Nombre d'exoplanètes: "+exoPlanets.length); 
$("#nbStar").append("Nombre d'étoiles: "+nbStar); 
$("#nbSystem").append("Nombre de système multiple: "+nbSystem);*/

$(document).ready(function() {
	exoPlanets = exoPlanets.sort(sortByStarName);
	exoPlanets.forEach(function(exoPlanet,i) {
		var strTR = "<tr> \n"+
                    "  <td><a href=\"javascript:initSystem('"+exoPlanet.star+"');\">"+(exoPlanet.star == "" ? "_none" : exoPlanet.star)+"</a></td>\n"+
                    "  <td>"+exoPlanet.spectre+"</td>\n"+
                    "  <td>"+exoPlanet.distance+"</td>\n"+
                    "  <td>"+exoPlanet.name+"</td>\n"+
                    "  <td>"+exoPlanet.detection+"</td>\n"+
                    "  <td>"+exoPlanet.periode+"</td>\n"+
                    "  <td>"+exoPlanet.masse+"</td>\n"+
                    "  <td>"+exoPlanet.rayon+"</td>\n"+
                    "  <td>"+exoPlanet.e+"</td>\n"+
                    "  <td>"+exoPlanet.major+"</td>\n"+
                    "  <td>"+exoPlanet.densite+"</td>\n"+
                    "  <td>"+exoPlanet.type+"</td>\n"+
                    "</tr>\n";
	$("#starBodyList").append(strTR);
	});
    $('#starList').DataTable();
	$("#starList").show();
} );


