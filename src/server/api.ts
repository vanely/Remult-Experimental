import { remultExpress } from 'remult/remult-express';
// used to setup postgres db connection
import { createPostgresDataProvider } from 'remult/postgres'
import { Task } from '../shared/Task';
import { TaskController } from '../shared/TaskController';

export const api = remultExpress({
  dataProvider: createPostgresDataProvider({
    connectionString: process.env['DATABASE_URL'] || 'some connection to a postgres db',
  }),
  entities: [Task],
  controllers: [TaskController],
  // getUser property is needed to fetch authenticated user session, and allow restricted content to be viewable
  getUser: (req) =>   req.session!['user'],
});
