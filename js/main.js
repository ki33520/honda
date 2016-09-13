"use strict";
var globel = {
	bodySwiper: new Swiper('.swiper-container', {
		pagination: '.swiper-pagination',
		paginationClickable: true,
		direction: 'vertical'
	}),
	domLoading: function(argument) {
		var self = this,
			manifest = [];
		$("img").each(function(){
			manifest.push($(this).data('src'));	
		});
		var loadingMod = function(){
			this.html = $('<div class="loading" id="loading"><div class="loading_bar" id="loading_bar"></div><div class="loading_inner"></div></div>');
		};
		loadingMod.prototype = {
			show: function(){
				this.html.appendTo('body');
			},
			hide: function(){
				this.html.remove();
				self.startShow();
			}
		};
		var loading_mod = new loadingMod();
		var handleProgress = function(e) {
			loading_mod.show();
			$('.loading_bar').width(e.loaded*100+'%');
		}
		var handleComplete = function(e) {
			$('.loading_bar').width('100%');
			console.log(e)
			loading_mod.hide();
		}
		if(manifest.length>0){
			var preload = new createjs.LoadQueue(false);
			preload.on("progress", handleProgress, this);
			preload.on("complete", handleComplete, this);
			preload.loadManifest(manifest);
		}else{
			handleComplete();
		};
	},
	startShow: function(argument) {
		this.aniFunc('.page1');
		$('.page-container').show();
		$('.scroll-container').each(function(){
			$(this).swiper({
				direction: 'vertical',
				scrollContainer: true,
				mousewheelControl: true,
				hide:false,
				scrollbar: {
					container: $(this).find('.swiper-scrollbar')[0]
				},
			});
		});
	},
	aniFunc: function(page) {
		$(page).addClass('show').find('.animate').each(function() {
			$(this).show().addClass($(this).attr('data-animate') + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
					$(this).removeClass($(this).attr('data-animate') + ' animated');
			});
		});
	}
};

globel.domLoading()