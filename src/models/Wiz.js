import { Record } from 'immutable';

const WixParams = {
  mac: 'a8bb50dc80bd',
  rssi: '-35',
  src: '',
  state: true,
  r: 0,
  b: 0,
  g: 1,
  c: 0,
  w: 0,
  dimming: 100,
};
export class WixParmas extends Record(WixParams) {
  static fromData(data) {
    return new WixParmas({ ...data }).setRandomColor();
  }

  getRandomValue() {
    return parseInt(Math.random() * 255);
  }
  setRandomColor() {
    return this.merge({
      r: this.getRandomValue(),
      b: this.getRandomValue(),
      g: this.getRandomValue(),
      c: 0,
      w: 0,
    });
  }
}

const WixData = {
  method: 'setPilot',
  env: 'pro',
  ip: '192.168.0.117',
  port: 38899,
  params: null,
};

export class Wiz extends Record(WixData) {
  static fromData(data) {
    let params = null;
    if (data.params) {
      params = WixParmas.fromData(data.params);
    }

    return new Wiz({ ...data, params });
  }
  setParams(params) {
    return this.set('params', params);
  }
  builBash() {
    const parmas = Object.entries(this.params.toJS())
      .reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          return `${acc},"${key}":"${value}"`;
        } else {
          return `${acc},"${key}":${value}`;
        }
      }, '')
      .replace(',', '');
    return `echo '{"method":"setPilot","env":"pro","params":{${parmas}}}' | nc -u ${this.ip} ${this.port}`;
  }
}
