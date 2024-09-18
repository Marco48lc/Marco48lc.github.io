var count = 0;
var users = {};
var usernames = {};	// id -> username

function getUserId(){
	return ++count;
}

onconnect = function(event){
	var id = getUserId();	// numeric ids
	var port0 = event.ports[0];	// common port to connect to!
	port0.postMessage("welcome|"+id);

	port0._data = {port: port0, name: id};	// Populate it with data, which is json object.
	users[id] = port0._data;
	port0.onmessage = function(event){
		var data = event.data;
		if(data.split('|')[0] == "msg"){
			for(var user in users){
				users[user].port.postMessage("chat|"+id+"|"+usernames[id]+"|"+data.split('|')[1]);
			}
		}
		else{
			usernames[id] = data.split('|')[1];
			for(var user in users){
				users[user].port.postMessage("added|"+id+"|"+usernames[id]);
			}
		}
	}
};