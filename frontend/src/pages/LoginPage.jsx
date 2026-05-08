import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axiosInstance'

const LoginPage = () => {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { data } = await axiosInstance.post('/auth/login', form)
      login(data); navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-root">

      {/* ── Left panel ── */}
      <div className="auth-left">
        <div className="auth-left-orb-top" />
        <div className="auth-left-orb-bot" />

        {/* Brand */}
        <div className="flex items-center gap-2.5 z-10">
          <div className="navbar-brand-icon">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M3.5 8.5l3.5 3.5 6-6" stroke="white" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="navbar-brand-name">TaskManager</span>
        </div>

        {/* Hero */}
        <div className="my-auto z-10">
          <h1 className="text-[2.8rem] font-black text-emerald-900 leading-[1.15] tracking-tight mb-3">
            Manage work,<br />
            <span className="text-emerald-600">beautifully.</span>
          </h1>
          <p className="text-emerald-800/80 text-base leading-relaxed max-w-[340px] mb-6">
            Assign tasks, track progress, and collaborate with your team —
            all in one clean workspace.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Role-based access', 'Real-time updates', 'Project dashboards'].map(f => (
              <span key={f} className="auth-pill">{f}</span>
            ))}
          </div>
        </div>

        {/* Floating stat cards */}
        <div className="auth-float-card" style={{ bottom: 88 }}>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
          <div>
            <p className="text-[0.65rem] text-gray-500 font-medium">Sprint Progress</p>
            <p className="text-[0.85rem] font-bold text-gray-900">72% complete</p>
          </div>
        </div>
        <div className="auth-float-card" style={{ bottom: 28 }}>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
          <div>
            <p className="text-[0.65rem] text-gray-500 font-medium">Tasks Due Today</p>
            <p className="text-[0.85rem] font-bold text-gray-900">3 pending</p>
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="mb-8">
            <h2 className="text-[1.75rem] font-black text-gray-900 tracking-tight mb-1">
              Welcome back
            </h2>
            <p className="text-gray-400 text-sm">Sign in to your workspace</p>
          </div>

          {error && <p className="error-box mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { name: 'email',    type: 'email',    label: 'Email Address', placeholder: 'you@example.com' },
              { name: 'password', type: 'password', label: 'Password',      placeholder: '••••••••'       },
            ].map(({ name, type, label, placeholder }) => (
              <div key={name} className="field">
                <label className="field-label">{label}</label>
                <input name={name} type={type} placeholder={placeholder}
                  value={form[name]} onChange={handleChange}
                  className="field-input" required
                />
              </div>
            ))}

            <button type="submit" disabled={loading}
              className={`btn btn-primary w-full justify-center mt-1 text-base
                         ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup"
              className="text-emerald-600 font-bold underline underline-offset-2">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage