var arrayLoad = [];
var load_obj = function(){
	var vue_instance = new Vue({
		el: "#saves_id",
		data: {
			saves: []
		},
		created: function(){

			let arrayPartides = [];
			if(localStorage.records){
				arrayPartides = JSON.parse(localStorage.records);
				if(!Array.isArray(arrayPartides)) arrayPartides = [];
				
			}
			this.saves = arrayPartides;
			arrayLoad = arrayPartides;
		},
		methods: { 
			load: function(i){
				sessionStorage.idPartida = i;
				loadpage("../html/game.html");
			}
		}
	});
	return {}; 
}();

window.onload = function(){
	if(arrayLoad[0]) document.getElementById("firstName").innerHTML = "Jugador/a: " + JSON.parse(arrayLoad[0]).nom + " Puntuació: " + Math.trunc(JSON.parse(arrayLoad[0]).punts);
	if(arrayLoad[1]) document.getElementById("secondName").innerHTML = "Jugador/a: " + JSON.parse(arrayLoad[1]).nom + " Puntuació: " + Math.trunc(JSON.parse(arrayLoad[1]).punts);
	if(arrayLoad[2]) document.getElementById("thirdName").innerHTML = "Jugador/a: " + JSON.parse(arrayLoad[2]).nom + " Puntuació: " + Math.trunc(JSON.parse(arrayLoad[2]).punts);
}