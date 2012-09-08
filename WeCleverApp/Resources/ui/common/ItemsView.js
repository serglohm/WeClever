function ItemsView(_params) {
	var settings = _params.settings;
	var self = Ti.UI.createView({
		backgroundImage: settings.itemsBackgroundImage
	});
	var engine = _params.engine;
	var categoryID = _params.categoryID;
	var itemsData = {};

	var tableData = [];
	
	self.addEventListener('itemSelected', function(e) {
		//lbl.text = e.name + ': ' + e.data;
	});
	
	var table = Ti.UI.createTableView({
		top: '0dp',
		bottom: '0dp',
		data: tableData
	});
	table.backgroundColor = 'transparent';
	table.separatorStyle = Ti.UI.iPhone.TableViewSeparatorStyle.NONE;
	table.separatorColor = 'transparent';
	self.add(table);
	
	table.addEventListener('click', function(e) {
		
		if(e.source.itemID == -1){
	
		} else { 
			Ti.App.fireEvent('app:selectItem', {data: [e.source.itemID, itemsData[e.source.itemID]]});
		}
	});	
	
	self.addRowToTable = function(_rowdata, _data){
		var newRow = Ti.UI.createTableViewRow({
				itemID: _rowdata.act_id,
				className: 'itemRowDp',
				height: '175dp'
		});
		newRow.backgroundColor = 'transparent';
		newRow.selectedBackgroundColor = '#fff';
	
		var bckView = Ti.UI.createView({left: '5dp', top: '0dp', right: '5dp', bottom: '5dp',
			backgroundColor: '#7fc14c',
			itemID: _rowdata.act_id,
			borderRadius: '5dp'
			//backgroundImage: '/iphone/item2Bg.png'
		});
		bckView.backgroundFocusedColor = '#fff';
		bckView.backgroundSelectedColor = '#fff';	
			
		var shadowColor = '#333';
		var shadowOffset = {x: 0, y: -1};	
			
		var titleLabel = Ti.UI.createLabel({
			text: _rowdata.act_name,
			itemID: _rowdata.act_id,			
			width: '300dp', height: '60dp', center: {x: '155dp', y: '35dp'},
			font: {fontSize: '13dp', fontWeight: 'bold', fontFamily: 'Arial'},
			color: "#fff",
			shadowColor: shadowColor,
			shadowOffset: shadowOffset
		});
		bckView.add(titleLabel);
		/*
		var annotationLabel = Ti.UI.createLabel({	
			font: {fontSize: '15dp', fontFamily: 'Arial'},
			color: "#555",
			top: '40dp', left: '90dp', right: '10dp', bottom: '10dp',
			text: _rowdata.annotation,
			itemID: _rowdata.iid
		});
		newRow.add(annotationLabel);
		*/
		
		var imageBgView = Ti.UI.createView({
			left: '0dp', bottom: '0dp',
			width: '180dp', height: '100dp',
			itemID: _rowdata.act_id,			
		});
		var img = Ti.UI.createImageView({
			left: '0dp', top: '0dp',
			width: '185dp',
			itemID: _rowdata.act_id,
			image: _rowdata.act_image
		});
		img.defaultImage = '/iphone/applelogo.png';
		imageBgView.add(img);
		bckView.add(imageBgView);
		
		var labelView = Ti.UI.createView({
			width: '140dp', height: Ti.UI.SIZE,
			center: {x: '245dp', y: '120dp'},
			layout: 'vertical'
		});
		
		var discountLabel = Ti.UI.createLabel({
			itemID: _rowdata.act_id,
			text: 'Скидка: ' + _rowdata.packet[0].discount + '%',
			color: "#fff", font: {fontWeight: 'bold', fontSize: '15dp', fontFamily: 'Arial'},
			shadowColor: shadowColor,
			shadowOffset: shadowOffset			
		});
		labelView.add(discountLabel);
		var descPriceLabel = Ti.UI.createLabel({
			itemID: _rowdata.act_id,
			text: 'Цена: ' + _rowdata.packet[0].discountprice + ' руб.',
			color: "#fff", font: {fontWeight: 'bold', fontSize: '15dp', fontFamily: 'Arial'},
			shadowColor: shadowColor,
			shadowOffset: shadowOffset			
		});
		labelView.add(descPriceLabel);
		var couponsSoldLabel = Ti.UI.createLabel({
			itemID: _rowdata.act_id,
			text: 'Продано: ' + _rowdata.packet[0].coupons_sold,
			color: "#fff", font: {fontWeight: 'bold', fontSize: '15dp', fontFamily: 'Arial'},
			shadowColor: shadowColor,
			shadowOffset: shadowOffset			
		});
		labelView.add(couponsSoldLabel);
		
		
		
		bckView.add(labelView);
		newRow.add(bckView);
		
		_data.push(newRow);
		itemsData[_rowdata.act_id + ""] = _rowdata;
	};	

	self.clearTable = function(){
		tableData = [];
		table.setData([]);		
	};

	self.categoryCallback = function(data){
		self.clearTable();
		var tempData = []
		for(var i = 0; i < data.length; i++){
			self.addRowToTable(data[i], tempData);
		}
		table.setData(tempData);
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
	
	engine.getData("/iphone_app/AppDataActionsPages2/" + categoryID + "/1000/0/1", self.categoryCallback);
	
	
	
	return self;
};

module.exports = ItemsView;
