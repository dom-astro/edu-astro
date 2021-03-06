#svg {
    display: block;
    margin: auto;
}

#chart {
	margin-top: 20px;
	border: 1px solid #DEDEDE;
}

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.5px;
}

.horizontalGrid {
	fill : none;
	shape-rendering : crispEdges;
	stroke : lightgrey;
	stroke-width : 1px;
}

.verticalLine {
	fill : none;
	shape-rendering : crispEdges;
	stroke : black;
	stroke-width : 1px;
}

.tooltip {
	position: absolute;
	opacity:0.8;
	z-index:1000;
	text-align:left;
	border-radius:4px;
	-moz-border-radius:4px;
	-webkit-border-radius:4px;
	padding:8px;
	color:#fff;
	background-color:#000;
	font: 12px sans-serif;
	max-width: 300px;
	height: 53px;
}

html,
body {
    width: 100%;
    height: 100%;
}

body {
	/* Explanation : https://github.com/twbs/bootstrap/pull/19098 */
	font-family:
	/* 1 */ -apple-system, BlinkMacSystemFont,
	/* 2 */ "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
	/* 3 */ "Helvetica Neue", sans-serif;
    /* font-family: "Lato",Arial,sans-serif; */
    font-weight: 300;
}

h1, .h1, h2, .h2, h3, .h3 {
    margin-bottom: 10px;
    margin-top: 20px;
}

.navbar {
    border-color: transparent;
	background-color: #000;
	color: #bebebe;
}

.nav-link {
	color: #bebebe;
    text-transform: uppercase;
}

.nav-link:hover {
	color: #fff;
}

/**

.navbar {
    border-color: transparent;
	background-color: #007bff;
	color: #bebebe;
}

.nav-link {
	color: #bebebe;
    text-transform: uppercase;
	padding-top: 4px;
    padding-bottom: 4px;
	cursor: pointer;
}

.nav-link:hover {
	color: #007bff;
	background: #fff;
	border-radius: 2px;
	border-color: transparent;
} */

header {
	/* background: rgba(0, 0, 0, 0) url("../img/header_bg.jpg") no-repeat scroll center center / cover; */
	background-color: #000;
    background-image: url("../img/background-tile.png");
    background-position: center top;
    background-repeat: repeat-x;
    background-size: contain;
    min-height: 100%;
    text-align: center;
    width: 100%;
}

header .header-content {
    position: relative;
    width: 100%;
    padding: 100px 15px;
    text-align: center;
    z-index: 2;
}

header .header-content .inner h1 {
	color: #ffffff;
    font-size: 70px;
	text-transform: uppercase;
    letter-spacing: 8px;
    padding-bottom: 30px;
    margin-top: 0;
    margin-bottom: 0;
}

header .header-content .inner p {
	color: #1f8dd6;
    margin-bottom: 50px;
    font-size: 30px;
    font-weight: 400;
    letter-spacing: 3px;
    margin-left: 15px;
}

@media(min-width:34em) {
    header .header-content {
        position: absolute;
        top: 50%;
        padding: 0 50px;
        -webkit-transform: translateY(-50%);
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
    }

    header .header-content .inner {
        margin-right: auto;
        margin-left: auto;
    }

    header .header-content .inner h1 {
        font-size: 70px;
    }

    header .header-content .inner p {
        margin-right: auto;
        margin-left: auto;
        font-size: 30px;
    }
}

section {
    padding: 20px 0;
}

aside {
    padding: 45px 0;
}

.centered {
    text-align: center;
}

hr.primary {
    border-color: #1f8dd6;
    opacity: 1;
}

hr {
    width: 50%;
    border-width: 3px;
    opacity: 0.08;
    margin-top: 25px;
    margin-bottom: 25px;
}

/* Carousel, remove shadow on left and right, invert text color, center image... */
.carousel-control.left, .carousel-control.right {
    background-image: none;
    color: #373a3c;
}

.carousel-indicators {
    bottom: 0;
}

.carousel-indicators li {
	border: 1px solid #373a3c;
}

.carousel-indicators .active {
	background-color: #373a3c;
}

.carousel-caption {
    position: relative;
    left: auto;
    right: auto;
	color: #373a3c;
	text-shadow: none;
}

.carousel-control .icon-prev::before, .carousel-control .icon-next::before {
    font-size: 60px;
}

/* tutorialwrap is the DIV used in each tutorial for the title and subtitle*/
#tutorialwrap {
    background: #f7f7f9 none repeat scroll 0 0;
    border-bottom: 1px solid #ddd;
    margin-bottom: 40px;
    margin-top: 0;
    padding-top: 40px;
    text-align: center;
}

#tutorialwrap h1 {
    font-size: 3em;
    font-weight: 300;
}

#tutorialwrap h3 {
    color: grey;
    font-weight: 300;
}

/* lib are used for display version of each library in tutorials */
.lib {
	display: inline-block;
	padding: .5em .5em;
	margin-bottom: .75em;
	margin-top: .75em;
	font-size: 75%;
	font-weight: 700;
	line-height: 1;
	text-align: center;
	white-space: nowrap;
	vertical-align: baseline;
	color: #fff;
}

.lib-name {
	border-top-left-radius: .25rem;
	border-bottom-left-radius: .25rem;
	background-color: #343a40;
}

.lib-version {
	border-top-right-radius: .25rem;
	border-bottom-right-radius: .25rem;
}

.lib-d3js {
	background-color: #007bff;
}

.lib-leaflet {
	background-color: #28a745;
}

.lib-jquery {
	background-color: #dc3545;
}

.card-title {
	font-size: 1rem;
	color: #007bff;
}

.card-text {
	font-size: 0.9rem;
}

.card-img-top:hover {
	opacity: 0.5;
}

/* Shadow for card on the main page, first one make bigger shadow */
.shadow {
	/* box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; */
	/* box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important; */
	
	box-shadow: 0 2px 6px 0 rgba(0,0,0,.5);
    border-radius: 2px;
}

.next-tutorial {
    float: right;
    letter-spacing: normal;
    position: relative;
}

/* bs-callout is used in tutorials to hightlight a particular point, it's a box with a color on the left */
.bs-callout {
    -moz-border-bottom-colors: none;
    -moz-border-left-colors: none;
    -moz-border-right-colors: none;
    -moz-border-top-colors: none;
    border-color: #eee;
    border-image: none;
    border-radius: 3px;
    border-style: solid;
    border-width: 1px 1px 1px 5px;
    margin: 20px 0;
    padding: 20px;
}

.bs-callout-warning {
    border-left-color: #fad232;
}  

.bs-callout-info {
    border-left-color: #1f8dd6;
} 

.bs-callout-danger {
    border-left-color: #dd514c;
}

.bs-callout-danger h4 {
    color: #dd514c;
}

.bs-callout-warning h4 {
    color: #fad232;
}

.bs-callout-info h4 {
    color: #1f8dd6;
}

body > footer {
    padding: 45px;
    padding-top: 40px;
}