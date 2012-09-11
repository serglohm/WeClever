function MEngine(){
	this.cmds = '';
	return this;
}

MEngine.prototype.getUrlStart = function(){    
	return "http://www.weclever.ru";
};

MEngine.prototype.getData = function(uri, callback, errorcallback){
	return this.getUrlData(this.getUrlStart() + uri, callback, errorcallback);
};
	
MEngine.prototype.getUrlData = function(url, callback, errorcallback){     
    var xhr = Titanium.Network.createHTTPClient();    
    xhr.onerror = function(e){
    	if(errorcallback){
    		errorcallback(e);
    	}
    	Ti.API.log('onerror: ' + JSON.stringify(e));
   	};
     
    var cmdUrl = url;
    
    Ti.API.log("cmdUrl: " + cmdUrl); 
     
    xhr.open("GET", cmdUrl);         
    xhr.onload = function(){
        if(this.status == '200'){
            if(this.readyState == 4){
                var response = JSON.parse(this.responseText);
                callback(response);
            }            
        }                      
    };                  
    xhr.send();
};

MEngine.prototype.postRawData = function(uri, params, callback, errorcallback){           
    var xhr = Titanium.Network.createHTTPClient();    
    xhr.onerror = function(e){
    	if(errorcallback){
    		errorcallback(e);
    	}
		Ti.API.log('error: ' + JSON.stringify(e));
    	Ti.API.log(cmdUrl);
		Ti.API.log(params);
   	};
     
    var cmdUrl = this.getUrlStart() + uri; 
     
    xhr.open("POST", cmdUrl);         
    xhr.onload = function(){
        if(this.status == '200'){
            if(this.readyState == 4){
                var response = JSON.parse(this.responseText);
                callback(response);
            }            
        }                      
    };                  
    xhr.send(params);
};


MEngine.prototype.postData = function(uri, params, callback, errorcallback){        
    this.postRawData(uri, JSON.stringify(params), callback, errorcallback);
};

//-----------------------------------------------------

MEngine.prototype.loadAllActionsToDb = function(params){
	var mdb = params.mdb;
	
	Ti.API.log("loadAllActionsToDb");
	
	var insert_orders_sql = "INSERT INTO actions (act_id, act_name, act_image, coupons_max, coupons_bought, date_sell_start, date_sell_end) values (?, ?, ?, ?, ?, ?, ?)"; 												
    var insert_packets_sql = "INSERT INTO packets (packet_id, act_id, plat, plong, coupons_max, coupons_sold, discountprice, discount, econ, pricecoupon) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"; 
	
	mdb.db.execute("DELETE FROM actions"); 
	mdb.db.execute("DELETE FROM packets"); 
	
	var loadAllUrl = 'http://www.weclever.ru/iphone_app/AppDataActionsPages2/0/1000/0/1';
	Titanium.App.fireEvent('app:showAlert', {data: "Загрузка акций..."});
	this.getUrlData(loadAllUrl, function(data){
		try{
			mdb.open();
			for(var i = 0; i < data.length; i++){
				mdb.db.execute(insert_orders_sql, [
					data[i].act_id, 
					data[i].act_name, 
					data[i].act_image, 
					data[i].coupons_max, 
					data[i].coupons_bought, 
					data[i].date_sell_start, 
					data[i].date_sell_end
				]);
				
				var packets = data[i].packet;
				for(var j = 0; j < packets.length; j++){
					var plat = 0; 
					var plong = 0;
					if(packets[j].coords && packets[j].coords != ""){
						var coords_str = packets[j].coords;
						var coords = coords_str.split(',');
						plat = coords[1]; 
						plong  = coords[0];	
					}
					mdb.db.execute(insert_packets_sql, [
						packets[j].packet_id, 
						data[i].act_id, 
						plat, 
						plong, 
						packets[j].coupons_max,
						packets[j].coupons_sold, 
						packets[j].discountprice, 
						packets[j].discount, 
						packets[j].econ, 
						packets[j].pricecoupon
					]);
				}
			}
			mdb.db.close();	
			var allActionsModel = mdb.getAllActions();
			Ti.API.log("allActionsModel.length: " + allActionsModel.length);
			Ti.API.log(JSON.stringify(allActionsModel));
			Titanium.App.fireEvent('app:showAlert', {data: "Загружено акций: " + allActionsModel.length + "..."});
			
		} catch(e){
			Ti.API.log("ERROR: " + JSON.stringify(e));
		}
	});
};

module.exports = MEngine; 
 