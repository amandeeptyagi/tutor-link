import { useEffect, useState } from "react";
import {
  getSubscriptionStatus,
  cancelSubscription,
  getFavouriteTeachers,
  addFavouriteTeacher,
  removeFavouriteTeacher,
  rateTeacher,
  getTeacherRatings
} from "@/services/studentApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Heart } from "lucide-react";
import StarRating from "@/components/common/StarRating";
import { Link } from "react-router-dom";

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("approved");
  const [favourites, setFavourites] = useState({});
  const [ratings, setRatings] = useState({});

// Fetch subscriptions and ratings
useEffect(() => {
  const fetchSubscriptionsAndRatings = async () => {
    try {
      const subRes = await getSubscriptionStatus();
      const subs = subRes.data || [];

      const ratingMap = {};
      for (const sub of subs) {
        try {
          const rateRes = await getTeacherRatings(sub.teacher.id);
          ratingMap[sub.teacher.id] = rateRes.data.ratings[0]?.rating || 0;
        } catch {
          ratingMap[sub.teacher.id] = 0;
        }
      }

      setSubscriptions(subs);
      setRatings(ratingMap);
    } catch (err) {
      toast.error("Failed to load subscriptions or ratings");
    } finally {
      setLoading(false);
    }
  };

  fetchSubscriptionsAndRatings();
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

  // fetch favourites separately
  useEffect(() => {
    const fetchFavourites = async () => {
      try {
        const res = await getFavouriteTeachers();
        // map favourite teachers into { teacherId: true }
        const favMap = {};
        res.data.forEach((fav) => {
          favMap[fav.id] = true;
        });
        setFavourites(favMap);
      } catch (err) {
        console.error("Failed to load favourites", err);
              toast.error("Failed to load favourites");
      }
    };

    fetchFavourites();
  }, []);

  // Toggle favourite
  const toggleFavourite = async (teacherId) => {
    try {
      if (favourites[teacherId]) {
        // already liked -> remove
        await removeFavouriteTeacher(teacherId);
        setFavourites((prev) => {
          const updated = { ...prev };
          delete updated[teacherId];
          return updated;
        });
        toast.success("Removed from favourites");
      } else {
        // not liked -> add
        await addFavouriteTeacher(teacherId);
        setFavourites((prev) => ({ ...prev, [teacherId]: true }));
        toast.success("Added to favourites");
      }
    } catch (err) {
      toast.error("Failed to update favourite");
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
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.length > 0 ? (
          filtered.map((sub) => (
            <Card key={sub.id} className="shadow-md">
              <CardContent className="p-4 flex flex-col items-center relative">
                {/* like button */}
                <button
                  className="absolute top-[-10px] right-4 hover:cursor-pointer"
                  onClick={() => toggleFavourite(sub.teacher.id)}
                >
                  <Heart
                    className={`w-6 h-6 ${favourites[sub.teacher.id] ? "fill-pink-500 text-pink-500" : "fill-gray-100 text-gray-400"}`}
                  />
                </button>
                <img
                  src={sub.teacher?.profile_photo || "https://placehold.co/80x80/orange/white"}
                  alt={sub.teacher?.name}
                  className="w-20 h-20 rounded-full object-cover mb-3"
                />
                <h3 className="text-lg font-semibold">{sub.teacher?.name}</h3>
                {activeTab === "approved" ? (
                <StarRating
                  rating={ratings[sub.teacher.id] || 0}
                  interactive={true}
                  onRate={async (value) => {
                    try {
                      await rateTeacher(sub.teacher.id, value);
                      setRatings((prev) => ({ ...prev, [sub.teacher.id]: value }));
                      toast.success(`You rated ${value} stars!`);
                    } catch {
                      toast.error("Failed to rate teacher");
                    }
                  }}
                /> ) : (
                <StarRating rating={ratings[sub.teacher.id] || 0} />
                )}
                <p className="text-xs text-gray-500 mt-1">Status: {sub.status}</p>
                <div className="flex justify-between mt-4 w-full gap-2">
                  <Button className="flex-1" asChild><Link to={`/student/teacher/${sub.teacher.id}`}>View Profile</Link></Button>
                  <Button
                    variant="destructive"
                    className="text-xs"
                    onClick={() => handleCancel(sub.id)}
                  >
                    Cancel Subscription
                  </Button>
                </div>
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
