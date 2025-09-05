import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import {
  Star,
  MapPin,
  Phone,
  Clock,
  GraduationCap,
  CheckCircle,
  Calendar,
  BookOpen,
  Globe,
  User,
  MessageCircle,
  School,
  ImageIcon,
  File
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/common/StarRating';
import { viewTeacher } from "@/services/studentApi";

const TeacherLocationMap = ({ location, address }) => {
  const [coordinates, setCoordinates] = useState(null);


  useEffect(() => {
    if (location) {
      try {
        // Convert hex string → byte array
        const hexToBytes = (hex) =>
          new Uint8Array(
            hex.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
          );

        const bytes = hexToBytes(location);
        const view = new DataView(bytes.buffer);

        // PostGIS WKB format → little endian double
        const lon = view.getFloat64(9, true);
        const lat = view.getFloat64(17, true);

        setCoordinates({ lat, lng: lon });
      } catch (err) {
        console.error("Failed to parse location:", err);
      }
    }
  }, [location]);

  if (!coordinates) {
    return <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500 text-sm">Map Location not available</p>
    </div>;
  }

  return (
    <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=${coordinates.lng - 0.01},${coordinates.lat - 0.01},${coordinates.lng + 0.01},${coordinates.lat + 0.01}&layer=mapnik&marker=${coordinates.lat},${coordinates.lng}`}
      />
    </div>
  );
};

const TeacherProfile = ({ teacherData }) => {
  const {
    name,
    phone,
    profile_photo,
    gender,
    mode,
    street,
    city,
    state,
    pincode,
    location,
    subjects,
    class_from,
    class_to,
    timing,
    institute_name,
    is_verified,
    created_at,
    avg_rating,
    review_count
  } = teacherData;

  const checkAddress = [street, city, state, pincode]
    .filter((part) => part && part.trim() !== "")
    .join(", ");

  const fullAddress = checkAddress ? checkAddress : "Not provided";
  const rating = parseFloat(avg_rating);
  const reviews = parseInt(review_count);

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Compact Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4">
                <img
                  src={profile_photo || "https://placehold.co/80x80/orange/white"}
                  alt={name}
                  className="w-20 h-20 rounded-full object-cover"
                />

                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">{name || 'N/A'}</h1>
                    {is_verified && <CheckCircle className="h-5 w-5 text-green-500" />}
                  </div>

                  <div className="flex items-center flex-wrap gap-2 mb-2">
                    <StarRating rating={rating || '0'} />
                    <span className="text-gray-500">({reviews || '0'} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600 text-sm">Gender:</span>
                    <span className="capitalize text-sm">{gender || "Not Specified"}</span>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="flex flex-col gap-2 md:ml-auto">
                <Button
                  size="sm"
                  className="w-full md:w-auto"
                  onClick={() => (window.location.href = `tel:${phone || null}`)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Now
                </Button>
                <Button
                  size="sm"
                  className="w-full md:w-auto"
                  variant='outline'
                  
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Gallery
                </Button>
                <Button
                  size="sm"
                  className="w-full md:w-auto"
                  variant='outline'
                  
                >
                  <File className="h-4 w-4 mr-2" />
                  Resources
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Column - Details */}
          <div className="space-y-6">

            {/* Quick Info Grid */}
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-4">

                  {/* Phone */}
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-semibold text-sm">{phone || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Timing */}
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-xs text-gray-500">Timing</p>
                      <p className="font-semibold text-sm">{timing || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Classes */}
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-xs text-gray-500">Classes</p>
                      <p className="font-semibold text-sm">{class_from || 'N/A'} - {class_to || 'N/A'}</p>
                    </div>
                  </div>

                  {/* Mode */}
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-500">Mode</p>
                      <p className="font-semibold text-sm capitalize">{mode ? mode.join(', ') : 'N/A'}</p>
                    </div>
                  </div>

                  {/* Institute */}
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-orange-600" />
                    <div>
                      <p className="text-xs text-gray-500">Institute Name</p>
                      <p className="font-semibold text-sm capitalize">{institute_name || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Subjects */}
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                    <p className="text-xs text-gray-500 font-medium">SUBJECTS</p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {subjects ? (subjects.map((subject, index) => (
                      <Badge key={index} variant="secondary" className="text-sm px-2 py-1">
                        {subject}
                      </Badge>
                    ))) : 'N/A'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Location */}
          <div>
            <Card>
              <CardContent className="">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-red-500" />
                  <h3 className="font-semibold text-sm">Location</h3>
                </div>
                <p className="text-gray-700 text-sm mb-4">{fullAddress}</p>
                <TeacherLocationMap location={location} address={fullAddress} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeacherProfilePage = () => {
  const { teacherId } = useParams();
  const [teacherData, setTeacherData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const res = await viewTeacher(teacherId);
        setTeacherData(res.data);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, []);


  if (!teacherData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Teacher not found</p>
      </div>
    );
  }

  return <TeacherProfile teacherData={teacherData} />;
};

export default TeacherProfilePage;