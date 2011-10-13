var cube = {
	currentLevel: 1,
	currentTheme: "numbers",
	defaultGameDuration: 120,
	board: document.querySelector("#main"),
	cards: board.querySelectorAll("div"),
	init: function() {
	  this.events();
  },
  events: function() {
    console.log("events()");
    for (var i=0; i<this.cards.length; i++) {
      this.cards[i].addEventListener("click", this.turnCard );
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
  pause: function() {
    
  },
  renderMenu: function() {
    
  },
  changeTheme: function() {
    
  }
  
};

//Initialize the js
document.addEventListener("load", cube.init());
