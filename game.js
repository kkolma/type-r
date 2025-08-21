const words = [
  ['Csak', 'Selmeczi Gabriella', 1],
  ['Ennyi!', 'Deutsch Tamás', 1],
  ['Ne hazudj!', 'Bese Gergő atya', 1],
  ['De sikerült?', 'Kovács Zoltán', 1],
  ['Orbán egy geci!', 'Simicska Lajos', 1],
  ['Vége van, Kicsi!', 'Mentzer Tamás', 1],
  ['Bátorak legyetek!', 'Mészáros "Lölő" Lőrinc', 1],
  ['Nem vagyok buzeráns!', 'Kocsis Máté', 2],
  ['Átteleltek a poloskák', 'Orbán Viktor', 2],
  ['Ada, adadada, ad adad', 'Orbán Viktor', 2],
  ['Saját lábunkon állunk', 'Orbán Ráhel', 2],
  ['Gondolom, nem gyalog?!', 'Mészáros Lőrinc', 2],
  ['Tolmácsot szeretnék kérni', 'Vida Ildikó', 2],
  ['Nőügyekkel nem foglalkozom', 'Orbán Viktor', 3],
  ['Elvesztette közpénz jellegét', 'Kósa Lajos', 3],
  ['Komondor kutyánk, vak szegény', 'Balogh József', 3],
  ['Büdös a szád, állj már arrébb!', 'Kocsis Máté', 3],
  ['Ember, most jövök ki a templomból', 'Orbán Viktor', 4],
  ['Parasztgyerek vagyok, nem urizálok', 'Rogán Antal', 4],
  ['Akinek nincs semmije, az annyit is ér', 'Lázár János', 4],
  ['A Jóisten, a szerencse és Orbán Viktor', 'Mészáros Lőrinc', 4],
  ['Nem azért lettem pap, mert hogy a fiúkat szeretem', 'Bese Gergő atya', 5],
  ['Mégiscsak Csányi Sándor az ország elsőszámú uzsorása', 'Lázár János', 5],
  ['Az tartozik a miniszteri feladataimhoz, amit annak gondolok', 'Rogán Antal', 6],
  ['Ne nyerjünk annyit, amennyit kértünk, ne mi kapjuk a legtöbbet.', 'Orbán Viktor', 6],
  ['A Pride szervezői ne bajlódjanak az idei felvonulás előkészítésével.', 'Orbán Viktor', 6],
  ['Nagyon régen szereltem utoljára gázt, mivel én egy vezető ember vagyok', 'Mészáros Lőrinc', 6],
  ['Amit korrupciónak neveznek, az gyakorlatilag a Fidesz legfőbb politikája', 'Lánczi András', 7],
  ['Szanaszét kell verni a civilek pofáját és taknyukon, vérükön kell őket kirángatni', 'Bayer Zsolt', 7],
  ['Nem penész található a plafonon, hanem a főzés során a kicsapódott zsírra por szállhat', 'Vitályos Eszter', 7],
  ['Mi sohasem vetemednénk arra, hogy elhallgattassuk azokat, akik nem értenek egyet velünk', 'Orbán Viktor', 8],
  ['Ha támadják a kisvasutat, akkor meg kell hosszabbítani Bicskéig, és ha akkor is támadják, akkor meg Lovasberényig', 'Orbán Viktor', 9],
  ['Mindenki a maga sikere kovácsa, ez bárki legyen, azt gondolom, tehát mindenki, mindenki, tehát kell hozzá, hogy valamire vigye, vagy valamire ne vigye, ahhoz is kell ám nagyon sok minden, ez lehet pozitív, negatív.”', '"BOSS" FIGHT: Mészáros Lőrinc', 666],
];

class TypingScene extends Phaser.Scene {
  constructor() {
    super({ key: 'typing' });
    this.highScore = 0; // Rekord: session high score
  }

  preload() {
    this.load.image('ship', 'assets/pro-ship.png');
    this.load.image('hungary', 'assets/hungary.png');
    this.load.image('clouds', 'assets/clouds.png');
    this.load.audio('bgmusic', ['assets/80s-synth-166739.mp3']);

  }

  // Resize handler: újrapozícionálja a főbb elemeket
  onResize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    // Start képernyő elemek
    if (this.gameState === 'start' && this.startScreenTexts && this.startScreenTexts.length) {
      // Rekord szöveg
      if (this.recordText) this.recordText.setPosition(width / 2, 30);

      // Cím (NER-TYPE) betűk
      if (this.nerTypeLetters && this.nerTypeLetters.length) {
        const title = 'NER-TYPE';
        const fontSize = 64;
        const spacing = 48;
        this.nerTypeBaseY = height / 2 - 60;
        const titleTotalWidth = (title.length - 1) * spacing + fontSize;
        let titleStartX = width / 2 - titleTotalWidth / 2 + fontSize / 2;
        for (let i = 0; i < this.nerTypeLetters.length; i++) {
          this.nerTypeLetters[i].setPosition(titleStartX + i * spacing, this.nerTypeBaseY);
        }
      }

      // "Harc a propaganda ellen!" szöveg
      if (this.startScreenTexts.length >= 3) {
        const propagandaText = this.startScreenTexts.find(t => t.text === 'Harc a propaganda ellen!');
        if (propagandaText) propagandaText.setPosition(width / 2, this.nerTypeBaseY + 60);
      }

      // "START" betűk
      if (this.menuLetterTexts && this.menuLetterTexts.length) {
        const letters = ['S', 'T', 'A', 'R', 'T'];
        const lettersTotalWidth = letters.length * 48 + (letters.length - 1) * 8;
        let lettersStartX = width / 2 - lettersTotalWidth / 2 + 24;
        for (let i = 0; i < this.menuLetterTexts.length; i++) {
          this.menuLetterTexts[i].setPosition(lettersStartX + i * 56, height / 2 + 80);
        }
      }

      // "by Ko-Ko" és "Zene" kreditek
      if (this.byKoKoText) this.byKoKoText.setPosition(width - 10, height - 10);
      if (this.musicCreditText) this.musicCreditText.setPosition(10, height - 10);
    }

    // HUD és játék közbeni elemek
    if (this.gameState === 'playing') {
      // HUD háttér
      if (this.hudBg) {
        this.hudBg.clear();
        this.hudBg.fillStyle(0x22232a, 0.92);
        this.hudBg.fillRect(0, 0, width, 54);
      }
      // HUD szövegek
      if (this.levelText) this.levelText.setPosition(width * 0.32, 54 / 2);
      if (this.livesText) this.livesText.setPosition(width * 0.60, 54 / 2);
      if (this.bonusText) this.bonusText.setPosition(width - 24, 54 / 2);

      // Felhők és Hungary tileSprite
      if (this.cloudsTile) {
        this.cloudsTile.setPosition(0, height - this.cloudsTile.displayHeight);
        this.cloudsTile.displayWidth = width;
        // displayHeight marad, nem változik
      }
      if (this.bgTile) {
        this.bgTile.setPosition(0, height - this.bgTile.displayHeight);
        this.bgTile.displayWidth = width;
        // displayHeight marad, nem változik
      }
      // Hajó (ship) függőleges közép
      if (this.ship) this.ship.setPosition(20, height / 2);
    }

    // Game Over képernyő
    if (this.gameState === 'gameover' && this.gameOverTexts && this.gameOverTexts.length) {
      // "Játék Vége" szöveg
      if (this.gameOverTexts[0]) this.gameOverTexts[0].setPosition(width / 2, height / 2 - 40);
      // "T O V Á B B" betűk
      if (this.gameOverLetterTexts && this.gameOverLetterTexts.length) {
        const letters = ['T', 'O', 'V', 'Á', 'B', 'B'];
        const totalWidth = letters.length * 48 + (letters.length - 1) * 8;
        let startX = width / 2 - totalWidth / 2 + 24;
        for (let i = 0; i < this.gameOverLetterTexts.length; i++) {
          this.gameOverLetterTexts[i].setPosition(startX + i * 56, height / 2 + 100);
        }
      }
    }
  }

  create() {
    // --- State management ---
    // Play background music if not already playing
    if (!this.bgMusic) {
      this.bgMusic = this.sound.add('bgmusic', { loop: true, volume: 0.5 });
      this.bgMusic.play();
    }

    // Prevent browser from scrolling on SPACE when game is focused
    this.input.keyboard.addCapture(['SPACE']);

    this.gameState = 'start'; // 'start', 'playing', 'gameover'
    this.menuSequence = ['s', 't', 'a', 'r', 't'];
    this.menuPrompt = 'Start';
    this.menuProgress = 0;
    this.menuLetterTexts = [];
    this.gameOverSequence = ['t', 'o', 'v', 'á', 'b', 'b'];
    this.gameOverPrompt = 'Tovább';
    this.gameOverProgress = 0;
    this.gameOverLetterTexts = [];
    this.startScreenTexts = [];
    this.gameOverTexts = [];
    this.recordText = null; // Rekord szöveg objektum

    // Listen for resize events
    this.scale.on('resize', this.onResize, this);

    // Background stars (always visible)
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1).fillCircle(2, 2, 2);
    g.generateTexture('star', 4, 4);
    g.destroy();

    this.add.particles(
      0, 0, 'star',
      {
        emitZone: {
          type: 'random',
          source: new Phaser.Geom.Rectangle(0, 0, this.scale.width, this.scale.height)
        },
        lifespan: { min: 8000, max: 12000 },
        speedX:  { min: -20, max: -50 },
        quantity: 1,
        frequency: 100,
        alpha: { start: 0.3, end: 0 },
        scale: { start: 0.5, end: 0 }
      }
    );
    this.add.particles(
      0, 0, 'star',
      {
        emitZone: {
          type: 'random',
          source: new Phaser.Geom.Rectangle(0, 0, this.scale.width, this.scale.height)
        },
        lifespan: { min: 4000, max:  6000 },
        speedX:  { min: -80, max: -120 },
        quantity: 1,
        frequency:  50,
        alpha: { start: 0.7, end: 0 },
        scale: { start: 1,   end: 0 }
      }
    );

    this.audioCtx = null; // Will be created on first user gesture

    // Listen for all keydown events for state transitions
    this.input.keyboard.on('keydown', this.handleGlobalKey, this);

    // Show start screen
    this.showStartScreen();
  }

  // --- State transition helpers ---

  showStartScreen() {
    this.clearGameObjects();
    this.gameState = 'start';
    this.menuProgress = 0;
    this.startScreenTexts = [];
    // Rekord szöveg (top center)
    const rekordStr = `Rekord: ${this.highScore}`;
    this.recordText = this.add.text(this.scale.width / 2, 30, rekordStr, {
      fontSize: '32px',
      color: 'rgba(114, 114, 114, 1)',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 4,
      align: 'center'
    }).setOrigin(0.5, 0);
    this.startScreenTexts.push(this.recordText);

    // Title as animated sine wave letters
    this.nerTypeLetters = [];
    const title = 'NER-TYPE';
    const fontSize = 64;
    const spacing = 48;
    this.nerTypeBaseY = this.scale.height / 2 - 60;
    const titleTotalWidth = (title.length - 1) * spacing + fontSize;
    let titleStartX = this.scale.width / 2 - titleTotalWidth / 2 + fontSize / 2;
    for (let i = 0; i < title.length; i++) {
      const ch = title[i];
      const t = this.add.text(titleStartX + i * spacing, this.nerTypeBaseY, ch, {
        fontSize: `${fontSize}px`, color: '#fff', fontStyle: 'bold', stroke: '#0ff', strokeThickness: 4
      }).setOrigin(0.5, 0.5);
      this.nerTypeLetters.push(t);
      this.startScreenTexts.push(t);
    }
    // "Harc a propaganda ellen!" under the NER-TYPE title
    const propagandaText = this.add.text(
      this.scale.width / 2,
      this.nerTypeBaseY + 60,
      'Harc a propaganda ellen!',
      {
        fontSize: '25px',
        color: '#ffcc00',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 3,
        align: 'center'
      }
    ).setOrigin(0.5, 0);
    this.startScreenTexts.push(propagandaText);

    // "S T A R T" letters for fade effect, below the word
    this.menuLetterTexts = [];
    const letters = ['S', 'T', 'A', 'R', 'T'];
    const lettersTotalWidth = letters.length * 48 + (letters.length - 1) * 8;
    let lettersStartX = this.scale.width / 2 - lettersTotalWidth / 2 + 24;
    for (let i = 0; i < letters.length; i++) {
      const t = this.add.text(lettersStartX + i * 56, this.scale.height / 2 + 80, letters[i], {
        fontSize: '40px', color: '#fff'
      }).setOrigin(0.5, 0.5);
      this.startScreenTexts.push(t);
      this.menuLetterTexts.push(t);
    }
    // "by Ko-Ko" label in bottom right corner
    this.byKoKoText = this.add.text(this.scale.width - 10, this.scale.height - 10, 'Ötlet + kód: Ko-Ko', {
      fontSize: '14px',
      color: '#888',
      fontStyle: 'italic'
    }).setOrigin(1, 1);
    this.startScreenTexts.push(this.byKoKoText);

    // "Zene: Дмитрий Соколов" label in bottom left corner (same style as "idea + code: Ko-Ko")
    this.musicCreditText = this.add.text(10, this.scale.height - 10, 'Zene: Дмитрий Соколов', {
      fontSize: '14px',
      color: '#888',
      fontStyle: 'italic'
    }).setOrigin(0, 1);
    this.startScreenTexts.push(this.musicCreditText);

    // Verziószám középen legalul
    this.versionText = this.add.text(this.scale.width / 2, this.scale.height - 10, 'v1.02', {
      fontSize: '16px',
      color: '#888',
      fontStyle: 'italic'
    }).setOrigin(0.5, 1);
    this.startScreenTexts.push(this.versionText);
  }

  startGame() {
    this.clearGameObjects();
    // Add scrolling clouds and hungary images at the very bottom
    const hungaryImg = this.textures.get('hungary').getSourceImage();
    const cloudsImg = this.textures.get('clouds').getSourceImage();
    const imgHeight = hungaryImg.height;
    // Clouds behind hungary
    this.cloudsTile = this.add.tileSprite(
      0,
      Math.floor(this.scale.height - cloudsImg.height),
      this.scale.width,
      cloudsImg.height,
      'clouds'
    ).setOrigin(0, 0).setDepth(-20);
    this.cloudsTile.displayHeight = cloudsImg.height;

    this.bgTile = this.add.tileSprite(
      0,
      Math.floor(this.scale.height - imgHeight),
      this.scale.width,
      imgHeight,
      'hungary'
    ).setOrigin(0, 0).setDepth(-10);
    this.bgTile.displayHeight = imgHeight;

    // DEBUG: log tileSprite magasságok
    console.log('bgTile.height:', this.bgTile.height, 'displayHeight:', this.bgTile.displayHeight, 'imgHeight:', imgHeight);
    console.log('cloudsTile.height:', this.cloudsTile.height, 'displayHeight:', this.cloudsTile.displayHeight, 'cloudsImg.height:', cloudsImg.height);
    this.gameState = 'playing';
    this.spaceProgress = 0;

    // --- HUD háttérsáv ---
    const hudHeight = 54;
    this.hudBg = this.add.graphics();
    this.hudBg.fillStyle(0x22232a, 0.92);
    this.hudBg.fillRect(0, 0, this.scale.width, hudHeight);
    this.hudBg.setDepth(100);

    // --- Egységes HUD szövegstílus ---
    const hudFont = {
      fontFamily: 'Arial',
      fontSize: '26px',
      color: '#fff',
      fontStyle: 'bold',
      stroke: '#000',
      strokeThickness: 3,
      shadow: { offsetX: 2, offsetY: 2, color: '#000', blur: 2, fill: true }
    };

    this.words = this.add.group();
    this.level = 1;

    // Pontszám (balra)
    this.score = 0;
    this.scoreText = this.add.text(24, hudHeight / 2, 'Pontszám: 0', hudFont).setOrigin(0, 0.5).setDepth(101);

    // Szint (középen bal)
    this.levelText = this.add.text(this.scale.width * 0.32, hudHeight / 2, `Szint: ${this.level}`, hudFont).setOrigin(0, 0.5).setDepth(101);

    // Életek (középen jobb)
    this.lives = 3;
    this.livesText = this.add.text(this.scale.width * 0.60, hudHeight / 2, `Életek: ${this.lives}`, hudFont).setOrigin(0, 0.5).setDepth(101);

    // Bónusz (jobbra)
    this.bonus = 1;
    this.bonusText = this.add.text(this.scale.width - 24, hudHeight / 2, `Bónusz: ${this.bonus}x`, hudFont).setOrigin(1, 0.5).setDepth(101);

    this._prepareLevelQueue();
    this.spawnWord();
    this.wordTimer = this.time.addEvent({ delay: 4000, callback: this.spawnWord, callbackScope: this, loop: true });

    this.inputStarted = false;
    this.currentWord = null;
    this.currentProgress = 0;
    this.hasMistakeDuringWord = false;

    this.ship = this.add.image(
      20,
      this.scale.height / 2,
      'ship'
    );
    this.ship.setOrigin(0.5, 0.5);
    const targetWidth = 40;
    const scale = targetWidth / this.ship.width;
    this.ship.setScale(scale);

    this.isGameOver = false;

    // Only listen for gameplay keys in playing state
    this.input.keyboard.on('keydown', this.handleKey, this);
  }

  showGameOverScreen() {
    // Update rekord if needed
    if (this.score > this.highScore) {
      this.highScore = this.score;
    }
    // Do NOT clear gameplay objects or data!
    this.gameState = 'gameover';
    this.spaceProgress = 0;

    // Remove all word containers from the screen
    if (this.words) this.words.clear(true, true);

    this.gameOverTexts = [
      this.add.text(this.scale.width / 2, this.scale.height / 2 - 40, 'Játék Vége', {
        fontSize: '56px', color: '#ff4444', backgroundColor: '#000', padding: { x: 20, y: 10 }
      }).setOrigin(0.5, 0.5),

    ];
    // "T O V Á B B" letters for fade effect, below the word
    this.gameOverLetterTexts = [];
    const letters = ['T', 'O', 'V', 'Á', 'B', 'B'];
    const totalWidth = letters.length * 48 + (letters.length - 1) * 8;
    let startX = this.scale.width / 2 - totalWidth / 2 + 24;
    for (let i = 0; i < letters.length; i++) {
      const t = this.add.text(startX + i * 56, this.scale.height / 2 + 100, letters[i], {
        fontSize: '40px', color: '#fff'
      }).setOrigin(0.5, 0.5);
      this.gameOverTexts.push(t);
      this.gameOverLetterTexts.push(t);
    }
    // Do NOT destroy the "Tovább" fade letters here; let them fade as the user types
  }

  clearGameObjects() {
    // Remove all texts and containers from previous state
    if (this.hudBg) { this.hudBg.destroy(); this.hudBg = null; }
    if (this.bgTile) { this.bgTile.destroy(); this.bgTile = null; }
    if (this.cloudsTile) { this.cloudsTile.destroy(); this.cloudsTile = null; }
    if (this.words) this.words.clear(true, true);
    if (this.levelText) this.levelText.destroy();
    if (this.livesText) this.livesText.destroy();
    if (this.scoreText) this.scoreText.destroy();
    if (this.bonusText) this.bonusText.destroy();
    if (this.ship) this.ship.destroy();
    if (this.wordTimer) this.wordTimer.remove(false);
    if (this.startScreenTexts) this.startScreenTexts.forEach(t => t.destroy());
    if (this.gameOverTexts) this.gameOverTexts.forEach(t => t.destroy());
    if (this.menuLetterTexts) this.menuLetterTexts.forEach(t => t.destroy());
    if (this.gameOverLetterTexts) this.gameOverLetterTexts.forEach(t => t.destroy());
    // Remove gameplay key handler if present
    if (this.input && this.handleKey) this.input.keyboard.off('keydown', this.handleKey, this);
    if (this.byKoKoText) this.byKoKoText.destroy();
    if (this.musicCreditText) { this.musicCreditText.destroy(); this.musicCreditText = null; }
  }

  // --- Global key handler for state transitions and "space" sequence ---
  handleGlobalKey(e) {
      // Ensure AudioContext is created/resumed on first user gesture
      if (!this.audioCtx) {
          this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          console.log('AudioContext created on user gesture');
      } else if (this.audioCtx.state === 'suspended') {
          this.audioCtx.resume().then(() => {
              console.log('AudioContext resumed on user gesture');
          });
      }

      if (this.gameState === 'playing') return; // handled by gameplay
      const key = e.key.toLowerCase();
      if (key.length !== 1) return;

      if (this.gameState === 'start') {
          if (key === this.menuSequence[this.menuProgress]) {
              // Fade out the corresponding letter
              if (this.menuLetterTexts && this.menuLetterTexts[this.menuProgress]) {
                  this.tweens.add({
                      targets: this.menuLetterTexts[this.menuProgress],
                      alpha: 0.3,
                      duration: 200,
                      ease: 'Linear'
                  });
                  this._playBeep();
              }
              this.menuProgress++;
              if (this.menuProgress === this.menuSequence.length) {
                  this.time.delayedCall(250, () => {
                      if (this.menuLetterTexts) this.menuLetterTexts.forEach(t => t.destroy());
                  });
                  this.startGame();
              }
          } else {
              // Wrong key resets progress and restores all letters
              if (this.menuLetterTexts) {
                  this.menuLetterTexts.forEach(t => t.setAlpha(1));
              }
              this.menuProgress = 0;
          }
      } else if (this.gameState === 'gameover') {
          // Handle accented and uppercase letters for "Tovább"
          let expected = this.gameOverSequence[this.gameOverProgress];
          let actual = key;
          // Accept both lower and uppercase, and handle 'á'
          if (expected === 'á' && (actual === 'á' || actual === 'a')) actual = 'á';
          if (expected === actual) {
              if (this.gameOverLetterTexts && this.gameOverLetterTexts[this.gameOverProgress]) {
                  this.tweens.add({
                      targets: this.gameOverLetterTexts[this.gameOverProgress],
                      alpha: 0.3,
                      duration: 200,
                      ease: 'Linear'
                  });
                  this._playBeep();
              }
              this.gameOverProgress++;
              if (this.gameOverProgress === this.gameOverSequence.length) {
                  this.time.delayedCall(250, () => {
                      if (this.gameOverLetterTexts) this.gameOverLetterTexts.forEach(t => t.destroy());
                      if (this.gameOverTexts) this.gameOverTexts.forEach(t => t.destroy());
                  });
                  this.showStartScreen();
              }
          } else {
              if (this.gameOverLetterTexts) {
                  this.gameOverLetterTexts.forEach(t => t.setAlpha(1));
              }
              this.gameOverProgress = 0;
          }
      }
  }

  _prepareLevelQueue() {
    let filtered = words.filter(w => w[2] === this.level);
    if (filtered.length === 0) {
      // Ha nincs több szó ezen a szinten, vissza az első szintre
      this.level = 1;
      filtered = words.filter(w => w[2] === this.level);
    }
    this.levelQueue = Phaser.Utils.Array.Shuffle(filtered.slice());
  }

  spawnWord() {
    // Random color: red, white, or green (Hungarian flag)
    const flagColors = ['#d32f2f', '#fff', '#388e3c'];
    const randomColor = flagColors[Math.floor(Math.random() * flagColors.length)];

    console.log('spawnWord called, state:', this.gameState);
    if (!this.levelQueue.length) {
      this.level++;
      this.levelText.setText(`Szint: ${this.level}`);
      this._prepareLevelQueue();
    }
    const [text, author, lvl] = this.levelQueue.shift();
    const wordsArr = text.split(' ');
    const fs = 23, lh = fs * 1.2;
    const style = { fontSize: `${fs}px`, color: randomColor };

    // --- Plakát méretezés előkészítés ---
    const measured = wordsArr.map(w => {
      const t = this.add.text(0, 0, w, style);
      const wdt = t.width;
      t.destroy();
      return { word: w, width: wdt };
    });
    const spaceWd = this.add.text(0, 0, ' ', style).width;
    const sentenceWidth = measured.reduce((s, o) => s + o.width, 0) + (measured.length - 1) * spaceWd;

    const startX = this.scale.width + 20;
    const hudHeight = 54;
    const topMargin = hudHeight + 10, bottomMargin = 50;
    const rows = Math.ceil(sentenceWidth / (this.scale.width - 40));
    const blockHeight = rows * lh + lh;
    const startY = Phaser.Math.Between(topMargin, this.scale.height - bottomMargin - blockHeight);

    const speed = Phaser.Math.Between(50, 120);
    const container = this.add.container(startX, startY);
    container.setData('speed', speed);

    // --- Plakát háttér ---
    // Számoljuk ki a szövegblokk szélességét és magasságát
    const paddingX = 24, paddingY = 18;
    const bgWidth = Math.min(sentenceWidth, this.scale.width - 60) + paddingX * 2;
    const bgHeight = blockHeight + 36 + paddingY * 2; // + author hely

    // --- EREDETI HÁTTÉR NÉLKÜLI LOGIKA ---
    const letters = [];
    let ox = 0, oy = 0;
    const wrapWidth = this.scale.width - 40;
    for (let i = 0; i < measured.length; i++) {
      const { word, width: wdt } = measured[i];
      if (ox + wdt > wrapWidth) { ox = 0; oy += lh; }
      for (let ch of word) {
        const lt = this.add.text(ox, oy, ch, style).setOrigin(0);
        container.add(lt);
        letters.push(lt);
        ox += lt.width;
      }
      if (i < measured.length - 1) {
        const sp = this.add.text(ox, oy, ' ', style).setOrigin(0);
        container.add(sp);
        letters.push(sp);
        ox += sp.width;
      }
    }
    const auth = this.add.text(0, oy + lh, `- ${author}`, { fontSize: '16px', color: '#ccc' }).setOrigin(0);
    container.add(auth);

    container.letters = letters;
    container.authorText = auth;
    this.words.add(container);
  }

  handleKey(e) {
    if (e.key.length !== 1) return;
    if (!this.inputStarted) {
      const found = this.words.getChildren().find(c => c.letters[0].text.toLowerCase() === e.key.toLowerCase());
      if (found) {    
        this.inputStarted = true;
        this.currentWord = found;
        this.currentProgress = 0;
        this.hasMistakeDuringWord = false;
        this._onCorrectChar();
      }
    } else {
      const letters = this.currentWord.letters;
      if (
        this.currentProgress < letters.length &&
        letters[this.currentProgress].text.toLowerCase() === e.key.toLowerCase()
      ) {
        this._onCorrectChar();
      } else if (!this.hasMistakeDuringWord) {
        // first typo resets bonus
        this.hasMistakeDuringWord = true;
        this.bonus = 1;
        this.bonusText.setText(`Bónusz: ${this.bonus}x`);
      }
    }
  }

  _onCorrectChar() {
    // award points with bonus multiplier
    this.score += this.level * this.bonus;
    this.scoreText.setText(`Pontszám: ${this.score}`);

    const lt = this.currentWord.letters[this.currentProgress];
    const targetX = this.currentWord.x + lt.x + lt.width / 2;
    const targetY = this.currentWord.y + lt.y + lt.height / 2;

    // move ship
    this.tweens.add({ targets: this.ship, y: targetY, duration: 100, ease: 'Linear' });

    // fire bullet
    const bullet = this.add.ellipse(this.ship.x + 40, this.ship.y, 8, 8, 0xff0000);
    this.tweens.add({
      targets: bullet,
      x: targetX,
      y: targetY,
      duration: 200,
      ease: 'Linear',
      onComplete: () => bullet.destroy()
    });

    this._playBeep();
    this.tweens.add({ targets: lt, alpha: 0.3, duration: 200, ease: 'Linear' });

    this.currentProgress++;
    if (this.currentProgress >= this.currentWord.letters.length) {
      const fin = this.currentWord;
      // double bonus if no mistakes
      if (!this.hasMistakeDuringWord) {
        this.bonus *= 2;
        this.bonusText.setText(`Bónusz: ${this.bonus}x`);
      }
      this.inputStarted = false;
      this.currentWord = null;
      this.currentProgress = 0;

      this.tweens.add({
        targets: [fin, fin.authorText],
        alpha: 0,
        duration: 300,
        ease: 'Cubic.easeOut',
        onComplete: () => fin.destroy(true)
      });
    }
  }

  _playBeep() {
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.frequency.value = 800;
    gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime);
    osc.start();
    osc.stop(this.audioCtx.currentTime + 0.05);
  }

  update(time, delta) {
    // Animate NER-TYPE title in sine wave on start screen
    if (this.gameState === 'start' && this.nerTypeLetters && this.nerTypeLetters.length) {
      const tsec = time / 1000;
      const amplitude = 24;
      const period = 2.0; // seconds for a full wave
      for (let i = 0; i < this.nerTypeLetters.length; i++) {
        this.nerTypeLetters[i].y = this.nerTypeBaseY + Math.sin(tsec * 2 * Math.PI / period + i * 0.5) * amplitude;
      }
    }

    // Animate "START" letters with a pulsing effect on start screen
    if (this.gameState === 'start' && this.menuLetterTexts && this.menuLetterTexts.length) {
      const tsec = time / 1000;
      const pulsePeriod = 1.5; // seconds for a full pulse
      const baseScale = 1.05;
      const pulseAmplitude = 0.12;
      for (let i = 0; i < this.menuLetterTexts.length; i++) {
        // Offset each letter's phase for a wave-like effect, or use same phase for uniform pulse
        const phase = tsec * 2 * Math.PI / pulsePeriod + i * 0.2;
        const scale = baseScale + Math.sin(phase) * pulseAmplitude;
        this.menuLetterTexts[i].setScale(scale);
      }
    }

    // Scroll clouds and hungary at the bottom during gameplay
    if (this.gameState === 'playing') {
      if (this.cloudsTile) {
        this.cloudsTile.tilePositionX += 0.2; // slower
        this.cloudsTile.tilePositionY = 0;
      }
      if (this.bgTile) {
        this.bgTile.tilePositionX += 0.5; // faster, in front
        this.bgTile.tilePositionY = 0;
      }
    }
  
    if (this.gameState !== 'playing') return;

    // Move word containers left
    this.words.getChildren().forEach(c => {
      c.x -= c.getData('speed') * delta / 1000;
      const bounds = c.getBounds();
      if (bounds.right < 0) {
        if (this.currentWord === c) {
          this.inputStarted = false;
          this.currentWord = null;
          this.currentProgress = 0;
        }
        c.destroy(true);

        // --- LIVES SYSTEM: Lose a life if a word reaches the ship ---
        this.lives--;
        this.livesText.setText(`Életek: ${this.lives}`);

        // Play explosion sound and shake effect
        this.playExplosionSound && this.playExplosionSound();
        if (this.cameras && this.cameras.main) {
          this.cameras.main.shake(250, 0.02);
        }

        if (this.lives <= 0) {
          this.isGameOver = true;
          this.showGameOverScreen();
        }
        // --- END LIVES SYSTEM ---
      }
    });
  }
  
  // Simple explosion sound using Web Audio API
  playExplosionSound() {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(80, this.audioCtx.currentTime);
    gain.gain.setValueAtTime(0.5, this.audioCtx.currentTime);
    osc.connect(gain);
    gain.connect(this.audioCtx.destination);
    osc.start();
    osc.frequency.linearRampToValueAtTime(30, this.audioCtx.currentTime + 0.15);
    gain.gain.linearRampToValueAtTime(0, this.audioCtx.currentTime + 0.18);
    osc.stop(this.audioCtx.currentTime + 0.18);
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#000000',
  scene: TypingScene,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};

const game = new Phaser.Game(config);

// Handle window resize to always fill available space
window.addEventListener('resize', () => {
  game.scale.resize(window.innerWidth, window.innerHeight);
});

