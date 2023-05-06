function start_game(){
	name = prompt("User name");
	
	sessionStorage.setItem("username", name);
	
	loadpage("./html/game.html");
}

function exit (){
	if (name != ""){
		alert("Sortint de la partida de " + name);
	}
	name = "";
	loadpage("../index.html");
}

function options(){
	loadpage("./html/options.html");
}


