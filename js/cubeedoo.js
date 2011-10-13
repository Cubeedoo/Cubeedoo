var cube = {
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
    
  },
  renderMenu: function() {
    
  },
  changeTheme: function() {
    
  }
  
};

//Initialize the js
document.addEventListener("load", cube.init());
