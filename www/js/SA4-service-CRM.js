angular.module('SA4.CRM', [])

.factory('CRM', function(InforCRM, $window, $http, $q){

  //Config Paramaters 
  var default_config = { 
      "CRM_Url" : "http://Sa4demo-mfg.cloudapp.net:3333/sData",
      "username": "admin",
      "password": "password"
  };

  var config = default_config;  //use overrideCRM to change 

  var CRM = {
    InforCRM: {
      get: function(entity) {
        return InforCRM.getFeeds(entity);
      },
      entities: {
        feeds: {
          name: null,
          query: null, 
          select: null,
          fieldMap: null,
          format: "json"
        },
        accounts: {
          name: "accounts",
          type: "dynamic",
          query: null,
          select: null,
          fieldMap: null,
          format: "json",
        },
        contacts: {
          name: "contacts",
          type: "dynamic",
          query: null,
          select: null,
          fieldMap: null,
          format: "json"
        },
        opportunities: {
          name: "opportunities",
          type: "dynamic",
          query: null,
          select: null,
          fieldMap: null,
          format: "json",
        }
      }
    }
  };

  var overrideCRMData = function(CRMData) {
    //add overrides to CRM service object 
    //config items 
    if(CRMData.config.Url){
      config.CRM_URL = CRMData.config.Url; 
    };

   //Get overrides for each entity  
   _.each(CRMData.entities, function(entityValue, entityKey) {
      _.each(CRMData.entities[entityKey], function(itemValue, itemKey){
        CRM[CRMData.config.CRM][entityKey][itemKey] = itemValue; 
      })
    });
  }; 

  var mapResult = function(input, map) {
    var output = []; 
    angular.forEach(input, function(item , key){
      var new_item = {}; 
      _.each(item, function(value, key) {
        key = map[key] || key;
        new_item[key] = value;
      });
      output.push(new_item);
    });
    return output; 
  }; 
   
  var getCRM = function(CRM_Name) {
    return CRM[CRM_Name];
  };

  var setConfig = function(newConfig) {
      $window.localStorage['CRM_config'] = JSON.stringify(newConfig);
      config = newConfig;
  };

  var getConfig = function(){
    config = JSON.parse($window.localStorage['CRM_config'] || JSON.stringify(default_config));
      return config;
  };

  return {
        getCRM: getCRM,
        overrideCRMData: overrideCRMData,
        mapResults: mapResult,
        setConfig: setConfig,
        getConfig: getConfig
  }
})



//Smartapps4 - Infor CRM Service 
// 
// Uses config object that consists of the following objects
// username 
// password
// SDATA_URL

.factory('InforCRM',  function ($http, $q, $window) {

    var default_config = { 
      "CRM_Url" : "http://Sa4demo-mfg.cloudapp.net:3333/sData",
      "username": "admin",
      "password": "password"
    };

    var config = default_config;

    $http.defaults.useXDomain = true;
    $http.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
    //$http.defaults.headers.common['Authorization'] = 'Basic ' + btoa("admin" + ":" + "");
    $http.defaults.headers.common.withCredentials = true;

    //Helper function to build SData url string 
    var buildUrl = function(CRM_URL, type, name, query, select, format) {
      //Build type segment 
      var typeSegment = "";
 
      switch(type) {
        case 'dynamic':
          typeSegment = "/slx/dynamic/-/";
          break;
        case 'system':
          typeSegment = "/slx/dynamic/-/";
          break;
        default:
          typeSegment = "/slx/dynamic/-/";
      }

      var url = CRM_URL + 
        //select type of call 
        typeSegment +
        (name != null ? name : "") + 
        //add format type
        "?format=" + (format != null ? format : "json") + 
        (query != null ? "&where=" + query : "") + 
        (select != null ? "&select=" + select : "");

        return url; 
    };

    var mapResult = function(input, map) {
      var output = []; 
      angular.forEach(input, function(item , key){
        var new_item = {}; 
        _.each(item, function(value, key) {
          key = map[key] || key;
          new_item[key] = value;
        });
        output.push(new_item);
      });
    return output; 
  }; 

    var setConfig = function(newConfig) {
      $window.localStorage['InforCRM_config'] = JSON.stringify(newConfig);
      config = newConfig;
    };

    var getConfig = function(){
      config = JSON.parse($window.localStorage['InforCRM_config'] || JSON.stringify(default_config));
      return config;
    };

    //Get all Dynamic Resources
    var getFeeds = function (feedConfig){

      return $http.get(
        buildUrl(config.CRM_Url, "dynamic", null, feedConfig.query) , 
        { headers: {'Authorization':  'Basic ' + btoa(config.username + ":" + config.password) }}
      )  
    };

    var getFeed = function(feedConfig){
      return $http.get(
        buildUrl(config.CRM_Url,"dynamic",feedConfig.name,feedConfig.query,feedConfig.select,"json"),
        { headers: {'Authorization':  'Basic ' + btoa(config.username + ":" + config.password) }},
        { method: 'GET', 
          transformResponse: function (data, headers) {
            if(feedConfig.fieldMap) {
              var data = data.replace(/\w+/g, function(m) {
                return feedConfig.fieldMap[m] || m;
              });
            }
            return JSON.parse(data);  
          }
        }
      )
    };


    //Entity Related Methods
    var getGroups = function (query){
      return $http.get(
        config.CRM_Url + "/slx/system/-/groups/?format=json" + 
         (query != null ? "&where=" + query : "") ,
        { headers: {'Authorization':  'Basic ' + btoa(config.username + ":" + config.password) }}

      )  
    };

    var getGroup = function (groupId){
      return $http.get(
        config.CRM_Url + "/slx/system/-/groups/$queries/execute?format=json&_groupId=" + groupId,
        { headers: {'Authorization':  'Basic ' + btoa(config.username + ":" + config.password) }}
      )
    };

    var getEntityDetails = function (entity, entityId, query){
      return $http.get(
        config.CRM_Url + "/slx/dynamic/-/" + entity + "('" + entityId + "')?format=json" + query,
        { headers: {'Authorization':  'Basic ' + btoa(config.username + ":" + config.password) }}
      )
    };

    var getEntityHistory = function (entity, entityId){
      return $http.get(
          config.CRM_Url + "/slx/dynamic/-/history?format=json&where=" + entity  + " eq '" + entityId + "'",
          { headers: {'Authorization':  'Basic ' + btoa(config.username + ":" + config.password) }}
        )  
    };

     var getEntityActivities = function (entity, entityId){
      return $http.get(
        CRM_Url + "/slx/dynamic/-/activities?format=json&where=" + entity  + " eq '" + entityId + "'",
        { headers: {'Authorization':  'Basic ' + btoa(config.username + ":" + config.password) }}
      )  
    };

    return {
        setConfig: setConfig,
        getConfig: getConfig,
        getFeeds: getFeeds,
        getFeed: getFeed,
        getGroups: getGroups,
        getGroup: getGroup, 
        getEntityDetails: getEntityDetails,
        getEntityHistory: getEntityHistory,
        getEntityActivities: getEntityActivities  
    }
})


.factory('Avatars',  function ($http, $q) {
  var allAvatars = {};

  //get all avatars 
  var getAllAvatars = function(){
      var deferred = $q.defer();

      $http.get(CRM_URL + "system/-/libraryDirectories(directoryName%20eq%20'Avatars')/documents?format=json")
      .then(function(avatars){
        allAvatars = avatars.data.$resources;
        angular.forEach(allAvatars, function(avatar){
          getAvatarImage(avatar)  //load the image for each attachment via a promise
          .then(function(response){
            avatar.imageURI = window.URL.createObjectURL(response.data);
          });
          deferred.resolve(allAvatars);
        }) 
      })
      .catch(function(error){
        deferred.rejected(error);
      })  
    return deferred.promise;
    };

    var getAvatarImage =  function(avatar) {
      var url = avatar.$url;
      //url = url.substring(0, url.indexOf('?'));
      //url = url.replace("dynamic", "system");  //quirk with sData when downloading blob info needs to be system
      // setup to get blob of image back
      return($http.get(url+ "/file", {responseType: "blob"}));
    };

    var getUserAvatar = function(User) {
      var file = User.trim().concat('.jpg');
      var avatar = _.find(allAvatars, { 'fileName' : file });
      return avatar.imageURI;
    };

    return {
      getAllAvatars: getAllAvatars,
      getUserAvatar: getUserAvatar
    }
})




