import React, { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5121/api'

export default function AdminDashboard({ username, onLogout, settings, onSettingsUpdate }) {
  // Tab state
  const [activeTab, setActiveTab] = useState('upload') // 'upload' or 'manage' or 'settings'
  const [productsList, setProductsList] = useState([])
  const [loadingProducts, setLoadingProducts] = useState(false)
  const [manageCategory, setManageCategory] = useState('All')

  // WhatsApp configuration state
  const [waNumber, setWaNumber] = useState(settings?.WhatsAppNumber || '919999999999')
  const [inqTemplate, setInqTemplate] = useState(settings?.InquiryTemplate || '')
  const [restockTemplate, setRestockTemplate] = useState(settings?.RestockTemplate || '')
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [settingsSuccess, setSettingsSuccess] = useState('')
  const [settingsError, setSettingsError] = useState('')

  useEffect(() => {
    if (settings) {
      setWaNumber(settings.WhatsAppNumber || '919999999999')
      setInqTemplate(settings.InquiryTemplate || '')
      setRestockTemplate(settings.RestockTemplate || '')
    }
  }, [settings])

  const insertPlaceholder = (textareaId, placeholder) => {
    const textarea = document.getElementById(textareaId)
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = textarea.value
    const before = text.substring(0, start)
    const after = text.substring(end, text.length)

    const updatedText = before + placeholder + after
    if (textareaId === 'inqTemplate') {
      setInqTemplate(updatedText)
    } else if (textareaId === 'restockTemplate') {
      setRestockTemplate(updatedText)
    }

    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + placeholder.length
    }, 0)
  }

  const handleSettingsSubmit = async (e) => {
    e.preventDefault()
    setSettingsLoading(true)
    setSettingsSuccess('')
    setSettingsError('')

    try {
      const response = await fetch(`${API_BASE}/Settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          WhatsAppNumber: waNumber,
          InquiryTemplate: inqTemplate,
          RestockTemplate: restockTemplate
        })
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Failed to save settings')
      }

      setSettingsSuccess('WhatsApp Settings saved and synchronized successfully!')
      if (onSettingsUpdate) {
        await onSettingsUpdate()
      }
    } catch (err) {
      setSettingsError(err.message)
    } finally {
      setSettingsLoading(false)
    }
  }

  // Product form state
  const [editingProduct, setEditingProduct] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Saree')
  const [priceRange, setPriceRange] = useState('')
  const [fabric, setFabric] = useState('')
  const [occasion, setOccasion] = useState('')
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL'])
  const [isSoldOut, setIsSoldOut] = useState(false)
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

  const categories = ['Saree', 'T-Shirt', 'Shirt', 'Suit Material', 'Jeans', 'Combo', 'Kurtas']
  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL', 'Free size', 'Blouse piece included']

  const getFullImageUrl = (url) => {
    if (!url) return 'https://loremflickr.com/400/600/fashion'
    if (url.startsWith('http') || url.startsWith('data:')) return url
    if (url.startsWith('/assets/')) return url
    return `${API_BASE.replace(/\/api$/, '')}${url}`
  }

  useEffect(() => {
    fetchAdminCount()
    fetchProductsList()
  }, [])

  const fetchProductsList = async () => {
    setLoadingProducts(true)
    try {
      const response = await fetch(`${API_BASE}/Products`)
      if (response.ok) {
        const data = await response.json()
        setProductsList(data)
      }
    } catch (err) {
      console.error('Error fetching products', err)
    } finally {
      setLoadingProducts(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you absolutely sure you want to permanently delete this product? This will also delete all its uploaded images.')) {
      return
    }
    try {
      const response = await fetch(`${API_BASE}/AdminProducts/${productId}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to delete product')
      }
      fetchProductsList()
      setUploadSuccess('Product successfully deleted!')
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdateSortOrder = async (productId, newOrder) => {
    try {
      const response = await fetch(`${API_BASE}/AdminProducts/${productId}/sort-order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sortOrder: parseInt(newOrder) || 0 })
      })
      if (!response.ok) {
        throw new Error('Failed to update sort order')
      }
      fetchProductsList()
    } catch (err) {
      alert(err.message)
    }
  }

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

  const handleStartEdit = (product) => {
    setEditingProduct(product)
    setName(product.name || product.Name || '')
    setDescription(product.description || product.Description || '')
    setCategory(product.category || product.Category || 'Saree')
    setPriceRange(product.priceRange || product.PriceRange || '')
    setFabric(product.fabric || product.Fabric || '')
    setOccasion(product.occasion || product.Occasion || '')
    setIsSoldOut(product.isSoldOut || product.IsSoldOut || false)

    const rawSizes = product.sizes || product.Sizes || []
    setSizes(rawSizes)

    // Populate previews
    const imgs = product.images || product.Images || (product.imageUrl || product.ImageUrl ? [product.imageUrl || product.ImageUrl] : [])
    setPreviews(imgs.map(url => getFullImageUrl(url)))
    setFiles([]) // No new files initially selected

    setUploadError('')
    setUploadSuccess('')
    setActiveTab('upload') // Jump to the form tab
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setName('')
    setDescription('')
    setCategory('Saree')
    setPriceRange('')
    setFabric('')
    setOccasion('')
    setSizes(['S', 'M', 'L', 'XL'])
    setIsSoldOut(false)
    setFiles([])
    setPreviews([])
    setUploadError('')
    setUploadSuccess('')
  }

  const handleProductSubmit = async (e) => {
    e.preventDefault()
    setUploadError('')
    setUploadSuccess('')
    setUploadLoading(true)

    if (!editingProduct && files.length === 0) {
      setUploadError('Please select at least one HD picture showing the product sides.');
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
      formData.append('IsSoldOut', isSoldOut)

      files.forEach((file) => {
        formData.append('Files', file)
      })

      const url = editingProduct
        ? `${API_BASE}/AdminProducts/${editingProduct.id || editingProduct.Id}`
        : `${API_BASE}/AdminProducts`
      const method = editingProduct ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method: method,
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Product save failed')
      }

      setUploadSuccess(editingProduct ? 'Product details updated successfully!' : 'Product uploaded and successfully added to the catalog!')
      fetchProductsList()
      
      // Reset form / mode
      handleCancelEdit()
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

      <div className="admin-tabs-nav" style={{ display: 'flex', gap: '12px', marginBottom: '24px', borderBottom: '1px solid var(--line)', paddingBottom: '12px' }}>
        <button
          type="button"
          onClick={() => {
            if (activeTab === 'upload' && editingProduct) {
              handleCancelEdit()
            }
            setActiveTab('upload')
          }}
          className={`admin-tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
          style={{
            padding: '10px 20px',
            border: '0',
            background: activeTab === 'upload' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'upload' ? '#fff' : 'var(--muted)',
            cursor: 'pointer',
            fontWeight: '800',
            textTransform: 'uppercase',
            fontSize: '12px',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
        >
          {editingProduct ? 'Edit Product' : 'Publish Product'}
        </button>
        <button
          type="button"
          onClick={() => {
            handleCancelEdit()
            setActiveTab('manage')
            fetchProductsList()
          }}
          className={`admin-tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          style={{
            padding: '10px 20px',
            border: '0',
            background: activeTab === 'manage' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'manage' ? '#fff' : 'var(--muted)',
            cursor: 'pointer',
            fontWeight: '800',
            textTransform: 'uppercase',
            fontSize: '12px',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
        >
          Manage Catalog ({productsList.length})
        </button>
        <button
          type="button"
          onClick={() => {
            handleCancelEdit()
            setActiveTab('settings')
          }}
          className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          style={{
            padding: '10px 20px',
            border: '0',
            background: activeTab === 'settings' ? 'var(--brand)' : 'transparent',
            color: activeTab === 'settings' ? '#fff' : 'var(--muted)',
            cursor: 'pointer',
            fontWeight: '800',
            textTransform: 'uppercase',
            fontSize: '12px',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
        >
          WhatsApp Settings
        </button>
      </div>

      {activeTab === 'manage' && (
        <div className="manage-catalog-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <div>
              <h2>Product Catalog Management</h2>
              <p className="panel-sub" style={{ margin: 0 }}>Reorder items by assigning sort order numbers (lower numbers show first) or permanently delete products from the database.</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em' }}>Filter Category:</label>
              <select 
                value={manageCategory} 
                onChange={(e) => setManageCategory(e.target.value)}
                style={{
                  padding: '8px 16px',
                  border: '1px solid var(--line)',
                  borderRadius: '4px',
                  background: '#fff',
                  color: 'var(--ink)',
                  fontWeight: 'bold',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                {['All', 'Saree', 'T-Shirt', 'Shirt', 'Suit Material', 'Jeans', 'Combo', 'Kurtas'].map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
          
          {loadingProducts ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>Loading catalog items...</p>
          ) : productsList.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: 'var(--muted)' }}>No products in catalog yet.</p>
          ) : (
            <div className="manage-products-list">
              {productsList.filter(p => {
                if (manageCategory === 'All') return true;
                const cat = (p.category || p.Category || '').toLowerCase();
                const filterCat = manageCategory.toLowerCase();
                return cat === filterCat || 
                       (filterCat === 'saree' && cat === 'sarees') ||
                       (filterCat === 'suit material' && (cat === 'suit' || cat === 'suits' || cat === 'suit material')) ||
                       (filterCat === 'kurtas' && cat === 'kurta') ||
                       (filterCat === 'combo' && cat === 'combos');
              }).map((product) => {
                return (
                  <div key={product.id || product.Id} className="manage-product-row">
                    <img 
                      src={getFullImageUrl(product.imageUrl || product.ImageUrl)} 
                      alt={product.name || product.Name} 
                      className="manage-product-img" 
                    />
                    <div className="manage-product-details">
                      <h4>{product.name || product.Name}</h4>
                      <p>Category: <strong>{product.category || product.Category}</strong> | Price: {product.priceRange || product.PriceRange}</p>
                    </div>
                    <div className="manage-product-actions">
                      <div className="sort-order-input-group">
                        <label>Sort Order:</label>
                        <input
                          type="number"
                          className="sort-order-field"
                          value={product.sortOrder !== undefined ? product.sortOrder : (product.SortOrder || 0)}
                          onChange={(e) => handleUpdateSortOrder(product.id || product.Id, e.target.value)}
                        />
                      </div>
                      <button 
                        type="button" 
                        className="edit-product-btn"
                        style={{
                          background: 'var(--sage)',
                          color: '#fff',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '4px',
                          fontWeight: '800',
                          textTransform: 'uppercase',
                          fontSize: '11px',
                          marginRight: '8px',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleStartEdit(product)}
                      >
                        Edit
                      </button>
                      <button 
                        type="button" 
                        className="delete-product-btn"
                        onClick={() => handleDeleteProduct(product.id || product.Id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="whatsapp-settings-panel" style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: '20px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <h2>WhatsApp Configurations</h2>
            <p className="panel-sub" style={{ margin: 0 }}>Configure the default support/inquiry phone number and the text templates triggered when a customer clicks a WhatsApp action.</p>
          </div>

          <form onSubmit={handleSettingsSubmit} className="dashboard-form">
            {settingsSuccess && <div className="dashboard-alert success">{settingsSuccess}</div>}
            {settingsError && <div className="dashboard-alert error">{settingsError}</div>}

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>WhatsApp Contact Number (with country code, no + or spaces) *</label>
              <input
                type="text"
                value={waNumber}
                onChange={(e) => setWaNumber(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 919999999999"
                required
                disabled={settingsLoading}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '4px' }}
              />
              <small style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '4px', display: 'block' }}>
                Enter the full phone number including the country code, but excluding the leading '+' sign or '00'. For example, for India (91) and number 9999999999, enter <strong>919999999999</strong>.
              </small>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Available Product Inquiry Template *</label>
              <textarea
                id="inqTemplate"
                value={inqTemplate}
                onChange={(e) => setInqTemplate(e.target.value)}
                placeholder="Write your template..."
                rows="6"
                required
                disabled={settingsLoading}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5' }}
              />
              <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--muted)', marginRight: '4px' }}>Insert Placeholder:</span>
                {['{ProductName}', '{Category}', '{Fabric}', '{Price}', '{Size}'].map((placeholder) => (
                  <button
                    key={placeholder}
                    type="button"
                    onClick={() => insertPlaceholder('inqTemplate', placeholder)}
                    style={{
                      background: 'var(--soft)',
                      border: '1px solid var(--line)',
                      borderRadius: '16px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: 'var(--brand)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--brand)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'var(--soft)'; e.currentTarget.style.color = 'var(--brand)'; }}
                  >
                    {placeholder}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '8px' }}>Sold Out / Restock Inquiry Template *</label>
              <textarea
                id="restockTemplate"
                value={restockTemplate}
                onChange={(e) => setRestockTemplate(e.target.value)}
                placeholder="Write your restock template..."
                rows="5"
                required
                disabled={settingsLoading}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '4px', fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5' }}
              />
              <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--muted)', marginRight: '4px' }}>Insert Placeholder:</span>
                {['{ProductName}', '{Category}', '{Fabric}', '{Price}'].map((placeholder) => (
                  <button
                    key={placeholder}
                    type="button"
                    onClick={() => insertPlaceholder('restockTemplate', placeholder)}
                    style={{
                      background: 'var(--soft)',
                      border: '1px solid var(--line)',
                      borderRadius: '16px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: 'var(--brand)',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.background = 'var(--brand)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseOut={(e) => { e.currentTarget.style.background = 'var(--soft)'; e.currentTarget.style.color = 'var(--brand)'; }}
                  >
                    {placeholder}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="form-submit-button"
              style={{
                background: 'var(--brand)',
                color: '#fff',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '4px',
                fontWeight: '800',
                textTransform: 'uppercase',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'block',
                width: '100%',
                marginTop: '12px'
              }}
              disabled={settingsLoading}
            >
              {settingsLoading ? 'Saving WhatsApp Settings...' : 'Save Configurations'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'upload' && (
        <div className="admin-dashboard-grid">
          {/* Left Side: Product Upload Form */}
          <div className="dashboard-panel main-upload-panel">
            <h2>{editingProduct ? 'Edit Catalog Product' : 'Upload New HD Product'}</h2>
            <p className="panel-sub">
              {editingProduct 
                ? 'Update descriptions, sizes, price ranges, or upload replacement images.' 
                : 'Add detailed descriptions, sizes, price ranges, and upload multiple HD side photos.'}
            </p>

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

              <div className="form-group" style={{ marginBottom: '20px', background: 'var(--soft)', padding: '12px', borderRadius: '4px', border: '1px solid var(--line)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={isSoldOut}
                    onChange={(e) => setIsSoldOut(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--brand)' }}>
                    Mark as Out of Stock / Sold Out (Displays Muted Badge on Storefront)
                  </span>
                </label>
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
                <label>
                  {editingProduct 
                    ? 'Upload Replacement Product Photos (Optional - leaving empty keeps current images)' 
                    : 'Upload HD Product Photos (Upload multiple angles/sides) *'}
                </label>
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
                    <span>{editingProduct ? 'Change Pictures' : 'Select HD Pictures'}</span>
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

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="submit" className="form-submit-button" style={{ flex: 1 }} disabled={uploadLoading}>
                  {uploadLoading 
                    ? (editingProduct ? 'Updating product details...' : 'Uploading details & pictures...') 
                    : (editingProduct ? 'Update Product Details' : 'Save & Publish Product')}
                </button>
                {editingProduct && (
                  <button 
                    type="button" 
                    className="cancel-edit-btn"
                    onClick={handleCancelEdit}
                    style={{
                      background: 'var(--muted)',
                      color: '#fff',
                      border: '0',
                      padding: '0 24px',
                      borderRadius: '4px',
                      fontWeight: '800',
                      textTransform: 'uppercase',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
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
      )}
    </div>
  )
}
