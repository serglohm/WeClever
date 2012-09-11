function ClickableScrollView(params) {
	var self = Titanium.UI.createScrollView(params);
	
	self.scrollType = 'horizontal';
	self.isScrolled = false;
	self.selectEventName = params.selectEventName;
	
	self.addEventListener('scroll', function(e){
		self.isScrolled = true;
	});
	self.selectedIndex = 0;
	
	
	self.addImages = function(params){
		var contentWidth = 0;
		self.data = params.data;
		for (var i = 0; i < self.data.length; i++){
			
			if(self.data[i].selected){
				self.selectedIndex = i;
			}
			var view = Ti.UI.createView({
				top: 0,
				width: self.data[i].width, height: self.data[i].height,
				left: contentWidth,
				backgroundColor: 'transparent',
				dataIndex: i
			});
			self.add(view);	
			
			contentWidth += self.data[i].width;
			
			var img = Ti.UI.createImageView({
				image: self.data[i].img,
				width: self.data[i].width, height: self.data[i].height,
				bottom: '0dp', top: '0dp',
				dataIndex: i
			});
			view.add(img);
			
			view.addEventListener('touchstart', function(e){
				self.isScrolled = false;
			});
			
			view.addEventListener('touchend', function(e){
				if(self.isScrolled == false){
					self.children[self.selectedIndex].backgroundColor = '#eee';
					self.children[e.source.dataIndex].backgroundColor = '#fff';		
					self.selectedIndex = e.source.dataIndex;
					self.scrollTo(e.source.dataIndex * 320, 0);
				}
			});	
		}
		self.contentWidth = contentWidth;
		self.scrollTo(30, 0);
		//self.children[self.selectedIndex].backgroundColor = '#fff';		
	};
	
	return self;
	
};		
	

module.exports = ClickableScrollView;