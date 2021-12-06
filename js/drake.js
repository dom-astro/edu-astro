//Width and Height of the SVG
var w = window,
	d = document,
	e = d.documentElement,
	g = d.getElementsByTagName('body')[0],
	x = (w.innerWidth || e.clientWidth || g.clientWidth) - 50,
	y = (w.innerHeight|| e.clientHeight|| g.clientHeight) - 50;


//window.onresize = updateWindow;
var equations = ["n", "r", "fp", "ne", "fl", "fi", "fc", "l"];


equations.forEach(function(variable) {
    var idEqn="#eqn-"+variable;
    var idDrake="#drake-"+variable;
    var idP="#p-"+variable;
    var idA="#a-"+variable;

	$(idEqn).hover(function() {
		$(idEqn).attr("src","img/eqn-"+variable+"-hover.jpg");
		$(idDrake).attr("src","img/drake-"+variable+"-hover.jpg");
		$(idP).css({"font-weight": "bold"});
	}, function(){
		$(idEqn).attr("src","img/eqn-"+variable+".jpg");
		$(idDrake).attr("src","img/drake-"+variable+".jpg");
		$(idP).css({"font-weight": ""});
	});

	$(idDrake).hover(function() {
		$(idEqn).attr("src","img/eqn-"+variable+"-hover.jpg");
		$(idDrake).attr("src","img/drake-"+variable+"-hover.jpg");
		$(idP).css({"font-weight": "bold"});
	}, function(){
		$(idEqn).attr("src","img/eqn-"+variable+".jpg");
		$(idDrake).attr("src","img/drake-"+variable+".jpg");
		$(idP).css({"font-weight": ""});
	});

	$(idA).hover(function() {
		$(idEqn).attr("src","img/eqn-"+variable+"-hover.jpg");
		$(idDrake).attr("src","img/drake-"+variable+"-hover.jpg");
		$(idP).css({"font-weight": "bold"});
	}, function(){
		$(idEqn).attr("src","img/eqn-"+variable+".jpg");
		$(idDrake).attr("src","img/drake-"+variable+".jpg");
		$(idP).css({"font-weight": ""});
	});
});

window.onscroll = function() {myFunction()};

var header = document.getElementById("myScrollspy");
var sticky = $("#myScrollspy").offset();

function myFunction() {
  if (window.pageYOffset > sticky.top) {
    $("#myScrollspy").addClass("sticky");
  } else {
	$("#myScrollspy").removeClass("sticky");
  }
}

equations.forEach(function(variable) {
  var idSlider="#range-"+variable;
  var valueSlider="#value-"+variable;
  $(idSlider).on('input', function() {
    $(valueSlider).html(this.value);
  });
});