
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


.factory('RaspiSocket', function (socketFactory, $rootScope) {
  var mySocket;
  myIoSocket = io.connect($rootScope.socketRaspiURL);

  mySocket = socketFactory({
    ioSocket: myIoSocket
  });
  mySocket.on('connect', function() {
    console.log("ok RaspiSocket")
    mySocket.emit("joinRoom", "controller")
  })

  return mySocket;
})



