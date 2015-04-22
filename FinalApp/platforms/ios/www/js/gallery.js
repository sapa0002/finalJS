var deleteLi;
var arrayThumnbails;
var galleryJS = {

	removeItemFromList: function () {

		deleteLi.remove();
	},
	displayGrid: function (thumnbails) {
				console.log(thumnbails);

		arrayThumnbails = thumnbails;

		//		var ul = document.querySelector(".items")

		for (var i = 0; i < thumnbails.length; i++) {
			var li = document.createElement("li");
			var div = document.createElement("div");
			div.className = "imageHolder";
			div.setAttribute("id", thumnbails[i].id);


			var img = document.createElement("img");
			img.src = thumnbails[i].data;
			console.log(thumnbails[i].data);
			img.className = "imgItem";
			img.setAttribute("id", thumnbails[i].id);

			//Add tap guesture
			var mc = new Hammer.Manager(img);
			// Single tap recognizer
			mc.add(new Hammer.Tap({
				event: 'singletap'
			}));
			mc.on("singletap", function (ev) {

				var target = ev.target;
				console.log(target);
				console.log(target.getAttribute("id"));
				//Load the MODEL page
				app.loadPage("modelView");
				
				var idItem = target.getAttribute("id");

				console.log(arrayThumnbails[0]);
				console.log(idItem);
				for (var i = 0; i < arrayThumnbails.length; i++) {
					var item = arrayThumnbails[i];
					console.log(item.id);
					if (item.id == idItem) {
						//Get device id
						//var devId = device.uuid;
						var devId = "1232341";
						serverJS.getLargeImage(devId, item.id);
						break;
					}
				}
			});

			var btn = document.createElement("button");
			btn.setAttribute("id", thumnbails[i].id);
			btn.innerHTML = "Delete";
			btn.className = "btnDelete";
			btn.addEventListener("click", function (ev) {

				ev.preventDefault();
				console.log($(this).attr("id"));
				deleteLi = $(this).closest("li");
				//				$(this).closest("li").remove();
				
				galleryJS.deleteImage($(this).attr("id"));
				
			});

			div.appendChild(img);
			div.appendChild(btn);
			li.appendChild(div);
			$(".items").append(li);
		}

		// Workaround for Webkit bug: force scroll height to be recomputed after the transition ends, not only when it starts
		$(".items").on("webkitTransitionEnd", function () {
			$(this).hide().offset();
			$(this).show();
		});
		
		var col =  Math.ceil(thumnbails.length/3);

		galleryJS.createListStyles(".items li:nth-child({0})", 3, col);
	},
	showFullImage: function (base64Str) {

		console.log("full image : ",+base64Str);
		
		var i = document.createElement("img");
		var c = document.getElementById("fullImageCanvas");
		//good idea to set the size of the canvas in Javascript in addition to CSS
		c.height = 300;
		c.width = 300;
		context = c.getContext('2d');
		
		i.addEventListener("load", function (ev) {
			//load to canvas after the image is loaded
			//in this sample the original is 300px x 430px
			//we want to resize it to fill the height of our canvas - 600px;
			//alert( i.width + " " + i.height)
			var imgWidth = ev.currentTarget.width;
			var imgHeight = ev.currentTarget.height;
			var aspectRatio = imgWidth / imgHeight;
			//alert(aspectRatio)
			ev.currentTarget.height = c.height;
			ev.currentTarget.width = c.height * aspectRatio;
			var w = i.width;
			var h = i.height;
			console.log("width: ", w, " height: ", h, " aspect ratio: ", aspectRatio);
			c.width = w;
//			c.height = h;
			c.style.width = w + "px";
			context.drawImage(i, 0, 0, w, h);
			//drawImage(image, x-position, y-position, width, height)
		});
		i.crossOrigin = "Anonymous";
		//the crossOrigin property will let you use images from different domains IF the SERVER allows it
		//and if you are using Chrome or Firefox
		//https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
		i.src =base64Str;
		
		//Add click event listenr to close button
		document.getElementById("closeFullView").addEventListener("click", function(){
			
			app.closeModelPage();
			
		});
		

	},
	deleteImage:function(imageId)
	{
		var div = document.createElement("div");
		var p = document.createElement("p");
		p.innerHTML="Delete this photo?";
		div.setAttribute("id","dialog");
		div.setAttribute("title","Delete");
		div.appendChild(p);
		document.querySelector("body").appendChild(div);
		
		
		$("#dialog").dialog({
				modal: true,
				resizable: false,
				width: 500,
            	maxHeight: 400,
				show: 'fade',
				hide: 'fade',
				dialogClass: 'main-dialog-class',
				buttons: {
					"Yes": function() {
						$(this).dialog("close");
						document.querySelector("#dialog").remove();
						//Get device id
						//var devId = device.uuid;
						var devId = "1232341";
						serverJS.deletePhoto(devId, imageId);
						
					},
					"No": function() {
						$(this).dialog("close");
						document.querySelector("#dialog").remove();
					}
				}
			});
	},
	createListStyles: function (rulePattern, rows, cols) {
		var rules = [],
			index = 0;
		for (var colIndex = 0; colIndex < cols; colIndex++) {
			for (var rowIndex = 0; rowIndex < rows; rowIndex++) {
			
				var x = (rowIndex * 100) + "%",
					y = (colIndex * 100) + "%",
					transforms = "{ -webkit-transform: translate3d(" + x + ", " + y + ", 0); transform: translate3d(" + y + ", " + x + ", 0); }";
				rules.push(rulePattern.replace("{0}", ++index) + transforms);
			}
		}
		var headElem = document.getElementsByTagName("head")[0],
			styleElem = $("<style>").attr("type", "text/css").appendTo(headElem)[0];
		if (styleElem.styleSheet) {
			styleElem.styleSheet.cssText = rules.join("\n");
		} else {
			styleElem.textContent = rules.join("\n");
		}
	}
}