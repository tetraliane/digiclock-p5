import p5 from "p5";

const CHAR_SIZE = 64;
const CHAR_SPACING = 4;

export function sketch(p: p5): void {
  const slides: Slide[] = [];

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.frameRate(60);

    p.textFont("Anonymous Pro");
    p.textSize(CHAR_SIZE);

    const t = timeStr();
    for (let i = 0; i < t.length; i++) {
      const char = t[i];
      const x = (CHAR_SIZE / 2 + CHAR_SPACING) * (i - (t.length - 1) / 2);
      slides.push(new Slide("", char, [x, 0], -Infinity));
    }
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function () {
    p.background(bgColor());
    p.translate(p.width / 2, p.height / 2);

    const s = timeStr();
    for (let i = 0; i < s.length; i++) {
      slides[i].update(s[i]);
      slides[i].draw();
    }
  };

  class Slide {
    static DURATION = 500; // milliseconds
    static TIMING_FUNCTION = easeOut;

    constructor(
      private _prevValue: string,
      private _value: string,
      private _pos: [number, number],
      private _startTime: number,
    ) {}

    update(newValue: string): void {
      if (this._value === newValue) return;
      this._prevValue = this._value;
      this._value = newValue;
      this._startTime = p.millis();
    }

    draw(): void {
      const progress = p.min(
        (p.millis() - this._startTime) / Slide.DURATION,
        1,
      );

      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(CHAR_SIZE);
      const y = 1 - Slide.TIMING_FUNCTION(progress);

      const c = fgColor();
      c.setAlpha(255 * (1 - Slide.TIMING_FUNCTION(progress)));
      p.fill(c);
      p.text(this._prevValue, this._pos[0], this._pos[1] + (y - 1) * CHAR_SIZE);

      c.setAlpha(255 * Slide.TIMING_FUNCTION(progress));
      p.fill(c);
      p.text(this._value, this._pos[0], this._pos[1] + y * CHAR_SIZE);
    }
  }

  function timeStr(): string {
    const hour = String(p.hour()).padStart(2, "0");
    const min = String(p.minute()).padStart(2, "0");
    const sec = String(p.second()).padStart(2, "0");
    return `${hour}:${min}:${sec}`;
  }

  function bgColor(): p5.Color {
    return p.color(255);
  }

  function fgColor(): p5.Color {
    return p.color(0);
  }
}

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}
