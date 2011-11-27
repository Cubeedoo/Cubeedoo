/* CuBeDoo */

var qbdoo = {
	currentLevel: 1,
	currentTheme: "numbers",
	defaultGameDuration: 120,
	board: document.querySelector("#board"),
	cards: 16,
	cardsEls: [],
	onceValue: [],
	twiceValue: [],
	cardarray: [],
	cardarray2: [],
	init: function() {
	  qbdoo.setupGame();
  	},
	
  setupGame: function() {
	
	// make sure global arrays are empty
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
      qbdoo.board.querySelectorAll("div[data-value]")[i-1].setAttribute("data-value", num);
    }
    qbdoo.events();
  },
  
  events: function() {
	qbdoo.cardEls = qbdoo.board.querySelectorAll("#board div:not([data-value='0'])");
	var cards = qbdoo.cardEls.length;
    for (var i = 0; i < cards; i++) {
      qbdoo.cardEls[i].addEventListener("click", qbdoo.turnCard );
    }
  },
  
  turnCard: function() {
    //turns the card by changing the className
    console.log("I pooped");
  },
  
  hideCard: function() {
    //removes card if poll returns true
  },
  
  poll: function() {
    // checks the value of the cards and returns boolean
  },
  
  getValue: function() {
    //get the data-value of the card
  },
  
  timer: function() {
    //the timer function.
    //accepts (none | start | stop)
  },
  
  randomize: function() {
	// get a random number 
    var num = Math.floor(Math.random() * (qbdoo.cards / 2) + 1);
	
	// make sure that random number isn't already used twice
		if(!(in_array( num, qbdoo.cardarray))){
			qbdoo.cardarray.push(num);
			console.dir(qbdoo.cardarray);
			return num;	
		} else if(!(in_array( num, qbdoo.cardarray2))){
			qbdoo.cardarray2.push(num);
			console.log('second array:');
			console.dir(qbdoo.cardarray2);
			return num;	
		} else {
			return num = '';	
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