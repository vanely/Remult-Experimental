import { remultExpress } from 'remult/remult-express';
import { Task } from '../shared/Task';
import { TaskController } from '../shared/TaskController';

export const api = remultExpress({
  entities: [Task],
  controllers: [TaskController],
});
