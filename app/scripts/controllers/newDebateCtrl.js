'use strict';

angular.module('debatable')
	.controller('NewDebateCtrl', 
	['$scope', '$rootScope', 'firebaseAddress', '$state', 
	function ($scope, $rootScope, firebaseAddress, $state) {
		$scope.debate = {
			topic: '',
			maxTime: 15,
			maxJudges: 1,
			status: 'Open',
			participants: []
		};

		$scope.participationType = 'For';

		$scope.createDebate = function() {
			var debatesRef = new Firebase(firebaseAddress + '/debates');
			var newDebate = $scope.debate;
			var newDebateRef = debatesRef.push(newDebate);

			var participantsRef = new Firebase(firebaseAddress + '/debates/' + newDebateRef.name() + '/participants');
			participantsRef.push({
				user: { 
					uid: $rootScope.auth.user.uid,
				 	displayName: $rootScope.auth.user.displayName 
				},
				type: $scope.participationType,
				creator: true
			});

			$state.go('home');
		};
	}]
);