angular.module('starter.controllers', [])


.controller('DashCtrl', function($scope, Socket) {

  $scope.coords = {};

  $scope.up = function() {
    console.log("up")
    Socket.emit("Move", "UP")
  }

  $scope.down = function() {
    console.log("down")
    Socket.emit("Move", "DOWN")
  }

  $scope.left = function() {
    console.log("left")
    Socket.emit("Move", "LEFT")
  }

  $scope.right = function() {
    console.log("right")
    Socket.emit("Move", "RIGHT")
  }


  $scope.joystickMove = function(){
      let direction = $scope.coords;
      // $scope.wtf = direction;
      // console.log("x = " + $scope.wtf.x + "   y = " + $scope.wtf.y);
      let x = direction.x;
      let y = direction.y;
      if(y >= 30 && -10 <= x && x <= 10){
          $scope.up();
      }
      else if(y<= -30 && -10 <=x && x <= 10){
          $scope.down();
      }
      else if(x>=28 && -10 <= y && y <= 10){
          $scope.right();
      }
      else if(x <= -28 && -10 <=y && y<=10){
        $scope.left();
      }
  }


})


