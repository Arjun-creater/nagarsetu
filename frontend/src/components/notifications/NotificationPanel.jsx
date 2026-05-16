import { useEffect, useState, useCallback } from "react";
import { getComplaints } from "../../services/complaintService";
import { Bell, Clock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"; // Icons add a huge pro feel

const NotificationPanel = () => {
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

 const formatActivityMessage = (complaint) => {
  switch (complaint.status) {
    case "resolved":
      return {
        text: `"${complaint.title}" was resolved`,
        icon: "✅", 
        color: "bg-emerald-50 border-emerald-100"
      };
    case "in_progress":
      return {
        text: `"${complaint.title}" moved to in progress`,
        icon: "🟡",
        color: "bg-amber-50 border-amber-100"
      };
    default:
      return {
        text: `New complaint reported: "${complaint.title}"`,
        icon: "🆕",
        color: "bg-blue-50 border-blue-100"
      };
  }
};

  const fetchActivities = useCallback(async (isInitialLoad = false) => {
    if (isInitialLoad) setIsLoading(true);
    try {
      const data = await getComplaints();
      const complaintData = data.results || [];

      const formatted = complaintData.slice(0, 5).map((complaint) => ({
        id: complaint.id,
        timestamp: new Date(complaint.created_at).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        ...formatActivityMessage(complaint)
      }));

      setActivities(formatted);
      setError(null);
    } catch (err) {
      setError("Failed to sync updates");
      console.error("Polling error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities(true);
    const interval = setInterval(() => fetchActivities(), 15000);
    return () => clearInterval(interval);
  }, [fetchActivities]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-slate-600" />
          <h2 className="text-lg font-semibold text-slate-800">Recent Activity</h2>
        </div>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {error && (
          <p className="text-xs text-red-500 text-center bg-red-50 py-2 rounded-lg">
            {error}. Retrying...
          </p>
        )}

        {activities.length === 0 && !isLoading ? (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">No recent activity to display</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex gap-4 p-4 rounded-xl border transition-all duration-200 hover:shadow-md ${activity.color}`}
            >
              <div className="mt-0.5">{activity.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-800 leading-tight">
                  {activity.text}
                </p>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-2 block">
                  {activity.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;