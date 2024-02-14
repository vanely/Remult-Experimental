import { Entity, Fields } from 'remult';

@Entity('tasks', {
  allowApiCrud: true,
})
export class Task {
  @Fields.uuid()
  id = ''

  @Fields.string()
  title = '';

  @Fields.boolean()
  completed = false
        
  @Fields.createdAt()
  createdAt?: Date
}

// This type should be inferred by TypeScript as a function that returns `Promise 

