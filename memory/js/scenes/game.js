var default_config = {
	cards: 2,
	difficulty: "easy",
	punts: null
};
var json = localStorage.getItem("config") || JSON.stringify(default_config);
options_data = JSON.parse(json);

class GameScene extends Phaser.Scene {
	constructor() {
		super('GameScene');
		this.cards = null;
		this.firstClick = null;
		this.score = 100;
		this.correct = 0;
		this.mulDif = 0;
		this.nCards = options_data.cards;
		this.difficulty = options_data.difficulty;
		this.i = 0;
		this.enEspera = false;
	}

	preload() {
		this.load.image([
			{ key: 'back', url: '../resources/back.png' },
			{ key: 'cb', url: '../resources/cb.png' },
			{ key: 'co', url: '../resources/co.png' },
			{ key: 'sb', url: '../resources/sb.png' },
			{ key: 'so', url: '../resources/so.png' },
			{ key: 'tb', url: '../resources/tb.png' },
			{ key: 'to', url: '../resources/to.png' }
		]);
	}

	create() {

		let tempsEspera = 0;
		switch (this.difficulty) {
			case "hard":
				this.mulDif = 2.5;
				tempsEspera = 1000;
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

		let arraycards = get_cards(this.nCards);
		this.cameras.main.setBackgroundColor(0xBFFCFF);

		for (let i = 0; i < arraycards.length; i++) {
			this.add.image(350 + i * 100, 300, arraycards[i]);
		}

		this.time.delayedCall(tempsEspera, () => {

			this.cards = this.physics.add.staticGroup();

			for (let i = 0; i < arraycards.length; i++) {
				this.cards.create(350 + i * 100, 300, 'back');
			}

			let i = 0;
			this.cards.children.iterate((card) => {
				card.card_id = arraycards[i];
				i++;
				card.setInteractive();
				card.on('pointerup', () => {
					// Si el joc està pausat, no es pot interaccionar
					if (this.enEspera) return;
					card.disableBody(true, true);
					if (this.firstClick) {
						if (this.firstClick.card_id !== card.card_id) { // Si és incorrecte
							let firstCard = this.firstClick;
							this.score -= 20 * this.mulDif;
							this.enEspera = true;
							this.time.delayedCall(1000, () => {
								firstCard.enableBody(false, 0, 0, true, true);
								card.enableBody(false, 0, 0, true, true);
								this.enEspera = false;
							})
							if (this.score <= 0) {
								alert("Fi de la partida");
								loadpage("../");
							}
						}
						else { // És correcte
							this.correct++;
							if (this.correct >= this.nCards) {
								this.time.delayedCall(1000, () => {
								alert("Has guanyat amb " + this.score + " punts.");
								loadpage("../");
								})
							}
						}
						this.firstClick = null;
					}
					else { // És el primer clic
						this.firstClick = card;
					}
				}, card);
			});
		})
	}
	update() { }
}

function get_cards(nCards) {
	let llistaCartes = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
	let triaCarta = [];
	for (let i = 0; i < nCards; i++) {
		let ramdom = Phaser.Utils.Array.RemoveRandomElement(llistaCartes);
		triaCarta.push(ramdom);
		triaCarta.push(ramdom);
	}
	Phaser.Utils.Array.Shuffle(triaCarta);
	return triaCarta;
}

function get_punts() {
	return this.score;
}
