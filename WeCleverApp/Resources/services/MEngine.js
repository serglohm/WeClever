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

module.exports = MEngine; 
 