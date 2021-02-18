import { Wiz } from '../models/Wiz';
import { exec } from 'child_process';

function execPromise({ command, ip }) {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout ? { stdout, command, ip } : null);
    });
  });
}
const zeroPad = (num, places) =>
  String(num).padStart(places, '0');

const ipAddress = new Array(21)
  .fill()
  .map((a, index) => zeroPad(index + 100, 3));

function* gen() {
  for (let i = 15; i < 21; i++) {
    yield execPromise({
      command: `echo '{"method":"getPilot","params":{}}' | nc -u -w 1  192.168.0.${ipAddress[i]} 38899`,
      ip: `192.168.0.${ipAddress[i]}`,
    });
  }
}

export const findIpAddress = () => {
  let lights = [];
  return new Promise((resolve, reject) => {
    const iterator = gen(0);
    const handle = async (yeilded) => {
      if (!yeilded.done) {
        try {
          const data = await yeilded.value;
          if (data) {
            lights.push(data);
          }
          return handle(iterator.next(data));
        } catch (error) {
          console.error(error);
        }
      } else {
        resolve(lights);
        console.log('done', lights);
      }
    };
    handle(iterator.next());
  });
};

export const bashIt = async () => {
  const initLights = await findIpAddress();
  const lights = initLights.map((light) => {
    const { ip, stdout } = light;
    const params = JSON.parse(stdout);

    return Wiz.fromData({ ip, params: { ...params } });
  });

  setInterval(() => {
    lights.forEach((light) => {
      exec(
        light
          .setParams(light.params.setRandomColor())
          .builBash(),
        (err, stdout, stderr) => {
          if (err) {
            //some err occurred
            console.error(err);
          } else {
          }
        }
      );
    });
  }, 1);

  console.log('bashIt');
};
