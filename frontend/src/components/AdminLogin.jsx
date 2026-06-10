import React, { useState } from 'react'

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121/api'
      const response = await fetch(`${API_BASE}/Admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Invalid login credentials')
      }

      localStorage.setItem('adminToken', data.token)
      localStorage.setItem('adminUser', data.username)
      onLoginSuccess(data.username)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="login-header">
          <img src="/logo.png" alt="Gaurav Vastralay" className="login-logo" />
          <h2>Admin Login</h2>
          <p>Access the catalog management dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="login-error-alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="login-submit-button" disabled={loading}>
            {loading ? 'Authenticating...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}
