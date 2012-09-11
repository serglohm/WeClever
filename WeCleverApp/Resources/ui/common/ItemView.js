function ItemView(_params) {
	var settings = _params.settings;
	var self = Ti.UI.createView({
		backgroundImage: settings.itemBackgroundImage
	});
	var engine = _params.engine;
	var mdb = _params.mdb;
	var itemID = _params.itemID;
	var itemData = {};

    var scrollView = Ti.UI.createScrollView({
      left: 0, top: 0, right: 0, bottom: 0,
      contentWidth: 'auto',
      contentHeight: 'auto',
      showVerticalScrollIndicator: true,
      showHorizontalScrollIndicator: true,
    });
  
    scrollView.visible = false;
    self.add(scrollView);
    
    var view = Ti.UI.createView({
      left: '5dp', top: '0dp', right: '5dp', bottom: '0dp',
      height: Ti.UI.SIZE,
      width: 'auto',
      layout: 'vertical'
    });
    view.backgroundColor = '#7fc14c';
    view.borderRadius = '5dp';
    scrollView.add(view);

	var titleLabel = Ti.UI.createLabel({
		text: '',	
		top: '10dp', 
		left: '10dp', right: '10dp',
		font: {fontSize: '15dp', fontWeight: 'bold', fontFamily: 'Arial'},
		color: '#fff'		
	});
	titleLabel.shadowColor = '#333';
	titleLabel.shadowOffset = {x: 0, y: -1};
	view.add(titleLabel);

	var ClickableScrollView = require('ui/common/ClickableScrollView');			
	var clickableScrollView = new ClickableScrollView({
		contentWidth: 320,
		contentHeight: 172,
		height: 172,
		top: '10dp',
		left: 0, right: 0,
		backgroundColor: 'transparent',	
		selectEventName: 'app:selectCampsType'
	});	
	//view.add(clickableScrollView);	

	var scrollImageView = Ti.UI.createScrollableView({
		views: [],
		pagingControlColor: 'transparent',
		showPagingControl: true,
		//clipViews: false,
		height: 172,
		top: 20, left: 0, right: 0
	});
	view.add(scrollImageView);

	var buttonsView = Ti.UI.createView({
		left: 0, top: 0, right: 0,
		backgroundColor: "#7fc14c",
		height: '60dp'
    });
	
	var cartButton = Ti.UI.createButton({	
		font: {fontSize: '20dp', fontFamily: 'Arial'},
		top: '10dp',
		right: '65dp', width: '164dp', height: '44dp',
		//backgroundColor : '',
		color: '#fff',
		title: ' Купить'
	});
	cartButton.textAlign = 'center';
	cartButton.backgroundLeftCap = 10;
	cartButton.backgroundTopCap = 4;
	cartButton.backgroundImage = '/iphone/buyBtn.png';
	cartButton.addEventListener('click', function(e){
		mdb.addItemToCart(itemID, itemData.act_name, itemData.act_images[0]);

		var cnt = mdb.getItemCountInCart(itemID);
		cartCountLabel.text = 'В корзине ' + cnt + ' шт.';
		if(cnt){cartCountLabel.show();} else {cartCountLabel.hide();}

		Ti.App.fireEvent('app:addItemToCart', {data: "0"});
	});

	var favouriteButton = Ti.UI.createButton({	
		font: {fontSize: '20dp', fontFamily: 'Arial'},
		top: '10dp',
		width: '50dp', right: '10dp', height: '44dp',
		backgroundImage : '/iphone/favBtn.png',
		color: '#555',
		title: ''
	});	
	favouriteButton.addEventListener('click', function(e){
		mdb.addItemToFavourites(itemID, itemData.act_name, itemData.cat_image);

		Ti.App.fireEvent('app:addItemToFavourites', {data: itemData.act_name});	
	});	
	
	var mapButton = Ti.UI.createButton({	
		font: {fontSize: '20dp', fontFamily: 'Arial'},
		top: '10dp',
		width: '50dp', left: '10dp', height: '44dp',
		backgroundImage : '/iphone/favBtn.png',
		color: '#555',
		title: ''
	});	
	mapButton.addEventListener('click', function(e){
		Ti.API.log("mapButton click");
		Ti.App.fireEvent('app:showMap', {data: itemData});	
	});	
	
	buttonsView.add(mapButton);
	buttonsView.add(cartButton);
	buttonsView.add(favouriteButton);
	
	
	view.add(buttonsView);	


	var priceLabel = Ti.UI.createLabel({	
		font: {fontSize: '20dp', fontFamily: 'Arial'},
		color: '#fff',
		left: '10dp', right: '10dp',
		text: ''
	});
	priceLabel.shadowColor = '#333';
	priceLabel.shadowOffset = {x: 0, y: -1};	
	view.add(priceLabel);




	var econLabel = Ti.UI.createLabel({	
		font: {fontSize: '15dp', fontFamily: 'Arial'},
		color: '#fff',
		left: '10dp', right: '10dp',
		text: ''
	});
	econLabel.shadowColor = '#333';
	econLabel.shadowOffset = {x: 0, y: -1};	
	view.add(econLabel);

	var econLabel = Ti.UI.createLabel({	
		font: {fontSize: '15dp', fontFamily: 'Arial'},
		color: '#fff',
		left: '10dp', right: '10dp',
		text: ''
	});
	econLabel.shadowColor = '#333';
	econLabel.shadowOffset = {x: 0, y: -1};	
	view.add(econLabel);

	var couponsBoughtLabel = Ti.UI.createLabel({	
		font: {fontSize: '15dp', fontFamily: 'Arial'},
		color: '#fff',
		left: '10dp', right: '10dp',
		text: ''
	});
	couponsBoughtLabel.shadowColor = '#333';
	couponsBoughtLabel.shadowOffset = {x: 0, y: -1};	
	view.add(couponsBoughtLabel);
 


	var annotaionLabel = Ti.UI.createLabel({	
		font: {fontSize: '14dp', fontFamily: 'Arial'},
		color: "#fff",
		left: '10dp', right: '10dp',
		height: 'auto',
		text: ''
	});
	annotaionLabel.shadowColor = '#000';
	annotaionLabel.shadowOffset = {x: 0, y: -1};	
	view.add(annotaionLabel);

	var cartCountLabel = Ti.UI.createLabel({	
		font: {fontSize: '15dp', fontFamily: 'Arial'},
		color: "#555",
		top: '10dp',
		left: '10dp', right: '10dp',
		text: 'В корзине ' + 0 + ' шт.'
	});
	view.add(cartCountLabel);

    var spaceView = Ti.UI.createView({
      right: 0, left: 0,
      height: '20dp',
      backgroundColor: '#fff'
    });
    view.add(spaceView);	
	
	self.setItemData = function(data){
		
		itemData = data[0];
		
		titleLabel.text = itemData.act_name;
		
		var t = itemData.conditions + " ";		

		Ti.API.log(JSON.stringify(itemData));
			
		var f = 0;
		var newstring = t.replace(/\n/g, "");
		Ti.API.log("newstring \n: " + newstring.indexOf("\n"));
		newstring = newstring.replace(/&nbsp;/g, " ");
		
		
		Ti.API.log(newstring);
		newstring = newstring.replace(/<([^>]+)>/g, function($0, $1) { 
			var r = '';
			if($1 == "ul"){f++;} 
			else if($1 == "/ul"){f = f - 1; if(f == 0){r = '\n';}}
			else if($1 == "/li"){}	
			else if($1 == "li"){if(f == 1){r = '\n ∙ ';} else if(f == 2){r = '\n  - ';}}
			else if($1.indexOf("/h") == 0){r = '\n';}
			else if($1.indexOf("h") == 0){r = '\n';}
			else if($1.indexOf("/p") == 0){r = '';}	
			return r;
		});
		annotaionLabel.text = newstring;
		Ti.API.log(newstring);
		
		var cnt = mdb.getItemCountInCart(itemID);
		cartCountLabel.text = 'В корзине ' + cnt + ' шт.';
		if(cnt){cartCountLabel.show();} else {cartCountLabel.hide();}
		 
		cartButton.title = 'В корзину';
		priceLabel.text = itemData.packet[0].discountprice + ' руб.';
		econLabel.text = '  Скидка: ' + itemData.packet[0].discount + '% Старая цена: ' + itemData.packet[0].pricecoupon + ' руб.  Экономия: ' + itemData.packet[0].econ + ' руб.';
		couponsBoughtLabel.text = (parseInt(itemData.packet[0].discountprice) > 0? 'Уже купили: ': 'Уже получили: ') + itemData.coupons_bought;
		var image_path = itemData.act_images[0];
		var images_arr = [];
		
		for(var i = 0; i < itemData.act_images.length; i++){
			images_arr.push({img: itemData.act_images[i].replace("300x162.jpg", "353x190.jpg"), width: 320, height: 172});
			var iv1 = Ti.UI.createImageView({image: itemData.act_images[i].replace("300x162.jpg", "353x190.jpg"), width: 320, height: 172});
			scrollImageView.addView(iv1);
			console.log(itemData.act_images[i].replace("300x162.jpg", "353x190.jpg"));
		}
		clickableScrollView.addImages({data: images_arr});
		view.height = Ti.UI.FILL;
		view.height = Ti.UI.SIZE;
	};


	self.itemCallback = function(data){
		self.setItemData(data);
		scrollView.show();
		actInd.hide();
	}	

	var actInd = Titanium.UI.createActivityIndicator({
		top: 10, 
		height: 50,
		width: 150
	});
	actInd.color = "#fff";
	if (Ti.UI.iPhone) {
		actInd.style = Titanium.UI.iPhone.ActivityIndicatorStyle.BIG;
	}
	actInd.show();
	actInd.message = 'Загрузка...';
	self.add(actInd);	
	
	engine.getData("/iphone_app/AppDataActions/" + itemID + '/', self.itemCallback);
	
	return self;
};

module.exports = ItemView;
