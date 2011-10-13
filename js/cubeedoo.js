var qbdoo = {
	currentLevel: 1,
	currentTheme: "numbers",
	defaultGameDuration: 120,
	init: function() {
	  console.log("init()");
  },
  events: function() {
    console.log("events()");
    
  },
  turnCard: function() {
    //turns the card by changing the className
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
  changeTheme: function(class) {
	//change the theme by changing the class
    document.getElementById('game').setAttribute('class',class);
  }
  
};

//Initialize the js
document.addEventListener("load", qbdoo.init());
