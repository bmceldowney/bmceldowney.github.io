'use strict';
(function () {

  angular.module('application').directive('teamRow', function (fumbblData) {
    return {
      scope: { team: '=' },
      link: function (scope, element) {
        fumbblData.getTeamDataById(scope.team.id).then(
          function success (result) {
            scope.record = result.wins + ' | ' + result.ties + ' | ' + result.losses;
          },
          function error () {

          });
      },
      templateUrl: 'templates/teamRow.html'
    };
  });
})();
