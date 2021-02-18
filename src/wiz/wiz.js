import { Record } from 'immutable';

const { exec } = require('child_process');

// const customPropertiesType = {
//   USER: 'USER',
//   MACHINE: 'MACHINE',
// };

//`echo '{"method":"setPilot","env":"pro","params":{"mac":"a8bb50dc80bd","rssi":-35,"src":"","state":true,"r":255,"g":0,"b":0,"c":0,"w":0,"dimming":100}}' | nc -u 192.168.0.117 38899`,

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
class WixParmas extends Record(WixParams) {
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
  params: new WixParmas(),
};

class WixBash extends Record(WixData) {
  setParams(params) {
    return this.set('params', params);
  }
  builBash() {
    const parmas = this.params;
    const so = Object.entries(parmas.toJS())
      .reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          return `${acc},"${key}":"${value}"`;
        } else {
          return `${acc},"${key}":${value}`;
        }
      }, '')
      .replace(',', '');

    console.log(
      `echo '{"method":"setPilot","env":"pro","params":{"mac":"a8bb50dc80bd","rssi":-35,"src":"","state":true,"r":255,"g":255,"b":0,"c":0,"w":0,"dimming":100}}' | nc -u 192.168.0.117 38899`
    );
    console.log(
      `echo '{"method":"setPilot","env":"pro","params":{${so}}}' | nc -u 192.168.0.117 38899`
    );
    return `echo '{"method":"setPilot","env":"pro","params":{${so}}}' | nc -u 192.168.0.117 38899`;
    return `echo '{"method":"setPilot","env":"pro","params":{"mac":"a8bb50dc80bd","rssi":-35,"src":"","state":true,"r":0,"g":255,"b":0,"c":0,"w":0,"dimming":100}}' | nc -u 192.168.0.117 38899`;
    //        return `echo '{"method":"${this.method}"}`
    ///   }
  }
}

export const bashIt = () => {
  const sdf = new WixBash();

  // console.log(
  //   sdf.setParams(sdf.params.setRandomColor()).builBash(),
  //   sdf.toJS()
  // );
  setInterval(() => {
    console.log('asfaf');
    exec(
      sdf.setParams(sdf.params.setRandomColor()).builBash(),
      (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err);
        } else {
          // the *entire* stdout and stderr (buffered)
          // console.log(`stdout: ${stdout}`);
          // console.log(`stderr: ${stderr}`);
        }
      }
    );
  }, 200);

  console.log('bashIt');
};
