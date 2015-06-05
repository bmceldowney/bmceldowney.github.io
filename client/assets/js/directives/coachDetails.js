'use strict';
(function () {

  angular.module('application').directive('teamRow', function (xmlHelpers) {
    return {
      scope: { team: '=' },
      link: function (scope, element) {
        Parse.Cloud.run('team', { id: scope.team.id }, {
          success: function(result) {

            var dom = xmlHelpers.parseXml(result);
            var json = xml2json(dom, ' ');
            var obj = JSON.parse(json);
            var record = obj.team.record;
            scope.record = record.wins + ' | ' + record.ties + ' | ' + record.losses;
            scope.$apply();
          },
          error: function() {
          }
        });
      },
      template: '<a ui-sref="home.teamDetail({ id: {{team.id}} })" class="team-row grid-block medium-12"> \
                   <div class="grid-content medium-3 team-cell">{{team.name}}</div> \
                   <div class="grid-content medium-2 team-cell show-for-medium">{{team.race}}</div> \
                   <div class="grid-content medium-2 team-cell show-for-medium">{{team.rating}}</div> \
                   <div class="grid-content medium-2 team-cell show-for-medium">{{record}}</div> \
                 </a>'
    };
  });
})();
