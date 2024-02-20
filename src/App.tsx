import { useEffect, useState, FormEvent } from 'react';
import { remult } from 'remult';
import { Task } from './shared/Task';
import { TaskController } from './shared/TaskController';

import './App.css';

const taskRepo = remult.repo(Task);

function App() {
  // the task entity can be used as the state type
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");

  const addTask = async (e: FormEvent) => {
    e.preventDefault();
    // no need to manually update local state when using liveQuery clearing is all that's needed, the db state change will be reflected automatically
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle, description: taskDescription });
      // setTasks([...tasks, newTask]);
      setNewTaskTitle("");
      setTaskDescription("");
    } catch (e) {
      console.error(['Unable to create new task: ', e]);
    }
  }

  const setAllCompleted = async (completed: boolean) => {
    await TaskController.setAllCompleted(completed);
  }

  useEffect(() => {
    // taskRepo.find({
    //   limit: 20,
    //   orderBy:  { createdAt: "asc" },
    //   // where: { completed: true }
    // }).then(setTasks);

    // for real time ui updates use the liveQuery method in remult repo
    // NOTE: liveQuery uses Server Side Events API, which only supports 6 browser connections per connection pool(not scalable)
    // find solution to replace this, potentially use Ably(https://ably.com/docs/getting-started/react)

    taskRepo.liveQuery({
      limit: 20,
      orderBy: { createdAt: 'asc' },
    })
    .subscribe((info) => setTasks(info.applyChanges));
  }, []); // <-- state or prop dependency causes useEffect to rerun! 

  return (
    <div className="App">
      <h1>Tasks</h1>
      <main>
        <div>
          <button onClick={() => setAllCompleted(true)}>Set All Completed</button>
          <button onClick={() => setAllCompleted(false)}>Set All uncompleted</button>
        </div>
        <form onSubmit={addTask}>
          <input type="text" onChange={(e) => setNewTaskTitle(e.target.value)} value={newTaskTitle} placeholder="What needs to be done?"/>
          <input type="text" onChange={(e) => setTaskDescription(e.target.value)} value={taskDescription} placeholder="Describe the task"/>
          <button>Add</button>
        </form>
        {tasks.map((task) => {
          // iterate through the tasks in the state, and when a task that matches the current task interacted with, replace it with it's updated version(value)
          const updateLocalStateTasks = (value: Task) => setTasks(tasks => tasks.map((t) => t.id === task.id ? value : t));

          // below two functions' returns don't need to be wrapped in updateLocalStateTasks() to save to DB and local state because liveQuery updates DB state in real time(can be used as local state) 
          const setCompleted = async (completed: boolean) => 
          // updateLocalStateTasks(await taskRepo.save({...task, completed})); // <-- assuming this works like an updateOrCreate()
          await taskRepo.save({...task, completed});

          const updateDescription = async (description: string) => 
          // updateLocalStateTasks(await taskRepo.save({...task, description}))
          await taskRepo.save({...task, description});

          // updates the title only for the local state
          const setTitle = (title: string) => updateLocalStateTasks({ ...task, title });

          // updates the title for the local and DB state
          const saveTask = async () => {
            try {
              updateLocalStateTasks(await taskRepo.update(task.id, task));
            } catch (e) {
              console.error(['Error updating: ', e]);
            }
          }

          const deleteTask = async () => {
            try {
              // using liveQuery the delete in the DB will take place in real time.
              await taskRepo.delete(task);
              // setTasks(tasks.filter((t) => t.id !== task.id));
            }  catch (e) {
              console.error(e);
            }
          }

          return (
            <div key={task.id}>
              <input type="checkbox" onChange={(e) => setCompleted(e.target.checked)} checked={task.completed}/>
              <input type="text" onChange={(e) => setTitle(e.target.value)} value={task.title}/>
              <input type="text" onChange={(e) => updateDescription(e.target.value)} value={task.description}/>
              <button onClick={saveTask}>Save</button>
              <button onClick={() => deleteTask()} >Delete</button>
            </div>
          )
        })}
      </main>
    </div>
  )
}

export default App
