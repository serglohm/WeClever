function CategoryView(_params) {
	var settings = _params.settings;
	var self = Ti.UI.createView({
		backgroundImage: settings.categoryBackgroundImage
	});
	var engine = _params.engine;
	var categoryID = _params.categoryID;
	var categoryData = {};

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
		
		if(e.source.categoryID == -1){
	
		} else { 
			Ti.App.fireEvent('app:selectCategory', {data: [e.source.categoryID, categoryData[e.source.categoryID]]});
		}
	});	
	
	self.addDescRowToTable = function(_rowdata, _data){
		var newRow = Ti.UI.createTableViewRow({
				categoryID: _rowdata.cat_id,
				className: 'categoryRowDesc',
				height: '105dp',
		});
		newRow.backgroundColor = 'transparent';
		newRow.selectedBackgroundColor = '#fff';

		var bckView = Ti.UI.createView({left: 5, right: 5, top: '5dp',
				height: '100dp',
				categoryID: _rowdata.cat_id,
				borderRadius: '5dp',
				backgroundColor: '#7fc14c'
			});
		
		//bckView.backgroundImage = '/iphone/itemBg.png';
		bckView.selectedBackgroundColor = '#fff';
		bckView.backgroundSelectedColor = '#0f0';	
		bckView.backgroundFocusedColor = '#f00';
		
		var shadowColor = '#333';
		var shadowOffset = {x: 0, y: -1};
	
		var imageBgView = Ti.UI.createView({
			left: '0dp', top: '0dp', height: '100dp', width: '180dp',
			backgroundColor: '#fff',
			borderRadius: 0,
			categoryID: _rowdata.cat_id
		});
		
		var imageView = Ti.UI.createImageView({	
			center: '45dp', width: '190dp',
			image: _rowdata.cat_image,			
			categoryID: _rowdata.cat_id
		});

		imageBgView.add(imageView);
		bckView.add(imageBgView);
		
		newRow.add(bckView);	
	
		var labelsView = Ti.UI.createView({
			width: '120dp',
			right: 0, //backgroundColor: '#fff',
			categoryID: _rowdata.cat_id,
			center: {x: '245dp', y: '50dp'},
			layout: 'vertical',
			height: Ti.UI.SIZE
		});
	
		var titleLabel = Ti.UI.createLabel({
			text: _rowdata.cat_name,
			categoryID: _rowdata.cat_id,	
			textAlign: 'center',
			font: {fontSize: '13dp', fontWeight: 'bold', fontFamily: 'Arial'},
			shadowColor: shadowColor,
			shadowOffset: shadowOffset,
			color: "#fff"				
		});
		labelsView.add(titleLabel);
				
		var numberLabel = Ti.UI.createLabel({
			text: _rowdata.number,
			categoryID: _rowdata.cat_id,	
			textAlign: 'center',
			font: {fontSize: '35dp', fontWeight: 'bold', fontFamily: 'Arial'},
			shadowColor: shadowColor,
			shadowOffset: shadowOffset,
			color: "#fff"	
		});
		labelsView.add(numberLabel);	
	
		var actionLabel = Ti.UI.createLabel({
			text: (_rowdata.number % 10 > 4 || (_rowdata.number > 9 && _rowdata.number < 21) ? "акций": (_rowdata.number % 10 == 1 ? "акция": "акции")),
			categoryID: _rowdata.cat_id,	
			textAlign: 'center',		
			font: {fontSize: '15dp', fontWeight: 'bold', fontFamily: 'Arial'},
			color: "#fff",
			shadowColor: shadowColor,
			shadowOffset: shadowOffset
			
		});
		labelsView.add(actionLabel);	
		
		bckView.add(labelsView);	
			
		_data.push(newRow);
		categoryData[_rowdata.cat_id + ""] = _rowdata;
	};	

	self.addRowToTable = function(_rowdata, _data){
		var newRow = Ti.UI.createTableViewRow({
				categoryID: _rowdata.cat_id,
				className: 'categoryRowTitle',
				height: '50dp'
		});
		newRow.backgroundColor = 'transparent';
		newRow.selectedBackgroundColor = '#fff';

		Ti.API.log(JSON.stringify(_rowdata));

		var bckView = Ti.UI.createView({left: 5, bottom: 5, right: 5,
				borderRadius: 5,
				categoryID: _rowdata.cat_id,
				backgroundColor: '#fff'
			});		
	
		var titleLabel = Ti.UI.createLabel({
			text: _rowdata.cat_name,
			categoryID: _rowdata.cat_id,			
			top: '10dp', left: '10dp', right: '10dp', bottom: '10dp',
			font: {fontSize: '15dp', fontWeight: 'bold', fontFamily: 'Arial'},
			color: "#333"			
		});
		bckView.add(titleLabel);
		newRow.add(bckView);

		_data.push(newRow);
		categoryData[_rowdata.cat_id + ""] = _rowdata;
	};

	self.clearTable = function(){
		tableData = [];
		table.setData([]);		
	};

	self.categoryCallback = function(data){
		self.clearTable();
		var tempData = []
		for(var i = 0; i < data.length; i++){
			if(data[i].description == ''){
				self.addRowToTable(data[i], tempData);
			} else {
				self.addDescRowToTable(data[i], tempData);	
			}
			
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
	
	engine.getData("/iphone_app/AppDataCategories/" + categoryID + '/', self.categoryCallback);
	
	return self;
};

module.exports = CategoryView;
