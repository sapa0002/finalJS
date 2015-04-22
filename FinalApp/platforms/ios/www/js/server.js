var serverJS = {
	uploadPhotoToServer: function (deviceId, baseSring, baseSringThumb) {

		var postData = "dev=" + deviceId + "&img=" + baseSring + "&thumb=" + baseSringThumb;
		serverJS.sendRequest(
			'http://localhost:8888/MAD9022/FinalApp/server/save.php',
//			'http://faculty.edumedia.ca/griffis/mad9022/final-w15/save.php',
			serverJS.uploadCalBack,
			postData
		);

		//		$.ajax({
		//				url: 'http://localhost:8888/MAD9022/FinalApp/server/save.php',
		//				type: 'POST',
		//				dataType: "jsonp",
		//				data: {
		//					dev: deviceId,
		//					img: baseSring,
		//					thumb: baseSringThumb
		//				},
		//				success: function (data) {
		////					alert(JSON.stringify(data));
		//					alert("save sucessfully");
		//				},
		//				fail: function () {
		//					alert("Fail to upload");
		//				}
		//		});
		//		
	},
	getListOfThumbnail: function (deviceId) {
//		var postData = "dev=" + deviceId;
		
		serverJS.sendRequest(
			'http://localhost:8888/MAD9022/FinalApp/server/list.php?dev='+deviceId,
//			'http://faculty.edumedia.ca/griffis/mad9022/final-w15/list.php?dev='+deviceId,
			serverJS.getListCalBack,
			null
		);
	},
	deletePhoto: function (deviceId, photoId) {
		var postData = "dev=" + deviceId + "&img_id="+photoId;
		serverJS.sendRequest(
			
			"http://localhost:8888/MAD9022/FinalApp/server/delete.php?dev=" + deviceId + "&img_id="+photoId,
//			"http://faculty.edumedia.ca/griffis/mad9022/final-w15/delete.php?dev=" + deviceId + "&img_id="+photoId,
			serverJS.deleteCalBack,
			null
		);
	},
	getLargeImage: function (deviceId, photoId) {
		serverJS.sendRequest(
			'http://localhost:8888/MAD9022/FinalApp/server/get.php?dev=' + deviceId + '&img_id='+photoId,
//			'http://faculty.edumedia.ca/griffis/mad9022/final-w15/get.php?dev=' + deviceId + '&img_id='+photoId,
			serverJS.getLargeImageCalBack,
			null
		);
		
	},
	/* Call back functions */
	uploadCalBack: function (data) {

//		var data1 = JSON.stringify(data);
		console.log(data['responseText']);
		alert("Added Successfully");
	},
	getListCalBack: function (data) {

		var response = JSON.parse(data["response"]);
		galleryJS.displayGrid(response.thumnbails);
		
//		alert("get list Successfully");
	},
	deleteCalBack: function (data) {

		var response = JSON.parse(data["response"]);
		
		if(response.message == "Successfully deleted image.")
		{
			console.log(response.message);
			galleryJS.removeItemFromList();
			
		}else{
			alert("Error while deleting");
		}
	},
	getLargeImageCalBack: function (data) {

		var data = JSON.parse(data["response"]);
		console.log(data);
//		alert("large Successfully");
		
		galleryJS.showFullImage(data.data);
	},

	// AJAX request

	createAJAXObj: function () {
		'use strict';
		try {
			return new XMLHttpRequest();
		} catch (er1) {
			try {
				return new ActiveXObject("Msxml3.XMLHTTP");
			} catch (er2) {
				try {
					return new ActiveXObject("Msxml2.XMLHTTP.6.0");
				} catch (er3) {
					try {
						return new ActiveXObject("Msxml2.XMLHTTP.3.0");
					} catch (er4) {
						try {
							return new ActiveXObject("Msxml2.XMLHTTP");
						} catch (er5) {
							try {
								return new ActiveXObject("Microsoft.XMLHTTP");
							} catch (er6) {
								return false;
							}
						}
					}
				}
			}
		}
	},

	sendRequest: function (url, callback, postData) {
		'use strict';
		var req = serverJS.createAJAXObj(),
			method = (postData) ? "POST" : "GET";
		if (!req) {
			return;
		}
		req.open(method, url, true);
		//req.setRequestHeader('User-Agent', 'XMLHTTP/1.0');
		if (postData) {
			req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		}
		req.onreadystatechange = function () {
			if (req.readyState !== 4) {
				return;
			}
			if (req.status !== 200 && req.status !== 304) {
				return;
			}
			callback(req);
		}
		req.send(postData);
	}
}