import { useEffect, useMemo, useState } from "react";
import ProjectSelector from "./ProjectSelector";

const defaultState = {
  title: "",
  description: "",
  projectId: "",
  assignedTo: "",
  dueDate: "",
  status: "Todo",
};

const CreateTaskModal = ({ open, projects, onClose, onCreate }) => {
  const [form, setForm] = useState(defaultState);

  const selectedProject = useMemo(
    () => projects.find((project) => project._id === form.projectId),
    [projects, form.projectId],
  );

  useEffect(() => {
    if (!open) {
      setForm(defaultState);
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "projectId") {
        return { ...prev, projectId: value, assignedTo: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onCreate(form);
    setForm(defaultState);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <div className="modal-head">
          <h2>Create Task</h2>
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <form className="grid-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Prepare sprint plan"
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Define deliverables and owners"
            />
          </div>

          <ProjectSelector
            projects={projects}
            value={form.projectId}
            onChange={handleChange}
          />

          <div className="field-group">
            <label htmlFor="assignedTo">Assign To</label>
            <select
              id="assignedTo"
              name="assignedTo"
              value={form.assignedTo}
              onChange={handleChange}
              required
            >
              <option value="">Select member</option>
              {(selectedProject?.members || []).map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="dueDate">Due Date</label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={form.dueDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>

          <button className="btn" type="submit">
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
