import { useState } from "react"
import { loginUser } from "../../services/authService"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
const LoginPage = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = await loginUser({ username, password })
      localStorage.setItem("access", data.access)
      localStorage.setItem("refresh", data.refresh)
      toast.success(
  "Login successful"
)
      navigate("/dashboard")
    } catch (error) {
      console.error(error)
      toast.error(
  "Invalid username or password"
)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f7f5f2;
          position: relative;
          overflow: hidden;
        }

        /* Decorative left panel */
        .login-panel {
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
          .login-panel { display: flex; }
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
          background: radial-gradient(circle, rgba(99,179,237,0.18) 0%, transparent 70%);
        }
        .panel-circle-1 {
          width: 380px; height: 380px;
          top: -80px; left: -80px;
        }
        .panel-circle-2 {
          width: 260px; height: 260px;
          bottom: 120px; right: -60px;
          background: radial-gradient(circle, rgba(154,230,180,0.12) 0%, transparent 70%);
        }

        .panel-badge {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px;
          padding: 8px 18px 8px 10px;
          margin-bottom: 28px;
          width: fit-content;
        }
        .panel-badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #68d391;
          box-shadow: 0 0 0 3px rgba(104,211,145,0.25);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(104,211,145,0.25); }
          50% { box-shadow: 0 0 0 6px rgba(104,211,145,0.1); }
        }
        .panel-badge-text {
          font-size: 12px;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.5px;
        }

        .panel-heading {
          font-family: 'DM Serif Display', serif;
          font-size: 42px;
          line-height: 1.15;
          color: #ffffff;
          margin: 0 0 16px;
        }
        .panel-heading em {
          font-style: italic;
          color: #90cdf4;
        }

        .panel-sub {
          font-size: 15px;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          margin: 0;
          max-width: 300px;
        }

        /* Right form area */
        .login-form-area {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 48px 24px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 40px;
        }
        .login-logo-icon {
          width: 36px; height: 36px;
          background: #1a1a2e;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .login-logo-icon svg {
          width: 18px; height: 18px;
        }
        .login-logo-name {
          font-size: 17px;
          font-weight: 600;
          color: #1a1a2e;
          letter-spacing: -0.3px;
        }

        .login-title {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          color: #111827;
          margin: 0 0 6px;
          letter-spacing: -0.5px;
        }
        .login-subtitle {
          font-size: 14px;
          color: #9ca3af;
          margin: 0 0 36px;
        }

        .form-group {
          margin-bottom: 18px;
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
          margin-top: 8px;
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

        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 24px 0 0;
          color: #d1d5db;
          font-size: 12px;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: #f3f4f6;
        }

        .signup-row {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #9ca3af;
        }
        .signup-link {
          color: #1a1a2e;
          font-weight: 600;
          cursor: pointer;
          margin-left: 4px;
          text-decoration: none;
          border-bottom: 1.5px solid transparent;
          transition: border-color 0.15s;
        }
        .signup-link:hover {
          border-bottom-color: #1a1a2e;
        }
      `}</style>

      <div className="login-root">
        {/* Left decorative panel */}
        <div className="login-panel">
          <div className="panel-grid" />
          <div className="panel-circle panel-circle-1" />
          <div className="panel-circle panel-circle-2" />
          <div style={{ position: "relative" }}>
            <div className="panel-badge">
              <span className="panel-badge-dot" />
              <span className="panel-badge-text">Civic Engagement Platform</span>
            </div>
            <h2 className="panel-heading">
              Track what <em>matters</em> in your community.
            </h2>
            <p className="panel-sub">
              Monitor local legislation, civic activity, and government decisions — all in one place.
            </p>
          </div>
        </div>

        {/* Right form area */}
        <div className="login-form-area">
          <div className="login-card">
            {/* Logo */}
            <div className="login-logo">
              <div className="login-logo-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <span className="login-logo-name">NagarSetu</span>
            </div>

            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to your account to continue</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="form-input"
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  autoComplete="current-password"
                />
              </div>

              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="spinner" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </button>
            </form>

            <div className="signup-row">
              Don't have an account?
              <span className="signup-link" onClick={() => navigate("/register")}>
                Create one
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage