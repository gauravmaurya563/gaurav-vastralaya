import React from 'react'
import { Instagram, Facebook, Sparkles, MessageCircle, Heart } from 'lucide-react'

function SocialTrending({ settings }) {
  const instagramUrl = settings?.InstagramUrl || 'https://instagram.com/gaurav_vastralay'
  const facebookUrl = settings?.FacebookUrl || 'https://facebook.com/gaurav_vastralay'

  const TRENDING_POSTS = [
    {
      image: '/assets/fabric_1.png',
      hashtag: '#AjrakhReels',
      caption: 'Traditional hand-block Ajrakh prints trending for custom kurtas.',
      likes: '2.4k',
      comments: '180',
      social: 'instagram'
    },
    {
      image: '/assets/saree_1_banarasi_red.png',
      hashtag: '#BridalVibes',
      caption: 'Our royal red Banarasi silk saree featured in the latest wedding campaign.',
      likes: '4.8k',
      comments: '312',
      social: 'instagram'
    },
    {
      image: '/assets/kurta_1.png',
      hashtag: '#ChikankariDrop',
      caption: 'Breezy Lucknowi georgette kurta set styled for festive dinners.',
      likes: '3.1k',
      comments: '240',
      social: 'facebook'
    },
    {
      image: '/assets/mens_1.png',
      hashtag: '#KhadiStyle',
      caption: 'Classic Khadi cotton short kurta styled for modern smart-casual looks.',
      likes: '1.9k',
      comments: '95',
      social: 'instagram'
    }
  ]

  return (
    <section className="social-trending-section" id="social-trending">
      <div className="social-trending-inner">
        <div className="social-trending-header">
          <div className="social-title-block">
            <span className="social-eyebrow">
              <Sparkles size={13} style={{ marginRight: '6px', display: 'inline-block', verticalAlign: 'middle' }} />
              Social Media & Marketing
            </span>
            <h2 className="social-heading">Trending Campaigns</h2>
            <p className="social-sub">
              Watch our daily styling reels, print guides, and customer showcases. Tag us at <strong>#GauravVastralay</strong> to get featured!
            </p>
          </div>

          <div className="social-cta-buttons">
            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn instagram-btn"
            >
              <Instagram size={16} /> Follow on Instagram
            </a>
            <a 
              href={facebookUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-btn facebook-btn"
            >
              <Facebook size={16} /> Follow on Facebook
            </a>
          </div>
        </div>

        <div className="social-grid">
          {TRENDING_POSTS.map((post, idx) => (
            <a 
              key={idx}
              href={post.social === 'instagram' ? instagramUrl : facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card"
            >
              <div className="social-card-media">
                <img src={post.image} alt={post.hashtag} loading="lazy" />
                <div className="social-card-overlay">
                  <div className="social-icon-badge">
                    {post.social === 'instagram' ? <Instagram size={22} /> : <Facebook size={22} />}
                  </div>
                  <div className="social-card-stats">
                    <span><Heart size={15} fill="#fff" /> {post.likes}</span>
                    <span><MessageCircle size={15} fill="#fff" /> {post.comments}</span>
                  </div>
                </div>
              </div>
              <div className="social-card-info">
                <span className="social-card-hashtag">{post.hashtag}</span>
                <p className="social-card-caption">{post.caption}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SocialTrending
