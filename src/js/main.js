var App = angular.module('app', []);

App.controller('GameBoard', ['$scope', 'ShutTheBox', function($scope, ShutTheBox) {

	$scope.initGame = function() {
		ShutTheBox.prepareNumbers();
		$scope.numbers = ShutTheBox.numbers;
		$scope.diceTotal = 0;
		$scope.canPlay = false;
		$scope.disableTurnButton = true;
		$scope.dice1 = $scope.dice2 = '';
	};

	$scope.initGame();

	var dice = [1, 2, 3, 4, 5, 6];

	$scope.rollDice = function() {
		$scope.dice1 = dice[Math.floor(Math.random() * dice.length)];
		$scope.dice2 = dice[Math.floor(Math.random() * dice.length)];
		// $scope.dice1 = parseInt(prompt('Enter number:'));
		// $scope.dice2 = parseInt(prompt('Enter number:'));
		$scope.diceTotal = $scope.dice1 + $scope.dice2;
		$scope.canPlay = true;
		// Check if game ended
		if (!ShutTheBox.IsThereMorePossibilies($scope.diceTotal)) {
			alert('Game Over');
		}
	};

	$scope.endTurn = function() {
		if (!$scope.diceTotal) {
			ShutTheBox.lockNumbers();
			$scope.canPlay = false;
			$scope.disableTurnButton = true;
			$scope.dice1 = $scope.dice2 = '';
			if (!ShutTheBox.getActiveNumbers().length) {
				$scope.canPlay = true;
				alert('Shut The Box!');
			}
		}
	};

	$scope.chooseNumber = function() {
		if (angular.element('.game-numbers').hasClass('disabled')) {
			return;
		}
		if (this.n.state === 'open') { // User chooses a number
			if (this.n.number <= $scope.diceTotal) {
				this.n.state = 'chosen';
				$scope.diceTotal = $scope.diceTotal - this.n.number;
				if (!$scope.diceTotal) {
					$scope.disableTurnButton = false;
				}
			}
		} else if (this.n.state === 'chosen') { // User changed mind, unset sum
			this.n.state = 'open';
			$scope.diceTotal = $scope.diceTotal + this.n.number;
			$scope.disableTurnButton = true;
		}
	};

}])

.factory('ShutTheBox', function() {

	var gameLogic = {};

	gameLogic.prepareNumbers = function() {
		this.numbers = [];
		for (var i = 1; i < 10; i++) {
			this.numbers.push({
				number: i,
				state: 'open'
			});
		}
		return this;
	};

	// Close numbers that were selected
	gameLogic.lockNumbers = function() {
		this.numbers.forEach(function(v) {
			if (v.state === 'chosen') {
				v.state = 'disabled';
			}
		});
		return this;
	};

	// Get numbers that are still in the game
    gameLogic.getActiveNumbers = function() {
    	var r = [];
    	this.numbers.forEach(function(v) {
    		if (v.state === 'open') {
    			r.push(v.number);
    		}
		});
		return r;
    };

    gameLogic.IsThereMorePossibilies = function(s) {
    	var stack = [],
	    	sumInStack = 0,
	    	results = [],
	    	// http://codereview.stackexchange.com/questions/36214/find-all-subsets-of-an-int-array-whose-sums-equal-a-given-target
			subsetSums = function(data, fromIndex, endIndex, sum) {
		        if (sumInStack == sum) {
		            results.push(stack.slice());
		        }
		    	for (var currentIndex = fromIndex; currentIndex < endIndex; currentIndex++) {

		            if (sumInStack + data[currentIndex] <= sum) {
		                stack.push(data[currentIndex]);
		                sumInStack += data[currentIndex];

		                subsetSums(data, currentIndex + 1, endIndex, sum);
		                sumInStack -= stack.pop();
		            }
		        }
		    };
		var items = this.getActiveNumbers();
		// console.log(s, items);
	    subsetSums(items, 0, items.length, s);
	    return !!results.length;
    };

	return gameLogic;

});