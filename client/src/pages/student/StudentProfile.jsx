import { useEffect, useState } from "react";
import { getStudentProfile, updateStudentProfile, changeStudentPassword } from "@/services/studentApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "react-hot-toast";

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "" });

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getStudentProfile();
        setProfile(res.data);
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
      await updateStudentProfile(profile);
      toast.success("Profile updated!");
      setEditMode(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // Change password
  const handlePasswordChange = async () => {
    try {
      await changeStudentPassword(passwordData);
      toast.success("Password changed!");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error("Password change failed");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!profile) return <p className="text-center text-red-500">No profile data</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm">Name</label>
            <Input
              value={profile.name}
              disabled={!editMode}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm">Email</label>
            <Input value={profile.email} disabled />
          </div>
          <div>
            <label className="block text-sm">Phone</label>
            <Input
              value={profile.phone || ""}
              disabled={!editMode}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm">Address</label>
            <Input
              value={profile.address || ""}
              disabled={!editMode}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            />
          </div>

          {editMode ? (
            <Button onClick={handleUpdate} className="mt-4 w-full">Save Changes</Button>
          ) : (
            <Button variant="outline" onClick={() => setEditMode(true)} className="mt-4 w-full">
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
            <label className="block text-sm">Old Password</label>
            <Input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm">New Password</label>
            <Input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
            />
          </div>
          <Button onClick={handlePasswordChange} className="mt-4 w-full">Update Password</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
