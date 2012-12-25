self.onmessage=function(event){
 		// handle the message
		//var stuff = event.data;
		// and send it back to the main thread
		//postMessage(stuff);
		self.postMessage(event);
};
