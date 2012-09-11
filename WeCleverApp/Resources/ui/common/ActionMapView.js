function ActionMapView(_params){
	var self = Ti.UI.createView({
		
	});
	var item = _params.item;
	Ti.API.log('ActionMapView.item = ' + JSON.stringify(item));


	var annotation_arr = [];
	var coords;
	
	
 	for(var i = 0; i < item.packet.length; i++){
 		var p = item.packet[i];
 		
 		coords = item.packet[i].coords.split(',');
 		
 		var tempAnnotation = Ti.Map.createAnnotation({ 
	 		latitude: coords[1], 
	 		longitude: coords[0], 
	 		title: item.packet[i].service_name, 
	 		subtitle: item.packet[i].address, 
	 		pincolor: Ti.Map.ANNOTATION_RED, 
	 		animate: true, 
	 		//leftButton: '/iphone/favBtn.png', 
			image: '/iphone/favBtn.png',
			//rightButton: '/iphone/favBtn.png',
	
	 		myid: 1 
	 		// CUSTOM ATTRIBUTE THAT IS PASSED INTO EVENT OBJECTS 
	 	});
	 	annotation_arr.push(tempAnnotation);
 	}

	var titleLabel = Ti.UI.createLabel({
		top: 5, left: 5, right: 5,
		text: 'count: ' + item.packet.length
	});
	self.add(titleLabel);
	
	var mapview = Ti.Map.createView({ 
		top: 50,
		mapType: Ti.Map.STANDARD_TYPE, 
		region: {
	 		latitude: coords[1], 
	 		longitude: coords[0],  
			latitudeDelta: 0.01, 
			longitudeDelta: 0.01
		}, 
		animate: true, 
		regionFit: true, 
		userLocation: true, 
		annotations: annotation_arr });

	self.add(mapview); 
	
	var minusButton = Ti.UI.createButton({
		left: 10, top: 10, title: '-'
	});
	minusButton.addEventListener('click', function(e){
		mapview.zoom(-1);
	});
	self.add(minusButton);
	
	var plusButton = Ti.UI.createButton({
		right: 10, top: 10, title: '+'
	});
	plusButton.addEventListener('click', function(e){
		mapview.zoom(1);
	});
	self.add(plusButton);

	return self;	
};

module.exports = ActionMapView;