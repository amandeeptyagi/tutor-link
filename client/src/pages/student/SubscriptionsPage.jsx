import { useEffect, useState } from "react";
import { getSubscriptionStatus, cancelSubscription } from "@/services/studentApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Grouping by status
  const pending = subscriptions.filter((s) => s.status === "pending");
  const approved = subscriptions.filter((s) => s.status === "approved");
  const rejected = subscriptions.filter((s) => s.status === "rejected");

  const renderList = (list, title, color) => (
    <div className="mb-8">
      <h2 className={`text-xl font-semibold mb-4 ${color}`}>{title}</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((sub) => (
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
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Subscriptions</h1>

      {approved.length > 0 && renderList(approved, "Subscribed", "text-green-600")}
      {pending.length > 0 && renderList(pending, "Requested", "text-yellow-600")}
      {rejected.length > 0 && renderList(rejected, "Rejected", "text-red-600")}
    </div>
  );
};

export default SubscriptionsPage;
