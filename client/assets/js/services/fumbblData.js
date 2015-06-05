'use strict';
(function () {
  angular.module('application').service('fumbblData', function ($q, Cache) {
    var teamDataCache = new Cache(5 * 60 * 1000);

    function getTeamDataById (id) {
      var deferred = $q.defer();
      var record = teamDataCache.get(id);
      if (record) {
        return $q.when(record);
      }

      Parse.Cloud.run('team', { id: id }, {
        success: function(result) {
          var data = xmlToObject(result);
          record = data.team.record;

          teamDataCache.add(id, record);
          deferred.resolve(record);
        },
        error: function() {
          deferred.reject();
        }
      });

      return deferred.promise;
    }

    function getTeamsByCoachName (coachName) {
      var deferred = $q.defer();

      Parse.Cloud.run('coach', { coachName: coachName }, {
        success: function(result) {
          var data = xmlToObject(result);

          deferred.resolve(data);
        },
        error: function() {
          deferred.reject();
        }
      });

      return deferred.promise;
    }

    return {
      getTeamsByCoachName: getTeamsByCoachName,
      getTeamDataById: getTeamDataById
    };
  });

  function xmlToObject(xml) {
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

    var json = xml2json(dom, '  ');
    var obj = JSON.parse(json);

    return obj;
  }
})();
