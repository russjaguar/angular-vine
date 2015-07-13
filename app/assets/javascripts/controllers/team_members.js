AngularVine.controller('TeamMembersCtrl', ['$scope', '$location', 'dragularService', function($scope, $location, dragularService) {
  $('base').attr('href', '/');
  $location.path('/team-members').search({show: 'all'});
  
  dragularService($('.projects'), {
    moves: function (el, container, handle) {
      return handle.className === 'handle';
    }
  });
  
  $scope.teamMembers = [];

  // TODO build filtered URI, load data from store

  $scope.teamMembers = {
    'Developers': [
      {id: 1, name: 'Russ', projects: [
        {
          id: 1,
          name: 'Jaguar Vine',
          tasks: [
            {id: 1, user_id: 1, content: 'Note 1'},
            {id: 2, user_id: 1, content: 'Note 2'},
            {id: 3, user_id: 1, content: 'Note 3'},
          ],
          state: 'H'
        },
        {id: 2, name: 'Test Project', tasks: [], state: 'jd'}
      ]}
    ]
  };

  $scope.addTask = function(teamName, index) {
    $scope.teamMembers[teamName][index].tasks.push({note: 'Click to edit'});
  };

  $scope.removeTask = function(teamName, parentIndex, index) {
    $scope.teamMembers[teamName][parentIndex].tasks.splice(index, 1);
  };
  
  $scope.setState = function(teamName, parentIndex, index, newState) {
    $scope.teamMembers[teamName][parentIndex].tasks[index].state = newState;
  }

  $scope.toggleEditTeamMember = function(teamName, index) {
    $scope.teamMembers[teamName][index].editing = !$scope.teamMembers[teamName][index].editing;
  };

  $scope.toggleEditTask = function(teamName, parentIndex, index) {
    $scope.teamMembers[teamName][parentIndex].tasks[index].editing = !$scope.teamMembers[teamName][parentIndex].tasks[index].editing;
  };
}]);

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

AngularVine.directive('stateColor', function($timeout) {
  return {
    link: function(scope, element, attrs) {
      $timeout(function() {
        console.debug(scope);
        element.addClass('state-color-');
      });
    }
  }
});
