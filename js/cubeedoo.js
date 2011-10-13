var qbdoo = {
	currentLevel: 1,
	currentTheme: "numbers",
	defaultGameDuration: 120,
	board: document.querySelector("#board"),
	cards: 16,
	//cardsEls: this.board.querySelectorAll("div[data-value]:not([data-value=0])"),
	init: function() {
	  console.log(this.cards.length);
	  this.events();
	  this.setupGame();
  },
  setupGame: function() {
    for (var i=1; i<=this.cards;i++) {
      this.board.querySelectorAll("div[data-value]")[i-1].setAttribute("data-value", 1);
      console.log(this.board.querySelectorAll("div[data-value]")[i-1]);
    }
  },
  events: function() {
    console.log("events()");
    //for (var i=0; i<this.cardsEls.length; i++) {
    //  this.cards[i].addEventListener("click", this.turnCard );
    //}
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
  }
  
};

//Initialize the js
document.addEventListener("load", qbdoo.init());
