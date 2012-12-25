/* CuBeDoo */

var qbdoo = {
	//game settings
	currentLevel: 1,
	currentTheme: "numbers",
	gameDuration: 30,
	score: 0,
    matchedSound: 'assets/match.mp3',
    failedMatchSound: 'assets/notmatch.mp3',
    mute: true,
	cardCount: 16,
	iterations: 0,
	iterationsPerLevel: 1,
	possibleLevels: 3,
	maxHighScores: 5,
	storageType: (!window.openDatabase)? "WEBSQL": 'local',
	cards: document.querySelectorAll('div[data-position]'),
	currFlipped: document.getElementsByClassName('flipped'),
	currMatched: document.getElementsByClassName('matched'),
	game: document.querySelector("article"),
	board: document.querySelector("#board"),
	footer: document.querySelector("article footer"),
	highscorepage: document.querySelector("#highscores"),
	highscorelist: document.getElementById("highscorelist"),
	gameover: document.getElementById('gameover'),
	levelover: document.getElementById('levelover'),
	levelOutput: document.querySelector('#level output'),
	congrats: document.getElementById('congrats'),
	btn_mute: document.getElementById('mute'),
	btn_pause: document.getElementById('pause'),
	scoreoutput: document.querySelector("#score output"),
	timerShell: document.querySelector("#pause output"),
	clearScores: document.getElementById('clearscores'),
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
	//highScores: JSON.parse(localStorage.getItem('highScores')) || [],
	highScores: [],
	init: function() {
		qbdoo.storeValues('newgame');
		qbdoo.pauseGame('newgame'); //stores settings
		qbdoo.setupGame();
	},

	setupGame: function(savedCards) {
		var cardsValues, cards, dbsize;
		if(savedCards){ // if starting from pause
			cardsValues = JSON.parse(savedCards); 
			for(i = 0; i < qbdoo.cardCount; i++){
				for (key in cardsValues[i]) {
					qbdoo.cards[i].dataset[key] = cardsValues[i][key];
				}
			}		
		} else { // not from pause
			// go up a level after "iterationsPerLevel" number of iterations
			if (qbdoo.iterations && (qbdoo.iterations % qbdoo.iterationsPerLevel == 0)) {
				qbdoo.levelUp();	
			}
			// populate all the active blocks with data valuess
			for (var i = 1; i <= qbdoo.cardCount; i++) {
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
		if(qbdoo.storageType !== "local"){
			if(!qbdoo.db){
				if (window.openDatabase) {
					dbSize = 5 * 1024 * 1024; 
			    	qbdoo.db = openDatabase("highscoresDB", "1.0", "scores", 200000); 
			    }
			}
			qbdoo.loadHighScoresSQL();
			qbdoo.loadHighScoresSQL();
		} else {
			qbdoo.loadHighScoresLocal();
		}
		qbdoo.renderHighScores();
		qbdoo.cardarray = [];
		qbdoo.cardarray2 = [];
		qbdoo.timerPause = true;
		qbdoo.pauseOrPlayBoard('pause');
		qbdoo.cardClicks();
		qbdoo.eventHandlers();
		qbdoo.setTimer(savedCards);
		qbdoo.changeTheme();
		qbdoo.congratulations('off');
		qbdoo.writeLevel();
	},

	cardClicks: function() {
		var i;
		for (i = 0; i < qbdoo.cardCount; i++){
			qbdoo.cards[i].addEventListener("click", qbdoo.turnCard );
		}
	},

	eventHandlers: function(){
		qbdoo.btn_pause.addEventListener('click', qbdoo.pauseGameOrNewGame);
		qbdoo.btn_mute.addEventListener('click', qbdoo.toggleMute);
		qbdoo.themeChanger.addEventListener('change', qbdoo.changeTheme);
		qbdoo.clearScores.addEventListener('click',qbdoo.eraseScores);
	},

	pauseGameOrNewGame: function(){
		if (qbdoo.game.classList.contains('over')) {
			qbdoo.startNewGame();
		} else {
			qbdoo.pauseGame();
		}
	},

	startNewGame: function(){
		qbdoo.setAndShowScore(0);
		qbdoo.alterAValue('currentLevel')
		qbdoo.setLevel(qbdoo.currentLevel);
		qbdoo.playGame('newgame');
	},

	setLevel: function(level){
		qbdoo.board.className = 'level' + level;
		qbdoo.levelOutput.innerHTML = level;
	},

	levelUp: function() {
		qbdoo.currentLevel++
		qbdoo.writeLevel();
		// to increase the possible values of the front of the cards
		if (qbdoo.currentLevel <= qbdoo.possibleLevels) {
			qbdoo.cardCount += 4;
		}
		// if we've maxed out the levels, the game gets harder (shorter time) with level increases.
		// at first it goes down by 5 seconds per level, and then down by 2 then 1 second per level after 
		else if (qbdoo.currentLevel > qbdoo.possibleLevels) {
			if(qbdoo.gameDuration > 60) {
				qbdoo.gameDuration -= 5;
			} else if (qbdoo.gameDuration > 30) {
				qbdoo.gameDuration -= 2;
			} else {
				qbdoo.gameDuration -= 1;
			}
		}
	},

	writeLevel: function(){
		qbdoo.levelOutput.innerHTML = qbdoo.currentLevel;
		if (qbdoo.currentLevel <= qbdoo.possibleLevels) {
			// look and feel is completely determined by class of the board
			qbdoo.board.className = 'level' + qbdoo.currentLevel;
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
		// if this is the 2nd card currently flipped, check for matching
		if (qbdoo.currFlipped.length == 2) {
			qbdoo.pauseFlipping = true;
			setTimeout(function() {
				qbdoo.handleMatching();
			}, 300);
		}
	},

	handleMatching: function() {
		// do cards match each other?
		if (qbdoo.matched()) {
			//then hide them
			qbdoo.hideCards();
			//play sound
			qbdoo.playSound(true);
			//increase score by # of cards * current level
			qbdoo.setAndShowScore(qbdoo.score += 2 * qbdoo.currentLevel);

		} else {
			qbdoo.playSound(false);
			//remove class whether or not matched
			while(qbdoo.currFlipped.length){
               qbdoo.currFlipped[0].classList.remove('flipped');
           }
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
		if (qbdoo.getValue(qbdoo.currFlipped[0]) == qbdoo.getValue(qbdoo.currFlipped[1])) {
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
		qbdoo.currFlipped[0].classList.add('matched');
		qbdoo.currFlipped[1].classList.add('matched');
		setTimeout(function(){
			var i;
			for(i = qbdoo.currMatched.length; i > 0; i--){
				qbdoo.currMatched[i-1].classList.remove('flipped');
				qbdoo.currMatched[i-1].dataset['value'] = 0;
				qbdoo.currMatched[i-1].classList.remove('matched');
			}
		}, 300);
	},

	// check level status 
	isLevelOver: function() {
		// not over if any card has data value
		if (qbdoo.board.querySelectorAll("#board div[data-value]:not([data-value='0'])").length > 2) {
			return false;
		}
		else { // if no data-values, game is over
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
			qbdoo.levelover.style.display = 'block';
			qbdoo.congratulations('on');
			// restart new game leaving the score up for a few seconds
			setTimeout(function() {qbdoo.setupGame();}, 4000);
		}
		else {
			qbdoo.gameLost();
		}
	},
	gameLost: function(){
		//kill unflipped cards
		while(qbdoo.currFlipped.length){
			qbdoo.currFlipped[0].classList.remove('flipped');
		}
		// Announce End of Game: update score, show game over and remove timer
		qbdoo.scoreoutput.innerHTML = qbdoo.score;
		qbdoo.game.classList.add('over');
		// empty out timer
		qbdoo.timerShell.innerHTML = "";
		qbdoo.addHighScore();
	},
	setAndShowScore: function(value){
		qbdoo.scoreoutput.innerHTML = qbdoo.score = value;
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

		var dropASecond = function() {
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
		var num = Math.floor(Math.random() * (qbdoo.cardCount / 2) + 1);
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
	storeValues: function(newgame){
		var currentState = {};
		//capture values for play
		currentState.currentTheme = qbdoo.currentTheme;
		currentState.timeLeft = qbdoo.timeLeft;
		currentState.score = qbdoo.score;
		currentState.cardCount = qbdoo.cardCount;
		currentState.mute = qbdoo.mute;
		currentState.iterations = qbdoo.iterations;
		// get all the cards values and positions
		// use dataset to get value for all the cards.
  		if(newgame == 'newgame') { 
  			   currentState.currentLevel = qbdoo.currentLevel;
			   currentState.score = 0;
			   currentState.gameDuration = qbdoo.gameDuration;
               sessionStorage.setItem('defaultvalues', JSON.stringify(currentState));
               return;
       	} else {
       		return currentState;
       	}
	},
	pauseGame: function(newgame) {
		// if game is paused
       var currentState = {}, i, cardinfo = [];
       if(qbdoo.game.classList.contains('paused')){
            qbdoo.playGame();
            return false;
       }
        //pause 
       qbdoo.pauseOrPlayBoard('pause');
       currentState = qbdoo.storeValues();
       for (i = 0; i < qbdoo.cardCount; i++) {
         	cardinfo.push(qbdoo.cards[i].dataset);
       }
		// add level to value set
		currentState.currentLevel = qbdoo.currentLevel;
        currentState.cardPositions = JSON.stringify(cardinfo);
		// add to local storage
		localStorage.setItem('pausedgame', JSON.stringify(currentState));
		//clear the board
		qbdoo.clearAll();	
		// return
	},

	playGame: function(newgame) {
		var cardsValues, cards, i, currentState = {};
		 // get localStorage or sessionStorage depending on state
		if(newgame == 'newgame'){
            currentState = JSON.parse(sessionStorage.getItem('defaultvalues'));
            qbdoo.timeLeft = qbdoo.gameDuration = currentState.gameDuration;
        } else {
			// get state via local storage
			currentState = JSON.parse(localStorage.getItem('pausedgame'));
			// game was paused with pause button
			if(qbdoo.game.classList.contains('paused')){
				qbdoo.game.classList.remove('paused');
			}
			qbdoo.timeLeft = currentState.timeLeft;
		}
		qbdoo.reset('pausedgame');
		// set all the values to be saved
		qbdoo.currentTheme = currentState.currentTheme;
		qbdoo.mute = currentState.mute;
		qbdoo.currentLevel = currentState.currentLevel;
		qbdoo.score = currentState.score;
		qbdoo.cardCount = currentState.cardCount;
		qbdoo.iterations = currentState.iterations;
		// restart the game
	 	qbdoo.setupGame(currentState.cardPositions);

   
		
	},

	// get saved state, alter the value, put back in session storage
	alterAValue: function(item, value){
		var currentState = JSON.parse(sessionStorage.getItem('defaultvalues'));
		if(value) {
			currentState[item] = value;
		} else {
			qbdoo[item] = currentState[item];
		}
		sessionStorage.setItem('defaultvalues', JSON.stringify(currentState));
		return value;
	},

	// sets all values to 0
	clearAll: function() {
		for (var i = 0; i < qbdoo.cardCount; i++) {
			qbdoo.cards[i].dataset.value = 0;
		}
	},

	//change the theme by changing the class.
	// everything else is in the CSS file
	changeTheme: function() {
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
		qbdoo.webWorkers();
		qbdoo.renderHighScores(score, player);
		qbdoo.saveHighScores(score, player);
	},

	sortHighScores: function() {
		console.log(qbdoo.highScores);
		// custom sorting function to compare score for each object
		var scores = qbdoo.highScores.sort(function(a, b) {
			if (a[0] > b[0]) {
				return -1;
			} else if (a[0] == b[0]) {
				return 0;
			} else {
				return 1;
			}
		});
		// make sure we don't have more scores than we need
		qbdoo.highScores = scores.slice(0, qbdoo.maxHighScores);
	},

	webWorkers: function(){
		var webWorker = new Worker('js/sort.js'); 
		webWorker.postMessage('some_message');
		webWorker.onmessage(function(event){
			console.dir(event);
		});
	},

/* WEBSQL */
	createTable: function() {
		var i;
        qbdoo.db.transaction(function(tx) {
          tx.executeSql("CREATE TABLE highscoresTable (id REAL UNIQUE, name TEXT, score NUMBER, date DATE )", [],
              function(tx) {console.log('highscore table created') },
              qbdoo.onError);
        });
      },
	saveHighScores: function(score, player) {
		if(qbdoo.storageType === 'local'){
			localStorage.setItem("highScores", JSON.stringify(qbdoo.highScores));
		} else {
			//var db = openDatabase("highscoresDB", "1.0", "All the scores, good and bad", 200000); 
                qbdoo.db.transaction(function(tx) {
                  tx.executeSql("INSERT INTO highscoresTable (score, name, date) VALUES (?, ?, ?)", [score, player, new Date()],
                      onSuccess, 
                      qbdoo.onError);
                });
             function onSuccess(tx,results){
                // not sure if needed
             }
		}
	},

	loadHighScoresLocal: function() {
		var scores = localStorage.getItem("highScores");
		if (scores) {
			qbdoo.highScores = JSON.parse(scores);
		}
		if(qbdoo.storageType === 'local'){
			qbdoo.sortHighScores();
		}
	 },

    loadHighScoresSQL: function(){
		var i;
	    qbdoo.db.transaction(function(tx) {
         	tx.executeSql("SELECT score, name, date FROM highscoresTable ORDER BY score DESC", 
         		[], function(tx, result) {

	           for (var i = 0, item = null; i < result.rows.length; i++) {
	              item = result.rows.item(i);
	              qbdoo.highScores[i] = [item['score'], item['name'], item['date']];
	            } //end for
	        }, onError);	 // end execute
	        function onError(tx, error){
	        	if(error.message.indexOf('no such table')){
	        		qbdoo.createTable();
	        	} else {
            		console.log('Error: ' + error.message);
            	}
            }
	    	qbdoo.renderHighScores();
	    }); // end transaction
	},

	// put the high scores on the screen
	renderHighScores: function(score, player) {
		var classname, highlighted = false, text = '';
		for (var i = 0; i < qbdoo.maxHighScores; i++) {
			if (i < qbdoo.highScores.length) {
				if (qbdoo.highScores[i][1] == player && qbdoo.highScores[i][0] == score) {
					classname = ' class="current"';
				} else {
					classname = '';
				}
			 	text += "<li" + classname + ">" + qbdoo.highScores[i][1].toUpperCase() + ": <em>" + parseInt(qbdoo.highScores[i][0]) + "</em></li> ";
			}
		}
		qbdoo.highscorelist.innerHTML = text;
	},
	eraseScores: function(){
		if(qbdoo.storageType === 'local'){
			qbdoo.reset("highScores");
		} else {
            qbdoo.db.transaction(function(tx) {
              tx.executeSql("DROP TABLE highscoresTable", [],
                  qbdoo.createTable, 
                  qbdoo.onError);
            });
		}
		qbdoo.highscorelist.innerHTML = '<li></li>';
	},


    onError: function(tx, error){
        console.log('Error: ' + error.message);
    },

	reset: function(item){
		localStorage.removeItem(item);
	}
};

//Initialize the js
document.addEventListener("load", qbdoo.init());

