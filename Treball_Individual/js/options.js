var options = function(){
	// Aquí dins hi ha la part privada de l'objecte
	var options_data = {
		cards:2, modalitat:"basic", difficulty:"easy"
	};
	var load = function(){
		var json = localStorage.getItem("config") || '{"cards":2,"modalitat":"basic","difficulty":"easy"}';
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
			modalitat: "basic",
			difficulty: "easy"
		},
		created: function(){
			this.num = options_data.cards;
			this.modalitat = options_data.modalitat;
			this.difficulty = options_data.difficulty;
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
				this.modalitat = options_data.modalitat;
				this.difficulty = options_data.difficulty;
			},
			save: function(){
				options_data.cards = this.num;
				options_data.modalitat = this.modalitat;
				options_data.difficulty = this.difficulty;
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
		getModalitat: function (){
			return options_data.modalitat;
		},
		getDifficulty: function (){
			return options_data.difficulty;
		}
	}; 
}();

console.log(options.getOptionsString());
console.log(options.getNumOfCards());
console.log(options.getModalitat());
console.log(options.getDifficulty());
console.log(options.options_data);




