angular.module('testInforCRM.controllers', [])

.controller('configCtrl', function($scope, $ionicModal, $timeout, CRM) {
  // Form data for the login modal
  $scope.loginData = InforCRM.getConfig();  

  
  // Open the login modal
  $scope.saveConfig = function() {
    InforCRM.setConfig($scope.loginData);
  };
})

.controller('feedsCtrl', function($scope, CRM) {
  $scope.data = {};
  var CRM = CRM.getCRM('InforCRM');

  $scope.doRefresh = function() {
    CRM.feeds.get()
    .then(function(resources){
      $scope.data.feeds = resources.data.$resources;   
    })
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete')
    })
  };

  $scope.doRefresh();
})

.controller('feedDetailsCtrl', function($scope, CRM, $stateParams) {
  $scope.data = {};
  $scope.data.currentFeed = $stateParams.currentFeed; 
  $scope.data.feedId = $stateParams.feedId;
  var CRM = CRM.getCRM('InforCRM');

 
  $scope.doRefresh = function() {
    CRM[$scope.data.feedId].get()
    .then(function(results){
      $scope.data.feed = results.data.$resources; 
    })
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete')
    })
  };

  $scope.doRefresh(); 
})


.controller('groupsCtrl', function($scope, InforCRM) {
  $scope.data = {};
  $scope.data.query = "family eq 'account'";

  $scope.doRefresh = function() {
    InforCRM.getGroups($scope.data.query)
    .then(function(resources){
      $scope.data.groups = resources.data.$resources;   
    })
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete')
    })
  };

  $scope.doRefresh(); 
})

.controller('groupDetailsCtrl', function($scope,InforCRM, $stateParams) {
  $scope.data = {};
  $scope.data.currentGroup = $stateParams.currentGroup; 
  $scope.data.groupId = $stateParams.groupId;

  $scope.doRefresh = function() {
    InforCRM.getGroup($scope.data.groupId)
    .then(function(resources){
      $scope.data.group = resources.data.$resources;   
    })
    .finally(function(){
      $scope.$broadcast('scroll.refreshComplete')
    })
  };

  $scope.doRefresh(); 

})
