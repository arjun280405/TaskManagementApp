import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import CreateTaskModal from "../components/CreateTaskModal";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", memberIds: [] });
  const [memberForm, setMemberForm] = useState({
    projectId: "",
    memberIds: [],
  });

  const isAdmin = user?.role === "admin";

  const loadData = async () => {
    setLoading(true);
    setError("");

    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);

      if (isAdmin) {
        const usersRes = await api.get("/auth/users");
        setUsers(usersRes.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === "my") {
      return tasks.filter((task) => task.assignedTo?._id === user?._id);
    }

    if (filter === "overdue") {
      return tasks.filter((task) => {
        if (!task.dueDate || task.status === "Done") {
          return false;
        }
        return new Date(task.dueDate) < today;
      });
    }

    return tasks;
  }, [tasks, filter, user?._id]);

  const dashboardStats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((task) => task.status === "Todo").length;
    const inProgress = tasks.filter(
      (task) => task.status === "In Progress",
    ).length;
    const done = tasks.filter((task) => task.status === "Done").length;
    const overdue = tasks.filter((task) => {
      if (!task.dueDate || task.status === "Done") {
        return false;
      }

      return new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));
    }).length;

    const completionRate = total ? Math.round((done / total) * 100) : 0;

    return {
      total,
      todo,
      inProgress,
      done,
      overdue,
      completionRate,
    };
  }, [tasks]);

  const chartItems = useMemo(
    () => [
      {
        label: "Todo",
        value: dashboardStats.todo,
        color: "#d97706",
      },
      {
        label: "In Progress",
        value: dashboardStats.inProgress,
        color: "#2563eb",
      },
      {
        label: "Done",
        value: dashboardStats.done,
        color: "#16a34a",
      },
    ],
    [dashboardStats],
  );

  const maxChartValue = Math.max(...chartItems.map((item) => item.value), 1);

  const handleStatusChange = async (taskId, status) => {
    try {
      const { data } = await api.put(`/tasks/${taskId}`, { status });
      setTasks((prev) =>
        prev.map((task) => (task._id === taskId ? data : task)),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not update task status");
    }
  };

  const handleCreateTask = async (payload) => {
    try {
      await api.post("/tasks", payload);
      setShowTaskModal(false);
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create task");
    }
  };

  const handleMemberToggle = (memberId, stateSetter, selectedIds) => {
    if (selectedIds.includes(memberId)) {
      stateSetter((prev) => ({
        ...prev,
        memberIds: prev.memberIds.filter((id) => id !== memberId),
      }));
      return;
    }

    stateSetter((prev) => ({
      ...prev,
      memberIds: [...prev.memberIds, memberId],
    }));
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError("");

    if (!projectForm.name.trim()) {
      setError("Project name is required");
      return;
    }

    try {
      const members = Array.from(new Set([user._id, ...projectForm.memberIds]));
      await api.post("/projects", { name: projectForm.name.trim(), members });
      setProjectForm({ name: "", memberIds: [] });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Could not create project");
    }
  };

  const handleUpdateMembers = async (e) => {
    e.preventDefault();
    setError("");

    if (!memberForm.projectId) {
      setError("Please select a project");
      return;
    }

    try {
      const members = Array.from(new Set([user._id, ...memberForm.memberIds]));
      await api.put(`/projects/${memberForm.projectId}/members`, { members });
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not update project members",
      );
    }
  };

  if (loading) {
    return <main className="page-wrap">Loading dashboard...</main>;
  }

  return (
    <main className="page-wrap">
      <Navbar user={user} onLogout={logout} />

      {error && <p className="error-text banner">{error}</p>}

      <section className="hero-grid">
        <article className="hero-panel hero-main">
          <div>
            <p className="eyebrow">Team Snapshot</p>
            <h2>Work moves faster when every task has a pulse.</h2>
            <p className="hero-copy">
              Track work, spot bottlenecks, and keep delivery visible in one
              command center.
            </p>
          </div>

          <div className="hero-metrics">
            <div className="metric-ring">
              <div>
                <strong>{dashboardStats.completionRate}%</strong>
                <span>completion</span>
              </div>
            </div>
            <div className="hero-stat-list">
              <div>
                <span>Total tasks</span>
                <strong>{dashboardStats.total}</strong>
              </div>
              <div>
                <span>Overdue</span>
                <strong>{dashboardStats.overdue}</strong>
              </div>
              <div>
                <span>Projects</span>
                <strong>{projects.length}</strong>
              </div>
            </div>
          </div>
        </article>

        <article className="hero-panel hero-chart">
          <div className="hero-chart-head">
            <div>
              <p className="eyebrow">Task Pulse</p>
              <h3>Status distribution</h3>
            </div>
            <span className="chart-badge">Live</span>
          </div>

          <div className="status-chart">
            {chartItems.map((item) => {
              const width = (item.value / maxChartValue) * 100;

              return (
                <div key={item.label} className="status-chart-row">
                  <div className="status-chart-labels">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>
                  <div className="status-chart-bar">
                    <div
                      className="status-chart-fill"
                      style={{
                        width: `${width}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="toolbar">
        <div className="filter-tabs">
          <button
            className={`btn btn-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Tasks
          </button>
          <button
            className={`btn btn-tab ${filter === "my" ? "active" : ""}`}
            onClick={() => setFilter("my")}
          >
            My Tasks
          </button>
          <button
            className={`btn btn-tab ${filter === "overdue" ? "active" : ""}`}
            onClick={() => setFilter("overdue")}
          >
            Overdue Tasks
          </button>
        </div>

        {isAdmin && (
          <button className="btn" onClick={() => setShowTaskModal(true)}>
            Create Task
          </button>
        )}
      </section>

      {isAdmin && (
        <section className="admin-grid">
          <form className="panel" onSubmit={handleCreateProject}>
            <h2>Create Project</h2>
            <div className="field-group">
              <label htmlFor="projectName">Project Name</label>
              <input
                id="projectName"
                value={projectForm.name}
                onChange={(e) =>
                  setProjectForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Website Revamp"
                required
              />
            </div>
            <p className="small-title">Select members</p>
            <div className="member-list">
              {users.map((member) => (
                <label key={member._id} className="check-row">
                  <input
                    type="checkbox"
                    checked={projectForm.memberIds.includes(member._id)}
                    onChange={() =>
                      handleMemberToggle(
                        member._id,
                        setProjectForm,
                        projectForm.memberIds,
                      )
                    }
                  />
                  {member.name} ({member.role})
                </label>
              ))}
            </div>
            <button className="btn" type="submit">
              Create Project
            </button>
          </form>

          <form className="panel" onSubmit={handleUpdateMembers}>
            <h2>Add Members To Project</h2>
            <div className="field-group">
              <label htmlFor="selectedProject">Project</label>
              <select
                id="selectedProject"
                value={memberForm.projectId}
                onChange={(e) =>
                  setMemberForm((prev) => ({
                    ...prev,
                    projectId: e.target.value,
                  }))
                }
              >
                <option value="">Select project</option>
                {projects.map((project) => (
                  <option key={project._id} value={project._id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <p className="small-title">Select members</p>
            <div className="member-list">
              {users.map((member) => (
                <label key={member._id} className="check-row">
                  <input
                    type="checkbox"
                    checked={memberForm.memberIds.includes(member._id)}
                    onChange={() =>
                      handleMemberToggle(
                        member._id,
                        setMemberForm,
                        memberForm.memberIds,
                      )
                    }
                  />
                  {member.name} ({member.role})
                </label>
              ))}
            </div>
            <button className="btn" type="submit">
              Save Members
            </button>
          </form>
        </section>
      )}

      <section className="task-grid">
        {filteredTasks.length === 0 && <p>No tasks found for this filter.</p>}
        {filteredTasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            canUpdate={Boolean(
              user &&
              (user.role === "admin" || task.assignedTo?._id === user._id),
            )}
            onStatusChange={handleStatusChange}
          />
        ))}
      </section>

      <CreateTaskModal
        open={showTaskModal}
        projects={projects}
        onClose={() => setShowTaskModal(false)}
        onCreate={handleCreateTask}
      />
    </main>
  );
};

export default DashboardPage;
