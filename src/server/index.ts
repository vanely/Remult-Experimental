import express from "express"
import session from 'cookie-session';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { api } from './api';
import { auth } from './auth';

const app = express()
// session authentication middleware
app.use(session({
  secret: process.env['SESSION_SECRET'] || 'my secret',
}));
// api security and compression middleware
app.use(helmet());
app.use(compression());
// authentication and remultExpress api middleware
app.use(auth);
app.use(api);
// setting express default static file serving path(where index.html is)
app.use(express.static(path.join(__dirname, '../')));
// any request that is sent to an unrecognizable url gets redirected to the react app
app.get('/*', (_, res) => {
  res.sendFile(path.join(__dirname, '../', 'index.html'));
});

// app.get("*", (req, res) => res.send(`api Server - path: "${req.path}"`))
app.listen(process.env['PORT'] || 3002, () => console.log('Server started'));
