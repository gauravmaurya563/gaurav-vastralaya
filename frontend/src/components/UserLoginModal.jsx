import React, { useState, useEffect, useRef } from 'react'
import { X, Eye, EyeOff, User, Mail, Phone, Lock, Sparkles } from 'lucide-react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121/api'

export default function UserLoginModal({ onClose, onLoginSuccess }) {
  const [tab, setTab] = useState('login') // 'login' | 'register'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  // Login fields
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  // Register fields
  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPhone, setRegPhone] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirm, setRegConfirm] = useState('')

  const overlayRef = useRef(null)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/UserAuth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('userToken', data.token)
      localStorage.setItem('userData', JSON.stringify(data.user))
      onLoginSuccess(data.user)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (regPassword !== regConfirm) {
      setError('Passwords do not match.')
      return
    }
    if (regPassword.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/UserAuth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: regName, email: regEmail, phone: regPhone, password: regPassword })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      localStorage.setItem('userToken', data.token)
      localStorage.setItem('userData', JSON.stringify(data.user))
      onLoginSuccess(data.user)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose()
  }

  return (
    <div className="ulm-overlay" ref={overlayRef} onClick={handleOverlayClick} role="dialog" aria-modal="true">
      <div className="ulm-modal">

        {/* Close button */}
        <button className="ulm-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Brand header */}
        <div className="ulm-brand">
          <Sparkles size={16} className="ulm-brand-icon" />
          <span>Gaurav Vastralay</span>
        </div>

        {/* Tab switcher */}
        <div className="ulm-tabs">
          <button
            className={`ulm-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setError('') }}
          >
            Sign In
          </button>
          <button
            className={`ulm-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setError('') }}
          >
            Create Account
          </button>
          <span className="ulm-tab-indicator" style={{ left: tab === 'login' ? '4px' : '50%' }} />
        </div>

        {/* Error message */}
        {error && <div className="ulm-error">{error}</div>}

        {/* ---- LOGIN FORM ---- */}
        {tab === 'login' && (
          <form className="ulm-form" onSubmit={handleLogin}>
            <p className="ulm-welcome">Welcome back! Sign in to your account.</p>

            <div className="ulm-field">
              <Mail size={16} className="ulm-field-icon" />
              <input
                type="email"
                placeholder="Email address"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="ulm-field">
              <Lock size={16} className="ulm-field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="ulm-eye"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <button type="submit" className="ulm-submit" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>

            <p className="ulm-switch">
              New here?{' '}
              <button type="button" onClick={() => { setTab('register'); setError('') }}>
                Create a free account
              </button>
            </p>
          </form>
        )}

        {/* ---- REGISTER FORM ---- */}
        {tab === 'register' && (
          <form className="ulm-form" onSubmit={handleRegister}>
            <p className="ulm-welcome">Join Gaurav Vastralay — it's free!</p>

            <div className="ulm-field">
              <User size={16} className="ulm-field-icon" />
              <input
                type="text"
                placeholder="Full name"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                required
                autoComplete="name"
                disabled={loading}
              />
            </div>

            <div className="ulm-field">
              <Mail size={16} className="ulm-field-icon" />
              <input
                type="email"
                placeholder="Email address"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                required
                autoComplete="email"
                disabled={loading}
              />
            </div>

            <div className="ulm-field">
              <Phone size={16} className="ulm-field-icon" />
              <input
                type="tel"
                placeholder="Phone number (optional)"
                value={regPhone}
                onChange={e => setRegPhone(e.target.value)}
                autoComplete="tel"
                disabled={loading}
              />
            </div>

            <div className="ulm-field">
              <Lock size={16} className="ulm-field-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Create password (min. 6 characters)"
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                required
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="ulm-eye"
                onClick={() => setShowPassword(v => !v)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            <div className="ulm-field">
              <Lock size={16} className="ulm-field-icon" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm password"
                value={regConfirm}
                onChange={e => setRegConfirm(e.target.value)}
                required
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="ulm-eye"
                onClick={() => setShowConfirm(v => !v)}
                tabIndex={-1}
                aria-label="Toggle confirm password visibility"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* Password strength indicator */}
            {regPassword.length > 0 && (
              <div className="ulm-strength">
                <div className={`ulm-strength-bar ${
                  regPassword.length >= 10 ? 'strong' :
                  regPassword.length >= 6  ? 'medium' : 'weak'
                }`} />
                <span>{
                  regPassword.length >= 10 ? 'Strong password' :
                  regPassword.length >= 6  ? 'Good password' : 'Too short'
                }</span>
              </div>
            )}

            <button type="submit" className="ulm-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account'}
            </button>

            <p className="ulm-switch">
              Already have an account?{' '}
              <button type="button" onClick={() => { setTab('login'); setError('') }}>
                Sign in
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
