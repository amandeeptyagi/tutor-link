import { useEffect, useState } from "react";
import { getFavouriteTeachers, removeFavouriteTeacher } from "@/services/studentApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";

const FavouritesPage = () => {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <p className="text-center">Loading favourites...</p>;
    if (!favourites.length) return <p className="text-center text-gray-500">No favourite teachers yet.</p>;

    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">My Favourite Teachers</h1>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {favourites.map((teacher) => (
                    <Card key={teacher.id} className="shadow-md hover:shadow-lg transition rounded-2xl">
                        <CardContent className="p-4 flex flex-col items-center">
                            {/* Profile Photo */}
                            <img
                                src={teacher.profile_photo || "https://placehold.co/80x80/orange/white"}
                                alt={teacher.name}
                                className="w-24 h-24 rounded-full object-cover"
                            />

                            {/* Teacher Info */}
                            <h2 className="font-semibold text-lg mt-4 mb-2">{teacher.name}</h2>
                            {teacher.subjects && (
                                <p>{teacher.subjects}</p>
                            )}

                            {/* Actions */}
                            <div className="mt-4 flex items-center gap-2 w-full justify-between">
                                <Button className="flex-1">View Profile</Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleRemove(teacher.id)}
                                    className="flex flex-1 items-center gap-2"
                                >
                                    <Trash size={14} /> Remove
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default FavouritesPage;