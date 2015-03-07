var App = angular.module('app', []);

App.controller('GameBoard', ['$scope', 'ShutTheBox', function($scope, ShutTheBox) {

	$scope.initGame = function() {
		ShutTheBox.prepareNumbers();
		$scope.numbers = ShutTheBox.numbers;
		$scope.canPlay = false;
		$scope.diceTotal = 0;
		$scope.dice1 = $scope.dice2 = '';
	};

	$scope.initGame();

	var dice = [1, 2, 3, 4, 5, 6];

	$scope.rollDice = function(x) {
		$scope.dice1 = dice[Math.floor(Math.random() * dice.length)];
		$scope.dice2 = dice[Math.floor(Math.random() * dice.length)];
		$scope.diceTotal = $scope.dice1 + $scope.dice2;
		$scope.canPlay = true;
	};

	$scope.endTurn = function() {
		if (!$scope.diceTotal) {
			ShutTheBox.lockNumbers();
			$scope.canPlay = false;
			$scope.dice1 = $scope.dice2 = '';
		}
	};

	$scope.chooseNumber = function() {
		if (angular.element('.game-numbers').hasClass('disabled')) {
			return;
		}
		if (this.n.state === 'open') {
			if (this.n.number <= $scope.diceTotal) {
				this.n.state = 'chosen';
				$scope.diceTotal = $scope.diceTotal - this.n.number;
			}
		} else if (this.n.state === 'chosen') {
			this.n.state = 'open';
			$scope.diceTotal = $scope.diceTotal + this.n.number;
		}
		// TODO subset check
		// if (ShutTheBox.getRemainingSum() < $scope.diceTotal) {

		// }

	};

}])

.factory('ShutTheBox', function() {

	var gameLogic = {};

	gameLogic.prepareNumbers = function() {
		gameLogic.numbers = [];
		for (var i = 1; i < 10; i++) {
			gameLogic.numbers.push({
				number: i,
				state: 'open'
			});
		}
		return this;
	};

	gameLogic.getRemainingSum = function() {
		var r = 0;
		this.numbers.forEach(function(v) {
			r += v.number;
		});
		return r;
	};

	gameLogic.lockNumbers = function() {
		this.numbers.forEach(function(v) {
			if (v.state === 'chosen') {
				v.state = 'disabled';
			}
		});
		return this;
	};

	// https://gist.github.com/lrvick/1381084
	// var subset_sum = function(items, target) {
	// 	var perms = [],
	// 		layer = 0,
	// 		depth = 2,
	// 		attempts = 0,
	// 		sum, perm,
	// 		ss = function(items) {
	// 			var item = items.shift();
	// 			for (i = 0; i < items.length; i++) {
	// 				attempts = attempts + 1;
	// 				if (attempts <= items.length * items.length) {
	// 					if (layer === 0) {
	// 						perm = [items[0], items[i]];
	// 					} else {
	// 						perm = perms.shift();
	// 						perm.push(items[0]);
	// 					}
	// 					sum = 0;
	// 					for (j = 0; j < perm.length; j++) {
	// 						sum += perm[j];
	// 					}
	// 					perms.push(perm);
	// 					if (sum == target) {
	// 						return perm;
	// 					}
	// 				} else {
	// 					if (layer < depth) {
	// 						attempts = 0;
	// 						layer = layer + 1;
	// 					} else {
	// 						return null;
	// 					}
	// 				}
	// 			}
	// 			items.push(item);
	// 			return ss(items);
	// 		}
	// 	return ss(items)
	// };

	// items = [1, 2, 3, 4, 5];

	// target = 6;

	// result = subset_sum(items, target);
	// console.log(result);

	return gameLogic;

});