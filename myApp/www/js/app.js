// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'btford.socket-io','angular-joystick', 'ngTouch'])

.run(function($ionicPlatform, $rootScope) { 

  $rootScope.socketReadURL = "http://ourshark.mysmarthome.vn:8001/"
  $rootScope.socketRaspiURL = "http://ourshark.mysmarthome.vn:8001/raspi"

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }   
    if (window.StatusBar) { 
      // org.apache.cordova.statusbar required 
      StatusBar.styleDefault(); 
    }
 
    window.addEventListener("orientationchange",function(){
       console.log(screen.orientation);
        if(screen.orientation && screen.orientation.angle == 0)
          $rootScope.isPortrait = true;
        else    
          $rootScope.isPortrait = false;
        //debugger;
       $rootScope.$digest();
    },false) 



  });
}) 


.run(function($rootScope){
    $rootScope.isPortrait = true;
    if(screen.orientation && screen.orientation.angle == 90)
      $rootScope.isPortrait = false;
})


.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});
