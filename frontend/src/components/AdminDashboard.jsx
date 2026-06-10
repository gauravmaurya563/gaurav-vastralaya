import React, { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121/api'

export default function AdminDashboard({ username, onLogout }) {
  // Product form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Saree')
  const [priceRange, setPriceRange] = useState('')
  const [fabric, setFabric] = useState('')
  const [occasion, setOccasion] = useState('')
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL'])
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])

  // Register admin state
  const [newAdminUser, setNewAdminUser] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [adminCount, setAdminCount] = useState(1)
  const [registerSuccess, setRegisterSuccess] = useState('')
  const [registerError, setRegisterError] = useState('')

  // Upload progress/status
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState('')
  const [uploadError, setUploadError] = useState('')

  const categories = ['Saree', 'T-Shirt', 'Shirt', 'Suit', 'Jeans', 'Combo', 'Kurtas']
  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL', 'Free size', 'Blouse piece included']

  useEffect(() => {
    fetchAdminCount()
  }, [])

  const fetchAdminCount = async () => {
    try {
      const response = await fetch(`${API_BASE}/Admin/accounts-count`)
      if (response.ok) {
        const data = await response.json()
        setAdminCount(data.count)
      }
    } catch (err) {
      console.error('Error fetching admin count', err)
    }
  }

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)

    // Generate previews
    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviews(newPreviews)
  }

  const handleSizeToggle = (size) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size))
    } else {
      setSizes([...sizes, size])
    }
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setUploadError('')
    setUploadSuccess('')
    setUploadLoading(true)

    if (files.length === 0) {
      setUploadError('Please select at least one HD picture showing the product sides.')
      setUploadLoading(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append('Name', name)
      formData.append('Description', description)
      formData.append('Category', category)
      formData.append('PriceRange', priceRange)
      formData.append('Fabric', fabric)
      formData.append('Occasion', occasion)
      formData.append('Sizes', sizes.join(','))

      files.forEach((file) => {
        formData.append('Files', file)
      })

      const response = await fetch(`${API_BASE}/AdminProducts`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Product upload failed')
      }

      setUploadSuccess('Product uploaded and successfully added to the catalog!')
      // Reset form
      setName('')
      setDescription('')
      setPriceRange('')
      setFabric('')
      setOccasion('')
      setFiles([])
      setPreviews([])
    } catch (err) {
      setUploadError(err.message)
    } finally {
      setUploadLoading(false)
    }
  }

  const handleRegisterAdmin = async (e) => {
    e.preventDefault()
    setRegisterSuccess('')
    setRegisterError('')

    try {
      const response = await fetch(`${API_BASE}/Admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: newAdminUser, password: newAdminPassword }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      setRegisterSuccess('New Admin registered successfully!')
      setNewAdminUser('')
      setNewAdminPassword('')
      fetchAdminCount()
    } catch (err) {
      setRegisterError(err.message)
    }
  }

  return (
    <div className="admin-dashboard-container">
      <header className="admin-dashboard-header">
        <div className="header-brand-section">
          <img src="/logo.png" alt="Gaurav Vastralay Logo" className="admin-header-logo" />
          <h1>Admin Workspace</h1>
        </div>
        <div className="admin-user-info">
          <span>Active Session: <strong>{username}</strong></span>
          <button className="admin-logout-button" onClick={onLogout}>Sign Out</button>
        </div>
      </header>

      <div className="admin-dashboard-grid">
        {/* Left Side: Product Upload Form */}
        <div className="dashboard-panel main-upload-panel">
          <h2>Upload New HD Product</h2>
          <p className="panel-sub">Add detailed descriptions, sizes, price ranges, and upload multiple HD side photos.</p>

          <form onSubmit={handleProductSubmit} className="dashboard-form">
            {uploadSuccess && <div className="dashboard-alert success">{uploadSuccess}</div>}
            {uploadError && <div className="dashboard-alert error">{uploadError}</div>}

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Designer Embroidered Banarasi Saree"
                  required
                  disabled={uploadLoading}
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={uploadLoading}>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group flex-1">
                <label>Price Range *</label>
                <input
                  type="text"
                  value={priceRange}
                  onChange={(e) => setPriceRange(e.target.value)}
                  placeholder="e.g. ₹3,499 - ₹8,999"
                  required
                  disabled={uploadLoading}
                />
              </div>

              <div className="form-group flex-1">
                <label>Fabric Quality</label>
                <input
                  type="text"
                  value={fabric}
                  onChange={(e) => setFabric(e.target.value)}
                  placeholder="e.g. Pure Georgette Silk"
                  disabled={uploadLoading}
                />
              </div>

              <div className="form-group flex-1">
                <label>Occasion Suitability</label>
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="e.g. Bridal & Festive Wear"
                  disabled={uploadLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description Details</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe material details, print type, borders, embellishments..."
                rows="4"
                disabled={uploadLoading}
              />
            </div>

            <div className="form-group">
              <label>Available Sizes / Inclusions</label>
              <div className="sizes-checkboxes-grid">
                {sizeOptions.map((opt) => (
                  <label key={opt} className={`size-checkbox-card ${sizes.includes(opt) ? 'checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={sizes.includes(opt)}
                      onChange={() => handleSizeToggle(opt)}
                      disabled={uploadLoading}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Upload HD Product Photos (Upload multiple angles/sides) *</label>
              <div className="file-uploader-box">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  id="product-images-input"
                  className="hidden-file-input"
                  disabled={uploadLoading}
                />
                <label htmlFor="product-images-input" className="file-input-trigger">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  <span>Select HD Pictures</span>
                </label>
                {files.length > 0 && <span className="selected-count-badge">{files.length} file(s) selected</span>}
              </div>

              {previews.length > 0 && (
                <div className="image-previews-grid">
                  {previews.map((src, idx) => (
                    <div key={idx} className="preview-card">
                      <img src={src} alt={`Preview ${idx + 1}`} />
                      <span className="preview-label">Side {idx + 1}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" className="form-submit-button" disabled={uploadLoading}>
              {uploadLoading ? 'Uploading details & pictures...' : 'Save & Publish Product'}
            </button>
          </form>
        </div>

        {/* Right Side: Admin Account Manager & Quick Statistics */}
        <div className="dashboard-panel side-control-panel">
          <div className="stats-box">
            <h3>Quick Status</h3>
            <div className="stats-indicator">
              <span className="stats-number">{adminCount} / 3</span>
              <span className="stats-lbl">Admin User Accounts Created</span>
            </div>
            <div className="stats-progress-container">
              <div className="stats-progress-bar" style={{ width: `${(adminCount / 3) * 100}%` }}></div>
            </div>
          </div>

          <div className="register-admin-box">
            <h3>Register Sub-Admin Account</h3>
            <p className="panel-sub">Share administrative access. Strictly limited to a maximum of 3 active user accounts.</p>

            {adminCount >= 3 ? (
              <div className="admin-limit-reached-message">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span>Maximum limit of 3 administrator accounts has been reached. No new registrations are allowed.</span>
              </div>
            ) : (
              <form onSubmit={handleRegisterAdmin} className="register-form">
                {registerSuccess && <div className="dashboard-alert success">{registerSuccess}</div>}
                {registerError && <div className="dashboard-alert error">{registerError}</div>}

                <div className="form-group">
                  <label>Username</label>
                  <input
                    type="text"
                    value={newAdminUser}
                    onChange={(e) => setNewAdminUser(e.target.value)}
                    placeholder="Enter new admin username"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Create strong password"
                    required
                  />
                </div>

                <button type="submit" className="register-submit-button">Create Account</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
