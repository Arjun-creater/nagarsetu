import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signupUser } from "../../services/authService"
import toast from "react-hot-toast"
const SignupPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await signupUser(formData)
      if (formData.password.length < 8) {

  toast.error(
    "Password must be at least 8 characters"
  )

  return
}
      toast.success(
  "Account created successfully"
)
      navigate("/login")
    } catch (error) {
      console.error(error.response?.data)
      toast.error(
  "Signup failed"
)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .signup-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f7f5f2;
          overflow: hidden;
        }

        /* Left decorative panel */
        .signup-panel {
          display: none;
          width: 42%;
          background: #1a1a2e;
          position: relative;
          overflow: hidden;
          flex-direction: column;
          justify-content: flex-end;
          padding: 52px;
        }
        @media (min-width: 900px) {
          .signup-panel { display: flex; }
        }

        .panel-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        .panel-circle {
          position: absolute;
          border-radius: 50%;
        }
        .panel-circle-1 {
          width: 340px; height: 340px;
          top: -60px; right: -80px;
          background: radial-gradient(circle, rgba(154,230,180,0.15) 0%, transparent 70%);
        }
        .panel-circle-2 {
          width: 280px; height: 280px;
          bottom: 160px; left: -80px;
          background: radial-gradient(circle, rgba(99,179,237,0.13) 0%, transparent 70%);
        }

        .panel-steps {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 40px;
        }
        .panel-step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .step-icon {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-top: 1px;
        }
        .step-icon svg {
          width: 15px; height: 15px;
        }
        .step-text-title {
          font-size: 13px;
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          margin-bottom: 2px;
        }
        .step-text-sub {
          font-size: 12px;
          color: rgba(255,255,255,0.38);
          line-height: 1.5;
        }

        .panel-heading {
          font-family: 'DM Serif Display', serif;
          font-size: 40px;
          line-height: 1.15;
          color: #ffffff;
          margin: 0 0 14px;
          position: relative;
        }
        .panel-heading em {
          font-style: italic;
          color: #90cdf4;
        }
        .panel-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.4);
          line-height: 1.6;
          margin: 0;
          max-width: 300px;
          position: relative;
        }

        /* Right form area */
        .signup-form-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }

        .signup-card {
          width: 100%;
          max-width: 420px;
        }

        .signup-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
        }
        .signup-logo-icon {
          width: 36px; height: 36px;
          background: #1a1a2e;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .signup-logo-icon svg {
          width: 18px; height: 18px;
        }
        .signup-logo-name {
          font-size: 17px;
          font-weight: 600;
          color: #1a1a2e;
          letter-spacing: -0.3px;
        }

        .signup-title {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          color: #111827;
          margin: 0 0 6px;
          letter-spacing: -0.5px;
        }
        .signup-subtitle {
          font-size: 14px;
          color: #9ca3af;
          margin: 0 0 32px;
        }

        .form-group {
          margin-bottom: 16px;
        }
        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #374151;
          margin-bottom: 7px;
          letter-spacing: 0.1px;
        }
        .form-input {
          width: 100%;
          box-sizing: border-box;
          padding: 13px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          background: #fff;
          outline: none;
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .form-input::placeholder {
          color: #d1d5db;
        }
        .form-input:focus {
          border-color: #1a1a2e;
          box-shadow: 0 0 0 3px rgba(26,26,46,0.07);
        }

        .form-hint {
          font-size: 12px;
          color: #9ca3af;
          margin-top: 5px;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #1a1a2e;
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          margin-top: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.18s, transform 0.12s, box-shadow 0.18s;
          letter-spacing: 0.1px;
        }
        .submit-btn:hover:not(:disabled) {
          background: #16213e;
          box-shadow: 0 4px 16px rgba(26,26,46,0.18);
          transform: translateY(-1px);
        }
        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .submit-btn:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .terms-note {
          font-size: 12px;
          color: #9ca3af;
          text-align: center;
          margin-top: 16px;
          line-height: 1.6;
        }

        .login-row {
          text-align: center;
          margin-top: 24px;
          font-size: 14px;
          color: #9ca3af;
        }
        .login-link {
          color: #1a1a2e;
          font-weight: 600;
          cursor: pointer;
          margin-left: 4px;
          border-bottom: 1.5px solid transparent;
          transition: border-color 0.15s;
        }
        .login-link:hover {
          border-bottom-color: #1a1a2e;
        }
      `}</style>

      <div className="signup-root">
        {/* Left panel */}
        <div className="signup-panel">
          <div className="panel-grid" />
          <div className="panel-circle panel-circle-1" />
          <div className="panel-circle panel-circle-2" />

          <div className="panel-steps">
            {[
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
                title: "Join your community",
                sub: "Connect with local civic groups and initiatives",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                ),
                title: "Real-time tracking",
                sub: "Follow legislation and decisions as they happen",
              },
              {
                icon: (
                  <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
                    <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                  </svg>
                ),
                title: "Stay informed",
                sub: "Personalised alerts on what matters to you",
              },
            ].map((s, i) => (
              <div className="panel-step" key={i}>
                <div className="step-icon">{s.icon}</div>
                <div>
                  <div className="step-text-title">{s.title}</div>
                  <div className="step-text-sub">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="panel-heading">
            Your civic voice,<br /><em>amplified.</em>
          </h2>
          <p className="panel-sub">
            Start tracking the decisions that shape your neighbourhood, city, and beyond.
          </p>
        </div>

        {/* Right form area */}
        <div className="signup-form-area">
          <div className="signup-card">
            <div className="signup-logo">
              <div className="signup-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span className="signup-logo-name">NagarSetu</span>
            </div>

            <h1 className="signup-title">Create an account</h1>
            <p className="signup-subtitle">Get started — it only takes a moment</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Create a strong password"
                  onChange={handleChange}
                  className="form-input"
                  autoComplete="new-password"
                   minLength={8}
                />
                <p className="form-hint">Must be at least 8 characters</p>
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    Creating account…
                  </>
                ) : (
                  "Create account"
                )}
              </button>

              <p className="terms-note">
                By creating an account you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>

            <div className="login-row">
              Already have an account?
              <span className="login-link" onClick={() => navigate("/login")}>
                Sign in
              
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignupPage