import { useEffect, useState } from "react"
import { Task } from "./Task"

export const TaskEditor: React.FC<{ task: Task }> = (props) => {
    const [{ task }, setTask] = useState(props);
    const save = () => task.save().then(task => setTask({ task }));
    useEffect(() => setTask(props), [props]);
    return <span>
        <input type="checkbox"
            checked={task.completed}
            onChange={e =>
                setTask({ task: task.assign({ completed: e.target.checked }) })}
        />
        <input
            value={task.title}
            onChange={e =>
                setTask({ task: task.assign({ title: e.target.value }) })
            }
            style={{ textDecoration: task.completed ? 'line-through' : undefined! }}
        />
        <button onClick={() => save()}
            disabled={!task.wasChanged()}
        >save</button>
    </span>
}
