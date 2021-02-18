import { Wiz } from '../models/Wiz';
import { exec } from 'child_process';

export const bashIt = () => {
  const sdf = Wiz.fromData();

  setInterval(() => {
    exec(
      sdf.setParams(sdf.params.setRandomColor()).builBash(),
      (err, stdout, stderr) => {
        if (err) {
          //some err occurred
          console.error(err);
        } else {
        }
      }
    );
  }, 200);

  console.log('bashIt');
};
