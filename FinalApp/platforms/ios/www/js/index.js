// JavaScript Document
var pages = [],
	links = [];
var numLinks = 0;
var numPages = 0;
var preTabUrl;

//create the pageShow type event.
var pageshow = document.createEvent("CustomEvent");
pageshow.initEvent("pageShow", false, true);

var app = {
	init: function () {
		document.addEventListener("deviceready", app.onDeviceReady);
		document.addEventListener("DOMContentLoaded", app.onDomReady);
	},
	onDeviceReady: function () {
		app.loadRequirements++;
		if (app.loadRequirements === 2) {
			app.start();
		}
	},
	onDomReady: function () {
		app.loadRequirements++;
		//		if (app.loadRequirements === 2) {
		//			app.start();
		//		}
		app.start();
	},
	start: function () {
		
		//device ready listener
		document.addEventListener("scroll", app.handleScrolling, false);

		pages = document.querySelectorAll('[data-role="page"]');
		numPages = pages.length;
		links = document.querySelectorAll('[data-role="pagelink"]');
		numLinks = links.length;
		for (var i = 0; i < numLinks; i++) {
			links[i].addEventListener("click", app.handleNav, false);
		}
		//add the listener for pageshow to each page
		for (var p = 0; p < numPages; p++) {
			pages[p].addEventListener("pageShow", app.handlePageShow, false);
		}
		app.loadPage(null);

		//for default selection
		//	preTabUrl="home";
		//	selecteTab("home");

		var svgEmbed = document.querySelector("#cameraSVG");
		svgEmbed.addEventListener("load", function () {
			preTabUrl = "camera";
			app.selecteTab("camera");
		});
	},
	handleNav: function (ev) {
		ev.preventDefault();
		var href = ev.target.href;
		console.log("href : " + href);
		var parts = href.split("#");
		app.loadPage(parts[1]);
		return false;
	},
	handlePageShow: function (ev) {
		ev.target.className = "active";
	},
	loadPage: function (url) {

		if (url == null) {
			//home page first call
			pages[0].className = 'active';
			history.replaceState(null, null, "#camera");
			preTabUrl = "camera";
			
			//document.querySelector("#footer").style.display="block";

		} else {
			for (var i = 0; i < numPages; i++) {
				pages[i].className = "hidden";
				//get rid of all the hidden classes
				//but make them display block to enable anim.
				if (pages[i].id == url) {
					pages[i].className = "show";
					//add active to the proper page
					history.pushState(null, null, "#" + url);
					setTimeout(app.addDispatch, 50, i);
				}
			}
			//set the activetab class on the nav menu
			for (var t = 0; t < numLinks; t++) {
				links[t].className = "";
				if (links[t].href == location.href) {
					links[t].className = "activetab";
				}
			}
		}
		
		console.log("previousURL : " + preTabUrl+ "  url : "+url);
		//If same tab clicked, do nothing
		if (preTabUrl != url) {
			//Change selection
			preTabUrl = url;
			app.selecteTab(url);
			
		}
	},
	closeModelPage: function () {
		//		console.log(preTabUrl);
		preTabUrl = "gallery"
		app.loadPage("gallery");
		
		//show footer tab bar
//		document.querySelector("#footer").style.display="block";

	},
	addDispatch: function (num) {
		pages[num].dispatchEvent(pageshow);
		//num is the value i from the setTimeout call
		//using the value here is creating a closure
	},
	//For footer
	handleScrolling: function (ev) {
		var height = window.innerHeight;
		var offset = window.pageYOffset;
		var footHeight = 60;
		var footer = document.querySelector("#footer");
		footer.style.position = "absolute";
		var total = height + offset - footHeight;
		footer.style.top = total + "px";
	},

	//For tab change selection
	selecteTab: function (tabName) {
		if (tabName == "camera") {
						
			//Home tab
			var a = document.getElementById("cameraSVG");
			var b = a.contentDocument;
			var contact = b.querySelector("#Capa_1");
			contact.setAttribute("fill", "#009FD4"); //009FD4,3498db

			//ContactTab
			var a2 = document.getElementById("gallerySVG");
			var b2 = a2.contentDocument;
			var contact2 = b2.querySelector("#Capa_1");
			contact2.setAttribute("fill", "black");

			//			Camera.takePicture();
			CameraJS.takePicture();
			//takePicture();

		} else if (tabName == "gallery") {

			//Home tab
			var a = document.getElementById("cameraSVG");
			var b = a.contentDocument;
			var camera = b.querySelector("#Capa_1");
			camera.setAttribute("fill", "black");

			//ContactTab
			var a2 = document.getElementById("gallerySVG");
			var b2 = a2.contentDocument;
			var gallery = b2.querySelector("#Capa_1");
			gallery.setAttribute("fill", "#009FD4");

			//Get thumbnails
			//galleryJS.getThumbnails();
			
			document.querySelector(".items").innerHTML="";
			
			//Get device id
			//var devId = device.uuid;
			var devId = "1232341";
			serverJS.getListOfThumbnail(devId)
		}
	},

	//handle 300ms delay
	touchHandler: function (ev) {
		//this function will run when the touch events happen
		if (ev.type == "touchend") {
			ev.preventDefault();
			var touch = evt.changedTouches[0]; //this is the first object touched

			var newEvt = document.createEvent("MouseEvent"); //old method works across browsers, though it is deprecated.
			/**
		event.initMouseEvent(type, canBubble, cancelable, view,
						 detail, screenX, screenY, clientX, clientY,
						 ctrlKey, altKey, shiftKey, metaKey,
						 button, relatedTarget); **/
			newEvt.initMouseEvent("click", true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY);
			//var newEvt = new MouseEvent("click");				//new method
			//REF: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.MouseEvent
			ev.currentTarget.dispatchEvent(newEvt);
			//change the touchend event into a click event and dispatch it immediately
			//this will skip the built-in 300ms delay before the click is fired by the browser
		}
	}
}
app.init();