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
				height: Ti.UI.SIZE
		});
		newRow.backgroundColor = 'transparent';
		newRow.selectedBackgroundColor = '#fff';

		var bckView = Ti.UI.createView({left: 5, right: 5, bottom: 5,
				borderRadius: 5,
				layout: 'vertical',
				height: Ti.UI.SIZE,
				backgroundColor: '#fff'
			});
		
		bckView.selectedBackgroundColor = '#fff';
		bckView.backgroundSelectedColor = '#0f0';	
		bckView.backgroundFocusedColor = '#f00';
	
		var titleLabel = Ti.UI.createLabel({
			text: _rowdata.cat_name,
			categoryID: _rowdata.cat_id,			
			top: '10dp', left: '10dp', right: '10dp',
			font: {fontSize: '15dp', fontWeight: 'bold', fontFamily: 'Arial'},
			color: "#333"			
		});
		bckView.add(titleLabel);

		var imageView = Ti.UI.createImageView({	
			left: '10dp', right: '10dp', bottom: '10dp',
			image: _rowdata.cat_image,
			categoryID: _rowdata.cat_id
		});
		bckView.add(imageView);
		Ti.API.log(_rowdata);
		
		newRow.add(bckView);	
			
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
