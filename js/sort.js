self.onmessage=function(event){
 		// handle the message
		//var stuff = event.data;
		// and send it back to the main thread
		//postMessage(stuff);
		self.postMessage('event: ' + event.data);
};
function sortall(numbers){
	var i=0;
	for(; i < numbers.length; i++){
		
	}
}
function sort(a,b){
	if (a[0] > b[0]) {
			return -1;
		} else if (a[0] == b[0]) {
			return 0;
		} else {
			return 1;
		}
}
