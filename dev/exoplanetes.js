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

function getExoDatas(datas) {
	var exoPlanetes = [];
	
	datas.forEach(function(data,i) {
		var exoPlanete = {};
		exoPlanete.name = data.name;
		exoPlanete.star = (data.star_name = undefined ? "" : data.star_name);
		if (data.discovered == null) {
			exoPlanete.discovered = data.updated.substring(0,4);
		} else {
			exoPlanete.discovered = data.discovered;
		}
		exoPlanete.masse = data.mass*317.62; // conversion en masse terrestre
		//exoPlanete.rayon = data.radius == null ? 10 : data.radius;
		exoPlanete.rayon = data.radius*11.2; // conversion en rayon terrestre//(data.radius == null ? 0.1 : data.radius);
		exoPlanete.periode = data.orbital_period;
		exoPlanete.distance = data.star_distance;
		exoPlanete.updated = data.updated;
		exoPlanete.detection = data.detection_type;
		exoPlanete.magnitude = data.mag_v;
		exoPlanete.ra = data.ra;
		exoPlanete.dec = data.dec;
		exoPlanete.star_k = data.star_teff;
		exoPlanete.spectre = data.star_sp_type;
		exoPlanete.major = data.semi_major_axis;
		exoPlanete.e = data.eccentricity; //(data.eccentricity == null ? 0 : data.eccentricity);
		exoPlanete.tStar = data.star_teff;
		exoPlanete.rStar = data.star_radius;
		exoPlanete.densite = +getDensite(exoPlanete);
		exoPlanete.type = getType(exoPlanete);
		
		exoPlanetes.push(exoPlanete);
	});
	
	return exoPlanetes.sort(sortByDiscoveryDate);;
}

function getExoHeaders(headers) {
	var columnDefs=[];
	Object.keys(headers).forEach(function(key) {
		let header = {};
		header.field=key;
		columnDefs.push(header);
	});
	
	return columnDefs;
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
			filter: true
		},
		columnDefs: getExoHeaders(headers),
		rowData: exoPlanets,
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
			if (exoData.discovered !== null && exoData.discovered !=='') {
				nombre += 1;
				if (exoData.discovered>annee) {
					annee=exoData.discovered;
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
  baseTheme: 'ag-pastel-dark',
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
		color: 'white',
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
        enabled: true,
		color: 'white',
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
