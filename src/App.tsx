import { useCallback, useEffect, useState } from "react";
import { auth, remult } from "./common";
import { Task } from "./Task";
import { TaskEditor } from "./TaskEditor";

const taskRepo = remult.repo(Task);

function App() {
  const [{ newTask }, setNewTask] =
    useState(() => ({ newTask: taskRepo.create() }));
  const [tasks, setTasks] = useState([] as Task[]);
  const [hideCompleted, setHideCompleted] = useState(false);
  const loadTasks = useCallback(() => {
    if (remult.authenticated())
      taskRepo.find({
        orderBy: task => task.completed,
        where: task => hideCompleted ?
          task.completed.isEqualTo(false) :
          undefined!
      }).then(setTasks)
  }, [hideCompleted]);
  useEffect(() => { loadTasks() }, [loadTasks]);

  const createTask = () =>
    newTask.save().then(() => setNewTask({ newTask: taskRepo.create() }))
      .then(loadTasks)
      .catch(() => setNewTask({ newTask }));

  const deleteTask = (task: Task) =>
    task.delete().then(loadTasks);

  const setAll = async (completed: boolean) => {
    await Task.setAll(completed);
    loadTasks();
  }

  const [username, setUsername] = useState("");
  const signIn = () => auth.signIn(username).then(loadTasks);
  const signOut = () => {
    auth.signOut();
    setTasks([]);
  }
  if (!remult.authenticated()) {
    return (<div>
      <input value={username}
        onChange={e => setUsername(e.target.value)} />
      <button onClick={signIn}>Sign In </button>
    </div>)
  }


  return (
    <div>
      <p>
        Hi {remult.user.name}<button onClick={signOut}>Sign out</button>
      </p>
      <input value={newTask.title}
        onChange={e =>
          setNewTask({ newTask: newTask.assign({ title: e.target.value }) })}
      />
      <button onClick={createTask}>Create Task</button>
      <div>{newTask._.error}</div>
      <div>
        <input type="checkbox"
          checked={hideCompleted}
          onChange={e => setHideCompleted(e.target.checked)}
        />

      </div>
      <div>
        <button onClick={() => setAll(true)}>Set all completed</button>
        <button onClick={() => setAll(false)}>Set all uncompleted</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <TaskEditor task={task} />
            <button onClick={() => deleteTask(task)}>Delete </button>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default App;
