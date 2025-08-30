import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/common/StarRating";
import {
  searchTeachers,
  getSubscriptionStatus,
  requestSubscription,
  getFavouriteTeachers,
  addFavouriteTeacher,
  removeFavouriteTeacher
} from "@/services/studentApi";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [subscriptions, setSubscriptions] = useState({});
  const [favourites, setFavourites] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // filters state
  const [filters, setFilters] = useState({
    city: "",
    pincode: "",
    subject: "",
    gender: "",
    mode: "",
    class: "",
    rating: "",
  });

  // fetch teachers
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);
        const response = await searchTeachers(filters);
        setTeachers(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError("Failed to load teachers");
        toast.error("Failed to load teachers");
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [filters]);

  // fetch subscriptions separately
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await getSubscriptionStatus();
        // Map teacherId -> subscription object
        const subsMap = {};
        res.data.forEach((sub) => {
          subsMap[sub.teacher.id] = sub;
        });
        setSubscriptions(subsMap);
      } catch (err) {
        console.error("Failed to load subscriptions", err);
        toast.error("Failed to load subscriptions");
      }
    };

    fetchSubscriptions();
  }, []);

  // handle subscribe
  const handleSubscribe = async (teacherId) => {
    try {
      const res = await requestSubscription(teacherId);
      // update local state
      setSubscriptions((prev) => ({
        ...prev,
        [teacherId]: { status: "pending", teacher: { id: teacherId } },
      }));
      toast.success("Subscription request sent");
    } catch (err) {
      console.error("Subscription failed", err);
      toast.error("Failed to subscribe");
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Find Teachers</h1>

      {/*Filters*/}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="City"
          value={filters.city}
          onChange={(e) => setFilters({ ...filters, city: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Pincode"
          value={filters.pincode}
          onChange={(e) => setFilters({ ...filters, pincode: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Subject"
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={filters.gender}
          onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select
          value={filters.mode}
          onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Mode</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
        <input
          type="number"
          placeholder="Enter your class"
          value={filters.class}
          onChange={(e) => setFilters({ ...filters, class: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={filters.rating}
          onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Min Rating</option>
          <option value="1">1 ⭐ & above</option>
          <option value="2">2 ⭐ & above</option>
          <option value="3">3 ⭐ & above</option>
          <option value="4">4 ⭐ & above</option>
          <option value="5">5 ⭐</option>
        </select>
      </div>

      {/*Teacher List*/}
      {loading ? (
        <p>Loading teachers...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : teachers.length === 0 ? (
        <p>No teachers found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {teachers.map((t) => {
            const sub = subscriptions[t.id]; // check subscription for this teacher
            return (
              <Card key={t.id} className="shadow-md hover:shadow-lg transition rounded-2xl">
                <CardContent className="p-4 flex flex-col items-center relative">
                  {/* like button */}
                  <button
                    className="absolute top-[-10px] right-4 hover:cursor-pointer"
                    onClick={() => toggleFavourite(t.id)}
                  >
                    <Heart
                      className={`w-6 h-6 ${favourites[t.id] ? "fill-pink-500 text-pink-500" : "fill-gray-100 text-gray-400"}`}
                    />
                  </button>
                  <img
                    src={t.profile_photo || "https://placehold.co/80x80/orange/white"}
                    alt={t.name}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <h2 className="font-semibold text-lg mt-4 mb-4">{t.name}</h2>
                  {/* Star Rating component */}
                  <StarRating rating={t.avg_rating} />

                  <p>{t.city || "N/A"}, {t.state || ""}</p>
                  <div className="flex justify-between mt-4 w-full gap-2">
                    <Button className="flex-1" asChild><Link to={`/student/teacher/${t.id}`}>View Profile</Link></Button>

                    {sub ? (
                      <Button
                        className={`flex-1 text-xs overflow-hidden
                            ${sub.status === "approved"
                            ? "bg-green-500"
                            : sub.status === "pending"
                              ? "bg-yellow-500"
                              : sub.status === "rejected"
                                ? "bg-gray-500"
                                : "bg-gray-300"
                          }`}
                          disabled
                      >
                        {sub.status === "approved"
                          ? "Subscribed"
                          : sub.status === "pending"
                            ? "Subscription Pending"
                            : sub.status === "rejected"
                              ? "Subscription Rejected"
                              : ""}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        className="flex-1 border-red-500 border-2 text-red-500"
                        onClick={() => handleSubscribe(t.id)}
                      >
                        Subscribe
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
