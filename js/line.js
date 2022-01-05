am4core.ready(function() {


// Themes begin
//am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create("linediv", am4charts.XYChart);

chart.colors.step = 2;
chart.maskBullets = false;

barres.forEach(function(barre, i) {
	var data = {};
	
	data.date=barre.annee+"-01-01";
	data.nbPlanete=barre.nbPlanete;
	data.townName=i;
	data.nbDiscovered=barre.nbDiscovered;
	data.rayon=5;
    //data.townSize=12;
    data.latitude=barre.nbPlanete;
	switch (+barre.annee) {
		case 1995:
			data.bullet="img/51Pegasi_b.jpg";
			data.tips="Découverte de la première exoplanète";
			break; 
		case 2006:
			data.bullet="img/Corot.png";
			data.tips="CoRoT: premier télescope en orbite destiné à la recherche de planètes extrasolaires";
			break;
		case 2009:
			data.bullet="img/Kepler.png";
			data.tips="Lancement du satellite Kepler";
			break;
		case 2015:
			data.bullet="img/Trappist.png";
			data.tips="Découverte de 7 planètes orbitant autour de Trappist-1";
			break;
		case 2018:
			data.bullet="img/Tess.png";
			data.tips="Tess: Recensement de manière systématique des exoplanètes les plus proches";
			break;
		case 2021:
			data.bullet="img/jwst.png";
			data.tips="Lancement par une fusée Ariane 5 du James-Webb Space Télescope";
			break;
		default:
			data.bullet="";
			data.tips="";
	}
	
	chart.data.push(data);
});

// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;
dateAxis.renderer.minGridDistance = 50;
dateAxis.renderer.grid.template.disabled = true;
dateAxis.renderer.fullWidthTooltip = true;

var distanceAxis = chart.yAxes.push(new am4charts.ValueAxis());
distanceAxis.title.text = "Nombre de planète";
distanceAxis.renderer.grid.template.disabled = true;

/*var durationAxis = chart.yAxes.push(new am4charts.DurationAxis());
durationAxis.title.text = "Duration";
durationAxis.baseUnit = "minute";
durationAxis.renderer.grid.template.disabled = true;
durationAxis.renderer.opposite = true;

durationAxis.durationFormatter.durationFormat = "hh'h' mm'min'";*/

var latitudeAxis = chart.yAxes.push(new am4charts.ValueAxis());
latitudeAxis.renderer.grid.template.disabled = true;
latitudeAxis.renderer.labels.template.disabled = true;

// Create series
var distanceSeries = chart.series.push(new am4charts.ColumnSeries());
distanceSeries.dataFields.valueY = "nbDiscovered";
distanceSeries.dataFields.dateX = "date";
distanceSeries.yAxis = distanceAxis;
distanceSeries.tooltipText = "{valueY} planètes";
distanceSeries.name = "Découvertes annuelles";
distanceSeries.columns.template.fillOpacity = 0.7;
distanceSeries.columns.template.propertyFields.strokeDasharray = "dashLength";
distanceSeries.columns.template.propertyFields.fillOpacity = "alpha";

var disatnceState = distanceSeries.columns.template.states.create("hover");
disatnceState.properties.fillOpacity = 0.9;

/*var durationSeries = chart.series.push(new am4charts.LineSeries());
durationSeries.dataFields.valueY = "duration";
durationSeries.dataFields.dateX = "date";
durationSeries.yAxis = durationAxis;
durationSeries.name = "Duration";
durationSeries.strokeWidth = 2;
durationSeries.propertyFields.strokeDasharray = "dashLength";
durationSeries.tooltipText = "{valueY.formatDuration()}";

var durationBullet = durationSeries.bullets.push(new am4charts.Bullet());
var durationRectangle = durationBullet.createChild(am4core.Rectangle);
durationBullet.horizontalCenter = "middle";
durationBullet.verticalCenter = "middle";
durationBullet.width = 7;
durationBullet.height = 7;
durationRectangle.width = 7;
durationRectangle.height = 7;

var durationState = durationBullet.states.create("hover");
durationState.properties.scale = 1.2;*/

var latitudeSeries = chart.series.push(new am4charts.LineSeries());
latitudeSeries.dataFields.valueY = "nbPlanete";
latitudeSeries.dataFields.dateX = "date";
latitudeSeries.yAxis = distanceAxis;
latitudeSeries.name = "Total de découverte";
latitudeSeries.strokeWidth = 2;
latitudeSeries.propertyFields.strokeDasharray = "dashLength";
latitudeSeries.tooltipText = "{tips}";

var latitudeBullet = latitudeSeries.bullets.push(new am4charts.CircleBullet());
latitudeBullet.circle.fill = am4core.color("#fff");
latitudeBullet.circle.strokeWidth = 2;
latitudeBullet.circle.propertyFields.radius = "rayon";

var latitudeState = latitudeBullet.states.create("hover");
latitudeState.properties.scale = 1.2;

var latitudeLabel = latitudeSeries.bullets.push(new am4charts.LabelBullet());
//latitudeLabel.label.text = "{tips}";
latitudeLabel.label.horizontalCenter = "left";
latitudeLabel.label.dx = 14;

// Add legend
chart.legend = new am4charts.Legend();

// Add cursor
chart.cursor = new am4charts.XYCursor();
chart.cursor.fullWidthLineX = true;
chart.cursor.xAxis = dateAxis;
chart.cursor.lineX.strokeOpacity = 0;
chart.cursor.lineX.fill = am4core.color("#000");
chart.cursor.lineX.fillOpacity = 0.1;

// Add bullets
var bullet = latitudeSeries.bullets.push(new am4charts.Bullet());
var image = bullet.createChild(am4core.Image);
image.horizontalCenter = "middle";
image.verticalCenter = "bottom";
image.dy = 10;
image.y = am4core.percent(10);
image.propertyFields.href = "bullet";
//image.tooltipText = series.columns.template.tooltipText;
image.propertyFields.fill = "color";
image.filters.push(new am4core.DropShadowFilter());

$("#linediv").show();
});
