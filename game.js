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
        // No assets to load since we use text graphics
    }

    create() {
        // Group to hold all falling words
        this.words = this.add.group();

        // Track the word currently being typed
        this.activeWord = null;

        // Represent the player's ship as a text sprite
        this.add.text(
            this.scale.width / 2,
            this.scale.height - 50,
            '🚀',
            { fontSize: '32px' }
        ).setOrigin(0.5);

        // Listen for keyboard input
        this.input.keyboard.on('keydown', this.handleKey, this);

        // Spawn new words on a timer
        this.time.addEvent({
            delay: 2000,
            callback: this.spawnWord,
            callbackScope: this,
            loop: true
        });
    }

    spawnWord() {
        // Choose a random word and create it at a random x position
        const text = Phaser.Utils.Array.GetRandom(words);
        const x = Phaser.Math.Between(50, this.scale.width - 50);
        const speed = Phaser.Math.Between(50, 120);

        const word = this.add.text(x, 0, text, { fontSize: '24px', color: '#ffffff' });
        word.setData('speed', speed);
        word.setData('remaining', text);
        this.words.add(word);
    }

    handleKey(event) {
        if (event.key.length !== 1) {
            return;
        }

        const key = event.key.toLowerCase();

        if (!this.activeWord) {
            // Look for a word starting with the pressed key
            const candidates = this.words.getChildren().filter(w => w.getData('remaining').toLowerCase().startsWith(key));
            if (candidates.length > 0) {
                // choose the one closest to the bottom
                candidates.sort((a, b) => b.y - a.y);
                this.activeWord = candidates[0];
                this.processChar(key);
            }
        } else {
            this.processChar(key);
        }
    }

    processChar(char) {
        if (!this.activeWord) return;
        const remaining = this.activeWord.getData('remaining');
        if (!remaining || remaining.length === 0) return;

        if (remaining[0].toLowerCase() === char) {
            const flash = this.add.text(this.activeWord.x, this.activeWord.y, remaining[0], { fontSize: '24px', color: '#ffff00' }).setOrigin(0.5);
            this.tweens.add({
                targets: flash,
                alpha: 0,
                duration: 150,
                onComplete: () => flash.destroy()
            });

            const newRemaining = remaining.slice(1);
            this.activeWord.setData('remaining', newRemaining);
            this.activeWord.setText(newRemaining);

            if (newRemaining.length === 0) {
                this.activeWord.destroy();
                this.activeWord = null;
            }
        }
    }

    update(time, delta) {
        // Move words downward and check if they've reached the bottom
        this.words.getChildren().forEach(word => {
            word.y += word.getData('speed') * delta / 1000;
            if (word.y > this.scale.height) {
                if (this.activeWord === word) {
                    this.activeWord = null;
                }
                word.destroy();
                // Optional: reduce life or trigger damage here
            }
        });
    }
}

// Set up the Phaser game instance
new Phaser.Game({
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: TypingScene
});
