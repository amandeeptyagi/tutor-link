import { useState, useEffect } from "react";
import { uploadStudentProfilePhoto } from "@/services/studentApi";
import { uploadTeacherProfilePhoto } from "@/services/teacherApi";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const ProfilePhotoUploader = ({ currentPhoto, onUploadSuccess }) => {
  const [preview, setPreview] = useState(currentPhoto);
  const [uploading, setUploading] = useState(false);

  // sync currentPhoto if parent updates
  useEffect(() => {
    setPreview(currentPhoto);
  }, [currentPhoto]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file)); // show local preview immediately
    setUploading(true);

    try {
      const res = await uploadTeacherProfilePhoto(file);
      const newUrl = res.data.url;
      setPreview(newUrl); // update preview with Cloudinary URL

      // notify parent
      if (onUploadSuccess) onUploadSuccess(newUrl);

      toast.success("Profile photo updated!");
    } catch (err) {
      toast.error("Upload failed");
      setPreview(currentPhoto);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-3">
      <img
        src={preview || "https://placehold.co/80x80/orange/white"}
        alt="Profile Image"
        className="w-28 h-28 rounded-full object-cover shadow-md"
      />
      <label className="cursor-pointer mt-2">
        <span className="px-4 py-3 bg-blue-600 text-white rounded-lg text-sm">
          {uploading ? "Uploading..." : "Change Photo"}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={uploading}
        />
      </label>
    </div>
  );
};

export default ProfilePhotoUploader;
