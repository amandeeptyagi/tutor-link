import { useEffect, useState } from "react";
import {
  uploadGalleryImage,
  getGalleryImages,
  deleteGalleryImage,
} from "@/services/teacherApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

const TeacherGallery = () => {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null); 

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await getGalleryImages();
      setImages(res.data.images);
    } catch (err) {
      toast.error("Failed to load gallery");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("image", file);

      await uploadGalleryImage(formData);
      toast.success("Image uploaded");
      setFile(null);
      fetchImages();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id); 
      await deleteGalleryImage(id);
      toast.success("Image deleted");
      fetchImages();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null); 
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Gallery</h1>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="flex flex-col md:flex-row gap-3 items-center mb-6"
      >
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </form>

      {/* Gallery Images */}
      {images.length === 0 ? (
        <p className="text-center text-gray-500">No images uploaded yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <Card key={img.id} className="p-0">
              <CardContent className="p-4 flex flex-col items-end">
                <img
                  src={img.image_url}
                  alt="Gallery"
                  className="w-full h-full object-cover rounded-lg mb-2"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  disabled={deletingId === img.id} 
                  onClick={() => handleDelete(img.id)}
                >
                  {deletingId === img.id ? "Deleting..." : "Delete"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherGallery;
