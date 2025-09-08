import { useEffect, useState } from "react";
import { getTeacherRatings, getTeacherAnalytics } from "@/services/teacherApi";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const TeacherDashboard = () => {
  const [ratings, setRatings] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [ratingsRes, analyticsRes] = await Promise.all([
        getTeacherRatings(),
        getTeacherAnalytics(),
      ]);

      setRatings(ratingsRes.data.ratings || []);
      setAnalytics(analyticsRes.data.analytics || {});
    } catch (err) {
      toast.error("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    ratings.length > 0
      ? (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(
          1
        )
      : 0;

  // Format analytics data for chart
  const monthlyData =
    analytics?.monthly?.map((m) => ({
      month: new Date(m.month).toLocaleString("default", { month: "short", year: "numeric" }),
      count: m.count,
    })) || [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Analytics</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ratings Card */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Average Rating</h2>
              <p className="text-3xl font-bold text-yellow-500">{averageRating} ⭐</p>
              <p className="text-sm text-gray-500">{ratings.length} ratings total</p>

              {/* Ratings Trend */}
              {ratings.length > 0 ? (
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ratings.map((r) => ({
                      date: new Date(r.created_at).toLocaleDateString(),
                      rating: r.rating
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="rating" stroke="#facc15" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No ratings yet</p>
              )}
            </CardContent>
          </Card>

          {/* Subscribers Card */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-2">Subscribers</h2>
              <p className="text-3xl font-bold text-blue-500">
                {analytics?.totalSubscribers || 0}
              </p>
              <p className="text-sm text-gray-500">Total subscribers</p>

              {/* Monthly Subscribers */}
              {monthlyData.length > 0 ? (
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-gray-500 mt-2">No subscribers data</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;