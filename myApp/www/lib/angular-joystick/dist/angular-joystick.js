'use strict';
/*
 * Joystick Directive for AngularJS. 
 * A fork of Scott Lobdell's joystick initially for backbone (https://github.com/slobdell/joystick).
 */

/**
 * @namespace angular-joystick
 */
angular.module('angular-joystick', [
]);
'use strict';
/*
 * Joystick Directive for AngularJS. 
 * A fork of Scott Lobdell's joystick initially for backbone (https://github.com/slobdell/joystick).
 */

angular.module('angular-joystick').directive('angularJoystick', function(JoystickService) {
    return {
        restrict: 'EA',
        scope: {
            coords: '=',
            onMove: '&'
        },
        template: '<div '+
            'ng-mousedown="joystick.startControl()" ' +
            'ng-mouseup="joystick.endControl()" ' +
            'ng-mousemove="joystick.move($event)" ' +
            //'hmPanstart"="joystick.startControl()" ' +
            //'hmPanmove"="joystick.move($event)" ' +
            //'hmPanend"="joystick.endCotrol()" ' +
            '><canvas id="joystickCanvas" ' +
                'width="{{joystick.squareSize}}" height="{{joystick.squareSize}}" style="width: {{joystick.squareSize}}px; height: {{joystick.squareSize}}px;"></canvas>'+
            '</div>',
        controller: ['$scope',
            function($scope) {
                $scope.joystick = JoystickService.get($scope.coords, $scope.onMove);
                $scope.$on('$destroy', function () {
                    $scope.joystick = {};
                });
            }
        ]
    };
});
'use strict';
/*
 * Joystick Directive for AngularJS. 
 * A fork of Scott Lobdell's joystick initially for backbone (https://github.com/slobdell/joystick).
 */

angular.module('angular-joystick').provider('JoystickService', function () {

    this.$get = ['$timeout', function($timeout) {
        var INACTIVE = 0;
        var ACTIVE = 1;
        var SECONDS_INACTIVE = 0.5;

        function loadSprite(src, callback) {
            var sprite = new Image();
            sprite.onload = callback;
            sprite.src = src;
            return sprite;
        }

        var squareSize = 150;
        var state = INACTIVE;
        var _coords = {x: 0, y: 0};
        var _callback = null;
        var canvas = null;
        var context = null;
        var radius = (squareSize / 2) * 0.5;
        var joyStickLoaded = false;
        var backgroundLoaded = false;
        var lastTouch = new Date().getTime();
        var sprite;
        var background;

        var self = {
            get: function(coords, callback) {
                if(coords) {
                    _coords = coords;
                }
                if (callback) {
                    _callback = callback;
                }
                return self; 
            },
            coords: _coords,
            squareSize: squareSize,
            _retractJoystickForInactivity: function(){
                var framesPerSec = 15;
                $timeout(function(){
                    var currentTime = new Date().getTime();
                    if(currentTime - lastTouch >= SECONDS_INACTIVE * 1000){
                        self._retractToMiddle();
                        self.renderSprite();
                    }
                    self._retractJoystickForInactivity();
                }, parseInt(1000 / framesPerSec, 10));
            },
            _tryCallback: function(){
                if (background && joyStickLoaded) {
                    if (!context) {
                        self.render();
                    }
                    self.renderSprite();
                }
            },
            startControl: function(){
                console.log('startControl');
                state = ACTIVE;
            },
            endControl: function(){
                console.log('endControl');
                state = INACTIVE;
                _coords.x = 0;
                _coords.y = 0;
                self.renderSprite();
            },
            move: function(evt){
                if(state === INACTIVE){
                    return;
                }
                //console.log('move');
                lastTouch = new Date().getTime();

                var x, y;

                if(evt.originalEvent && evt.originalEvent.touches){
                    evt.preventDefault();
                    var left = 0;
                    var fromTop = 0;
                    var elem = $(canvas)[0];
                    while(elem) {
                        left = left + parseInt(elem.offsetLeft);
                        fromTop = fromTop + parseInt(elem.offsetTop);
                        elem = elem.offsetParent;
                    }
                    x = evt.originalEvent.touches[0].clientX - left;
                    y = evt.originalEvent.touches[0].clientY - fromTop;
                } else {
                    x = evt.offsetX;
                    y = evt.offsetY;
                }
                self._mutateToCartesian(x, y);
                self._triggerChange();
            },
            _triggerChange: function(){
                var xPercent = _coords.x / radius;
                var yPercent = _coords.y / radius;
                if(Math.abs(xPercent) > 1.0){
                    xPercent /= Math.abs(xPercent);
                }
                if(Math.abs(yPercent) > 1.0){
                    yPercent /= Math.abs(yPercent);
                }
                _callback();
                //self.trigger('horizontalMove', xPercent);
                //self.trigger('verticalMove', yPercent);
            },
            _mutateToCartesian: function(x, y){
                x -= (squareSize) / 2;
                y *= -1;
                y += (squareSize) / 2;
                if(isNaN(y)){
                    y = squareSize / 2;
                }

                _coords.x = x;
                _coords.y = y;
                if(self._valuesExceedRadius(_coords.x, _coords.y)){
                    self._traceNewValues();
                }
                self.renderSprite();
            },
            _retractToMiddle: function(){
                var percentLoss = 0.1;
                var toKeep = 1.0 - percentLoss;

                var xSign = 1;
                var ySign = 1;

                if(_coords.x !== 0){
                    xSign = _coords.x / Math.abs(_coords.x);
                }
                if(_coords.y !== 0) {
                    ySign = _coords.y / Math.abs(_coords.y);
                }

                _coords.x = Math.floor(toKeep * Math.abs(_coords.x)) * xSign;
                _coords.y = Math.floor(toKeep * Math.abs(_coords.y)) * ySign;
            },
            _traceNewValues: function(){
                var slope = _coords.y / _coords.x;
                var xIncr = 1;
                var y;
                if(_coords.x < 0){
                    xIncr = -1;
                }
                for(var x=0; x<squareSize / 2; x+=xIncr){
                    y = x * slope;
                    if(self._valuesExceedRadius(x, y)){
                        break;
                    }
                }
                _coords.x = x;
                _coords.y = y;
            },
            _cartesianToCanvas: function(x, y){
                var newX = x + squareSize / 2;
                var newY = y - (squareSize / 2);
                newY = newY * -1;
                return {
                    x: newX,
                    y: newY
                };
            },
            _valuesExceedRadius: function(x, y){
                if(x === 0){
                    return y > radius;
                }
                return Math.pow(x, 2) + Math.pow(y, 2) > Math.pow(radius, 2);
            },
            renderSprite: function(){
                //console.log('renderSprite');
                var originalWidth = 89;
                var originalHeight = 89;

                var spriteWidth = 50;
                var spriteHeight = 50;
                var pixelsLeft = 0; //ofset for sprite on img
                var pixelsTop = 0; //offset for sprite on img
                var coords = self._cartesianToCanvas(_coords.x, _coords.y);
                if(context === null){
                    console.log('context is null :(');
                    return;
                }
                // hack dunno why I need the 2x
                context.clearRect(0, 0, squareSize * 2, squareSize);

                var backImageSize = 300;
                context.drawImage(background,
                    0,
                    0,
                    backImageSize,
                    backImageSize,
                    0,
                    0,
                    squareSize,
                    squareSize
                );
                context.drawImage(sprite,
                    pixelsLeft,
                    pixelsTop,
                    originalWidth,
                    originalHeight,
                    coords.x - spriteWidth / 2,
                    coords.y - spriteHeight / 2,
                    spriteWidth,
                    spriteHeight
                );
            },
            render: function(){
                canvas = $('#joystickCanvas')[0];
                console.log('render ' + canvas);
                context = canvas.getContext('2d');
                self.renderSprite();
                return this;
            }
        };

        sprite = loadSprite('img/buttonJoystick.png', function(){
            joyStickLoaded = true;
            self._tryCallback();
        });
        background = loadSprite('img/canvasJoystick.png', function(){
            backgroundLoaded = true;
            self._tryCallback();
        });

        /*$timeout(function() {
            self._retractJoystickForInactivity();
        }, 1000);*/
        return self;
    }]; //$get
}); // provider