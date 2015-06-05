(function() {
  'use strict';

  var module = angular.module('application', [
    'ui.router',
    'ngAnimate',

    //foundation
    'foundation',
    'foundation.dynamicRouting',
    'foundation.dynamicRouting.animations'
  ])
    .config(config)
    .run(run)
  ;

  config.$inject = ['$urlRouterProvider', '$locationProvider', '$httpProvider'];

  function config($urlProvider, $locationProvider, $httpProvider) {
    $urlProvider.otherwise('/');

    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $locationProvider.html5Mode({
      enabled: false,
      requireBase: false
    });

    $locationProvider.hashPrefix('!');
  }

  function run() {
    Parse.initialize('gQXnvWk0slPHaL810whmLIT7lgfqIhx0to1tLpxc', 'j87Wj8nqIS6HVcIMV9ezhAiYWOVIp4Cet5H4cuxr');
    FastClick.attach(document.body);
  }

  function debounce(func, wait) {
    var timeout;
    return function() {
      var context = this;
      var args = arguments;
      var callback = function() {
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(callback, wait);
    };
  }

  module.service('xmlHelpers', function () {
    function parseXml(xml) {
       var dom = null;
       if (window.DOMParser) {
          try {
             dom = (new DOMParser()).parseFromString(xml, 'text/xml');
          }
          catch (e) { dom = null; }
       }
       else if (window.ActiveXObject) {
          try {
             dom = new window.ActiveXObject('Microsoft.XMLDOM');
             dom.async = false;
             if (!dom.loadXML(xml)) {
                console.log(dom.parseError.reason + dom.parseError.srcText);
             } // parse error
          }
          catch (e) { dom = null; }
       }

       return dom;
    }

    return { parseXml: parseXml };
  });

  module.controller('mainCtrl', function ($scope, $state, xmlHelpers) {
    console.log('entering mainCtrl');

    $scope.$watch('coach', debounce(function (value) {

      if (!value) {
        $scope.loading = false;
        $scope.teams = [];
        $scope.$apply();
        return;
      }

      $scope.loading = true;
      Parse.Cloud.run('coach', { coachName: value }, {
        success: function(result) {
          $state.transitionTo('home.teamList');
          var dom = xmlHelpers.parseXml(result);
          var json = xml2json(dom, ' ');
          var obj = JSON.parse(json);
          $scope.loading = false;
          $scope.teams = obj.teams.team;
          $scope.$apply();
        },
        error: function() {
          $scope.loading = false;
          $scope.teams = [];
          $scope.$apply();
        }
      });
    }, 750));
  });

})();
