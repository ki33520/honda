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
var voiceStatus = true,
	indexUrl = 'http://honda10emc.dzhcn.cn/popularity/',
	jssdkUrl = 'http://sovita.dzhcn.cn/wechat_api/get_jssdk.php',
	ajaxUrl = 'http://honda10emc.dzhcn.cn/callback.php',
	boardType = 'Leaderboard1',
	voteType = "Vote",
	oilType = "Oil",
	isParticipate = "isParticipate1",
	groupNames = ['personal','company'],
//	pageHref = window.location.origin+window.location.pathname;
	pageHref = document.URL.split("#")[0];

function dataPorts(){
	this.getJssdk();
}
dataPorts.prototype = {
	getJssdk: function(){
		var self = this;
		this.jssdkAjax = $.ajax({
			url: jssdkUrl,
			type:'get',
			dataType:'jsonp',
			data:{url:pageHref},
			success:function(data){
				console.log(data)
				self.appId = data.appId;
				self.timestamp = data.timestamp;
				self.nonceStr = data.nonceStr;
				self.signature = data.signature;
				weixinShare();
			}
		});
	},
	postVote: function(){
		$.ajax({
			url: ajaxUrl,
			type: "post",
			data: {type: voteType,openid:$.QueryString('openid'),worksID:node.id,votes:vote_num,worksType:select_group.group},
			dataType: "json",
			error: function(request){
				console.log(request);
			},
			success: function(data){
				view_model.vote(data);
			}
		});
	}
}
var data_ports = new dataPorts();
function viewModel(){

}
viewModel.prototype = {
	vote: function(data){
		if(data.status === 1){
			$('.status-3 .number').text(vote_num);
		}else if(data.status === 2){
			$('.status-3 .number').text(0);
			pop.alert('当天已对投过作品');
		}else if(data.status === 3){
			$('.status-3 .number').text(0);
			pop.alert('所投作品id与作品所属类');
		}else if(data.status === 0){
			$('.status-3 .number').text(0);
			pop.alert('投票失败');
		}
		$('.shake-vote').removeClass('roll-animate');
		$('.status').hide();
		$('.status-3').show();
	}
}
var view_model = new viewModel();

function weixinShare(){
	wx.config({
		debug: false,
		appId: data_ports.appId,
		timestamp: data_ports.timestamp,
		nonceStr: data_ports.nonceStr,
		signature: data_ports.signature,
		jsApiList: [
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ'
		]
	});
	var shareTitle = '大赛在即先夺人气',
		shareDesc = '2016第十届Honda中国节能竞技大赛最佳人气奖评选',
		shareLink = window.location.origin+window.location.pathname,
		shareImg = indexUrl+"images/share_img.jpg";
	wx.ready(function () {
		wx.onMenuShareTimeline({
			title: shareTitle,
			desc: shareDesc,
			link: shareLink,
			imgUrl: shareImg,
			success: function () {
			},
			cancel: function () {
			}
		});
		wx.onMenuShareAppMessage({
			title: shareTitle,
			desc: shareDesc,
			link: shareLink,
			imgUrl: shareImg,
			success: function () {
			},
			cancel: function () {
			}
		});
		wx.onMenuShareQQ({
			title: shareTitle,
			desc: shareDesc,
			link: shareLink,
			imgUrl: shareImg,
			success: function () {
			},
			cancel: function () {
			}
		});
	});
}

function loadAudio(){
	$('.audio').each(function(){
		$(this)[0].load();
	})
}
function playAudio(string){
	$(string)[0].play();
}
function audioOff(string){
	$(string)[0].pause();
}
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

var lightFlash = function(itm,ind){
	setTimeout(function(){
		if(ind>=$(itm).find('.light').length){
			ind=0;
			setTimeout(function(){
				$(itm).find('.light').removeClass("fadeIn animated");
				lightFlash(itm,ind)
			},100)
		}else{
			$(itm).find('.light').eq(ind).addClass("fadeIn animated");
			ind++;
			lightFlash(itm,ind)
		}
	},500);
}
$('.lights').each(function(index,item){
	lightFlash(item,0);
})
function aniFunc(page) {
	$(page).addClass('show').find('.animate').each(function() {
		$(this).show().addClass($(this).attr('data-animate') + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
				$(this).removeClass($(this).attr('data-animate') + ' animated');
		});
	});
}
$(function(){
	var pi = 0,
		myPageSwiper,
		listSwipers = [];

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
				if(e.activeIndex === 3){
					works_vote.setWorksList();
				}
				if(e.activeIndex === 4){
					works_vote.setLeaderBoard();
				}
				if(e.activeIndex === 5){
					works_vote.setWorksNode();
				}
				if(e.activeIndex === 6){
					works_vote.setVote();
				}
			},
			onSlideChangeEnd: function(e) {
				$('.row-rule').hide().prev('.row').find('.slide_btn').show();
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
					playAudio('#armor');
				}
				
				startShake(e.activeIndex);
				
				if(e.activeIndex === 3){

					// alert("444")

					// 
					// 	setTimeout(function(){
							
					// 	}, 500)
						

					// 	// $('.works-wrap .scroll-container-1').each(function(index,item){
					// 	// 	var self = this;
					// 	// 	var scrollContainer01 = new Swiper($(self),{
					// 	// 		scrollbar: $(self).find('.swiper-scrollbar'),
					// 	// 		scrollbarHide: false,
					// 	// 		direction: 'vertical',
					// 	// 		slidesPerView: 'auto',
					// 	// 		mousewheelControl: true,
					// 	// 		freeMode: true
					// 	// 	});
					// 	// });

					// works_vote.listAjax.complete(function(){

					// 	$('.works-wrap .scroll-container').each(function(index,item){
					// 		var self = this;
					// 		new Swiper($(self),{
					// 			scrollbar: $(self).find('.swiper-scrollbar'),
					// 			scrollbarHide: false,
					// 			direction: 'vertical',
					// 			slidesPerView: 'auto',
					// 			mousewheelControl: true,
					// 			freeMode: true
					// 		});
					// 	});
						
					// });
				}
				if(e.activeIndex === 4){
					works_vote.boardAjax.complete(function(){
						$('.leader-board-wrap .scroll-container').each(function(){
							new Swiper(this,{
								scrollbar: $(this).find('.swiper-scrollbar'),
								scrollbarHide: false,
								direction: 'vertical',
								slidesPerView: 'auto',
								mousewheelControl: true,
								freeMode: true
							});
						});
					});
				}
			},
			onSlidePrevEnd: function(swiper, event) {
				
			},
			onSlideNextEnd: function(e) {
			},
			onTouchEnd: function(swiper, event) {
				if(swiper.touches.diff<0 && swiper.activeIndex == 1){
					$('.row-rule').show().prev('.row').find('.slide_btn').hide();
				}
			}
		});
		
	};
	window.addEventListener('touchstart', touchstartHandler);
	function touchstartHandler(){
		if(!($('#bgm').hasClass('loaded'))){
			$('#bgm').addClass('loaded');
			loadAudio();
			if(voiceStatus){
				playAudio('#bgm');
			}
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
		$('.row-rule').hide().prev('.row').find('.slide_btn').show();
	});
	$('.btn-confirm').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		myPageSwiper.slideNext();
	});
	$('.type-btn').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		myPageSwiper.slideNext();
	});
	$('.sound-btn').on('click',function(){
		playAudio('#button');
	});
	$('.rank-btn').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		myPageSwiper.slideNext();
	});
	$('.leader-board li').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		myPageSwiper.slideTo(5);
	});
	$('.btn-back-list').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		myPageSwiper.slideTo(3);
	});
	$('.btn-back-choose').on('click',function(){
		myPageSwiper.unlockSwipeToNext();
		if(myPageSwiper.previousIndex===4){
			myPageSwiper.slideTo(4);
		}else{
			myPageSwiper.slideTo(3);
		}
	});
	$('.btn-start-shake').on('click',function(){
		$.ajax({
			url: ajaxUrl,
			type: "post",
			data: {type: isParticipate,openid:$.QueryString('openid')},
			dataType: "json",
			error: function(request){
				console.log(request);
			},
			success: function(data){
				if(data.status === 1){
					myPageSwiper.unlockSwipeToNext();
					myPageSwiper.slideTo(6);
					trackEvent('shake','start');
				}else{
					pop.alert('当天已经投过作品');
				}
			}
		});
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

	$('#btn-voice').on('touchstart',function(){
		var status = $(this).hasClass('off') ? false : true;
		if(status){
			$(this).addClass('off');
			voiceStatus = false;
			audioOff('#bgm');
		}else{
			$(this).removeClass('off');
			voiceStatus = true;
			playAudio('#bgm');
		}
	});

	var SHAKE_THRESHOLD = 3000;
	var last_update = 0;
	var shake_bl = false;
	var x = y = z = last_x = last_y = last_z = shake_num = 0;
	function startShake(ind){
		if (window.DeviceMotionEvent) {
			if(ind===6){
				window.addEventListener('devicemotion', deviceMotionHandler);
			}else{
				window.removeEventListener('devicemotion', deviceMotionHandler);
			}
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
					myPageSwiper.lockSwipeToPrev();
					countNumber(10);
				}
			}
			last_x = x;
			last_y = y;
			last_z = z;
		}
	}
	$('.status-1').on('click',function(){
		if(!shake_bl){
			shake_bl = true;
			$('.status-1').hide();
			$('.status-2').show();
			myPageSwiper.lockSwipeToPrev();
			countNumber(10);
		}
	});

	function countNumber(num){
		if(num%2 === 0){
			playAudio('#shake');
		};
		$('.status-2 .number').text(num);
		setTimeout(function(){
			$('.status-2 .number').text(--num);
			if(num>0){
				countNumber(num);
			}else{
				voteFn(shake_num)
			}
		},1000)
	}
	var pop = {
		wrap: $('<div class="pop-alert"></div>'),
		show: function(html){
			var self = this;
			this.wrap.show().html(html);
			this.wrap.on('click',function(){
				self.hide();
			})
		},
		alert: function(text){
			this.wrap.show().delay(1000).fadeOut(10,function(){
				$(this).empty();
			}).html('<div class="text">'+text+'</div>');
		},
		hide: function(){
			this.wrap.hide().empty();
		}
	}
	pop.wrap.appendTo('body');
	/* data */

	function voteFn(shake_num){
		var shake_num = shake_num ? shake_num : 1;
		var vote_num = shake_num*6 >200 ? 200 : shake_num*6;
		var node = select_group.node;
		myPageSwiper.unlockSwipeToPrev();
		$.ajax({
			url: ajaxUrl,
			type: "post",
			data: {type: voteType,openid:$.QueryString('openid'),worksID:node.id,votes:vote_num,worksType:select_group.group},
			dataType: "json",
			error: function(request){
				console.log(request);
			},
			success: function(data){
				if(data.status === 1){
					$('.status-3 .number').text(vote_num);
				}else if(data.status === 2){
					$('.status-3 .number').text(0);
					pop.alert('当天已经投过作品');
				}else if(data.status === 3){
					$('.status-3 .number').text(0);
					pop.alert('所投作品id与作品所属类');
				}else if(data.status === 0){
					$('.status-3 .number').text(0);
					pop.alert('投票失败');
				}
				$('.shake-vote').removeClass('roll-animate');
				$('.status').hide();
				$('.status-3').show();
			}
		});
	}

	function selectGroup(){
		var self = this;
		this.group = 1;
		this.name = groupNames[0];
		$('.type-btn').each(function(index,item){
			$(item).on('click',function(){
				self.group = index+1;
				self.name = groupNames[index];
			});
		})
	}
	var select_group = new selectGroup();

	function worksVote(list){
		this.list = list ? list : window.worksList;
		this.workWrap = $('.works-wrap');
		this.listWraps = $('.works-wrap .works-list');
		this.boardWrap = $('.leader-board');
		this.setWorksList();
	};
	worksVote.prototype = {
		setLeaderBoard: function(){
			var self = this;
			this.boardAjax = $.ajax({
				url: ajaxUrl,
				type: "post",
				data: {type: boardType},
				dataType: "json",
				error: function(request){
					console.log(request);
				},
				success: function(data){
					if(data.status === 1){
						var list_data = data[select_group.name];
						self.boardWrap.empty();
						$(list_data).each(function(index,item){
							var li = $('<li class="cf"><div class="item rank">'+item.rowno+'</div><div class="item item-right"><div class="img-wrap"><div class="img-cover"></div><div class="img" style="background-image:url(images/'+item.id+'.jpg)"></div></div><div class="text"><div class="name">'+item.Name+'</div><div class="dis">得票数: '+item.vote+'ml</div></div></div></li>');
							li.on('click',function(){
								select_group.node = item;
								myPageSwiper.unlockSwipeToNext();
								myPageSwiper.slideTo(5);
								var trackType = item.type === '1' ? 's' : 'e';
								trackEvent('list',trackType,item.id)
							});
							li.appendTo(self.boardWrap);
						});
					}else{
						console.log(data)
					}
				}
			});
		},
		setWorksList: function(){
			var self = this;
			$("#leftSlideBlock").empty();
			$("#rightSlideBlock").empty();
			this.listAjax = $.ajax({
				url: ajaxUrl,
				type: "post",
				data: {type: oilType},
				dataType: "json",
				error: function(request){
					console.log(request);
				},
				success: function(data){
					if(data.status === 1){
						var oilArr = data[select_group.name];
						var ind = 0;
						// var wraps = [$('<div class="scroll-container scroll-container-1"><div class="swiper-wrapper"><div class="swiper-slide"><ul class="pd-list works-list pd-list-1"></ul></div></div><div class="swiper-scrollbar"></div></div>'),$('<div class="scroll-container scroll-container-2"><div class="swiper-wrapper"><div class="swiper-slide"><ul class="pd-list works-list pd-list-2"></ul></div></div><div class="swiper-scrollbar"></div></div>')];
						$(oilArr).each(function(index,item){
							var li = $('<li class="swiper-slide"><div class="number">编号:'+item.id+'</div><div class="img-wrap"><div class="img-cover"></div><div class="img" style="background-image:url(images/'+item.id+'.jpg)"></div></div><div class="name">名称: '+item.name+'</div><div class="dis">加油量: '+item.vote+'ml</div></li>');
							li.on('click',function(){
								select_group.node = item;
								myPageSwiper.unlockSwipeToNext();
								myPageSwiper.slideTo(5);
								var trackType = item.type === '1' ? 's' : 'e';
								trackEvent('list',trackType,item.id)
							});
							if(index===0){
								select_group.node = item;
							}
							if(index%2 == 0){
								$("#leftSlideBlock").append(li);
							}else{
								$("#rightSlideBlock").append(li);
							}
							// wraps[ind++%2].find('.works-list').append(li);
						});
						// self.workWrap.append(wraps[0]);
						// self.workWrap.append(wraps[1]);

						// scrollContainer01 = null;
						// scrollContainer02 = null;

						// setTimeout(function(){
						// 	var scrollContainer01 = new Swiper('.scroll-container-1', {
						// 		scrollbar: '.swiper-scrollbar-01',
						// 		scrollbarHide: false,
						// 		direction: 'vertical',
						// 		slidesPerView: 3,
						// 		mousewheelControl: true,
								
						// 	});

						// 	var scrollContainer02 = new Swiper('.scroll-container-3', {
						// 		scrollbar: '.swiper-scrollbar-02',
						// 		scrollbarHide: false,
						// 		direction: 'vertical',
						// 		slidesPerView: 3,
						// 		mousewheelControl: true,
						// 	});
						// }, 500)

						// alert("feeefefef")

						var h = $(".works-wrap").eq(0).height();

						$(".scroll-container-1, .scroll-container-3").height(h)
						$("#leftSlideBlock, #rightSlideBlock").height(h)

						var ua = navigator.userAgent.toLowerCase();	

						setTimeout(function(){
							if (/iphone|ipad|ipod/.test(ua)) {
								$('.works-wrap .scroll-container').each(function(index,item){
									var self = this;
									new Swiper($(self),{
										scrollbar: $(self).find('.swiper-scrollbar'),
										scrollbarHide: false,
										direction: 'vertical',
										slidesPerView: 'auto',
										freeMode: true
									});
								});
							}else{
								$('.works-wrap .scroll-container').each(function(index,item){
									var self = this;
									new Swiper($(self),{
										direction: 'vertical',
										slidesPerView:3
									});
								});
							}

						}, 3000)
						
						
						self.setWorksNode();

					}
				}
			});
		},
		setWorksNode: function(){
			var node = select_group.node;
			$('.works-node .node-img').css('backgroundImage','url(images/'+node.id+'.jpg)');
			$('.works-node .node-id').text(node.id);
			$('.works-node .node-dis').text(node.des);
			$('.works-node .node-vote').text(node.vote);
			$('.works-node .pd-img').off('click').on('click',function(event){
				pop.show($('<div class="img-wrap"><div style="background-image:url(images/'+node.id+'.jpg)"></div></div>'));
				event.stopPropagation();
			})
		},
		setVote: function(){
			shake_bl = false;
			$('.status').hide();
			$('.status-1').show();
		}
	}
	var works_vote = new worksVote(window.worksList);
});
