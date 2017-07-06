angular.module('starter.controllers', [])


.controller('DashCtrl', function($scope, Socket, $ionicPlatform, $timeout, RaspiSocket) {
  $scope.coords = {};

  $scope.up = function() {
    console.log("up")
    RaspiSocket.emit("Move", "UP")
  }

  $scope.down = function() {
    console.log("down")
    RaspiSocket.emit("Move", "DOWN")
  }

  $scope.left = function() {
    console.log("left")
    RaspiSocket.emit("Move", "LEFT")
  }

  $scope.right = function() {
    console.log("right")
    RaspiSocket.emit("Move", "RIGHT")
  }
  isInitiator = true// (location.search.split('isInitiator=')[1] != undefined)
  var config = {
      isInitiator: isInitiator,
      turn: {
        host: 'turn:turn.ourshark.mysmarthome.vn',
        username: 'admin',
        password: 'admin'
      },
      streams: {
          audio: true,
          video: true
      }
  }

  $ionicPlatform.ready(function() {
    if (window.cordova) {
      var session = new cordova.plugins.phonertc.Session(config);
      cordova.plugins.phonertc.setVideoView({
        container: document.getElementById('videoContainer'),
        local: {
          position: [0, 0],
          size: [100, 100]
        }
      });
    
      session.on('sendMessage', function (data) { 
          //console.log("sendMessage", data)
      Socket.emit("SendMessage", isInitiator, data)
      });
    
      Socket.on("SendMessage", function(initiator, data) {
        session.receiveMessage(data)
      })

      session.on('answer', function () { 
          console.log('Other client answered!');
      });
    
      session.on('disconnect', function () { 
          console.log('Other client disconnected!');
      });
    
      session.call(function() {
        console.log("sucess")
      }, function() {
        console.log("error")
      });
    }
  
  
  })


  $scope.joystickMove = function(){
      var direction = $scope.coords;
      // $scope.wtf = direction;
      // console.log("x = " + $scope.wtf.x + "   y = " + $scope.wtf.y);
      var x = direction.x;
      var y = direction.y;
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


