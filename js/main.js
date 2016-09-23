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
	$(page).find('.lights').each(function(index,item){
		var lightFlash = function(itm,ind){
			setTimeout(function(){
				if(ind>=$(item).find('.light').length){
					ind=0;
					setTimeout(function(){
						$(item).find('.light').fadeOut(100);
						lightFlash(itm,ind)
					},1000)
				}else{
					$(item).find('.light').eq(ind).fadeIn(200);
					ind++;
					lightFlash(itm,ind)
				}
			},1000);
		}
		lightFlash(item,0);
	})
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
		aniFunc($('.page').eq(pi));
		$('.page-container').show();
		myPageSwiper = new Swiper('.swiper-main', {
			initialSlide: pi,
			loop: true,
			noSwiping: true,
			noSwipingClass : 'stop-swiping',
			slidesPerView: 1,
			loop: false,
			direction: 'vertical',
			autoHeight: true,
			onInit: function(e){
				if(pi == (e.slides.length-1)){
					$('.slide_btn').hide();
				}else{
					$('.slide_btn').show();
				};
			},
			onSlideChangeStart: function(e) {
				$('.page').find('.animate').hide();
			},
			onSlideChangeEnd: function(e) {
				$('.row-rule').hide();
				if(e.activeIndex == (e.slides.length-1)){
					$('.slide_btn').hide();
				}else{
					$('.slide_btn').show();
				};
				var curPage = e.activeIndex;
				aniFunc($('.page').eq(curPage));
				if(e.activeIndex === 0){
					e.unlockSwipeToNext();
				}else{
					e.lockSwipeToNext();
				}
				if(e.activeIndex === 2 || e.activeIndex === 3 || e.activeIndex === 4 || e.activeIndex === 5 || e.activeIndex === 6){
					$("#musicBox")[0].play();
				}
				if(e.activeIndex === 7){
					startShake();
				}
				$('.page').eq(curPage).find('.scroll-container').each(function(){
					new Swiper(this,{
						scrollbar: '.swiper-scrollbar',
						scrollbarHide: false,
						direction: 'vertical',
						slidesPerView: 'auto',
						mousewheelControl: true,
						freeMode: true
					});
				});
			},
			onSlidePrevEnd: function(swiper, event) {
				
			},
			onSlideNextEnd: function(e) {
			},
			onTouchEnd: function(swiper, event) {
				if(swiper.touches.diff<0 && swiper.activeIndex == 1){
					$('.row-rule').show();
				}
			}
		});
		
	};

	window.addEventListener('touchstart', touchstartHandler, false);
	function touchstartHandler(){
		if(!($("#musicBox").hasClass('loaded'))){
			$("#musicBox").addClass('loaded');
			$("#musicBox")[0].load();
		}
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
		$('.row-rule').hide();
	});
	$('.btn-confirm').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		myPageSwiper.slideNext();
	});
	$('.type-btn').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		myPageSwiper.slideNext();
	});
	$('.rank-btn').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		myPageSwiper.slideNext();
	});
	$('.pd-list li').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		myPageSwiper.slideTo(5);
	});
	$('.btn-back-choose').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		myPageSwiper.slideTo(3);
	});
	$('.btn-start-shake').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		myPageSwiper.slideTo(6);
	});
	$('.share-btn').on('click',function(){
		$('.share-cover').show();
	});
	$('.share-cover').on('click',function(){
		$('.share-cover').hide();
	});

	$('#return').on('click',function(){
		myPageSwiper.swipeTo(0);
	});

	var SHAKE_THRESHOLD = 3000;
	var last_update = 0;
	var shake_bl = false;
	var x = y = z = last_x = last_y = last_z = shake_num = 0;
	function startShake(){
		if (window.DeviceMotionEvent) {
			window.addEventListener('devicemotion', deviceMotionHandler, false);
		} else {
			alert('not support mobile event');
		}
	}
	function deviceMotionHandler(eventData) {
		var acceleration = eventData.accelerationIncludingGravity;
		var curTime = new Date().getTime();
		if ((curTime - last_update) > 100) {
			var diffTime = curTime - last_update;
			last_update = curTime;
			x = acceleration.x;
			y = acceleration.y;
			z = acceleration.z;
			var speed = Math.abs(x + y + z - last_x - last_y - last_z) / diffTime * 10000; 
			if (speed > SHAKE_THRESHOLD) {
				shake_num++;
				if(!shake_bl){
					shake_bl = true;
					$('.status-1').hide();
					$('.status-2').show();
					$('.shake-vote').addClass('roll-animate');
					countNumber(10);
				}
			}
			last_x = x;
			last_y = y;
			last_z = z;
		}
	}
	function countNumber(num){
		setTimeout(function(){
			$('.status-2 .number').text(--num);
			if(num>0){
				countNumber(num);
			}else{
				voteFn(shake_num)
			}
		},1000)
	}
	function voteFn(shake_num){
		var vote_num = shake_num*6 >200 ? 200 : shake_num*6;
		$('.status').hide();
		$('.status-3 .number').text(vote_num);
		$('.status-3').show();
		$('.shake-vote').removeClass('roll-animate');
	}
	



	function worksVote = function(list){
		this.list = list ? list : window.worksList;
		this.listWraps = $('.works-wrap .works-list');
	};
	worksVote.prototype = {
		setLayout: function(){
			{id:1, name:"summer1", des: "这是一个Honda的季节", img:"images/works_1.jpg", group:1},
			$(this.list).each(function(index,item){
				var li = $('<li><div class="number">编号:'+(index+1)+'</div><div class="img-wrap"><div class="img-cover"></div><div><img src="'+item.img+'" /></div></div><div class="name">名称:'+item.name+'</div><div class="dis">'+item.voteNum+'</div></li>');
				li.appendTo(this.listWraps.eq(item.group));
			})
		},
		init: function(){
			this.setLayout();
		}
	}
	new worksVote(window.worksList);
});
