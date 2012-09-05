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
      left: '5dp', top: '5dp', right: '5dp', bottom: '5dp',
      height: Ti.UI.SIZE,
      width: 'auto',
      layout: 'vertical'
    });
    view.backgroundColor = 'transparent';
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

	var imgView = Ti.UI.createImageView({
		top: '10dp', left: '0dp', right: '0dp'
	});	
	imgView.defaultImage = '/iphone/applelogo.png';
	view.add(imgView);

	var priceLabel = Ti.UI.createLabel({	
		font: {fontSize: '20dp', fontFamily: 'Arial'},
		color: '#555',
		left: '10dp', right: '10dp',
		text: ''
	});
	view.add(priceLabel);

	var annotaionLabel = Ti.UI.createWebView({	
		font: {fontSize: '15dp', fontFamily: 'Arial'},
		color: "#555",
		left: '10dp', right: '10dp',
		height: 200,
		text: ''
	});
	
	view.add(annotaionLabel);

	var cartCountLabel = Ti.UI.createLabel({	
		font: {fontSize: '15dp', fontFamily: 'Arial'},
		color: "#555",
		top: '10dp',
		left: '10dp', right: '10dp',
		text: 'В корзине ' + 0 + ' шт.'
	});
	view.add(cartCountLabel);
	
	var buttonsView = Ti.UI.createView({
      left: 0, top: 0,
      width: Ti.UI.SIZE,
      height: '50dp'
    });
	
	var cartButton = Ti.UI.createButton({	
		font: {fontSize: '20dp', fontFamily: 'Arial'},
		top: '0dp',
		left: '10dp', right: '70dp',
		//backgroundColor : '',
		color: '#555',
		title: 'Добавить в корзину'
	});
	cartButton.addEventListener('click', function(e){
		mdb.addItemToCart(itemID, itemData.act_name, itemData.act_image);

		var cnt = mdb.getItemCountInCart(itemID);
		cartCountLabel.text = 'В корзине ' + cnt + ' шт.';
		if(cnt){cartCountLabel.show();} else {cartCountLabel.hide();}

		Ti.App.fireEvent('app:addItemToCart', {data: "0"});
	});

	var favouriteButton = Ti.UI.createButton({	
		font: {fontSize: '20dp', fontFamily: 'Arial'},
		top: '0dp',
		width: '50dp', right: '10dp',
		//backgroundColor : '',
		color: '#555',
		title: 'F'
	});	
	favouriteButton.addEventListener('click', function(e){
		mdb.addItemToFavourites(itemID, itemData.act_name, itemData.cat_image);

		Ti.App.fireEvent('app:addItemToFavourites', {data: "0"});
		
	});	
	
	buttonsView.add(cartButton);
	buttonsView.add(favouriteButton);
	view.add(buttonsView);	

	var descriptionLabel = Ti.UI.createLabel({	
		font: {fontSize: '15dp', fontFamily: 'Arial'},
		color: "#555",
		top: '10dp',
		left: '10dp', right: '10dp',
		text: ''
	});
	view.add(descriptionLabel);

    var spaceView = Ti.UI.createView({
      right: 0, left: 0,
      height: '20dp',
      backgroundColor: '#fff'
    });
    view.add(spaceView);	
	
	self.setItemData = function(data){
		Ti.API.log(data[0]);
		itemData = data[0];
		annotaionLabel.html = '<div style="font-family: Arial; size: 12px;">' + itemData.conditions + "</div>";
		descriptionLabel.text = itemData.conditions;
		titleLabel.text = itemData.act_name;

		var cnt = mdb.getItemCountInCart(itemID);
		cartCountLabel.text = 'В корзине ' + cnt + ' шт.';
		if(cnt){cartCountLabel.show();} else {cartCountLabel.hide();}
		 
		cartButton.title = 'В корзину';
		priceLabel.text = 'Цена: ' + data.price + ' руб.';
		imgView.image = itemData.act_image;
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
