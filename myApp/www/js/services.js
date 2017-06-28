
angular.module('starter.services', [])

.factory('Socket', function (socketFactory, $rootScope) {
  var mySocket;
  myIoSocket = io.connect($rootScope.socketReadURL);

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });
  mySocket.on('connect', function() {
    console.log("ok")
  })

  return mySocket;
})



