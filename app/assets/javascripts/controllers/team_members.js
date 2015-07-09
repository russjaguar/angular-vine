AngularVine.controller('TeamMembersCtrl', function($scope, $location) {
  $('base').attr('href', '/team-members');
  $location.path('/team-members').search({show: 'all'});

  $scope.teamMembers = [];

  // TODO build filtered URI, load data from store

  $scope.teamMembers = {
    'Developers': [
      {name: 'Russ', projects: []},
      {name: 'Justin', projects: []},
      {name: 'Zach', projects: []}
    ],
    'Administrative': [
      {name: 'Terry', projects: []},
      {name: 'Linda', projects: []}
    ]
  };

  $scope.addTask = function(teamName, index) {
    $scope.teamMembers[teamName][index].tasks.push({note: 'Click to edit'});
  };

  $scope.removeTask = function(teamName, parentIndex, index) {
    $scope.teamMembers[teamName][parentIndex].tasks.splice(index, 1);
  };

  $scope.toggleEditTeamMember = function(teamName, index) {
    $scope.teamMembers[teamName][index].editing = !$scope.teamMembers[teamName][index].editing;
  };

  $scope.toggleEditTask = function(teamName, parentIndex, index) {
    $scope.teamMembers[teamName][parentIndex].tasks[index].editing = !$scope.teamMembers[teamName][parentIndex].tasks[index].editing;
  };
});

AngularVine.directive('focusInput', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      element.bind('click', function() {
        $timeout(function() {
          element.siblings('input')[0].focus();
        });
      });
    }
  };
});

AngularVine.directive('blurOnEnter', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      element.bind('keydown', function(event) {
        $timeout(function() {
          if(event.keyCode == 13) {
            element[0].blur();
          }
        });
      });
    }
  };
});
