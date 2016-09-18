"use strict";

$.extend({
	testAct: function(str,reg){
		return(reg.test(str));
	},
	testBasic: function(str){
		var bl = str ? true : false;
		return(bl);
	},
	testMail: function(str){
		var myReg = /^[.-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
		return($.testAct(str,myReg));
	},
	testPass: function(str){
		var myReg = /^[a-z0-9_-]{3,18}$/;
		return($.testAct(str,myReg));
	},
	testNumber: function(str){
		var myReg = /^[0-9]/;
		return($.testAct(str,myReg));
	},
	testMobile: function(str){
		var myReg = /^(1(([35][0-9])|(47)|[8][0123456789]))\d{8}$/;
		return($.testAct(str,myReg));
	},
	QueryString: function(str){
		var sValue=location.search.match(new RegExp("[\?\&]"+str+"=([^\&]*)(\&?)","i"));
		return sValue?sValue[1]:sValue;
	}
});
var manifest = ["images/logo.png"];
$("img").each(function(){
	manifest.push($(this).attr('src'));
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
		window.pageInit();
	}
};
var loading_mod = new loadingMod();
var handleProgress = function(e) {
	loading_mod.show();
	var p = Math.round(e.progress * 100);
	$('.loading_page>li').each(function(index,item){
		if(p<(index+1)*25){
			$(item).show().siblings().hide();
			return false;
		};
	});
	$('.loading_bar').width(p+'%');
} //加载时回调
var handleComplete = function(e) {
	$('.loading_bar').width('100%');
	loading_mod.hide();
} //加载完毕回调
if(manifest.length>0){
	var preload = new createjs.LoadQueue(false);
	preload.on("progress", handleProgress, this);
	preload.on("complete", handleComplete, this);
	preload.loadManifest(manifest);
}else{
	handleComplete();
};

function aniFunc(page) {
	$(page).addClass('show').find('.animate').each(function() {
		$(this).show().addClass($(this).attr('data-animate') + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$(this).removeClass($(this).attr('data-animate') + ' animated');
		});
	});
}
$(function(){
	var pi = 0,
		myPageSwiper;

	if($.QueryString('page')){
		pi = Number($.QueryString('page'));
		pi = pi > $('.page-container .swiper-slide').length ? $('.page-container .swiper-slide').length-1 : pi -1;
	};

	window.pageInit = function(){
		aniFunc('.page'+(pi+1));
		$('.page-container').show();
		myPageSwiper = new Swiper('.swiper-main', {
			initialSlide: pi,
			loop: true,
			noSwiping: true,
			noSwipingClass : 'stop-swiping',
			slidesPerView: 1,
			loop: false,
			direction: 'vertical',
			onInit: function(e){
				if(pi == (e.slides.length-1)){
					$('.slide_btn').hide();
				}else{
					$('.slide_btn').show();
				};
			},
			onTransitionEnd: function(e) {
				if(e.activeIndex == (e.slides.length-1)){
					$('.slide_btn').hide();
				}else{
					$('.slide_btn').show();
				};
				var curPage = e.activeIndex;
				aniFunc($('.page').eq(curPage));
				if(e.activeIndex === 2 || e.activeIndex === $('.page').length-1){
					e.lockSwipeToNext();
				}else{
					e.unlockSwipeToNext();
				}
				if(e.activeIndex === $('.page').length-1){
					$("#musicBox")[0].play();
				}
			},
			onTouchMove: function(e) {
				$($('.page').get(e.activeIndex - 1)).find('.animate').hide();
				$($('.page').get(e.activeIndex + 1)).find('.animate').hide();
			},
			onSlidePrevEnd: function(e) {
			},
			onSlideNextEnd: function(e) {
			}
		});
		$('.scroll-container').each(function(){
			new Swiper(this, {
				scrollbar: '.swiper-scrollbar',
				scrollbarHide: false,
				direction: 'vertical',
				slidesPerView: 'auto',
				mousewheelControl: true,
				freeMode: true
			});
		});
	};

	/*$('.scroll-container').each(function(){
	 	$(this).swiper({
			mode: 'vertical',
			scrollContainer: true,
			mousewheelControl: true,
			hide:false,
			scrollbar: {
				container: $(this).find('.swiper-scrollbar')[0]
			},
		});
	});*/
	window.addEventListener('touchstart', touchstartHandler, false);
	function touchstartHandler(){
		$("#musicBox")[0].load();
		//$("#musicBox")[0].play();
	}
	$('.rule-btn').on('click',function(){
		$('.masker').fadeIn();
		$('.rule-wrap').fadeIn();
	});
	$('.masker,.btn-close').on('click',function(){
		$('.masker').fadeOut();
		$('.rules').fadeOut();
	});
	$('.btn-back').on('click',function(){
		myPageSwiper.slidePrev();
	});
	$('.btn-confirm').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		myPageSwiper.slideNext();
	});

	$('#return').on('click',function(){
		myPageSwiper.swipeTo(0);
	});
});
