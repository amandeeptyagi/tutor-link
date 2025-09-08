import { useEffect, useState } from "react";
import {
  uploadResource,
  listResources,
  deleteResource,
  downloadResource,
} from "@/services/teacherApi";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";

const TeacherResources = () => {
  const [resources, setResources] = useState([]);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [classFrom, setClassFrom] = useState("");
  const [classTo, setClassTo] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    try {
      const res = await listResources();
      setResources(res.data.resources);
    } catch (err) {
      toast.error("Failed to load resources");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title || !classFrom || !classTo) {
      return toast.error("Please fill all fields and select a file");
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("class_from", classFrom);
      formData.append("class_to", classTo);

      await uploadResource(formData);
      toast.success("Resource uploaded");
      setFile(null);
      setTitle("");
      setClassFrom("");
      setClassTo("");
      fetchResources();
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(id);
      await deleteResource(id);
      toast.success("Resource deleted");
      fetchResources();
    } catch (err) {
      toast.error("Delete failed");
    } finally {
      setDeleting(null);
    }
  };

  const handleDownload = async (res) => {
    try {
      setDownloading(res.id);
      window.location.href = downloadResource(res.id);
    } catch (err) {
      toast.error("Download failed");
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My Resources</h1>

      {/* Upload Form */}
      <form
        onSubmit={handleUpload}
        className="flex flex-col md:flex-row gap-3 items-center mb-6"
      >
        <Input
          type="text"
          placeholder="Resource Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="md:w-1/5"
        />
        <Input
          type="number"
          placeholder="Class From"
          value={classFrom}
          onChange={(e) => setClassFrom(e.target.value)}
          className="md:w-1/5"
        />
        <Input
          type="number"
          placeholder="Class To"
          value={classTo}
          onChange={(e) => setClassTo(e.target.value)}
          className="md:w-1/5"
        />
        <Input
          type="file"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
          onChange={(e) => setFile(e.target.files[0])}
          className="md:w-1/5"
        />
        <Button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </Button>
      </form>

      {/* Resource List */}
      {resources.length === 0 ? (
        <p className="text-center text-gray-500">No resources uploaded yet</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {resources.map((res) => (
            <Card key={res.id} className='p-0'>
              <CardContent className="p-3">
                <h2 className="font-semibold">{res.title}</h2>
                <p className="text-sm text-gray-500">
                  Class {res.class_from} - {res.class_to}
                </p>

                <Button
                  size="sm"
                  
                  className="my-2 mr-3"
                  onClick={() => handleDownload(res)}
                  disabled={downloading === res.id}
                >
                  {downloading === res.id ? "Downloading..." : "View / Download"}
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(res.id)}
                  disabled={deleting === res.id}
                >
                  {deleting === res.id ? "Deleting..." : "Delete"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherResources;
