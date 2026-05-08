import { Link, useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          <Link to="/dashboard" className="navbar-brand">
            <div className="navbar-brand-icon">
               {/* Just a simple checkmark/logo icon */}
               <span style={{color: 'white'}}>✓</span>
            </div>
            <span className="navbar-brand-name">TaskManager</span>
          </Link>
          
          <Link to="/dashboard" className="navbar-link navbar-link-idle">Dashboard</Link>
          <Link to="/projects" className="navbar-link navbar-link-idle">Projects</Link>
        </div>

        <div className="navbar-right">
          <div style={{textAlign: 'right', marginRight: '15px'}}>
            <p style={{fontSize: '14px', fontWeight: 'bold', margin: 0}}>{user?.name || 'User'}</p>
            <p style={{fontSize: '11px', color: '#10b981', margin: 0}}>{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="navbar-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar