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

        // Display the player's typed input at the bottom center
        this.typedText = '';
        this.typedDisplay = this.add.text(
            this.scale.width / 2,
            this.scale.height - 20,
            '',
            { fontSize: '20px', color: '#ffffff' }
        ).setOrigin(0.5);

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
        this.words.add(word);
    }

    handleKey(event) {
        // Append letter keys, handle backspace
        if (event.key === 'Backspace') {
            this.typedText = this.typedText.slice(0, -1);
        } else if (event.key.length === 1) {
            this.typedText += event.key;
        }
        this.typedDisplay.setText(this.typedText);

        // Check for an exact match with any active word
        this.words.getChildren().forEach(word => {
            if (word.text === this.typedText) {
                word.destroy();
                this.typedText = '';
                this.typedDisplay.setText('');
            }
        });
    }

    update(time, delta) {
        // Move words downward and check if they've reached the bottom
        this.words.getChildren().forEach(word => {
            word.y += word.getData('speed') * delta / 1000;
            if (word.y > this.scale.height) {
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
