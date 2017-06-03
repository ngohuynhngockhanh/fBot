angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Socket) {
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
