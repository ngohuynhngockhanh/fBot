angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Socket, $ionicPlatform, $timeout) {
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
  isInitiator = true// (location.search.split('isInitiator=')[1] != undefined)
  var config = {
      isInitiator: isInitiator,
      turn: {
        host: 'turn:turn.ourshark.mysmarthome.vn',
        username: 'admin',
        password: 'admin'
      },
      streams: {
          audio: false,
          video: true
      }
  }

  $ionicPlatform.ready(function() {
    
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
  
  
  })

})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
