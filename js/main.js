"use strict";
var globel = {

};

var bodySwiper = new Swiper('.swiper-container', {
	pagination: '.swiper-pagination',
	paginationClickable: true,
	direction: 'vertical'
});

function domLoading(argument) {
	var manifest = [];
	$("img").each(function(){
		manifest.push($(this).data('src'));
	});
}