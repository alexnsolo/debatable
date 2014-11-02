'use strict';

angular.module('debatable')
	.directive('debateListItem', function() {
		return {
			restrict: 'E',
			scope: {
				debate: '='
			},
			templateUrl: 'partials/debateListItem.html',
			controller: ['$scope', '$rootScope', '$state', '$firebase', 'firebaseAddress', 
			function($scope, $rootScope, $state, $firebase, firebaseAddress) {
				$scope.isParticipating = $rootScope.auth.user && _.some($scope.debate.participants, function(participant) {
					return participant.user.uid === $rootScope.auth.user.uid;
				});

				$scope.statusLabel = {
					'Open': 'label-primary',
					'In-Progress': 'label-success',
					'Closed': 'label-danger'
				}[$scope.debate.status];

				function canJoinAs(participationType) {
					if ($scope.isParticipating === true) {
						return false;
					}
					if (participationType === 'Spectator') {
						return $scope.debate.status === 'Open' || $scope.debate.status === 'In-Progress';
					}
					if (participationType === 'Judge') {
						return $scope.debate.maxJudges > _.where($scope.debate.participants, {type: 'Judge'}).length;
					}
					return _.isUndefined(_.findWhere($scope.debate.participants, {type: participationType}));
				}
				
				$scope.canJoinAsFor = canJoinAs('For');
				$scope.canJoinAsAgainst = canJoinAs('Against');
				$scope.canJoinAsJudge = canJoinAs('Judge');

				$scope.joinDebate = function(participationType) {
					var participantsRef = new Firebase(firebaseAddress + '/debates/' + $scope.debate.$id + '/participants');
					participantsRef.push({
						user: { 
							uid: $rootScope.auth.user.uid,
						 	displayName: $rootScope.auth.user.displayName 
						},
						type: participationType
					});

					$scope.viewDebate();
				};

				$scope.viewDebate = function() {
					$state.go('viewDebate', {debateId: $scope.debate.$id});
				};
			}]
		};
	}
);