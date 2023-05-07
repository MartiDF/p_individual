var default_config = {
	cards: 2,
	difficulty: "easy",
	punts: null,
    username: sessionStorage.getItem("username")
};
var json = localStorage.getItem("config") || JSON.stringify(default_config);
options_data = JSON.parse(json);
options_data.username = sessionStorage.getItem("username");
console.log(options_data);

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
        this.punts = options_data.punts;
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
            this.add.image(250 + i * 100, 300, arraycards[i]);
        }

        this.time.delayedCall(tempsEspera, () => {

            this.cards = this.physics.add.staticGroup();

            for (let i = 0; i < arraycards.length; i++) {
                this.cards.create(250 + i * 100, 300, 'back');
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
                            this.time.delayedCall(500, () => {
                                firstCard.enableBody(false, 0, 0, true, true);
                                card.enableBody(false, 0, 0, true, true);
                                this.enEspera = false;
                            })
                            if (this.score <= 0) { // Si perdem
                                localStorage.setItem("config", JSON.stringify(default_config));
                                let points = this.punts;
                                if (points == null) points = 0;
                                alert("Has acumulat " + points + "\nFi de la partida");
                                var records = JSON.parse(localStorage.getItem("records")) || [];
                                records.push(JSON.stringify({"nom":options_data.username,"punts":points}));
                                records.sort((a,b) => {
                                    const puntsA = JSON.parse(a).punts; 
                                    const puntsB = JSON.parse(b).punts; 
                                    if (puntsA > puntsB) {
                                        return -1;
                                    }
                                    if (puntsA < puntsB) {
                                        return 1;
                                    }
                            
                                    return 0;
                                });
                                if(records.length > 3) records.pop();
                                localStorage.setItem("records", JSON.stringify(records));
                                loadpage("../");
                            }
                        }
                        else { // És correcte
                            this.correct++;
                            if (this.correct >= this.nCards) {
                                this.time.delayedCall(500, () => {
                                    alert("Has guanyat! \nSumes " + this.score + " punts al contador");
                                    let dificultat = this.difficulty;
                                    if (dificultat == "easy") dificultat = "normal";
                                    else dificultat = "hard";
                                    let nCartes = this.nCards;
                                    if (nCartes < 4) nCartes++;
                                    else nCartes = 4;
                                    let points = this.punts;
                                    if (points == null) points = 0;
                                    var new_config_data = {
                                        cards: nCartes,
                                        difficulty: dificultat,
                                        punts: points + this.score,
                                        username: sessionStorage.getItem("username")
                                    };
                                    localStorage.setItem("config", JSON.stringify(new_config_data));
                                    loadpage("phaserArcadeMode.html")
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

function saveGame() {
    var partidaActual = JSON.stringify(options_data);
    var saveFiles = JSON.parse(localStorage.getItem("saves")) || [];
    if(saveFiles.length == 3) saveFiles.shift();
    saveFiles.push(partidaActual);
    localStorage.setItem("saves", JSON.stringify(saveFiles));
    localStorage.setItem("config", JSON.stringify(default_config));
    loadpage("../");
}