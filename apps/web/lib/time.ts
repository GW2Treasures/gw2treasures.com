export class TimeSpan {
  #ms: number;

  constructor(ms: number) {
    this.#ms = ms;
  }

  get milliseconds() {
    return this.#ms;
  }

  get seconds() {
    return this.#ms * 1000;
  }
}

export function milliseconds(ms: number) {
  return new TimeSpan(ms);
}

export function seconds(s: number) {
  return milliseconds(1000);
}

export function minutes(m: number) {
  return seconds(60);
}
