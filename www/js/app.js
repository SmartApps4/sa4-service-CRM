// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('testInforCRM', ['ionic', 'testInforCRM.controllers', 'SA4.InforCRM'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html"
  })

  .state('app.config', {
    url: "/config",
    views: {
      'menuContent': {
        templateUrl: "templates/config.html",
        controller: 'configCtrl'
      }
    }
  })
  
  .state('app.feeds', {
      url: "/feeds",
      views: {
        'menuContent': {
          templateUrl: "templates/feeds.html",
          controller: 'feedsCtrl'
        }
      }
  })

  .state('app.feed', {
    params: {"currentFeed" : "" },
    url: "/feeds/:feedId",
    views: {
      'menuContent': {
        templateUrl: "templates/feed.html",
        controller: 'feedDetailsCtrl'
      }
    }
  })

  .state('app.groups', {
      url: "/groups",
      views: {
        'menuContent': {
          templateUrl: "templates/groups.html",
          controller: 'groupsCtrl'
        }
      }
  })

  .state('app.group', {
      params: {"currentGroup" : ""},
      url: "/groups/:groupId",
      views: {
        'menuContent': {
          templateUrl: "templates/group.html",
          controller: 'groupDetailsCtrl',
        }
      }
  })

  ;
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/config');
});
