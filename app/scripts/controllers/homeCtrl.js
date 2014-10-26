'use strict';

angular.module('debatable')
	.controller('HomeCtrl', ['$scope', '$state', '$firebase', 'firebaseAddress', function($scope, $state, $firebase, firebaseAddress) {
		var debatesRef = $firebase(new Firebase(firebaseAddress + '/debates'));
  	  	$scope.debates = debatesRef.$asArray();

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

		$scope.joinDebate = function(debate, participationType) {
			var participantsRef = new Firebase(firebaseAddress + '/debates/' + debate.$id + '/participants');
			participantsRef.push({
				user: { 
					uid: $scope.auth.user.uid,
				 	displayName: $scope.auth.user.displayName 
				},
				type: participationType
			});

			$scope.viewDebate(debate);
		};

		$scope.viewDebate = function(debate) {
			$state.go('viewDebate', {debateId: debate.$id});
		};

		$scope.getDebateStatusLabel = function(debate) {
			if (debate.status === 'Open') {
				return 'label-primary';
			}
			else if (debate.status === 'In-Progress') {
				return 'label-success';
			}
			else if (debate.status === 'Closed') {
				return 'label-danger';
			}
		};
	}]);