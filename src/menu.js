// export default (function() {
// 	var pub = {};

// 	const getCss = function(){
// 		var css = 'table td:hover{ background-color: #00ff00 }';
// 		return css;
// 	}
	
// 	const appendStyleSheet = function(){
// 		var style = document.createElement('style');
// 		if (style.styleSheet) {
// 		    style.styleSheet.cssText = css;
// 		} else {
// 		    style.appendChild(document.createTextNode(css));
// 		}
// 		document.getElementsByTagName('head')[0].appendChild(style);
// 	}

// 	const getButton = function(){
// 		// var back = document.createElement("div");
// 		var button = document.createElement("div");
// 		button.style.position = "absolute";
// 		button.style.top = "45%";
// 		button.style.left = "48%";
// 		button.style.color = "#fff";
// 		button.id = 'menu-button';
// 		button.innerText = 'Start Game';
// 		button.style.zIndex = "19";
// 		button.addEventListener("click", pub.hide);
// 		return button;
// 	}

// 	const getBackground = function(){
// 		var background = document.createElement("div"); 
// 		background.style.width = "100%";
// 		background.style.height = "100%";
// 		background.style.backgroundColor = "#000";
// 		background.style.opacity = "0.3";
// 		background.style.position = "relative";
// 		background.style.top = "0";
// 		background.style.left = "0";
// 		background.style.zIndex = "9";
// 		background.id = "menu-bg";
// 		return background;
// 	}

// 	pub.show = function(){
// 		var menu = document.createElement("div"); 
// 		menu.style.position = "fixed";
// 		menu.style.width = "800px";
// 		menu.style.height = "600px";
// 		menu.style.top = "8";
// 		menu.style.left = "8";
// 		menu.id = "menu";
// 		document.querySelector('body').appendChild(menu);
// 		document.querySelector('#menu').appendChild(getBackground());
// 		document.querySelector('#menu').appendChild(getButton());
// 	}

// 	pub.hide = function(){
// 		var menu = document.querySelector('#menu');
// 		document.querySelector('body').removeChild(menu);
// 	}
//   return pub;
// })();
import * as PIXI from 'pixi.js';

export default (function() {
	var _pub = {};
	var _container = new PIXI.Container();
    var _background = new PIXI.Graphics();
    var _buttons = new PIXI.TECT();
	
  return _pub;
})();




