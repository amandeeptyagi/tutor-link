import { useEffect, useState } from "react";
import { getSubscriptionStatus, cancelSubscription } from "@/services/studentApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("approved"); 

  // Fetch subscriptions
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await getSubscriptionStatus();
        setSubscriptions(res.data || []);
      } catch (err) {
        toast.error("Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  // Cancel subscription
  const handleCancel = async (id) => {
    try {
      await cancelSubscription(id);
      setSubscriptions(subscriptions.filter((s) => s.id !== id));
      toast.success("Subscription cancelled");
    } catch (err) {
      toast.error("Failed to cancel");
    }
  };

  if (loading) return <p className="text-center">Loading subscriptions...</p>;
  if (!subscriptions.length) return <p className="text-center text-gray-500">No subscriptions yet.</p>;

  // Group by status
  const filtered = subscriptions.filter((s) => s.status === activeTab);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Subscriptions</h1>

      {/* Tabs */}
      <div className="flex gap-3 mb-6">
        <Button
          variant={activeTab === "approved" ? "default" : "outline"}
          onClick={() => setActiveTab("approved")}
        >
          Subscribed
        </Button>
        <Button
          variant={activeTab === "pending" ? "default" : "outline"}
          onClick={() => setActiveTab("pending")}
        >
          Pending
        </Button>
        <Button
          variant={activeTab === "rejected" ? "default" : "outline"}
          onClick={() => setActiveTab("rejected")}
        >
          Rejected
        </Button>
      </div>

      {/* List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map((sub) => (
            <Card key={sub.id} className="shadow-md">
              <CardContent className="p-4 flex flex-col items-center">
                <img
                  src={sub.teacher?.profile_photo || "https://placehold.co/80x80/orange/white"}
                  alt={sub.teacher?.name}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
                <h3 className="text-lg font-semibold">{sub.teacher?.name}</h3>
                <p className="text-sm text-gray-600">{sub.teacher?.email}</p>
                <p className="text-xs text-gray-500 mt-1">Status: {sub.status}</p>

                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-3"
                  onClick={() => handleCancel(sub.id)}
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">No {activeTab} subscriptions.</p>
        )}
      </div>
    </div>
  );
};

export default SubscriptionsPage;
