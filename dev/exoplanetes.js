function sortByStarName(a, b) {
	aName = a.star+"-"+a.name;
	bName = b.star+"-"+b.name;
	
    return aName.localeCompare(bName);
}

function sortByDiscoveryDate(a, b) {
    return a["Année"] - b["Année"];
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
	
	var m = exoPlanet.mass*mJup;
	var v = (4/3)*Math.PI*Math.pow(exoPlanet.radius*rJup,3);
	
	return (m == 0 ? 0 : (v == 0 ? 0 : (m/v/1000).toFixed(2)));
}

function getType(exoPlanet) {
	var densite = getDensite(exoPlanet);
	if (densite>2) return "Rocheuse";
	if (densite>0) return "Gazeuse";

	return "";
}

function formatNumber(number, isDecimal = false)
{
    number = number.toFixed(2) + '';
    x = number.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ' ' + '$2');
    }
	
	x=x1;
	if (isDecimal) {
		x = x + x2;
	}
    return x;
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

function getExoDatas(datas) {
	var exoPlanetes = [];
	
	datas.forEach(function(data,i) {
		var exoPlanete = {};
		exoPlanete["Nom"] = data.name;
		exoPlanete["Type"] = getType(data);
		exoPlanete["Zone habitable"] = getZH(data);
		if (data.discovered == null) {
			exoPlanete["Année"] = data.updated.substring(0,4);
		} else {
			exoPlanete["Année"] = data.discovered;
		}
		exoPlanete["Distance"] = formatNumber(data.star_distance*3.26,true);
		exoPlanete["Statut"] = data.planet_status;
		exoPlanete.detection = data.detection_type;
		exoPlanete["Masse"] = formatNumber(data.mass*317.62,true); // conversion en masse terrestre
		//exoPlanete.rayon = data.radius == null ? 10 : data.radius;
		exoPlanete["Rayon"] = formatNumber(data.radius*11.2,true); // conversion en rayon terrestre//(data.radius == null ? 0.1 : data.radius);
		exoPlanete["Densité"] = getDensite(data);
		exoPlanete["Période"] = data.orbital_period;
		exoPlanete["Etoile"] = (data.star_name = undefined ? "" : data.star_name);
		exoPlanete.magnitude = data.mag_v;
		exoPlanete.ra = data.ra;
		exoPlanete.dec = data.dec;
		exoPlanete["Température de l'étoile"] = data.star_teff;
		exoPlanete.spectre = data.star_sp_type;
		exoPlanete.major = data.semi_major_axis;
		exoPlanete.excentricite = data.eccentricity; //(data.eccentricity == null ? 0 : data.eccentricity);
		exoPlanete.star_rayon = data.star_radius;
		exoPlanete["Dernière mise à jour"] = data.updated;
		
		exoPlanetes.push(exoPlanete);
	});
	
	return exoPlanetes.sort(sortByDiscoveryDate);
}

function getZH(exoPlanet) {
	var tSun=5750;
	var tStar=exoPlanet.star_teff;
	var rStar=exoPlanet.star_radius;
	var cstStefanBoltzmann=5.670374;

	var lStar = getLuminosite(rStar, tStar);
	var lSun = getLuminosite(1,tSun);
	var zh=Math.sqrt(lStar/lSun);
	
	if (zh==0) return '';
	if (exoPlanet.semi_major_axis>=(0.953*zh) && zh*exoPlanet.semi_major_axis<=(1.577*zh)) return "Oui";
	
	return "Non";
}

function getLuminosite(rayon, temp) {
	var cstStefanBoltzmann=5.670374;

	return 4*Math.PI*Math.pow(rayon,2)*cstStefanBoltzmann*Math.pow(temp,4);
}

function getExoHeaders(headers) {
	var columnDefs=[];
	Object.keys(headers).forEach(function(key) {
		let header = {};
		header.field=key;
		switch(key) {
			case "Nom":
				header.width=150;
				header.pinned='left';
				break;
			case "Type":
				header.filter='typeFilter';
				header.width=100;
				break;
			case "Status":
				header.filter='typeFilter';
				header.width=100;
				break;
			case "Année":
				header.filter='listeFilter';
				header.width=100;
				header.headerTooltip='Année découverte';
				break;
			case "Distance":
				header.width=100;
				header.headerTooltip='Distance (Année lumière)';
				break;
			case "Zone habitable":
				header.filter='typeFilter';
				header.width=150;
				break;
			case "Statut":
				header.filter='typeFilter';
				header.width=100;
				break;
			case "Masse":
				header.width=100;
				header.headerTooltip='Masse terreste';
				break;
			case "Rayon":
				header.width=80;
				header.headerTooltip='Rayon terreste';
				break;
			case "Période":
				header.width=100;
				header.headerTooltip='Période en jour';
				break;
			default:
			// code block
		}			
		columnDefs.push(header);
	});
	
	return columnDefs;
}

function getNbZH(exoPlanets) {
	var nbExoPlanet=0;
	
	exoPlanets.forEach(function(exoPlanet) {
		if(exoPlanet["Zone habitable"] == "Oui" && exoPlanet["Etoile"] != 'Sun') {
			nbExoPlanet +=1
		}	
	});
	
	return formatNumber(nbExoPlanet);
}

function getNbConfirmed(exoPlanets,type) {
	var nbExoPlanet=0;
	
	exoPlanets.forEach(function(exoPlanet) {
		if(exoPlanet["Statut"] == "Confirmed" && exoPlanet["Etoile"] != 'Sun') {
			nbExoPlanet +=1
		}	
	});
	
	return formatNumber(nbExoPlanet);
}

function getNbType(exoPlanets,type) {
	var nbExoPlanet=0;
	
	exoPlanets.forEach(function(exoPlanet) {
		if(exoPlanet["Type"] == type && exoPlanet["Etoile"] != 'Sun') {
			nbExoPlanet +=1
		}	
	});
	
	return formatNumber(nbExoPlanet);
}
function getNbWanderingPlanets(exoPlanets) {
	var nbWanderingPlanets=0;
	
	exoPlanets.forEach(function(exoPlanet) {
		if(exoPlanet["Etoile"] == '') {
			nbWanderingPlanets +=1
		}	
	});
	
	return formatNumber(nbWanderingPlanets);
}

function getNbPlanets(exoPlanets) {
	var nbExoPlanets=0;
	
	exoPlanets.forEach(function(exoPlanet) {
		if(exoPlanet["Etoile"] != 'Sun') {
			nbExoPlanets +=1
		}	
	});
	
	return formatNumber(nbExoPlanets);
}

function getNbStars(exoPlanets) {
	exoPlanets=exoPlanets.sort(sortByStarName);
	var exoStars=[{star: exoPlanets[0].star, nbPlanet: 0}];
	var starName=exoPlanets[0]["Etoile"];
	exoPlanets.forEach(function(exoPlanet) {
		if(exoPlanet.star != 'Sun') {
			if(exoPlanet.star!=starName) {
				starName=exoPlanet["Etoile"];
				star = {};
				star.name=exoPlanet["Etoile"];
				star.nbPlanet=1;
				exoStars.push(star);
			} else {
				exoStars[exoStars.length-1].nbPlanet +=1;
			}
		}	
	});
	
	return formatNumber(exoStars.length);
}

function getNbMulti(exoPlanets, nb=0) {
	exoPlanets=exoPlanets.sort(sortByStarName);
	var exoStars=[{star: exoPlanets[0]["Etoile"], nbPlanet: 0}];
	var starName=exoPlanets[0]["Etoile"];
	exoPlanets.forEach(function(exoPlanet) {
		if(exoPlanet["Etoile"] != 'Sun') {
			if(exoPlanet["Etoile"]!=starName) {
				starName=exoPlanet["Etoile"];
				star = {};
				star.name=exoPlanet["Etoile"];
				star.nbPlanet=1;
				exoStars.push(star);
			} else {
				exoStars[exoStars.length-1].nbPlanet +=1;
			}
		}	
	});
	
	if (nb==0) { 
		exoStars = exoStars.filter(function(exoStar){
			return exoStar.nbPlanet > 1;
		});
	} else {
		exoStars = exoStars.filter(function(exoStar){
			return exoStar.nbPlanet == nb;
		});
	}
	
	return formatNumber(exoStars.length);
}

function csvJSON(csv){

    var lines=csv.split("\n");

    var result = [];
    
    var commaRegex = /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/g
    
    var quotesRegex = /^"(.*)"$/g

    var headers = lines[0].split(commaRegex).map(h => h.replace(quotesRegex, "$1"));

    for(var i=1;i<lines.length;i++){

        var obj = {};
        var currentline=lines[i].split(commaRegex);


        for(var j=0;j<headers.length;j++){

            obj[headers[j]] = currentline[j].replace(quotesRegex, "$1");
        }
        result.push(obj);

    }
  return result; //JavaScript object
  //return JSON.stringify(result); //JSON
}

function setAgGrid(exoPlanets,div) {
	var headers=exoPlanets[0];
	// Effacement des données initiales
	datas = [];
		
	// let the grid know which columns and what data to use
	const gridOptions = {
		pagination: true,
		paginationPageSize: 100,
		defaultColDef: {
			sortable: true,
			filter: true,
			resizable: true
		},
		columnDefs: getExoHeaders(headers),
		rowData: exoPlanets,
		components: {
			typeFilter: TypeFilter,
			listeFilter: ListeFilter,
		}
	};

	// lookup the container we want the Grid to use
	const eGridDiv = document.getElementById(div);

	// create the grid passing in the div to use together with the columns & data we want to use
	new agGrid.Grid(eGridDiv, gridOptions);
}

function setAgChart(exoPlanets, div) {
	var dataLines = [];

		var exoDatas = exoPlanets.sort(sortByDiscoveryDate);
		var annee=1900;
		var nombre=0;
		var points = [];
		exoDatas.forEach(function(exoData) {
			if (exoData["Année"] !== null && exoData["Année"] !== undefined && exoData["Année"] !=='') {
				nombre += 1;
				if (exoData["Année"]>annee) {
					annee=exoData["Année"];
					var point = {};
					point.annee = annee;
					point.nbPlanete = 1;
					point.nombre = nombre;
					points.push(point);
				} else {
					points[points.length-1].nombre = nombre;
					points[points.length-1].nbPlanete += 1;
				}
			}
		});
		
		function formatNumber(number) {
			return number.value;
		}

var myTheme = {
  baseTheme: 'ag-pastel',
  palette: {
    fills: ['#80a0c3','#80a0c3'],
    strokes: ['black'],
  }
};
		var options = {
		 theme: myTheme,
   navigator: {
    enabled: false,
  },
 container: document.getElementById(div),
  autoSize: true,
  title: {
    text: 'Evolution des découvertes d\'exoplanète',
  },
  /*subtitle: {
    text: 'Nombre de planètes par année de découverte',
  },*/
  data: points,
  legend: {
	enabled: false
  },
  series: [
    {
      type: 'line',
      xKey: 'annee',
	  xName: 'Année de la découverte',
      yKey: 'nombre',
	  yName: 'Nombre d\'exoplanètes',
 	  highlightStyle: {
	  item: {
          fill: 'gray',
          stroke: '#80a0c3',
          strokeWidth: 3,
        },
	  },
     stroke: '#80a0c3',
      marker: {
        stroke: '#80a0c3',
        fill: '#80a0c3',
      },
      label: {
        enabled: true,
		color: 'black',
        fontWeight: 'bold',
		formatter: formatNumber
	  },
	  tooltip: {
        renderer: function (params) {
          return {
            title: '<p>Année '+params.xValue+'</p><!-- img src="Corot.png" width="32px" /-->',
            content: params.yValue.toFixed(0)+' planètes découvertes',
          };
        },
      },
	},
    {
      type: 'column',
      xKey: 'annee',
	  xName: 'Année de la découverte',
      yKeys: ['nbPlanete'],
	  highlightStyle: {
        item: {
          fill: 'gray',
          stroke: '#80a0c3',
          strokeWidth: 1,
        },
	  },
	  stroke: 'lightgray',
      label: {
        enabled: false,
		color: 'black',
        fontWeight: 'bold',
		formatter: formatNumber
      },
	  tooltip: {
        renderer: function (params) {
          return {
            title: '<p>Année '+params.xValue+'</p><!-- img src="Corot.png" width="32px" /-->',
            content: params.yValue.toFixed(0)+' planètes découvertes',
          };
        },
      },
	},
  ],
};

agCharts.AgChart.create(options);
}
