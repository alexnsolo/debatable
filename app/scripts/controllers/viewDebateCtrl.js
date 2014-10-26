'use strict';

angular.module('debatable').controller('ViewDebateCtrl', 
	['$scope', '$firebase', 'firebaseAddress', '$stateParams',
	function ($scope, $firebase, firebaseAddress, $stateParams) {
		var debateRef = new Firebase(firebaseAddress + '/debates/' + $stateParams.debateId);
		$scope.debate = $firebase(debateRef).$asObject();

		var argumentsRef = debateRef.child('/arguments');
		$scope.debateArguments = $firebase(argumentsRef).$asArray();

		debateRef.once('value', function (snapshot) {
			checkDebateStatus(snapshot.val());
		});

		function checkDebateStatus(debate) {
			if (debate.status !== 'Open') {
				return;
			}

			console.log('Checking debate status');

			var forParticipant = _.findWhere(debate.participants, {type: 'For'});
			var againstParticipant = _.findWhere(debate.participants, {type: 'Against'});
			var judges = _.where(debate.participants, {type: 'Judge'});

			if (!_.isUndefined(forParticipant) && !_.isUndefined(againstParticipant) && judges.length === debate.maxJudges) {
				console.log('Starting Debate!');
				debateRef.update({
					'status': 'In-Progress'
				});
			}
		}

		/*
		 * New Argument
		 */
		$scope.newArgument = null;
		$scope.startNewArgument = function() {
			$scope.newArgument = {};
		};

		$scope.cancelNewArgument = function() {
			$scope.newArgument = null;
		};

		$scope.createNewArgument = function() {
			var newArgument = $scope.newArgument;
			newArgument.user = { 
				uid: $scope.auth.user.uid,
			 	displayName: $scope.auth.user.displayName 
			};	
			newArgument.timestamp = Date.now();

			var argumentsRef = debateRef.child('/arguments/');
			argumentsRef.push(newArgument);

			$scope.newArgument = null;
		};

		/*
		 * New Rebuttal
		 */
		var rebuttals = {};
		$scope.newRebuttal = function(argument) {
			return rebuttals[argument.$id];
		};

		$scope.startNewRebuttal = function(argument) {
			rebuttals[argument.$id] = {};
		};

		$scope.cancelNewRebuttal = function(argument) {
			rebuttals[argument.$id] = null;
		};

		$scope.createNewRebuttal = function(argument) {
			var newRebuttal = rebuttals[argument.$id];
			newRebuttal.user = { 
				uid: $scope.auth.user.uid,
			 	displayName: $scope.auth.user.displayName 
			};	
			newRebuttal.timestamp = Date.now();

			var argumentRef = debateRef.child('/arguments/' + argument.$id);
			argumentRef.update({
				'rebuttal' : newRebuttal
			});

			rebuttals[argument.$id] = null;
		};

		/*
		 * Set Bounty
		 */
		var bounties = {};
		$scope.newBounty = function(argument) {
			return bounties[argument.$id];
		};

		$scope.startNewBounty = function(argument) {
			bounties[argument.$id] = {value: 0};
		};

		$scope.cancelNewBounty = function(argument) {
			bounties[argument.$id] = null;
		};

		$scope.createNewBounty = function(argument) {
			var newBounty = bounties[argument.$id];
			newBounty.user = { 
				uid: $scope.auth.user.uid,
			 	displayName: $scope.auth.user.displayName 
			};	
			newBounty.timestamp = Date.now();

			var bountiesRef = debateRef.child('/arguments/' + argument.$id + '/bounties');
			bountiesRef.push(newBounty);

			var participantsRef = debateRef.child('/participants/');
			participantsRef.once('value', function(snapshot) {
				var participantId;
				var participant;
				snapshot.forEach(function(childSnapshot) {
				  	var childData = childSnapshot.val();
				  	if (childData.user.uid === $scope.auth.user.uid) {
						participantId = childSnapshot.name();
						participant = childData;
				  	}
				});

				var newBountyAvailable = participant.bountyAvailable - newBounty.value;

				var participantRef = participantsRef.child(participantId);
				participantRef.update({
					'bountyAvailable': newBountyAvailable
				});
			});

			bounties[argument.$id] = null;
		};

		/*
		 * Award Argument
		 */

		var awardArgument = {};
		$scope.newAwardArgument = function(argument) {
			return awardArgument[argument.$id];
		};

		$scope.startAwardArgument = function(argument) {
			awardArgument[argument.$id] = {value: 'For'};
		};

		$scope.cancelAwardArgument = function(argument) {
			awardArgument[argument.$id] = null;
		};

		$scope.submitAwardArgument = function(argument) {
			var awardValue = awardArgument[argument.$id].value;
			var argumentRef = debateRef.child('/arguments/' + argument.$id);
			argumentRef.update({
				'awardedTo' : awardValue
			});

			awardArgument[argument.$id] = null;
		};

		/*
		 * End Debate
		 */
		$scope.endDebate = function() {
			var debateRef2 = $firebase(new Firebase(firebaseAddress + '/debates/' + $stateParams.debateId));
			debateRef2.$update({
				'status': 'Closed'
			});	
		};

		/*
		 * UI Helpers
		 */

		function getParticipant(user) {
			return _.find($scope.debate.participants, function(participant) {
				return participant.user.uid === user.uid;
			});
		}

		$scope.bountiesAwarded = {
			For: 0,
			Against: 0
		};

		$scope.$watch('debate', function() {
			$scope.bountiesAwarded.For = getBountiesAwarded('For');
			$scope.bountiesAwarded.Against = getBountiesAwarded('Against');
		}, true);

		function getBountiesAwarded(side) {
			var bounties = 0;
			_.each($scope.debate.arguments, function(argument) {
				if (argument.awardedTo === side) {
					_.each(argument.bounties, function(bounty) {
						bounties += bounty.value;
					});
				}
			});
			return bounties;
		}

		$scope.isArgumentAwardedTo = function(argument, user) {
			if (_.isUndefined(argument) || _.isUndefined(user)) {
				return false;
			}

			var participant = getParticipant(user);
			if (_.isUndefined(participant)) {
				return false;
			}
			return participant.type === argument.awardedTo;
		};

		$scope.getSideLabel = function(user) {
			if (_.isUndefined(user)) {
				return 'label-default';
			}

			var participant = getParticipant(user);
			if (_.isUndefined(participant)) {
				return 'label-default';
			}
			if (participant.type === 'For') {
				return 'label-success';
			}
			else if (participant.type === 'Against') {
				return 'label-danger';	
			} 
			else {
				return 'label-primary';	
			}
		};

		$scope.getBountyAvailable = function() {
			var participant = getParticipant($scope.auth.user);
			return participant.bountyAvailable;
		};

		$scope.canStartArgument = function() {
			if (_.isNull($scope.auth.user)) {
				return false;
			}

			if ($scope.debate.status !== 'In-Progress') {
				return false;
			}

			var participant = getParticipant($scope.auth.user);
			if (_.isUndefined(participant)) {
				return false;
			}

			if (participant.type === 'Judge') {
				return false;
			}

			return true;
		};

		$scope.canCreateRebuttal = function(argument) {
			if (_.isUndefined(argument) ||  _.isNull($scope.auth.user)) {
				return false;
			}

			if ($scope.debate.status !== 'In-Progress') {
				return false;
			}


			var participant = getParticipant($scope.auth.user);
			if (_.isUndefined(participant)) {
				return false;
			}

			if (participant.type !== 'For' && participant.type !== 'Against') {
				return false;
			}

			return argument.user.uid !== $scope.auth.user.uid && _.isUndefined(argument.rebuttal);
		};

		$scope.canSetBounty = function(argument) {
			if (_.isUndefined(argument) || _.isNull($scope.auth.user)) {
				return false;
			}

			if ($scope.debate.status !== 'In-Progress') {
				return false;
			}

			var participant = getParticipant($scope.auth.user);
			if (_.isUndefined(participant)) {
				return false;
			}

			return _.isUndefined(argument.awardedTo);
		};

		$scope.canAwardArgument = function(argument) {
			if (_.isUndefined(argument) ||  _.isNull($scope.auth.user)) {
				return false;
			}

			if ($scope.debate.status !== 'In-Progress') {
				return false;
			}

			var participant = getParticipant($scope.auth.user);
			if (_.isUndefined(participant)) {
				return false;
			}

			if (participant.type !== 'Judge') {
				return false;
			}

			return !_.isUndefined(argument.rebuttal) && _.isUndefined(argument.awardedTo) && !_.isEmpty(argument.bounties);
		};

		$scope.canEndDebate = function() {
			if (_.isNull($scope.auth.user)) {
				return false;
			}

			if ($scope.debate.status !== 'In-Progress') {
				return false;
			}

			var participant = getParticipant($scope.auth.user);
			if (_.isUndefined(participant)) {
				return false;
			}

			if (participant.type !== 'Judge') {
				return false;
			}

			return $scope.debate.status === 'In-Progress' && !_.isEmpty($scope.debate.arguments);
		};

		$scope.showBountiesWon = function() {
			return $scope.debate.status !== 'Open';
		};

		$scope.debateIsOpen = function() {
			return $scope.debate.status === 'Open';
		};
	}]
);