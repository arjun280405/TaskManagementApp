const ProjectSelector = ({ projects, value, onChange }) => {
  return (
    <div className="field-group">
      <label htmlFor="projectId">Project</label>
      <select
        id="projectId"
        name="projectId"
        value={value}
        onChange={onChange}
        required
      >
        <option value="">Select project</option>
        {projects.map((project) => (
          <option key={project._id} value={project._id}>
            {project.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectSelector;
