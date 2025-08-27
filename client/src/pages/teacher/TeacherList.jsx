import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/common/StarRating";
import { searchTeachers } from "@/services/studentApi";

export default function TeacherList() {
    const [teachers, setTeachers] = useState([]);
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

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                setLoading(true);
                const response = await searchTeachers(filters);
                console.log(response.data);

                setTeachers(Array.isArray(response.data) ? response.data : []);

            } catch (err) {
                setError("Failed to load teachers");
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [filters]);

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
                    {teachers.map((t) => (
                        <Card key={t.id} className="shadow-md hover:shadow-lg transition rounded-2xl">
                            <CardContent className="p-4 flex flex-col items-center">
                                <img
                                    src={t.profile_photo || "https://placehold.co/80x80/orange/white"}
                                    alt={t.name}
                                    className="w-24 h-24 rounded-full object-cover"
                                />
                                <h2 className="font-semibold text-lg mt-4 mb-4">{t.name}</h2>
                                {/* Star Rating component */}
                                <StarRating rating={t.avg_rating} />

                                <p>{t.city || "N/A"}, {t.state || ""}</p>
                                <Button className="mt-4 w-full">View Profile</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
