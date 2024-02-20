import { Entity, Fields, Validators, Allow } from 'remult';

// ensure that when an entity is being hidden behind authentication by setting it's "AllowApiCrud" property to "Allow.authenticated"  that it's set on the respective controller class too. Other wise that code is still open to crud operations.
@Entity('tasks', {
  allowApiCrud: Allow.authenticated,
})
export class Task {
  @Fields.uuid()
  id = ''

  @Fields.string({
    // validate: Validators.required,
    validate: (task) => {
      if (task.title.length < 5) {
        throw 'Not Titly Enough!'
      }
    }
  })
  title = '';

  @Fields.string({
    validate: (task) => { // validate also accepts a custom function that takes the task as an arg, and does some custom validation on the fields within
      if (task.description.length && task.description.length < 4) throw 'Not Descriptive Enough!'
    }
  })
  description?: string;

  @Fields.boolean()
  completed = false
        
  @Fields.createdAt()
  createdAt?: Date
}

// This type should be inferred by TypeScript as a function that returns `Promise 
