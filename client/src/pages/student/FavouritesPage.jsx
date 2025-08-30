import { useEffect, useState } from "react";
import { getFavouriteTeachers, removeFavouriteTeacher, getSubscriptionStatus, requestSubscription } from "@/services/studentApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Trash, Heart } from "lucide-react";
import StarRating from "@/components/common/StarRating";
import { Link } from "react-router-dom";

const FavouritesPage = () => {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscriptions, setSubscriptions] = useState({});

    // Fetch favourites on mount
    useEffect(() => {
        const fetchFavourites = async () => {
            try {
                const res = await getFavouriteTeachers();
                setFavourites(res.data || []);
            } catch (err) {
                toast.error("Failed to load favourites");
            } finally {
                setLoading(false);
            }
        };
        fetchFavourites();
    }, []);

    // Remove teacher from favourites
    const handleRemove = async (teacherId) => {
        try {
            await removeFavouriteTeacher(teacherId);
            setFavourites(favourites.filter((t) => t.id !== teacherId));
            toast.success("Removed from favourites");
        } catch (err) {
            toast.error("Failed to remove");
        }
    };

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

    if (loading) return <p className="text-center">Loading favourites...</p>;
    if (!favourites.length) return <p className="text-center text-gray-500">No favourite teachers yet.</p>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">My Favourite Teachers</h1>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {favourites.map((teacher) => {
                    const sub = subscriptions[teacher.id]; // check subscription for this teacher
                    return (
                        <Card key={teacher.id} className="shadow-md hover:shadow-lg transition rounded-2xl">
                            <CardContent className="p-4 flex flex-col items-center relative">
                                {/* like button */}
                                <button
                                    className="absolute top-[-10px] right-4 hover:cursor-pointer"
                                    onClick={() => handleRemove(teacher.id)}
                                >
                                    <Heart
                                        className={`w-6 h-6 fill-pink-500 text-pink-500`}
                                    />
                                </button>
                                {/* Profile Photo */}
                                <img
                                    src={teacher.profile_photo || "https://placehold.co/80x80/orange/white"}
                                    alt={teacher.name}
                                    className="w-24 h-24 rounded-full object-cover"
                                />

                                {/* Teacher Info */}
                                <h2 className="font-semibold text-lg mt-4 mb-2">{teacher.name}</h2>
                                {/* Star Rating component */}
                                <StarRating rating={teacher.avg_rating} />
                                {teacher.subjects ? (
                                    <p>{teacher.subjects.join(', ')}</p>
                                ): <p>N/A</p> }

                                {/* Actions */}
                                <div className="mt-4 flex items-center gap-2 w-full justify-between">
                                    <Button className="flex-1" asChild><Link to={`/student/teacher/${teacher.id}`}>View Profile</Link></Button>

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
                                            onClick={() => handleSubscribe(teacher.id)}
                                        >
                                            Subscribe
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )
                }
                )}
            </div>
        </div>
    );
};

export default FavouritesPage;