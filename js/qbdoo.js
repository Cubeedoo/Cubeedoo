/* CuBeDoo */

var qbdoo = {
	//game settings
	currentLevel: 1,
	currentTheme: "numbers",
	gameDuration: 120,
	score: 0,
    matchedSound: 'assets/match.mp3',
    failedMatchSound: 'assets/notmatch.mp3',
    mute: false,
	cards: 16,
	iterations: 0,
	iterationsPerLevel: 3,
	possibleLevels: 3,
	maxHighScores: 5,
	storageType: "local",
	game: document.querySelector("article"),
	board: document.querySelector("#board"),
	footer: document.querySelector("article footer"),
	highscorepage: document.querySelector("#highscores"),
	highscorelist: document.querySelectorAll("#highscorelist li"),
	gameover: document.getElementById('gameover'),
	levelover: document.getElementById('levelover'),
	congrats: document.getElementById('congrats'),
	btn_mute: document.getElementById('mute'),
	btn_pause: document.getElementById('pause'),
	scoreoutput: document.querySelector("#score output"),
	//matchfound: document.getElementById('matchsound'),
	//failedmatch: document.getElementById('nonmatchsound'),
	game: document.getElementById('game'),
	themeChanger: document.getElementById('themechanger'),
	pauseFlipping: false, // after 2nd card, so time to see card
	timerPause: true, //before start of game
	interval: false, //before start of game
	player: sessionStorage.getItem('user') || '',
	cardEls: [],
	cardarray: [],
	cardarray2: [],
	highScores: JSON.parse(localStorage.getItem('scores')) || [],

	init: function() {
		qbdoo.setupGame();
	},

	setupGame: function(savedCards) {
		var cardsValues, cards;
		if(savedCards){ // if starting from pause
			cardsValues = JSON.parse(savedCards);
			cards = document.querySelectorAll('div[data-position]'); 
			for(i = 0; i < qbdoo.cards; i++){
				for (key in cardsValues[i]) {
					cards[i].dataset[key] = cardsValues[i][key];
				}
			}		
		} else { // not from pause
			// go up a level after "iterationsPerLevel" number of iterations
			if (qbdoo.iterations && (qbdoo.iterations % qbdoo.iterationsPerLevel == 0)) {
				qbdoo.levelUp();	
			}
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
		  // add to iterations so that iterationsPerLevel will eventually cause a level increase.
			qbdoo.iterations++; 
		}
		qbdoo.maxHighScores = qbdoo.highscorelist.length;
		qbdoo.loadHighScores();
		qbdoo.renderHighScores();
		qbdoo.cardarray = [];
		qbdoo.cardarray2 = [];
		qbdoo.timerPause = true;
		qbdoo.pauseOrPlayBoard('pause');
		qbdoo.cardClicks();
		qbdoo.eventHandlers();
		qbdoo.setTimer(savedCards);
		qbdoo.changeTheme();
		qbdoo.pauseGame('newgame'); //stores settings


		qbdoo.congratulations('off');
	},

	cardClicks: function() {
		qbdoo.cardEls = qbdoo.board.querySelectorAll("#board div:not([data-value='0'])");

		var cards = qbdoo.cardEls.length;
		for (var i = 0; i < cards; i++) {
			qbdoo.cardEls[i].addEventListener("click", qbdoo.turnCard );
		}
	},

	eventHandlers: function(){
		qbdoo.btn_pause.addEventListener('click', qbdoo.pauseGame);
		qbdoo.btn_mute.addEventListener('click', qbdoo.toggleMute);
		qbdoo.themeChanger.addEventListener('change', qbdoo.changeTheme);
	},
	pauseToNewGame: function(){
		qbdoo.btn_pause.removeEventListener('click', qbdoo.pauseGame);
		qbdoo.btn_pause.addEventListener('click', qbdoo.startNewGame);
	},
	startNewGame: function(){
		qbdoo.playGame('newgame');
		qbdoo.gameover.classList.remove('visible');
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
		// at first it goes down by 5 seconds per level, and then down by 2 then 1 second per level after 
		else if (qbdoo.currentLevel > qbdoo.possibleLevels) {
			if(qbdoo.gameDuration > 60){
				qbdoo.gameDuration -= 5;
			} else if (qbdoo.gameDuration > 30){
				qbdoo.gameDuration -= 2;
			} else {
				qbdoo.gameDuration -= 1;
			}
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
			//play sound
			qbdoo.playSound(true);
			//increase score
			qbdoo.scoreoutput.innerHTML = qbdoo.score += 2;

		} else {
			qbdoo.playSound(false);
		//remove class whether or not matched
		qbdoo.flipped[0].classList.remove('flipped');
		qbdoo.flipped[1].classList.remove('flipped');
		}
		// once done, allow game to continue
		qbdoo.pauseFlipping = false;

		//check end of level
		if (qbdoo.isLevelOver()) {
			//Level is over
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
	toggleMute: function(){
		if(qbdoo.mute === true){
			qbdoo.mute = false;
			qbdoo.btn_mute.classList.remove('on');
		} else {
			qbdoo.mute = true;
			qbdoo.btn_mute.classList.add('on');
		}
		qbdoo.alterAValue('mute', qbdoo.mute);
	},

	playSound: function(matched){
		//if sound is off for game, skip
		if(qbdoo.mute) {
			return false;
		}
		if(!qbdoo.audio){
			qbdoo.audio = document.createElement('audio')
		}
		if(matched){
			qbdoo.audio.src = qbdoo.matchedSound;
		}
		else {
			qbdoo.audio.src = qbdoo.failedMatchSound;
		}
		qbdoo.audio.play();
	},
/*	playSound: function(matched){
		if(qbdoo.mute) {
			return false;
		}
		if(matched){
			qbdoo.matchfound.play();
		} else {
			qbdoo.failedmatch.play();
		}
	},
*/

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
			//console.log(qbdoo.board.querySelectorAll("#board div[data-value]:not([data-value='0'])").length)
			return false;
		}
		else {
			// if no data-values, game is over
			return true;
		}
	},

	// when level ends or game is over
	endLevel: function() {
		// Stop the timer
		qbdoo.timerPause = true;
		qbdoo.pauseOrPlayBoard('pause');

		// Add to score
		qbdoo.scoreoutput.innerHTML = qbdoo.score += (qbdoo.timeLeft * qbdoo.currentLevel);

		if (qbdoo.timeLeft) {
			// Announce End of Level
			qbdoo.levelover.getElementsByTagName('output')[0].innerHTML = qbdoo.score;
			qbdoo.levelover.style.display = 'block';
			qbdoo.congratulations('on');
			// restart a new game
			// leaving the score up for a few seconds
			setTimeout(function() {
				qbdoo.setupGame();
			}, 4000);
		}
		else {
			// Announce End of Game: update score, show game over and remove timer
			qbdoo.gameover.getElementsByTagName('output')[0].innerHTML = qbdoo.score;
			qbdoo.gameover.classList.add('visible');
			qbdoo.timerShell.innerHTML = "";
			qbdoo.addHighScore();
			//changes the pause link to new game link
			qbdoo.pauseToNewGame();
		}
	},
	congratulations: function(state){
		if(state === 'on') qbdoo.congrats.classList.add('visible');
		else if(state === 'off') qbdoo.congrats.classList.remove('visible');
		else qbdoo.congrats.classList.toggle('visible');
	},
	getValue: function(mycard) {
		//get the data-value of the card
		return mycard.dataset['value'];
	},

	pauseOrPlayBoard: function(state) {
		//class controls animation of timer
		if (state == "pause") {
			qbdoo.game.classList.add('paused');
			window.clearInterval(qbdoo.interval);
			qbdoo.interval = undefined;
		}
		else if (state == "play") {
			qbdoo.game.classList.remove('paused');	
			qbdoo.timer();		
		}
	},

	setTimer: function(frompaused) {
		qbdoo.timerShell = document.querySelector("#pause output");
		if(frompaused){
			qbdoo.timerShell.innerHTML = qbdoo.timeLeft;
		} else {
			qbdoo.timerShell.innerHTML = qbdoo.timeLeft = qbdoo.gameDuration;
		}
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

	pauseGame: function(newgame) {
		// if game is paused
        var currentState = {}, i, key, cardinfo = [], fulldeck = [];
       if(newgame != 'newgame'){
               // if game is paused
               if(qbdoo.game.classList.contains('paused')){
                       qbdoo.playGame();
                       return false;
               }
                //pause 
               qbdoo.pauseOrPlayBoard('pause');
      	}

//capture values for play
		// add theme to value set
		currentState.currentTheme = qbdoo.currentTheme;
		// add level to value set
		currentState.currentLevel = qbdoo.currentLevel;
		// add timeleft to value set
		currentState.timeLeft = qbdoo.timeLeft;
		// add score to value set
		currentState.score = qbdoo.score;
		// add number of cards displayed at current level
		currentState.cards = qbdoo.cards;
		// add audio state
		currentState.mute = qbdoo.mute;
		// how many iterations
		currentState.iterations = qbdoo.iterations;
		// get all the cards values and positions
		// use dataset to get value for all the cards.
  		if(newgame == 'newgame') {
               sessionStorage.setItem('defaultvalues', JSON.stringify(currentState));
               return;
       	} else {
           var currCards = document.querySelectorAll('#board > div');
            // return if there are no cards
           if(!currCards.length) {
           		console.log('error');
           		return;
           	}
           for (i = 0; i < qbdoo.cards; i++) {
             	cardinfo.push(currCards[i].dataset);
           }
        }     
        currentState.cardPositions = JSON.stringify(cardinfo);
		// add to local storage
		localStorage.setItem('pausedgame', JSON.stringify(currentState));

		//clear the board
		qbdoo.clearAll();	
		// return
	},

	playGame: function(newgame) {
		var cardsValues, cards, i;
		 // get localStorage or sessionStorage depending on state
		if(newgame == 'newgame'){
            var currentState = JSON.parse(sessionStorage.getItem('defaultvalues'));
        } else {
		// game was paused with pause button
			if(qbdoo.game.classList.contains('paused')){
				qbdoo.game.classList.remove('paused');
			}
			// get local storage
			var currentState = JSON.parse(localStorage.getItem('pausedgame'));
		}
		qbdoo.reset('pausedgame');
		// set theme to value set
		qbdoo.currentTheme = currentState.currentTheme;
		// add audio state
		qbdoo.mute = currentState.mute;
		// set level to value set
		qbdoo.currentLevel = currentState.currentLevel;
		// set timeleft to value set
		qbdoo.timeLeft = currentState.timeLeft;

		// set score to value set
		qbdoo.score = currentState.score;
		// set number of cards displayed at current level
		qbdoo.cards = currentState.cards;
		// how many iterations
		qbdoo.iterations = currentState.iterations;

		// restart the game
	 	qbdoo.setupGame(currentState.cardPositions);
		
	},

	renderMenu: function() {

	},
	alterAValue: function(item, value){
		// get saved state, alter the value, put back in session storage
		var currentState = JSON.parse(sessionStorage.getItem('defaultvalues'));
		currentState[item] = value;
		sessionStorage.setItem('defaultvalues', JSON.stringify(currentState));
	},
	clearAll: function() {
		// sets all values to 0
		for (var i = 1; i <= qbdoo.cards; i++) {
			qbdoo.board.querySelector("div[data-position='" + i + "']").setAttribute("data-value", 0);
		}
	},

	changeTheme: function() {
		//change the theme by changing the class.
		// everything else is in the CSS file
		qbdoo.currentTheme = qbdoo.themeChanger.value || qbdoo.currentTheme
		qbdoo.game.setAttribute('class', qbdoo.currentTheme);
		qbdoo.alterAValue('currentTheme', qbdoo.currentTheme);
	},


// HIGH SCORES
	addHighScore: function() {
		var score = qbdoo.score, player = qbdoo.player;
		if(!player) {
			player = qbdoo.player = prompt('Enter your name');
			sessionStorage.setItem('user', player)
		}
		qbdoo.highScores[qbdoo.highScores.length] = [score, player];
		qbdoo.sortHighScores();
		qbdoo.renderHighScores(score, player);
		qbdoo.saveHighScores();
	},

	sortHighScores: function() {
		// custom sorting function to compare score for each object
		var scores = qbdoo.highScores.sort(function(a, b) {
			if (a[0] > b[0]) {
				return -1;
			}
			else if (a[0] == b[0]) {
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
		}
		qbdoo.sortHighScores();
	},
	// put the high scores on the screen
	renderHighScores: function(score, player) {
		var classname = "";
		var highlighted = false;
		
		for (var i = 0; i < qbdoo.maxHighScores; i++) {
			if (i < qbdoo.highScores.length) {
				qbdoo.highscorelist[i].innerHTML = qbdoo.highScores[i][1].toUpperCase() + ": <em>" + qbdoo.highScores[i][0] + "</em> ";

				// if provided, highlight score from current game
				if (!highlighted && typeof player !== "undefined" && typeof score !== "undefined") {
					if (qbdoo.highScores[i][1] == player && qbdoo.highScores[i][0] == score) {
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
			if(classname) qbdoo.highscorelist[i].className = classname;
		}
	},
	reset: function(item){
		localStorage.removeItem(item);
	}
};

//Initialize the js
document.addEventListener("load", qbdoo.init());

