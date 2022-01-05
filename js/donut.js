
am4core.ready(function() {

// Themes begin
//am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("donutdiv", am4charts.PieChart3D);
chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

chart.legend = new am4charts.Legend();
var cpt = +0;
systemes.forEach(function(system, i) {
	switch (i) {
		case 0:
			chart.data.push({taille: "Système simple", nombre: system});
			break; 
		case 1:
			chart.data.push({taille: "Système double", nombre: system});
			break;
		case 2:
			chart.data.push({taille: "Système triple", nombre: system});
			break;
		default:
			cpt += system;
	}
});
chart.data.push({taille: "Système quadruple ou +", nombre: cpt});

chart.innerRadius = 50;

var series = chart.series.push(new am4charts.PieSeries3D());
series.dataFields.value = "nombre";
series.dataFields.category = "taille";

$("#donutdiv").show();
});
