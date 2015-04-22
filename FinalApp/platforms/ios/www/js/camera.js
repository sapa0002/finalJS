var c, context, i;

var CameraJS = {
	takePicture: function () {

		document.getElementById("preview").addEventListener("click", CameraJS.showPreview);
		document.getElementById("upload").addEventListener("click", CameraJS.uploadPhoto);


		i = document.createElement("img");
		c = document.getElementById("mycanvas");
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
		i.src = "./img/hello.jpg";
		//		i.setAttribute("src","./img/avatar.png");

		var params = {
			quality: 75,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			//			  popoverOptions: CameraPopoverOptions,
			saveToPhotoAlbum: true
		};

		navigator.camera.getPicture(CameraJS.onSuccess, CameraJS.onFail, params);
	},
	onSuccess: function (imageURI) {

		var image = document.getElementById('myImage');
		image.src = imageURI;
		//image.src = "data:image/jpeg;base64," + imageData;
	},
	onFail: function (message) {
		alert('Failed because: ' + message);
	},
	showPreview: function (ev) {
		var txt = document.getElementById("textInput").value;
		//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_text
		if (txt != "") {
			//clear the canvas
			context.clearRect(0, 0, c.w, c.h);
			//reload the image
			var w = i.width;
			var h = i.height;
			context.drawImage(i, 0, 0, w, h);
			//THEN add the new text to the image
			var middle = c.width / 2;

			//CheckBox event
			var marginTop;
			if (document.getElementById("top").checked) {
				marginTop = 20;
			} else {
				marginTop = c.height - 20;
			}
			//			var bottom = c.height - 20;
			//			var bottom = 20;
			context.font = "13px sans-serif";
			//			context.fillStyle = "red";
			context.strokeStyle = "gold";
			context.textAlign = "center";
			context.fillText(txt, middle, marginTop);
			context.strokeText(txt, middle, marginTop);
		}
	},
	getThumbnail: function () {
		//generate thumbnail and save it's output
		//i is the loaded image.
		//we can resize it and then repeat the loading code to scale the canvas to match
		//then extract the whole canvas
		var imgWidth = i.width;
		var imgHeight = i.height;
		var aspectRatio = imgWidth / imgHeight;
		console.log("width: ", imgWidth, " height: ", imgHeight, " aspect ratio: ", aspectRatio);
		//now resize the image to our desired height
		var h = 200;
		var w = 200 * aspectRatio;
		console.log("width: ", w, " height: ", h, " aspect ratio: ", aspectRatio);
		i.height = h;
		i.width = h * aspectRatio;
		c.height = h;
		c.style.height = h + "px";
		c.width = w;
		c.style.width = w + "px";
		context.drawImage(i, 0, 0, w, h);

		//THEN add the new text to the image

		var txt = document.getElementById("textInput").value;
		if (txt != "") {
			var middle = c.width / 2;

			//CheckBox event
			var marginTop;
			if (document.getElementById("top").checked) {
				marginTop = 20;
			} else {
				marginTop = c.height - 20;
			}
			//			var bottom = c.height - 20;
			//			var bottom = 20;
			context.font = "13px sans-serif";
			//			context.fillStyle = "red";
			context.strokeStyle = "gold";
			context.textAlign = "center";
			context.fillText(txt, middle, marginTop);
			context.strokeText(txt, middle, marginTop);
		}

		var thumbnailStr = c.toDataURL("image/jpeg", 1.0);

		return thumbnailStr;
	},
	uploadPhoto: function () {

		//Get device id
		//var devId = device.uuid;
		var devId = "1232341";

		//Convert to base64 string
		var base64Str = c.toDataURL("image/jpeg", 1.0);
		base64Str = encodeURIComponent(base64Str);

		//Convert to base64 string fro thumbnail
		var base64Thumbnail = CameraJS.getThumbnail();
		base64Thumbnail = encodeURIComponent(base64Thumbnail);


		serverJS.uploadPhotoToServer(devId, base64Str, base64Thumbnail);

		//		serverJS.uploadPhotoToServer(devId,base64Str,base64Thumbnail);
	}


}