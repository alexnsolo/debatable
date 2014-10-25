'use strict';

angular.module('debatable')
	.controller('HomeCtrl', ['$scope', '$state', '$firebase', 'firebaseAddress', function($scope, $state, $firebase, firebaseAddress) {
		var debatesSync = $firebase(new Firebase(firebaseAddress + '/debates'));
  	  	$scope.debates = debatesSync.$asArray();

		$scope.newDebate = function() {
			$state.go('newDebate');
		};

		$scope.isParticipating = function(debate) {
			return _.some(debate.participants, function(participant) {
				return participant.user.uid === $scope.auth.user.uid;
			});
		};

		$scope.canJoin = function(debate, participationType) {
			if ($scope.isParticipating(debate)) {
				return false;
			}

			if (participationType === 'Spectator') {
				return debate.status === 'Open' || debate.status === 'In-Progress';
			}
			else if (participationType === 'Judge') {
				return debate.maxJudges > _.where(debate.participants, {type: 'Judge'}).length;
			}
			else {
				return _.isUndefined(_.findWhere(debate.participants, {type: participationType}));
			}
		};
	}]);