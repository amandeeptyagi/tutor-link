import { useEffect, useState } from "react";
import {
  getTeacherProfile,
  updateTeacherProfile,
  changeTeacherPassword,
} from "@/services/teacherApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";
import ProfilePhotoUploader from "@/components/common/ProfilePhotoUploader";

const TeacherProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Fetch teacher profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getTeacherProfile();
        setProfile(res.data.teacher);
      } catch (err) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Update profile
  const handleUpdate = async () => {
    try {
      await updateTeacherProfile(profile);
      toast.success("Profile updated!");
      setEditMode(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    try {
      await changeTeacherPassword(passwordData);
      toast.success("Password changed!");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error("Password change failed");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!profile) return <p className="text-center text-red-500">No profile data</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="space-y-4">
          {/* Profile Photo */}
          <div className="flex justify-center">
            <ProfilePhotoUploader
              currentPhoto={profile.profile_photo}
              onUploadSuccess={(newUrl) =>
                setProfile({ ...profile, profile_photo: newUrl })
              }
            />
          </div>

          {/* Basic Info */}
          <div>
            <label className="block text-sm">Name</label>
            <Input
              value={profile.name || ""}
              disabled={!editMode}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <Input value={profile.email || ""} disabled />
          </div>
          <div>
            <label className="block text-sm">Phone</label>
            <Input
              value={profile.phone || ""}
              disabled={!editMode}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm">Gender</label>
            {/* <Input
              value={profile.gender || ""}
              disabled={!editMode}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
            /> */}
            <select
              value={profile.gender || ""}
              disabled={!editMode}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              className="border w-full h-9 text-sm rounded"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Teaching Mode */}
          <div>
            <label className="block text-sm">Mode (Online/Offline/Both)</label>
            <Input
              value={profile.mode?.join(", ") || ""}
              disabled={!editMode}
              onChange={(e) =>
                setProfile({ ...profile, mode: e.target.value.split(",") })
              }
            />
            <select
              value={profile.mode?.join(", ") || ""}
              disabled={!editMode}
              onChange={(e) =>
                setProfile({ ...profile, mode: e.target.value.split(",") })
              }
              className="border w-full h-9 text-sm rounded"
            >
              <option value="">Mode</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="online,offline">Both</option>
            </select>
          </div>

          {/* Subjects */}
          <div>
            <label className="block text-sm">Subjects</label>
            <Input
              value={profile.subjects?.join(", ") || ""}
              disabled={!editMode}
              onChange={(e) =>
                setProfile({ ...profile, subjects: e.target.value.split(",") })
              }
            />
          </div>

          {/* Classes Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm">Class From</label>
              <Input
                type="number"
                value={profile.class_from || ""}
                disabled={!editMode}
                onChange={(e) =>
                  setProfile({ ...profile, class_from: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm">Class To</label>
              <Input
                type="number"
                value={profile.class_to || ""}
                disabled={!editMode}
                onChange={(e) =>
                  setProfile({ ...profile, class_to: e.target.value })
                }
              />
            </div>
          </div>

          {/* Timing */}
          <div>
            <label className="block text-sm">Timing</label>
            <Input
              value={profile.timing || ""}
              disabled={!editMode}
              onChange={(e) =>
                setProfile({ ...profile, timing: e.target.value })
              }
            />
          </div>

          {/* Institute */}
          <div>
            <label className="block text-sm">Institute Name</label>
            <Input
              value={profile.institute_name || ""}
              disabled={!editMode}
              onChange={(e) =>
                setProfile({ ...profile, institute_name: e.target.value })
              }
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm">Street</label>
            <Input
              value={profile.street || ""}
              disabled={!editMode}
              onChange={(e) => setProfile({ ...profile, street: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm">City</label>
            <Input
              value={profile.city || ""}
              disabled={!editMode}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm">State</label>
            <Input
              value={profile.state || ""}
              disabled={!editMode}
              onChange={(e) => setProfile({ ...profile, state: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm">Pincode</label>
            <Input
              value={profile.pincode || ""}
              disabled={!editMode}
              onChange={(e) =>
                setProfile({ ...profile, pincode: e.target.value })
              }
            />
          </div>

          {/* Save/Edit Button */}
          {editMode ? (
            <Button onClick={handleUpdate} className="mt-4 w-full">
              Save Changes
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => setEditMode(true)}
              className="mt-4 w-full"
            >
              Edit Profile
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Password Change */}
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-lg font-semibold">Change Password</h2>
          <div>
            <label className="block text-sm">Current Password</label>
            <Input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  currentPassword: e.target.value,
                })
              }
            />
          </div>
          <div>
            <label className="block text-sm">New Password</label>
            <Input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  newPassword: e.target.value,
                })
              }
            />
          </div>
          <Button onClick={handlePasswordChange} className="mt-4 w-full">
            Update Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherProfile;
