var json = localStorage.getItem("config") || '{"cards":2,"dificulty":"easy"}';
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
        this.difficulty = options_data.dificulty;
        this.i = 0;
        this.enEspera = false;
    }

    preload() {
        this.load.image(
            { key: 'back', url: '../resources/back.png' },
            { key: 'cb', url: '../resources/cb.png' },
            { key: 'co', url: '../resources/co.png' },
            { key: 'sb', url: '../resources/sb.png' },
            { key: 'so', url: '../resources/so.png' },
            { key: 'tb', url: '../resources/tb.png' },
            { key: 'to', url: '../resources/to.png' }
        );


        create(){

            let tempsEspera = 0;
            switch (this.difficulty) {
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

            let arraycards = ['co', 'sb', 'co', 'sb'];
            this.cameras.main.setBackgroundColor(0xBFFCFF);

            let i = 0;
            while (i < arraycards.length) {
                this.add.image(250 + i * 100, 300, arraycards[i]);
                i++;
            }

            this.time.delayedCall(tempsEspera, () => {

                this.cards = this.physics.add.staticGroup();

                let j = 0;
                while (i <= arraycards.length) {
                    ;
                    this.cards.create(250 + j * 100, 300, 'back');
                    i++;
                }

                let i = 0;
                this.cards.children.iterate((card) => {
                    card.card_id = arraycards[i];
                    i++;
                    card.setInteractive();
                    card.on('pointerup', () => {
                        if (!this.enEspera) {
                            card.disableBody(true, true);
                            if (this.firstClick) {
                                if (this.firstClick.card_id !== card.card_id) {
                                    this.score -= 20 * this.mulDif;
                                    this.firstClick.enableBody(false, 0, 0, true, true);
                                    card.enableBody(false, 0, 0, true, true);

                                    var QUEPUTESESAIXOoFirstClick = this.firstClick;
                                    this.enEspera = true;
                                    this.time.delayedCall(1000, () => {
                                        QUEPUTESESAIXOoFirstClick.enableBody(false, 0, 0, true, true);
                                        card.enableBody(false, 0, 0, true, true);
                                        this.enEspera = true;
                                    })
                                    if (this.score <= 0) {
                                        alert("Fi de la partida");
                                        loadpage("../");
                                    }
                                }
                                else {
                                    this.correct++;
                                    if (this.correct >= 2) {
                                        alert("Has guanyat amb " + this.score + " punts.");
                                        loadpage("../");
                                    }
                                }
                                this.firstClick = null;
                            }
                            else {
                                this.firstClick = card;
                            }
                        }
                    }, card);
                });
            })
        }
    }
    update() { }
}

function get_cards() {
    let llistaCartes = ['cb', 'co', 'sb', 'so', 'tb', 'to'];
    for (let i = 0; i < this.nCards; i++) {
        let ramdom = Phaser.Utils.Array.RemoveRandomElement(llistaCartes);
        triaCarta.push(ramdom);
        triaCarta.push(ramdom);
    }
    Phaser.Utils.Array.Shuffle(triaCarta);
    return triaCarta;
}

function punts() {
    return this.score;
}