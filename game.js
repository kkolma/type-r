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

        // Represent the player's ship as a text sprite
        this.add.text(
            this.scale.width / 2,
            this.scale.height - 50,
            '🚀',
            { fontSize: '32px' }
        ).setOrigin(0.5);

        // Track the current word being typed and progress
        this.activeWord = null;
        this.activeIndex = 0;

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
        this.words.add(word);
    }

    handleKey(event) {
        // Only process single character keys
        if (event.key.length !== 1) return;

        // If no word is currently being typed, look for a word whose first character matches
        if (!this.activeWord) {
            let found = null;
            this.words.getChildren().forEach(word => {
                if (!found && word.text[0] && word.text[0].toLowerCase() === event.key.toLowerCase()) {
                    found = word;
                }
            });
            if (found) {
                this.activeWord = found;
                this.activeIndex = 1;
                this.flashChar(found, 0);
            }
        } else {
            // Continue typing the active word
            const word = this.activeWord;
            const idx = this.activeIndex;
            if (word.text[idx] && word.text[idx].toLowerCase() === event.key.toLowerCase()) {
                this.flashChar(word, idx);
                this.activeIndex++;
                if (this.activeIndex >= word.text.length) {
                    word.destroy();
                    this.activeWord = null;
                    this.activeIndex = 0;
                }
            }
        }
    }

    update(time, delta) {
        // Move words downward and check if they've reached the bottom
        this.words.getChildren().forEach(word => {
            word.y += word.getData('speed') * delta / 1000;
            if (word.y > this.scale.height) {
                // If the active word falls off, reset typing state
                if (this.activeWord === word) {
                    this.activeWord = null;
                    this.activeIndex = 0;
                }
                word.destroy();
                // Optional: reduce life or trigger damage here
            }
        });
    }

    // Flash a character at the given index in the word
    flashChar(word, idx) {
        // Save original text
        const original = word.text;
        // Build highlighted text
        const before = original.slice(0, idx);
        const char = original[idx];
        const after = original.slice(idx + 1);
        // Use Phaser's rich text for color
        word.setText(before + '[color=yellow]' + char + '[/color]' + after);
        // Remove highlight after a short delay
        this.time.delayedCall(120, () => {
            if (word.active) {
                word.setText(original);
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
