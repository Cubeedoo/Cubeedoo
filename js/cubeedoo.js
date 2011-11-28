/* CuBeDoo */

var qbdoo = {
	currentLevel: 1,
	currentTheme: "numbers",
	gameDuration: 120,
	score: 0,
	board: document.querySelector("#board"),
	cards: 16,
	pauseFlipping: false, // after 2nd card, so time to see card
	timerPause: true, //before start of game
	gameover: document.getElementById('gameover'),
	levelover: document.getElementById('levelover'),
	cardEls: [],
	cardarray: [],
	cardarray2: [],
	init: function() {
	  qbdoo.setupGame();
  	},
	
  setupGame: function() {
	// make sure global arrays are empty
	qbdoo.gameover.style.display = 'none';
	qbdoo.levelover.style.display = 'none';
	qbdoo.cardarray = [];
	qbdoo.cardarray2 = [];
    // populate all the active blocks with data valuess
    for (var i=1; i<=qbdoo.cards; i++) {
	  // get pairs of randome numbers
	  var num = "";
	  while(!num) { 
	  	num = qbdoo.randomize(); 
	 	}
	  // set the data-value for each card
      qbdoo.board.querySelector("div[data-position='" + i + "']").setAttribute("data-value", num);
    }
	qbdoo.timerPause = true;
    qbdoo.events();
	qbdoo.setTimer();
  },
  
  events: function() {
	qbdoo.cardEls = qbdoo.board.querySelectorAll("#board div:not([data-value='0'])");
	var cards = qbdoo.cardEls.length;
    for (var i = 0; i < cards; i++) {
      qbdoo.cardEls[i].addEventListener("click", qbdoo.turnCard );
    }
  },
  
  turnCard: function() {
	// timer starts on first flip
	if(qbdoo.timerPause) qbdoo.timerPause = false;
	
	//can flip cards at this time
	if(qbdoo.pauseFlipping) return false;
    
	//turns the card by changing the className
    this.classList.add('flipped');
	qbdoo.flipped = document.querySelectorAll('div.flipped');
	if(qbdoo.flipped.length == 2) {
		qbdoo.pauseFlipping = true;
		setTimeout(function(){qbdoo.handleMatching()}, 500);
	}
  },
  handleMatching: function(){
	if(qbdoo.matched()){
		qbdoo.hideCards();
	} 
	//remove class whether or not matched
		qbdoo.flipped[0].classList.remove('flipped');
		qbdoo.flipped[1].classList.remove('flipped');
		
		// once done, allow game to continue
		qbdoo.pauseFlipping = false;
		
		//check end of game
		if(qbdoo.isLevelOver()){
			qbdoo.endLevel();
		}	
  },
  
  matched: function(){
	if(qbdoo.getValue(qbdoo.flipped[0]) == qbdoo.getValue(qbdoo.flipped[1])){
		return true;
	} else {
		console.log('no match');
		return false;	
	}
  },
  
  
  hideCards: function() {
    //removes card if poll returns true
		qbdoo.flipped[0].dataset['value'] = 0;
		qbdoo.flipped[1].dataset['value'] = 0;
  },
  
  isLevelOver: function() {
	if(qbdoo.board.querySelectorAll("#board div:not([data-value='0'])").length > 0) {
		return false;
	}
	console.log('game over');
	return true;
  },
  
  endLevel: function() {
    // Stop the timer
	qbdoo.timerPause = true;
	
	// Add to score
	document.querySelector("#score output").innerHTML = qbdoo.score += qbdoo.timeLeft;
	
	if(qbdoo.timeLeft){
		// Announce End of Level
		qbdoo.levelover.getElementsByTagName('output')[0].innerHTML = qbdoo.score;
		qbdoo.levelover.style.display = 'block';
		
		// restart a new game
		// leaving the score up for a few seconds
		setTimeout(function(){
				qbdoo.setupGame();
			}, 4000);
	} else {
		// Announce End of Game
		qbdoo.gameover.getElementsByTagName('output')[0].innerHTML = qbdoo.score;
		qbdoo.gameover.style.display = 'block';
		
	}
	
  },
  
  
  
  getValue: function(mycard) {
    //get the data-value of the card
	return mycard.dataset['value'];
  },
  
  
  setTimer: function() {
	  qbdoo.timerShell = document.querySelector("#timer output");
	  qbdoo.timerShell.innerHTML = qbdoo.timeLeft = qbdoo.gameDuration;
	  qbdoo.timer();
  },
  
  timer: function() {
    //the timer function.
	setInterval(function(){ dropASecond();}, 1000);
	
	function dropASecond(){
		if (!qbdoo.timerPause) {
			qbdoo.timerShell.innerHTML = --qbdoo.timeLeft;
		}
		if(!qbdoo.timeLeft){
			qbdoo.timerPause = true;
			qbdoo.clearAll();
			qbdoo.endLevel();	
		}
	}
  },
  
  randomize: function() {
	// get a random number 
    var num = Math.floor(Math.random() * (qbdoo.cards / 2) + 1);
	
	// make sure that random number isn't already used twice
		if(!(in_array( num, qbdoo.cardarray))){
			qbdoo.cardarray.push(num);
			return num;	
		} else if(!(in_array( num, qbdoo.cardarray2))){
			qbdoo.cardarray2.push(num);
			return num;	
		} else {
			return '';	
		}
		
		// checks if number already in array
		function in_array( num, currArray ){
			var inarray=false,
				arrayLength = currArray.length,
				i;
			for(i=0; i < arrayLength; i++){
			  if(num == currArray[i]){
				inarray = true;
				break;
			  }
			}
			return inarray;
		}

  },
  
  pause: function() {
    // use dataset to get value for all the cards.

	// add theme to value set

	// add level to value set

	// add timeleft to value set

	// add score to value set

	// add to local storage

	// kill the timer

	// return
  },
  
  
  playGame: function(){
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
	  for (var i=1; i<=qbdoo.cards; i++) {
      		qbdoo.board.querySelector("div[data-position='" + i + "']").setAttribute("data-value", 0);
		}
  },
  
  changeTheme: function(klass) {
	//change the theme by changing the class
    document.getElementById('game').setAttribute('class',klass);
  },
  
  
  inArray: function(needle, haystack, argStrict) {
    var key = '',
    strict = !! argStrict;
    
    if (strict) {
      for (key in haystack) {
        if (haystack[key] === needle) {
          return true;
        }
      }
    } else {
      for (key in haystack) {
        if (haystack[key] == needle) {
          return true;
        }
      }
    }
    return false;
  },
};

//Initialize the js
document.addEventListener("load", qbdoo.init());