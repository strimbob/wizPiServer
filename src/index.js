import express from 'express';
import bodyParser from 'body-parser';
import path, { resolve } from 'path';
import cors from 'cors';
import { config } from 'dotenv';

import { bashIt, findIpAddress } from './wiz/wiz';
const PORT = process.env.PORT || 5000;
findIpAddress();
bashIt();

const setGenericApi = ({ project = 'shared', route }) => {
  //_______________________________________________________________________
  router.get(
    `${project}/${route}/:id`,
    getObject({ project, route })
  );
  //_______________________________________________________________________
  router.get(
    `${project}/${route}s`,
    getObjects({ project, route })
  );
  //_______________________________________________________________________
  router.put(
    `${project}/${route}/:id`,
    putObject({ project, route })
  );
  //_______________________________________________________________________
  router.post(
    `${project}/${route}/:id`,
    postObject({ project, route })
  );
  //_______________________________________________________________________
  router.delete(
    `${project}/${route}/:id`,
    deleteObject({ project, route })
  );
};

const app = express();
app.use(
  '/static',
  express.static(path.join(__dirname, 'public'))
);
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  bodyParser.json({
    limit: '20mb',
  })
);

const router = express.Router();
app.use('/v1', router);
router.use(async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods, Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control, pragma'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET,PUT,POST,DELETE,OPTIONS'
  );
  next();
});

//_______________________________________________________________________
app.get('/', (req, res) => {
  res.sendFile('public/index.html');
});

//_______________________________________________________________________
router.get('/light', (req, res) => {});
//_______________________________________________________________________
app.listen(PORT, () => {
  console.log(`stomp is ready on port ${PORT}`);
});
