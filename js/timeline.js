am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create("timelinediv", am4charts.XYChart);

// Add data
chart.data = [{
  "x": "1",
  "y": 1,
  "text": "[bold]"+nbExoPlanet+" exoplanètes découvertes",
  "center": "bottom"
}, {
  "x": "2",
  "y": 1,
  "text": "[bold]"+nbStar+" systèmes planétaires",
  "center": "top"
}, {
  "x": "3",
  "y": 1,
  "text": "[bold]"+(nbSystem-1)+" systèmes multiples",
  "center": "bottom"
}];

// Create axes
var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
xAxis.dataFields.category = "x";
xAxis.renderer.grid.template.disabled = true;
xAxis.renderer.labels.template.disabled = true;
xAxis.tooltip.disabled = true;

var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
yAxis.min = 0;
yAxis.max = 1.99;
yAxis.renderer.grid.template.disabled = true;
yAxis.renderer.labels.template.disabled = true;
yAxis.renderer.baseGrid.disabled = true;
yAxis.tooltip.disabled = true;


// Create series
var series = chart.series.push(new am4charts.LineSeries());
series.dataFields.categoryX = "x";
series.dataFields.valueY = "y";
series.strokeWidth = 4;
series.sequencedInterpolation = true;

var bullet = series.bullets.push(new am4charts.CircleBullet());
bullet.setStateOnChildren = true;
bullet.states.create("hover");
bullet.circle.radius = 10;
bullet.circle.states.create("hover").properties.radius = 15;

var labelBullet = series.bullets.push(new am4charts.LabelBullet());
labelBullet.setStateOnChildren = true;
labelBullet.states.create("hover").properties.scale = 1.2;
labelBullet.label.text = "{text}";
labelBullet.label.maxWidth = 150;
labelBullet.label.wrap = true;
labelBullet.label.truncate = false;
labelBullet.label.textAlign = "middle";
labelBullet.label.paddingTop = 20;
labelBullet.label.paddingBottom = 20;
labelBullet.label.fill = am4core.color("#999");
labelBullet.label.states.create("hover").properties.fill = am4core.color("#666");

labelBullet.label.propertyFields.verticalCenter = "center";


chart.cursor = new am4charts.XYCursor();
chart.cursor.lineX.disabled = true;
chart.cursor.lineY.disabled = true;

$("#timelinediv").show();

});