const Navbar = ({ user, onLogout }) => {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Team Task Manager</p>
        <h1>Dashboard</h1>
      </div>
      <div className="topbar-right">
        <div className="user-pill">
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>
        </div>
        <button className="btn btn-outline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
