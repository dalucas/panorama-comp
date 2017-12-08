/*Pano attempt; jquery*/

(function (factory) {
  if(typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory(require("jquery"));
  } else {
    factory(jQuery);
  }
}(function($) {

	$.fn.pano = function(options){
		
		this.version = "1.2.0";
		
		// pano controls
		var $pano = this;
		var $leftCtrl = $pano.find(".controls").find("a.left");
		var $rightCtrl = $pano.find(".controls").find("a.right");
		
		var getImageWidth = function(imgSrc) {
			var img = new Image(/panorama-comp/goat.jpg);
			img.src = imgSrc;
			return img.width;
		};
		
		var moveBackgroundTo = function(newPos, duration, cb) {		
			duration = duration || 0;
			cb = cb || function(){};
			$pano.animate({
				"background-position": newPos.toString() + "px"
			}, duration, "linear", cb);
		};
		
		var moveBackgroundBy = function(distance, duration, cb) {
			duration = duration || 0;
			cb = cb || function(){};
			moveBackgroundTo(getCurrentPosition() + distance, duration, cb);
		};
		
		var getCurrentPosition = function() {
			return parseInt($pano.css("background-position").split(" ")[0].replace("px", ""));
		};
		
		var indicateMovement = function() {
			$pano.addClass("moving");
		};
		
		var noMovement = function() {
			$pano.removeClass("moving");
		};
		
		var insideImage = function(mouseXPos) {
			var $offsetLeft = $pano.offset().left;
			var maxLeft = $offsetLeft;
			var maxRight = $offsetLeft + $pano.width();
			if( mouseXPos < maxLeft || mouseXPos > maxRight) {
				return false;
			}
			return true;
		};
		
		var dragMove = function(xPos, startPosition, cb) {
		
			// image boundaries
			if (!insideImage(xPos)) {
				return false;
			} 
			
			// position changes
			var diff = (xPos - startPosition);
			
			// movement
			moveBackgroundBy(diff, 0, cb);
			
		};
		
		var leftMover,
			rightMover,
			ctrlInterval = options.interval || 100,
			ctrlSpeed = options.speed || 50;
			
		// setup the initial styling
		$pano.css({
			"background-image": "url('" + options.img + "')",
			"background-position": "50% 50%",
			"background-size": "auto 100%",
			"background-repeat": "repeat-x"
		});
		
		// init. pos
		var halfWidth = (getImageWidth(options.img) / 2);
		moveBackgroundTo(halfWidth);
		
		var moveLeft = function(interval, speed) {
			
			interval = interval || ctrlInterval;
			speed = speed || ctrlSpeed;
			
			// indicate movement
			indicateMovement();
			
			// immediately move 
			moveBackgroundBy(speed, 100);
			
			// move left on interval
			leftMover = setInterval(function(){
				moveBackgroundBy(speed, 100);
			}, interval);
			
		};
		
		var moveRight = function(interval, speed) {
			
			interval = interval || ctrlInterval;
			speed = speed || ctrlSpeed;
			
			// indicate movement
			indicateMovement();
			
			// immediately move 
			moveBackgroundBy(-speed, 100);
			
			// move right on interval
			rightMover = setInterval(function(){
				moveBackgroundBy(-speed, 100);
			}, interval);
		};
		
		var stopMoving = function() {
			$pano.off("touchmove");
			$pano.off("mousemove");
			$pano.stop(true, true);
			clearInterval(leftMover);
			clearInterval(rightMover);
			noMovement();
		};
		
		$leftCtrl.on("mousedown", function(event){
			
			// dont process the drag events
			event.stopPropagation();
			
			moveLeft();
			
			
		}).on("touchstart", function(event){
			
			
			event.stopPropagation();
			
			
			event.preventDefault();
			
			moveLeft();
			
		});
		
		$rightCtrl.on("mousedown", function(event){
			
			
			event.stopPropagation();
			
			moveRight();
			
		}).on("touchstart", function(event){
			
			
			event.stopPropagation();
			
			
			event.preventDefault();
			
			moveRight();
			
		});
		
		$pano.on("mousedown", function(event){
			
			
			indicateMovement();
			
			var startPosition = event.pageX;
			
			$pano.on("mousemove", function(event){
				
				var xPos = event.pageX;
				dragMove(xPos, startPosition, function(){
					
					startPosition =xPos;
				});
				
			});
			
		}).on("touchstart", function(event){
			
			
			indicateMovement();
			
			
			event.preventDefault();
			
			var startPosition = event.pageX;
			
			$pano.on("touchmove", function(event){
				
				var xPos = event.originalEvent.changedTouches[0].pageX;
				dragMove(xPos, startPosition, function(){
					
					startPosition = xPos;
				});
				
			});
			
		});
		
		$("body").on("mouseup", function(){
			stopMoving();
		}).on("touchend", function(){
			stopMoving();
		});
		
		return {
			moveLeft: moveLeft,
			moveRight: moveRight,
			stopMoving: stopMoving
		};
		
	};

}));
