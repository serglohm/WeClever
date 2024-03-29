function TabApplicationWindow(_params){
	
	var MasterView = require('ui/common/MasterView'),
		CategoryView = require('ui/common/CategoryView'),
		CartView = require('ui/common/CartView'),
		FavouritesView = require('ui/common/FavouritesView'),
		HistoryView = require('ui/common/HistoryView'),
		HistoryItemsView = require('ui/common/HistoryItemsView'),
		OrderView = require('ui/common/OrderView'),
		ItemsView = require('ui/common/ItemsView'),
		ItemView = require('ui/common/ItemView'),
		ActionMapView = require('ui/common/ActionMapView');
			
	var engine = _params.engine;	
	var mdb = _params.mdb;
	var settings = _params.settings;
	
	var self = Titanium.UI.createTabGroup({
			id:'tabGroup1',
			barColor: '#B5CDF8'
		});
	
	self.createWindow = function(_params){
		var w = Ti.UI.createWindow({
			barColor: '#555',
			barImage: '/iphone/navBg.png'
		});
		for(var i in _params){
			w[i] = _params[i];
		}
		return w;
	};

	var masterView = new MasterView({settings: settings}),
		categoryView = new CategoryView({engine: _params.engine, categoryID: 0, settings: settings});
		
	var masterContainerWindow = self.createWindow({
		title: settings.mainWindowTitle
	});
	masterContainerWindow.add(masterView);
	
	var categoryContainerWindow = self.createWindow({
		title: 'Product Details'
	});
	categoryContainerWindow.add(categoryView);


	masterView.addEventListener('itemSelected', function(e) {
		if(e.data == 'cart'){
			self.setActiveTab(1);
			
		} else if(e.data == 'favourites') {
			var tempView;
			tempView = new FavouritesView({engine: engine, mdb: mdb, settings: settings});		
	
			var tempWindow = self.createWindow({
				title: e.name
			});	
			var tempContainerView = Ti.UI.createView({layout: "vertical"});
			tempContainerView.add(tempView);
			tempWindow.add(tempContainerView);
			
			Titanium.UI.currentTab.open(tempWindow,{animated:true});
		
		} else {
			categoryContainerWindow.title = e.name;
			tab1.open(categoryContainerWindow, {animated:true});
		}
	});	

	var tab1 = Titanium.UI.createTab({
		icon:'/images/tabs/KS_nav_cat.png',
		id:'tab1',
		titleid: 'Акции',
		window: masterContainerWindow
	});
	var cartView = new CartView({engine: engine, mdb: mdb, settings: settings});	
	
	var cartWindow = self.createWindow({
		title: 'Корзина'
	});	
	
	var cartContainerView = Ti.UI.createView({layout: "vertical"});
	cartContainerView.add(cartView);
	cartWindow.add(cartContainerView);

	var cartTab = Titanium.UI.createTab({
		icon: '/images/tabs/KS_nav_cart.png',
		titleid: 'Корзина',
		window: cartWindow
	});

	engine.loadAllActionsToDb({mdb: mdb});

	var cartCnt = mdb.cartItemsCount();
	if (cartCnt > 0){
		cartTab.badge = cartCnt;		
	} else {
		cartTab.badge = null;		
	}	
	
	self.addTab(tab1);
	self.addTab(cartTab);


	var favouritesView = new FavouritesView({engine: engine, mdb: mdb, settings: settings});		
	var favouritesWindow = self.createWindow({
		title: 'Избранное'
	});	
	var favouritesContainerView = Ti.UI.createView({layout: "vertical"});
	favouritesContainerView.add(favouritesView);
	favouritesWindow.add(favouritesContainerView);	
	var favouritesTab = Titanium.UI.createTab({
		icon: '/images/tabs/KS_nav_fav.png',
		titleid: 'Избранное',
		window: favouritesWindow
	});
	self.addTab(favouritesTab);	


	var historyView = new HistoryView({engine: engine, mdb: mdb, settings: settings});		
	var historyWindow = self.createWindow({
		title: 'Купоны'
	});	
	var historyContainerView = Ti.UI.createView({layout: "vertical"});
	historyContainerView.add(historyView);
	historyWindow.add(historyContainerView);	
	var historyTab = Titanium.UI.createTab({
		icon: '/images/tabs/KS_fav_orders.png',
		titleid: 'Купоны',
		window: historyWindow
	});
	self.addTab(historyTab);	

	self.addEventListener('open',function(){
		Titanium.UI.setBackgroundColor('#fff');
	});

	self.setActiveTab(1);	

	Ti.App.addEventListener('app:addItemToFavourites', function(e){
		favouritesView.updateFavouritesItems();
		Titanium.App.fireEvent('app:showAlert', {data: "" + e.data + " добавленно в избранное..."});
	});

	Ti.App.addEventListener('app:addItemToCart', function(e){
		cartView.updateCartItems();
		var cartCnt = mdb.cartItemsCount();
		if (cartCnt > 0){
			cartTab.badge = cartCnt;		
		} else {
			cartTab.badge = null;		
		}
	});

	Ti.App.addEventListener('app:cartBadge', function(e){
		var cartCnt = e.data;
		if (cartCnt > 0){
			cartTab.badge = cartCnt;		
		} else {
			cartTab.badge = null;		
		}
	});

	Ti.App.addEventListener('app:selectItem', function(e) {
		var tempView = new ItemView({engine: engine, mdb: mdb, itemID: e.data[0], settings: settings});			
		var tempWindow = self.createWindow({
			//title: e.data[1].act_name
		});	
		var tempContainerView = Ti.UI.createView({layout: "vertical"});
		tempContainerView.add(tempView);
		tempWindow.add(tempContainerView);
		tab1.open(tempWindow, {animated:true});		
	});
	
	Ti.App.addEventListener('app:showMap', function(e) {
		Ti.API.log("app:showMap");
		var tempView = new ActionMapView({engine: engine, mdb: mdb, settings: settings, item: e.data});			
		var tempWindow = self.createWindow({
			title: "Карта"
		});	
		var tempContainerView = Ti.UI.createView({layout: "vertical"});
		tempContainerView.add(tempView);
		tempWindow.add(tempContainerView);
		tab1.open(tempWindow, {animated:true});		
	});
	
	Ti.App.addEventListener('app:selectCategory', function(e) {
		var tempView;
		var temp_data = e.data[1];
		
		Ti.API.log('temp_data: ' + temp_data);
		
		if(temp_data.has_child == '1'){
			tempView = new CategoryView({engine: engine, categoryID: e.data[0], settings: settings});
		} else {
			tempView = new ItemsView({engine: engine, categoryID: e.data[0], settings: settings});
		}
	
		var tempWindow = self.createWindow({
			title: e.data[1].cat_name
		});	
		var tempContainerView = Ti.UI.createView({layout: "vertical"});
		tempContainerView.add(tempView);
		tempWindow.add(tempContainerView);

		tab1.open(tempWindow, {animated:true});			
	});	
	
	Ti.App.addEventListener('app:makeOrder', function(e) {
		var tempView = new OrderView({engine: engine, mdb: mdb, settings: settings});

		var tempWindow = self.createWindow({
			title: 'Заказ'
		});	
		var tempContainerView = Ti.UI.createView({layout: "vertical"});
		tempContainerView.add(tempView);
		tempWindow.add(tempContainerView);

		cartTab.open(tempWindow, {animated:true});			
		
	});
	
	Ti.App.addEventListener('app:completeOrder', function(e){
		var order_id = mdb.orderCart(e.data);
		historyView.updateHistory();
	});

	Ti.App.addEventListener('app:selectOrder', function(e){		
		var tempView = new HistoryItemsView({engine: engine, mdb: mdb, orderID: e.data[0], settings: settings});			
		var tempWindow = self.createWindow({
			title: 'Заказ №' + e.data[0]
		});	
		var tempContainerView = Ti.UI.createView({layout: "vertical"});
		tempContainerView.add(tempView);
		tempWindow.add(tempContainerView);

		historyTab.open(tempWindow, {animated: true});

	});
	
	Ti.App.addEventListener('app:selectAdvItem', function(e) {
		var tempView = new ItemView({engine: engine, mdb: mdb, itemID: e.data[0], settings: settings});			
		var tempWindow = self.createWindow({
			title: e.data[1].act_name
		});	
		var tempContainerView = Ti.UI.createView({layout: "vertical"});
		tempContainerView.add(tempView);
		tempWindow.add(tempContainerView);

		if(e.data[2] == 'cart'){
			cartTab.open(tempWindow, {animated:true});	
		} else if(e.data[2] == 'favourites'){
			favouritesTab.open(tempWindow, {animated: true});
		} else if(e.data[2] == 'history'){
			historyTab.open(tempWindow, {animated: true});
		}
	});	
	
	//---------------------------------------------------------------
	
	var alertWin = Titanium.UI.createWindow({
		height: 100,
		width: 280,
		bottom: 110,
		borderRadius: 10
	});
	
	var alertView = Titanium.UI.createView({
		backgroundColor:'#000',
		opacity: 0.8,
		height: 100,
		width: 280,
		borderRadius: 10
	});
	
	var alertLabel = Titanium.UI.createLabel({
		color: '#fff',
		font: {fontSize: 13},
		textAlign: 'center',
		left: '10dp', right: '10dp', top: '10dp', botom: '10dp'
	});
	alertLabel.verticalAlign = Ti.UI.TEXT_VERTICAL_ALIGNMENT_CENTER;
	alertWin.add(alertView);
	alertWin.add(alertLabel);
	
	//Titanium.App.fireEvent('app:showAlert',{data: ""});
	
	Titanium.App.addEventListener('app:showAlert', function(e)
	{
		alertLabel.text = e.data;
		alertWin.open();
		setTimeout(function()
		{
			alertWin.close({opacity: 0, duration: 500});
		}, 2000);
	});		
	
	return self; 
};

module.exports = TabApplicationWindow;