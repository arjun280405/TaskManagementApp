import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "member",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-layout">
      <section className="auth-card">
        <p className="eyebrow">Team Workspace</p>
        <h1>Create Account</h1>
        {error && <p className="error-text">{error}</p>}
        <form className="grid-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>
          <div className="field-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Signup"}
          </button>
        </form>
        <p className="helper-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  );
};

export default SignupPage;
