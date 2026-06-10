import React from 'react'

export default function Logo({ size = 'medium', layout = 'horizontal', variant = 'header' }) {
  const logoSize = size === 'small' ? 68 : size === 'medium' ? 94 : 110

  return (
    <a href="#" className={`logo-brand logo-${layout} logo-${variant}`}>
      <div className="logo-icon-wrapper">
        <img 
          src="/logo.png" 
          alt="Gaurav Vastralay" 
          className="logo-img" 
          style={{ width: `${logoSize}px`, height: `${logoSize}px`, objectFit: 'contain' }}
        />
      </div>
    </a>
  )
}
