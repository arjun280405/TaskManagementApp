const TaskCard = ({ task, canUpdate, onStatusChange }) => {
  const dueDate = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = dueDate && dueDate < new Date() && task.status !== "Done";
  const statusClass = task.status.toLowerCase().replaceAll(" ", "-");
  const progressValue =
    task.status === "Todo" ? 20 : task.status === "In Progress" ? 62 : 100;

  return (
    <article
      className={`task-card ${statusClass} ${isOverdue ? "task-overdue" : ""}`}
    >
      <div className="task-head">
        <div>
          <p className="task-kicker">
            {task.projectId?.name || "Untitled Project"}
          </p>
          <h3>{task.title}</h3>
        </div>
        <div className="task-badges">
          <span className={`chip chip-status chip-${statusClass}`}>
            {task.status}
          </span>
          {isOverdue && <span className="chip chip-danger">Overdue</span>}
        </div>
      </div>
      <p>{task.description || "No description"}</p>
      <div className="task-progress">
        <div className="task-progress-track">
          <div
            className="task-progress-fill"
            style={{ width: `${progressValue}%` }}
          />
        </div>
        <span>{progressValue}%</span>
      </div>
      <div className="task-meta">
        <span>Assignee: {task.assignedTo?.name || "Unassigned"}</span>
        <span>Due: {dueDate ? dueDate.toLocaleDateString() : "N/A"}</span>
      </div>
      <div className="field-group compact">
        <label>Status</label>
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          disabled={!canUpdate}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
    </article>
  );
};

export default TaskCard;
