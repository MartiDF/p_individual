const back = "../resources/back.png";
const items = ["../resources/cb.png","../resources/co.png","../resources/sb.png",
"../resources/so.png","../resources/tb.png","../resources/to.png"];
var json = localStorage.getItem("config") || '{"cards":2,"modalitat":"basic","difficulty":"hard"}';
options_data = JSON.parse(json);

var game = new Vue({
	el: "#game_id",
	data: {
		username:'',
		current_card: [],
		items: [],
		difficulty: options_data.difficulty,
		modalitat: options_data.modalitat,
		num_cards: options_data.cards,
		bad_clicks: 0,
		enEspera: true
	},
	created: function(){
		this.username = sessionStorage.getItem("username","unknown");
		this.items = items.slice(); // Copiem l'array
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		this.items = this.items.slice(0, this.num_cards); // Agafem els primers numCards elements
		this.items = this.items.concat(this.items); // Dupliquem els elements
		this.items.sort(function(){return Math.random() - 0.5}); // Array aleatòria
		for (var i = 0; i < this.items.length; i++){
			this.current_card.push({done: false, texture: this.items[i]});
		}

		let tempsEspera = 0;
		switch(this.difficulty){
			case "hard":
				this.mulDif = 2.5;
				tempsEspera = 500;
				break;
			case "normal":
				this.mulDif = 1.7;
				tempsEspera = 1500;
				break;
			case "easy":
				this.mulDif = 1;
				tempsEspera = 3000;
				break;
			default:
				break;
		}

		this.myTimeout = setTimeout(this.timeout, tempsEspera);
		this.pausa = false;
	},
	methods: {
		timeout: function(){
			console.log(this.difficulty);
			this.pausa = true;
			for (var i = 0; i < this.items.length; i++) {
				Vue.set(this.current_card, i, {done: false, texture: back});
			}
			this.enEspera = false;
			clearTimeout(this.timeout);
		},

		clickCard: function(i){
			if (!this.current_card[i].done && this.current_card[i].texture === back)
				Vue.set(this.current_card, i, {done: false, texture: this.items[i]});
		},
	
	},
	watch: {
		current_card: function(value){
			if (value.texture === back || this.enEspera) return;
			var front = null;
			var i_front = -1;
			for (var i = 0; i < this.current_card.length; i++){
				if (!this.current_card[i].done && this.current_card[i].texture !== back){
					if (front){
						if (front.texture === this.current_card[i].texture){
							front.done = this.current_card[i].done = true;
							this.num_cards--;
						}
						else{
							Vue.set(this.current_card, i, {done: false, texture: back});
							Vue.set(this.current_card, i_front, {done: false, texture: back});
							this.bad_clicks++;
							break;
						}
					}
					else{
						front = this.current_card[i];
						i_front = i;
					}
				}
			}			
		}
	},
	computed: {
		score_text: function(){
			let puntuacio = 100 - this.bad_clicks * 20 * this.mulDif;
			return puntuacio;
		}
	}
});





