const words = [
    'hello',
    'world',
    'foo',
    'bar',
    'typing',
    'javascript',
    'phaser',
    'open source',
    'space',
    'shoot',
    'game over'
];

class TypingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'typing' });
    }

    preload() {
        // Nincsenek assetek
    }

    create() {
        // Csoport a zuhanó szavaknak
        this.words = this.add.group();

        // A játékos űrhajója (text sprite-ként)
        this.add.text(
            this.scale.width / 2,
            this.scale.height - 50,
            '🚀',
            { fontSize: '32px' }
        ).setOrigin(0.5);

        // Billentyűzetfigyelés
        this.input.keyboard.on('keydown', this.handleKey, this);

        // Szavak indítása időzítővel
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnWord,
            callbackScope: this,
            loop: true
        });

        // **************************************************
        // INPUT-KEZELÉS állapotváltozók
        // **************************************************
        // Ha false, még nem találtad el semelyik szó első betűjét
        this.inputStarted = false;
        // A kiválasztott szó, amin dolgozunk
        this.currentWord = null;
    }

    spawnWord() {
        // Véletlenszerű szó, véletlen X pozíció
        const text = Phaser.Utils.Array.GetRandom(words);
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const speed = Phaser.Math.Between(50, 120);

        const word = this.add.text(x, 0, text, { fontSize: '24px', color: '#ffffff' });
        word.setData('speed', speed);
        this.words.add(word);
    }

    handleKey(event) {
        // Ha még nem kezdtél bele (nem találtad el az első betűt):
        if (!this.inputStarted) {
            // csak egykarakteres billentyűkre reagálunk
            if (event.key.length === 1) {
                // keresünk olyan szót, amelynek az első karaktere egyezik
                let found = null;
                this.words.getChildren().forEach(word => {
                    if (!found && word.text.charAt(0).toLowerCase() === event.key.toLowerCase()) {
                        found = word;
                    }
                });
                if (found) {
                    // eltaláltad az első betűt
                    this.inputStarted = true;
                    this.currentWord = found;
                    // eltüntetjük a szó első karakterét
                    const newText = found.text.substring(1);
                    found.setText(newText);
                    // ha így üres marad, megsemmisítjük rögtön
                    if (newText.length === 0) {
                        found.destroy();
                        this.inputStarted = false;
                        this.currentWord = null;
                    }
                }
            }
            // minden más leütést figyelmen kívül hagyunk, és nem jelenítünk meg semmit
            return;
        }

        // Ha már egyszer eltaláltad az első betűt, csak a kiválasztott szóhoz viszonyítunk
        if (this.currentWord && event.key.length === 1) {
            // ha a következő betűt is eltalálod
            if (this.currentWord.text.charAt(0).toLowerCase() === event.key.toLowerCase()) {
                const newText = this.currentWord.text.substring(1);
                this.currentWord.setText(newText);
                // ha üres lett, töröljük és újracélzásra állítunk vissza
                if (newText.length === 0) {
                    this.currentWord.destroy();
                    this.inputStarted = false;
                    this.currentWord = null;
                }
            }
        }
        // egyéb billentyűk és Backspace itt nem csinálnak semmit
    }

    update(time, delta) {
        // Szavak lefele mozgatása, ha leérnek, megsemmisülnek
        this.words.getChildren().forEach(word => {
            word.y += word.getData('speed') * delta / 1000;
            if (word.y > this.scale.height) {
                word.destroy();
                // itt lehet életet csökkenteni
            }
        });
    }
}

// Phaser játék indítása
new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: TypingScene
});
