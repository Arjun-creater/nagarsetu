import { useEffect, useState } from "react"
import { getMyComplaints } from "../../services/complaintService"

const statusConfig = {
  open:        { bg: "#eff6ff", color: "#2563eb", label: "Open" },
  in_progress: { bg: "#fefce8", color: "#ca8a04", label: "In Progress" },
  resolved:    { bg: "#f0fdf4", color: "#16a34a", label: "Resolved" },
  closed:      { bg: "#f3f4f6", color: "#6b7280", label: "Closed" },
}

const priorityConfig = {
  low:      { bg: "#f0fdf4", color: "#16a34a", dot: "#22c55e" },
  medium:   { bg: "#fefce8", color: "#ca8a04", dot: "#eab308" },
  high:     { bg: "#fff7ed", color: "#ea580c", dot: "#f97316" },
  critical: { bg: "#fef2f2", color: "#dc2626", dot: "#ef4444" },
}

const getStatusStyle = (status) =>
  statusConfig[status?.toLowerCase()] ?? { bg: "#eff6ff", color: "#2563eb", label: status }

const getPriorityStyle = (priority) =>
  priorityConfig[priority?.toLowerCase()] ?? { bg: "#f3f4f6", color: "#6b7280", dot: "#9ca3af" }

const SkeletonRow = () => (
  <div style={{ padding: "24px 28px", borderBottom: "1px solid #f3f4f6", display: "flex", flexDirection: "column", gap: 10 }}>
    <div style={{ height: 16, width: "45%", background: "#f3f4f6", borderRadius: 8, animation: "shimmer 1.4s infinite" }} />
    <div style={{ height: 13, width: "30%", background: "#f9fafb", borderRadius: 8, animation: "shimmer 1.4s infinite 0.1s" }} />
    <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
      <div style={{ height: 24, width: 80, background: "#f3f4f6", borderRadius: 100, animation: "shimmer 1.4s infinite 0.2s" }} />
      <div style={{ height: 24, width: 64, background: "#f3f4f6", borderRadius: 100, animation: "shimmer 1.4s infinite 0.3s" }} />
    </div>
  </div>
)

const MyComplaintsPage = () => {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchComplaints = async () => {
    try {
      const data = await getMyComplaints()
      setComplaints(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const total = complaints.length
  const resolved = complaints.filter(c => c.status?.toLowerCase() === "resolved").length
  const open = complaints.filter(c => ["open", "in_progress"].includes(c.status?.toLowerCase())).length

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        .mcp-root {
          font-family: 'DM Sans', sans-serif;
          color: #111827;
          max-width: 860px;
        }

        .mcp-header {
          margin-bottom: 28px;
        }
        .mcp-title {
          font-family: 'DM Serif Display', serif;
          font-size: 34px;
          color: #111827;
          margin: 0 0 6px;
          letter-spacing: -0.5px;
        }
        .mcp-subtitle {
          font-size: 14px;
          color: #9ca3af;
          margin: 0;
        }

        /* Stats row */
        .mcp-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
          margin-bottom: 24px;
        }
        .mcp-stat-card {
          background: #fff;
          border: 1.5px solid #f3f4f6;
          border-radius: 16px;
          padding: 20px 22px;
        }
        .mcp-stat-label {
          font-size: 12px;
          font-weight: 500;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.6px;
          margin-bottom: 8px;
        }
        .mcp-stat-value {
          font-family: 'DM Serif Display', serif;
          font-size: 32px;
          color: #111827;
          line-height: 1;
        }

        /* Table card */
        .mcp-card {
          background: #fff;
          border: 1.5px solid #f3f4f6;
          border-radius: 20px;
          overflow: hidden;
        }
        .mcp-card-header {
          padding: 18px 28px;
          border-bottom: 1px solid #f9fafb;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mcp-card-title {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          letter-spacing: 0.1px;
        }
        .mcp-card-count {
          font-size: 12px;
          color: #9ca3af;
          background: #f9fafb;
          border: 1px solid #f3f4f6;
          border-radius: 100px;
          padding: 3px 10px;
        }

        /* Complaint row */
        .mcp-row {
          padding: 20px 28px;
          border-bottom: 1px solid #f9fafb;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: background 0.15s;
          cursor: default;
        }
        .mcp-row:last-child { border-bottom: none; }
        .mcp-row:hover { background: #fafafa; }

        .mcp-row-index {
          font-size: 12px;
          font-weight: 600;
          color: #d1d5db;
          width: 22px;
          flex-shrink: 0;
          text-align: right;
        }

        .mcp-row-body {
          flex: 1;
          min-width: 0;
        }
        .mcp-row-title {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .mcp-row-address {
          font-size: 13px;
          color: #9ca3af;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .mcp-row-address svg {
          flex-shrink: 0;
        }

        .mcp-row-badges {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-shrink: 0;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 4px 11px;
          border-radius: 100px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }
        .badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        /* Empty state */
        .mcp-empty {
          padding: 72px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          text-align: center;
        }
        .mcp-empty-icon {
          width: 52px; height: 52px;
          background: #f9fafb;
          border: 1.5px solid #f3f4f6;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .mcp-empty-title {
          font-size: 15px;
          font-weight: 600;
          color: #374151;
          margin: 0;
        }
        .mcp-empty-sub {
          font-size: 13px;
          color: #9ca3af;
          margin: 0;
        }

        @keyframes shimmer {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>

      <div className="mcp-root">
        {/* Header */}
        <div className="mcp-header">
          <h1 className="mcp-title">My Complaints</h1>
          <p className="mcp-subtitle">Track and monitor complaints reported by you</p>
        </div>

        {/* Stats */}
        <div className="mcp-stats">
          {[
            { label: "Total", value: loading ? "—" : total },
            { label: "Open / In Progress", value: loading ? "—" : open },
            { label: "Resolved", value: loading ? "—" : resolved },
          ].map((s) => (
            <div className="mcp-stat-card" key={s.label}>
              <div className="mcp-stat-label">{s.label}</div>
              <div className="mcp-stat-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* List card */}
        <div className="mcp-card">
          <div className="mcp-card-header">
            <span className="mcp-card-title">All Reports</span>
            {!loading && (
              <span className="mcp-card-count">{total} {total === 1 ? "complaint" : "complaints"}</span>
            )}
          </div>

          {loading ? (
            [1, 2, 3].map((i) => <SkeletonRow key={i} />)
          ) : complaints.length === 0 ? (
            <div className="mcp-empty">
              <div className="mcp-empty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/>
                </svg>
              </div>
              <p className="mcp-empty-title">No complaints yet</p>
              <p className="mcp-empty-sub">Complaints you submit will appear here</p>
            </div>
          ) : (
            complaints.map((complaint, i) => {
              const status = getStatusStyle(complaint.status)
              const priority = getPriorityStyle(complaint.priority)
              return (
                <div className="mcp-row" key={complaint.id}>
                  <span className="mcp-row-index">{i + 1}</span>
                  <div className="mcp-row-body">
                    <div className="mcp-row-title">{complaint.title}</div>
                    {complaint.address && (
                      <div className="mcp-row-address">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {complaint.address}
                      </div>
                    )}
                  </div>
                  <div className="mcp-row-badges">
                    <span className="badge" style={{ background: status.bg, color: status.color }}>
                      {status.label ?? complaint.status}
                    </span>
                    <span className="badge" style={{ background: priority.bg, color: priority.color }}>
                      <span className="badge-dot" style={{ background: priority.dot }} />
                      {complaint.priority}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}

export default MyComplaintsPage