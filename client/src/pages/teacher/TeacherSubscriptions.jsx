import { useEffect, useState } from "react";
import {
  getTeacherSubscriptions,
  updateSubscriptionStatus,
  deleteSubscription,
} from "@/services/teacherApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const TeacherSubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch subscriptions
  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const res = await getTeacherSubscriptions();
      setSubscriptions(res.data.subscriptions);
    } catch (err) {
      toast.error("Failed to load subscriptions");
    } finally {
      setLoading(false);
    }
  };

  // Update status
  const handleUpdateStatus = async (id, status) => {
    try {
      await updateSubscriptionStatus(id, status);
      toast.success("Subscription updated");
      fetchSubscriptions();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // Delete subscription
  const handleDelete = async (id) => {
    try {
      await deleteSubscription(id);
      toast.success("Subscription deleted");
      fetchSubscriptions();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  // Filtered subscriptions
  const filteredSubscriptions = subscriptions.filter((s) => s.status === activeTab);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Subscriptions</h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        {["pending", "approved", "rejected"].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Button>
        ))}
      </div>

      {filteredSubscriptions.length === 0 ? (
        <p className="text-center text-gray-500">
          No {activeTab} subscriptions
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSubscriptions.map((sub) => (
            <Card key={sub.id} className="shadow-md p-2 w-full">
              <CardContent className="p-4 flex flex-col items-start w-full">
                <img
                  src={sub.profile_photo || "https://placehold.co/80x80/orange/white"}
                  alt={sub.name || ""}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
                <h3 className="text-lg font-semibold"><b>Name :</b> {sub.name || ""}</h3>                             
                <p className="text-sm"><b>Phone No. :</b> {sub.phone || ""}</p>                             
                <p className="text-sm"><b>Address :</b> {sub.address || ""}</p>                             
                  <p className="text-sm mb-5">
                    <b>Status :</b>{" "}
                    <span
                      className={`font-medium ${
                        sub.status === "approved"
                          ? "text-green-600"
                          : sub.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                    </span>
                  </p>
                

                <div className="flex gap-2 justify-between w-full">
                  {sub.status !== "approved" && (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateStatus(sub.id, "approved")}
                    >
                      Accept
                    </Button>
                  )}
                  {sub.status !== "rejected" && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleUpdateStatus(sub.id, "rejected")}
                    >
                      Reject
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(sub.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherSubscriptions;
