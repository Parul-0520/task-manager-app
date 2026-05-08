import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axiosInstance from '../api/axiosInstance'

const SignupPage = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', role: 'member' })
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate  = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const { data } = await axiosInstance.post('/auth/register', form)
      login(data); navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-root">

      {/* ── Left panel ── */}
      <div className="auth-left">
        <div className="auth-left-orb-top" />
        <div className="auth-left-orb-bot" />

        <div className="flex items-center gap-2.5 z-10">
          <div className="navbar-brand-icon">
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M3.5 8.5l3.5 3.5 6-6" stroke="white" strokeWidth="2.2"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="navbar-brand-name">TaskManager</span>
        </div>

        <div className="my-auto z-10">
          <h1 className="text-[2.8rem] font-black text-emerald-900 leading-[1.15] tracking-tight mb-3">
            Join your team,<br />
            <span className="text-emerald-600">get things done.</span>
          </h1>
          <p className="text-emerald-800/80 text-base leading-relaxed max-w-[340px] mb-6">
            Create your account and start collaborating with your team in minutes.
          </p>
          <div className="flex flex-wrap gap-2">
            {['Free to start', 'Admin & member roles', 'Full task control'].map(f => (
              <span key={f} className="auth-pill">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="mb-8">
            <h2 className="text-[1.75rem] font-black text-gray-900 tracking-tight mb-1">
              Create account
            </h2>
            <p className="text-gray-400 text-sm">Start managing your team today</p>
          </div>

          {error && <p className="error-box mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {[
              { name: 'name',     type: 'text',     label: 'Full Name',      placeholder: 'Parul Sharma'      },
              { name: 'email',    type: 'email',     label: 'Email Address',  placeholder: 'you@example.com'   },
              { name: 'password', type: 'password',  label: 'Password',       placeholder: '••••••••'          },
            ].map(({ name, type, label, placeholder }) => (
              <div key={name} className="field">
                <label className="field-label">{label}</label>
                <input name={name} type={type} placeholder={placeholder}
                  value={form[name]} onChange={handleChange}
                  className="field-input" required
                />
              </div>
            ))}

            {/* Role toggle */}
            <div className="field">
              <label className="field-label">Role</label>
              <div className="flex gap-2">
                {[
                  { val: 'member', icon: '👤', label: 'Member' },
                  { val: 'admin',  icon: '🛡️', label: 'Admin'  },
                ].map(({ val, icon, label }) => (
                  <button key={val} type="button"
                    onClick={() => setForm({ ...form, role: val })}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold font-sans
                                cursor-pointer transition-all duration-150
                                ${form.role === val
                                  ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-500'
                                  : 'bg-gray-50 text-gray-500 border-[1.5px] border-gray-200 hover:bg-gray-100'
                                }`}
                  >
                    {icon} {label}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading}
              className={`btn btn-primary w-full justify-center mt-1 text-base
                         ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Creating account…' : 'Create Account →'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login"
              className="text-emerald-600 font-bold underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignupPage