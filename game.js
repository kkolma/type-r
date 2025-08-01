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
  ['Férjemmel önálló családunk van, saját lábunkon állunk', 'Orbán Ráhel', 5],
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
  }

  preload() {}

  create() {
    // 1) Először generáld le a kisméretű 'star' textúrát
    const g = this.add.graphics();
    g.fillStyle(0xffffff, 1).fillCircle(2, 2, 2);
    g.generateTexture('star', 4, 4);
    g.destroy();

    // 2) Két emitter: egy lassú és egy gyors csillagnak
    // A konfigurációt rögtön creation-nél átadjuk,
    // nincs createEmitter() hívás!

    // Lassú, halvány csillagok
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

    // Gyors, fényes csillagok
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

    // ———— rest of your setup ————
    this.words = this.add.group();
    this.level = 1;
    this.levelText = this.add.text(
      this.scale.width / 2,
      20,
      `Szint: ${this.level}`,
      { fontSize: '24px', color: '#fff' }
    ).setOrigin(0.5, 0);

    this.score = 0;
    this.scoreText = this.add.text(10, 20, 'Pontszám: 0', { fontSize: '24px', color: '#fff' }).setOrigin(0, 0);

    this.bonus = 1;
    this.bonusText = this.add.text(this.scale.width - 10, 20, `Bónusz: ${this.bonus}x`, {
      fontSize: '24px',
      color: '#0f0',
    }).setOrigin(1, 0);

    this._prepareLevelQueue();
    this.spawnWord();
    this.time.addEvent({ delay: 4000, callback: this.spawnWord, callbackScope: this, loop: true });
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    this.input.keyboard.on('keydown', this.handleKey, this);

    this.inputStarted = false;
    this.currentWord = null;
    this.currentProgress = 0;
    this.hasMistakeDuringWord = false;

    this.ship = this.add.triangle(
      20,
      this.scale.height / 2,
      0, -20,
      0, 20,
      40, 0,
      0xffffff
    );
  }

  _prepareLevelQueue() {
    this.levelQueue = Phaser.Utils.Array.Shuffle(
      words.filter(w => w[2] === this.level).slice()
    );
  }

  spawnWord() {
    if (!this.levelQueue.length) {
      this.level++;
      this.levelText.setText(`Szint: ${this.level}`);
      this._prepareLevelQueue();
    }
    const [text, author, lvl] = this.levelQueue.shift();
    const wordsArr = text.split(' ');
    const fs = 23, lh = fs * 1.2;
    const style = { fontSize: `${fs}px`, color: '#fff' };

    const measured = wordsArr.map(w => {
      const t = this.add.text(0, 0, w, style);
      const wdt = t.width;
      t.destroy();
      return { word: w, width: wdt };
    });
    const spaceWd = this.add.text(0, 0, ' ', style).width;
    const sentenceWidth = measured.reduce((s, o) => s + o.width, 0) + (measured.length - 1) * spaceWd;

    const startX = this.scale.width + 20;
    const topMargin = 50, bottomMargin = 50;
    const rows = Math.ceil(sentenceWidth / (this.scale.width - 40));
    const blockHeight = rows * lh + lh;
    const startY = Phaser.Math.Between(topMargin, this.scale.height - bottomMargin - blockHeight);

    const speed = Phaser.Math.Between(50, 120);
    const container = this.add.container(startX, startY);
    container.setData('speed', speed);

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
      }
    });
  }
}

new Phaser.Game({ type: Phaser.AUTO, width: 800, height: 600, backgroundColor: '#000000', scene: TypingScene });
