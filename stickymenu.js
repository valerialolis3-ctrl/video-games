window.requestAnimationFrame = window.requestAnimationFrame
                               || window.mozRequestAnimationFrame
                               || window.webkitRequestAnimationFrame
                               || window.msRequestAnimationFrame
                               || function(f){return setTimeout(f, 1000/60)}


////// Sticky Horizontal Menu Definition //////


;(function(window){ 
	//configurable variables:

	var stickyclass = 'sticky', // class to add to BODY when menu is sticky
			stickymenuwrapper = 'stickymenuwrapper', // id of sticky menu wrapper
			stickymenudiv = 'stickymenudiv', // id of sticky menu div inside wrapper
			mobiletogglerid = 'stickymobiletoggler' // id of mobile menu toggler

	//end config

	var body,
			targetholder,
			target,
			targetheight = 0,
			targetoffsetTop,
			resizetimer,
			domreadyfired = false


	function getoffset(what, offsettype){
		return (what.offsetParent)? what[offsettype] + getoffset(what.offsetParent, offsettype) : what[offsettype]
	}

	function updateCoords(){
		targetheight = target.offsetHeight
		targetoffsetTop = getoffset(target, 'offsetTop')
	}


	function makesticky(){
		var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
		if (scrollTop >= (targetoffsetTop + targetheight)){
			if (!classie.has(body, stickyclass)){
				if (targetheight > 0)
					targetholder.style.height = targetheight + 'px'
				classie.add(body, stickyclass)
			}
		}
		else{
			if (classie.has(body, stickyclass)){
				targetholder.style.height = 'auto'
				classie.remove(body, stickyclass)
			}
		}
	}

	function resizeHandler(){
		clearTimeout(resizetimer)
		resizetimer = setTimeout(function(){
			classie.remove(body, stickyclass)
			updateCoords()
			makesticky()
		}, 50)
	}

	function toggleMobileMenu(menuid, togglerid){
		var targetobj = document.getElementById(menuid)
		var toggler = document.getElementById(togglerid)
		classie.toggle(targetobj, 'open')
		classie.toggle(toggler, 'open')
	}

	function addEvent(target, functionref, tasktype){ //assign a function to execute to an event handler (ie: onunload)
		var tasktype=(window.addEventListener)? tasktype : "on"+tasktype
		if (target.addEventListener)
			target.addEventListener(tasktype, functionref, false)
		else if (target.attachEvent)
			target.attachEvent(tasktype, functionref)
	}

	function initmenu(){
		body = document.getElementsByTagName('body')[0]
		targetholder = document.getElementById(stickymenuwrapper)
		target = document.getElementById(stickymenudiv)
		mobiletoggler = document.getElementById(mobiletogglerid)
		updateCoords()
		makesticky()
		addEvent(window, function(){ // on scroll
			requestAnimationFrame(makesticky)
		}, 'scroll')
		if (typeof window.orientation != 'undefined'){
			addEvent(window, function(){ // on orientationchange
				resizeHandler()
			}, 'orientationchange')			
		}
		else{
			addEvent(window, function(){ // on window resize
				resizeHandler()
			}, 'resize')
		}
		addEvent(mobiletoggler, function(){
			toggleMobileMenu(stickymenudiv, mobiletogglerid)
		}, 'click')
		addEvent(target, function(){
			setTimeout(function(){
				toggleMobileMenu(stickymenudiv, mobiletogglerid)
			}, 100)
		}, 'click')
	}


	addEvent(document, function(){ // on DOMContentLoaded
		initmenu()
		domreadyfired = true
	}, 'DOMContentLoaded')

	addEvent(window, function(){ // on window.load
		if (!domreadyfired){ // IE8 and below
			initmenu()
		}
		updateCoords()
	}, 'load')	


})(window);


/*!
 * classie v1.0.1
 * class helper functions
 * from bonzo https://github.com/ded/bonzo
 * MIT license
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {

'use strict';

// class helper functions from bonzo https://github.com/ded/bonzo

function classReg( className ) {
  return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
}

// classList support for class management
// altho to be fair, the api sucks because it won't accept multiple classes at once
var hasClass, addClass, removeClass;

if ( 'classList' in document.documentElement ) {
  hasClass = function( elem, c ) {
    return elem.classList.contains( c );
  };
  addClass = function( elem, c ) {
    elem.classList.add( c );
  };
  removeClass = function( elem, c ) {
    elem.classList.remove( c );
  };
}
else {
  hasClass = function( elem, c ) {
    return classReg( c ).test( elem.className );
  };
  addClass = function( elem, c ) {
    if ( !hasClass( elem, c ) ) {
      elem.className = elem.className + ' ' + c;
    }
  };
  removeClass = function( elem, c ) {
    elem.className = elem.className.replace( classReg( c ), ' ' );
  };
}

function toggleClass( elem, c ) {
  var fn = hasClass( elem, c ) ? removeClass : addClass;
  fn( elem, c );
}

var classie = {
 	// full names
  hasClass: hasClass,
  addClass: addClass,
  removeClass: removeClass,
  toggleClass: toggleClass,
  // short names
  has: hasClass,
  add: addClass,
  remove: removeClass,
  toggle: toggleClass
};

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( classie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = classie;
} else {
  // browser global
  window.classie = classie;
}

})( window );