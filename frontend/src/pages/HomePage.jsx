import DarkVeil from '../components/common/DarkVeil.jsx';
import PillNav from '../components/common/PillNav.jsx';
import '../styles/HomePage.css';
import logo from '../assets/images/test.jpg';



export default function HomePage() {
  return (
    <div className='home-page-container'>
      <PillNav
        logo={logo}
        logoAlt="Company Logo"
        items={[
          { label: 'Home', href: '/' },
          { label: 'About', href: '/about' },
          // { label: 'Services', href: '/services' },
          // { label: 'Contact', href: '/contact' }
        ]}
        activeHref="/"
        className="custom-nav"
        ease="power2.easeOut"
        baseColor="#000000"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
        theme="light"
        initialLoadAnimation={false}
      />

      <DarkVeil
        hueShift={0}
        noiseIntensity={0}
        scanlineIntensity={0}
        speed={0.5}
        scanlineFrequency={0}
        warpAmount={0}
      >
        <main>
          <section className="hero-section">
            <div className="hero-content">
              <h1>From Zero to Persona: Automate your entire customer research loop with AI</h1>
              <p>Transform fragmented manual surveys into an intelligent research ecosystem. Our AI automatically generates optimized forms, distributes surveys, and creates detailed customer personas with deep behavioral insights—all in minutes, not weeks.</p>
              <div className="hero-buttons">
                <button className="btn-primary">Start Free Trial</button>
                <button className="btn-secondary">See Demo with Sample Data</button>
              </div>
            </div>
          </section>
          <section className="demo-picture">
            <div className="demo-content">
              <h2>All-in-One AI-Powered Research Ecosystem</h2>
              <p>See how our platform automates the entire customer discovery lifecycle from form creation to detailed personas</p>

              <div className="demo-workflow">
                <div className="input-section">
                  <div className="input-card">
                    <div className="card-header">
                      <span className="icon">🎯</span>
                      <span>Auto-Form</span>
                    </div>
                    <div className="input-item">
                      <span className="label">Describe Goals</span>
                    </div>
                    <div className="input-item">
                      <span className="label">📋 AI Survey Generation</span>
                    </div>
                    <div className="input-item">
                      <span className="label">📧 Smart Distribution</span>
                    </div>
                  </div>
                </div>

                <div className="ai-processing">
                  <div className="ai-cube">
                    <div className="cube-face front">
                      <span className="ai-text">AI</span>
                      <div className="brain-icon">🧠</div>
                    </div>
                    <div className="processing-lines">
                      <div className="line line-1"></div>
                      <div className="line line-2"></div>
                      <div className="line line-3"></div>
                    </div>
                  </div>
                </div>

                <div className="output-section">
                  <div className="profile-card">
                    <div className="profile-header">Persona Studio</div>
                    <div className="profile-avatar">
                    </div>
                    <div className="profile-info">
                      <h4>Sarah Chen</h4>
                      <p>Marketing Manager</p>
                      <div className="profile-stats">
                        <div className="stat">Age: 28 • Tech-savvy</div>
                        <div className="stat">Budget: $5K-15K</div>
                        <div className="stat">Pain: Time constraints</div>
                      </div>
                    </div>
                  </div>

                  <div className="profile-card">
                    <div className="profile-header">Persona Studio</div>
                    <div className="profile-avatar">
                    </div>
                    <div className="profile-info">
                      <h4>Marcus Johnson</h4>
                      <p>Small Business Owner</p>
                      <div className="profile-stats">
                        <div className="stat">Age: 45 • ROI-focused</div>
                        <div className="stat">Budget: $2K-8K</div>
                        <div className="stat">Pain: Complex tools</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section><section className="main-feature">
            <div className="comparison-cards">
              <div className="comparison-card">
                <h3>The Problem (Manual Process)</h3>
                <div className="comparison-content">
                  <div className="chart-placeholder">
                    <div className="chart-bars">
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                      <div className="bar"></div>
                    </div>
                  </div>
                  <div className="comparison-features">
                    <div className="feature-item">
                      <span className="feature-icon">⏱️</span>
                      <span>Weeks to design and distribute surveys manually</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📊</span>
                      <span>Manual data synthesis in spreadsheets</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">🤷</span>
                      <span>Generic personas based on assumptions</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="comparison-card">
                <h3>Our Solution (AI-Powered)</h3>
                <div className="comparison-content">
                  <div className="profile-preview">
                    <div className="mini-profile">
                      <div className="profile-pic"></div>
                      <div className="profile-text">
                        <div className="profile-name">Sarah Chen</div>
                        <div className="profile-details">Marketing Manager</div>
                      </div>
                    </div>
                  </div>
                  <div className="comparison-features">
                    <div className="feature-item">
                      <span className="feature-icon">🚀</span>
                      <span>Auto-Form: Don't write questions, describe your goals</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">📈</span>
                      <span>Insight Hub: Skip the spreadsheets; read the story</span>
                    </div>
                    <div className="feature-item">
                      <span className="feature-icon">👥</span>
                      <span>Persona Studio: Visualize your audience in high definition</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="key-features">
              <h2>Key Features</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon-large">💬</div>
                  <h4>Sentiment Analysis</h4>
                </div>
                <div className="feature-card">
                  <div className="feature-icon-large">📊</div>
                  <h4>Automated Data Synthesis</h4>
                </div>
                <div className="feature-card">
                  <div className="feature-icon-large">💡</div>
                  <h4>AI-Generated Marketing Strategies</h4>
                </div>
              </div>
            </div>
          </section>
        </main>
      </DarkVeil>
    </div>
  );
}