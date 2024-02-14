import { useEffect, useState, FormEvent } from 'react'
import { remult } from 'remult';
import { Task } from './shared/Task';

import './App.css'

const taskRepo = remult.repo(Task);

function App() {
  // the task entity can be used as the state type
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const addTask = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newTask = await taskRepo.insert({ title: newTaskTitle });
      setTasks([...tasks, newTask]);
      setNewTaskTitle("");
    } catch (e) {
      console.error(`Unable to create new task:\n\t${e}`);
    }
  }

  useEffect(() => {
    taskRepo.find({
      limit: 20,
      // orderBy:  { createdAt: "desc" },
      // where: { completed: true }
    }).then(setTasks);
  }, []); // <-- state or prop dependency causes useEffect to rerun! 

  const handleChange = (e: any) => {
    console.log(`handleChange event: ${typeof e}`);
    console.dir(e)
    console.log(`checked value: ${e.target.checked}`);
  }

  return (
    <div className="App">
      <h1>Tasks</h1>
      <main>
        <form onSubmit={addTask}>
          <input type="text" onChange={(e) => setNewTaskTitle(e.target.value)} value={newTaskTitle} placeholder="What needs to be done?"/>
          <button>Add</button>
        </form>
        {tasks.map((task) => {
          // iterate through the tasks in the state, and when a task that matches the current task interacted with, replace it with it's updated version(value)
          const setTask = (value: Task) => setTasks(tasks => tasks.map((t) => t.id === task.id ? value : t));
          const setCompleted = async (completed: boolean) => setTask(await taskRepo.save({...task, completed})); // <-- assuming this works like an updateOrCreate()

          return (
            <div key={task.id}>
              <input type="checkbox" onChange={(e) => setCompleted(e.target.checked)} checked={task.completed}/>
              {task.title}
            </div>
          )
        })}
      </main>
    </div>
  )
}

export default App
