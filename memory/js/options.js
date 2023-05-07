var default_config = {
	cards: 2,
	difficulty: "easy",
	punts: null
};
var options = function(){
	// Aquí dins hi ha la part privada de l'objecte
	var options_data = {
		cards:2, difficulty:"easy", punts: null
	};
	var load = function(){
		var json = localStorage.getItem("config") || '{"cards":2,"difficulty":"easy"}';
		options_data = JSON.parse(json);
	};
	var save = function(){
		localStorage.setItem("config", JSON.stringify(options_data));
	};
	load();
	var vue_instance = new Vue({
		el: "#options_id",
		data: {
			num: 2,
			difficulty: "easy"
		},
		created: function(){
			this.num = options_data.cards;
			this.difficulty = options_data.difficulty;
			this.punts = options_data.punts;
		},
		watch: {
			num: function(value){
				if (value < 2)
					this.num = 2;
				else if (value > 4)
					this.num = 4;
			}
		},
		methods: { 
			discard: function(){
				this.num = options_data.cards;
				this.difficulty = options_data.difficulty;
				this.punts = options_data.punts;
			},
			save: function(){
				options_data.cards = this.num;
				options_data.difficulty = this.difficulty;
				this.punts = options_data.punts;
				save();
				loadpage("../");
			}
		}
	});

	return {
		// Aquí dins hi ha la part pública de l'objecte
		getOptionsString: function (){
			return JSON.stringify(options_data);
		},
		getNumOfCards: function (){
			return options_data.cards;
		},
		getDifficulty: function (){
			return options_data.difficulty;
		},
		getPunts: function(){
			return options_data.punts;
		}
	}; 
}();