/* CuBeDoo */

var qbdoo = {
	currentLevel: 1,
	currentTheme: "numbers",
	gameDuration: 120,
	score: 0,

	game: document.querySelector("article"),
	board: document.querySelector("#board"),
	footer: document.querySelector("article footer"),
	highscorepage: document.querySelector("#highscores"),
	highscorelist: document.querySelectorAll("#highscorelist li"),

	cards: 16,
	iterations: 0,
	iterationsPerLevel: 3,
	possibleLevels: 3,
	pauseFlipping: false, // after 2nd card, so time to see card

	timerPause: true, //before start of game
	interval: false, //before start of game

	gameover: document.getElementById('gameover'),
	levelover: document.getElementById('levelover'),

	cardEls: [],
	cardarray: [],
	cardarray2: [],

	highScores: [],
	maxHighScores: 5,

	storageType: "local",

	init: function() {
		qbdoo.setupGame();
	},

	setupGame: function() {
		// make sure global arrays are empty

		// go up a level after "iterationsPerLevel" number of iterations
		if (qbdoo.iterations && (qbdoo.iterations % qbdoo.iterationsPerLevel == 0)) {
			qbdoo.levelUp();	
		}

		qbdoo.maxHighScores = qbdoo.highscorelist.length;
		qbdoo.loadHighScores();
		qbdoo.renderHighScores();

		qbdoo.gameover.style.display = 'none';
		qbdoo.levelover.style.display = 'none';
		qbdoo.cardarray = [];
		qbdoo.cardarray2 = [];

		// populate all the active blocks with data valuess
		for (var i = 1; i <= qbdoo.cards; i++) {

			// get pairs of random numbers
			var num = "";
			while (!num) { 
				num = qbdoo.randomize(); 
			}

			// set the data-value for each card
			qbdoo.board.querySelector("div[data-position='" + i + "']").setAttribute("data-value", num);
		}

		qbdoo.timerPause = true;
		qbdoo.pauseOrPlayBoard('pause');
		qbdoo.events();
		qbdoo.setTimer();

		// add to iterations so that iterationsPerLevel will eventually cause a level increase.
		qbdoo.iterations++;
	},

	events: function() {
		qbdoo.cardEls = qbdoo.board.querySelectorAll("#board div:not([data-value='0'])");

		var cards = qbdoo.cardEls.length;
		for (var i = 0; i < cards; i++) {
			qbdoo.cardEls[i].addEventListener("click", qbdoo.turnCard );
		}
	},

	levelUp: function() {
		qbdoo.currentLevel++

		if (qbdoo.currentLevel <= qbdoo.possibleLevels) {
			// look and feel is completely determined by class of the board
			document.getElementById('board').className = 'level' + qbdoo.currentLevel;
		}

		document.querySelector('#level output').innerHTML = qbdoo.currentLevel;

		// to increase the possible values of the front of the cards
		if (qbdoo.currentLevel == 2 || qbdoo.currentLevel == 3) {
			qbdoo.cards += 4;
		}
		// if we've maxed out the levels, the game gets harder (shorter time) with level increases.
		else if (qbdoo.currentLevel > qbdoo.possibleLevels) {

			qbdoo.gameDuration -= 5;
		}
	},

	turnCard: function() {
		// timer starts on first flip
		if (qbdoo.timerPause) {
			qbdoo.timerPause = false;
			qbdoo.pauseOrPlayBoard('play');
		}

		//can flip cards at this time
		if (qbdoo.pauseFlipping) {
			return false;
		}

		//turns the card by changing the className
		this.classList.add('flipped');
		qbdoo.flipped = document.querySelectorAll('div.flipped');

		// if this is the 2nd card currently flipped, check for matching
		if (qbdoo.flipped.length == 2) {
			qbdoo.pauseFlipping = true;
			setTimeout(function() {
				qbdoo.handleMatching();
			}, 500);
		}
	},

	handleMatching: function() {
		// do cards match each other?
		if (qbdoo.matched()) {
			//then hide them
			qbdoo.hideCards();
		} else {

		//remove class whether or not matched
		qbdoo.flipped[0].classList.remove('flipped');
		qbdoo.flipped[1].classList.remove('flipped');
		}
		// once done, allow game to continue
		qbdoo.pauseFlipping = false;

		//check end of level
		if (qbdoo.isLevelOver()) {
			console.log('Level is over')
			qbdoo.endLevel();
		}
	},

	// check if 2 cards match
	matched: function() {
		if (qbdoo.getValue(qbdoo.flipped[0]) == qbdoo.getValue(qbdoo.flipped[1])) {
			return true;
		}
		else {
			return false;
		}
	},

	// nullify cards upon match
	hideCards: function() {
		qbdoo.flipped[0].classList.add('matched');
		qbdoo.flipped[1].classList.add('matched');
		setTimeout(function(){
			var matched = document.querySelectorAll('div.matched'), i = 0;
			for(; i < 2; i++){
				matched[i].dataset['value'] = 0;
				matched[i].classList.remove('matched');
				matched[i].classList.remove('flipped');
			}
		}, 300);
	},

	// check level status 
	isLevelOver: function() {
		// not over if any card has data value
		if (qbdoo.board.querySelectorAll("#board div[data-value]:not([data-value='0'])").length > 2) {
			console.log(qbdoo.board.querySelectorAll("#board div[data-value]:not([data-value='0'])").length)
			return false;
		}
		else {
			// if no data-values, game is over
			console.log('foo')
			return true;
		}
	},

	// when level ends or game is over
	endLevel: function() {
		// Stop the timer
		qbdoo.timerPause = true;
		qbdoo.pauseOrPlayBoard('pause');

		// Add to score
		document.querySelector("#score output").innerHTML = qbdoo.score += qbdoo.timeLeft;

		if (qbdoo.timeLeft) {
			// Announce End of Level
			qbdoo.levelover.getElementsByTagName('output')[0].innerHTML = qbdoo.score;
			qbdoo.levelover.style.display = 'block';

			// restart a new game
			// leaving the score up for a few seconds
			setTimeout(function() {
				qbdoo.setupGame();
			}, 4000);
		}
		else {
			// Announce End of Game: update score, show game over and remove timer
			qbdoo.gameover.getElementsByTagName('output')[0].innerHTML = qbdoo.score;
			qbdoo.gameover.style.display = 'block';
			qbdoo.timerShell.innerHTML = "";
		}
	},

	getValue: function(mycard) {
		//get the data-value of the card
		return mycard.dataset['value'];
	},

	pauseOrPlayBoard: function(state) {
		//class controls animation of timer
		if (state == "pause") {
			qbdoo.game.classList.add('paused');
		}
		else if (state == "play") {
			qbdoo.game.classList.remove('paused');			
		}
	},

	setTimer: function() {
		qbdoo.timerShell = document.querySelector("#timer output");
		qbdoo.timerShell.innerHTML = qbdoo.timeLeft = qbdoo.gameDuration;
		qbdoo.timer();
	},

	timer: function() {
		//the timer function.
		if (!qbdoo.interval) {
			qbdoo.interval = setInterval(function() { dropASecond(); }, 1000);
		}

		function dropASecond() {
			if (!qbdoo.timerPause) {
				qbdoo.timeLeft = qbdoo.timeLeft - 1;
				qbdoo.timerShell.innerHTML = qbdoo.timeLeft;
			}

			if (!qbdoo.timeLeft) {
				qbdoo.timerPause = true;
				qbdoo.pauseOrPlayBoard('pause');
				qbdoo.clearAll();
				qbdoo.endLevel();	
			}
		}
	},

	randomize: function() {
		// get a random number 
		var num = Math.floor(Math.random() * (qbdoo.cards / 2) + 1);

		// make sure that random number isn't already used twice
		if (qbdoo.cardarray.indexOf(num) < 0) {
			qbdoo.cardarray.push(num);
			return num;
		}
		
		if (qbdoo.cardarray2.indexOf(num) < 0) {
			qbdoo.cardarray2.push(num);
			return num;
		}

		return "";
	},

	pauseGame: function() {
		// use dataset to get value for all the cards.
		console.log('paused selected');
		qbdoo.pauseOrPlayBoard('pause');

		// add theme to value set

		// add level to value set

		// add timeleft to value set

		// add score to value set

		// add to local storage

		// kill the timer

		// return
	},

	playGame: function() {
		// get local storage

		// set the theme

		// set the level

		// set the 24 cards

		// set the score back

		// start the time
	},

	renderMenu: function() {

	},

	clearAll: function() {
		// sets all values to 0
		for (var i = 1; i <= qbdoo.cards; i++) {
			qbdoo.board.querySelector("div[data-position='" + i + "']").setAttribute("data-value", 0);
		}
	},

	changeTheme: function(klass) {
		//change the theme by changing the class
		document.getElementById('game').setAttribute('class', klass);
	},

	addHighScore: function(score, player) {
		qbdoo.highScores[qbdoo.highScores.length] = { score: score, player: player };
		qbdoo.sortHighScores();
		qbdoo.renderHighScores(score, player);

		console.log(qbdoo.highScores);
	},

	sortHighScores: function() {
		// custom sorting function to compare score for each object
		var scores = qbdoo.highScores.sort(function(a, b) {
			if (a.score > b.score) {
				return -1;
			}
			else if (a.score == b.score) {
				return 0;
			}
			else {
				return 1;
			}
		});

		// make sure we don't have more scores than we need
		qbdoo.highScores = scores.slice(0, qbdoo.maxHighScores);
	},

	saveHighScores: function() {
		localStorage.setItem("highScores", JSON.stringify(qbdoo.highScores));
	},

	loadHighScores: function() {
		var scores = localStorage.getItem("highScores");
		if (scores) {
			qbdoo.highScores = JSON.parse(scores);
			qbdoo.sortHighScores();
		}
	},
	
	renderHighScores: function(score, player) {
		var classname = "";
		var highlighted = false;
		
		for (var i = 0; i < qbdoo.maxHighScores; i++) {
			if (i < qbdoo.highScores.length) {
				qbdoo.highscorelist[i].innerHTML = "<em>" + qbdoo.highScores[i].score + "</em> " + qbdoo.highScores[i].player;

				// if provided, highlight score from current game
				if (!highlighted && typeof player !== "undefined" && typeof score !== "undefined") {
					if (qbdoo.highScores[i].player == player && qbdoo.highScores[i].score == score) {
						classname = "current";
						highlighted = true;
					}
				}
				else {
					classname = "";
				}
			}
			else {
				qbdoo.highscorelist[i].innerHTML = "";
			}

			qbdoo.highscorelist[i].className = classname;
		}
	}
};

//Initialize the js
document.addEventListener("load", qbdoo.init());

