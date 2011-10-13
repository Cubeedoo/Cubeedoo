var qbdoo = {
	currentLevel: 1,
	currentTheme: "numbers",
	defaultGameDuration: 120,
	board: document.querySelector("#board"),
	cards: 16,
	cardsEls: [],
	init: function() {
	  this.setupGame();
  },
  setupGame: function() {
    for (var i=1; i<=this.cards;i++) {
      num = Math.floor(Math.random()*this.cards);
      this.board.querySelectorAll("div[data-value]")[i-1].setAttribute("data-value", num);
    }
    this.cardEls = this.board.querySelectorAll("div[data-value]");
	this.events();
  },
  events: function() {
    for (var i=0; i < this.cards; i++) {
      this.cardEls[i].addEventListener("click", this.turnCard );
    }
  },
  turnCard: function(el) {
	el.className = 'flipped';
    //turns the card by changing the className
    console.log(el);
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
