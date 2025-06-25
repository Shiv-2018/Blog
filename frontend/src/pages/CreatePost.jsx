import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { LoadingSpinner } from "../components/ui/loading";
import apiService from "../services/api";
import { Save, Eye, ArrowLeft, Tag } from "lucide-react";

export const CreatePost = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    tags: "",
    isPublic: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPreview, setIsPreview] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Please fill in title and content");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        isPublic: formData.isPublic,
      };

      await apiService.createPost(postData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to create post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
  };

  if (isPreview) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Preview</h1>
            <Button
              variant="outline"
              onClick={handlePreview}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Edit</span>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">{formData.title}</CardTitle>
              {formData.tags && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {formData.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                <div className="whitespace-pre-wrap">{formData.content}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Create New Post</h1>
            <p className="text-muted-foreground">
              Share your thoughts and stories with the community
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  name="title"
                  placeholder="Enter your post title..."
                  value={formData.title}
                  onChange={handleChange}
                  className="text-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  name="content"
                  placeholder="Write your post content here..."
                  value={formData.content}
                  onChange={handleChange}
                  rows={12}
                  className="resize-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tags</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    name="tags"
                    placeholder="Enter tags separated by commas (e.g., technology, react, programming)"
                    value={formData.tags}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="isPublic" className="text-sm font-medium">
                  Make this post publicly visible (non-logged in users can see
                  it in preview)
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePreview}
                  className="flex items-center space-x-2"
                  disabled={!formData.title.trim() || !formData.content.trim()}
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </Button>

                <Button
                  type="submit"
                  variant="gradient"
                  disabled={loading}
                  className="flex items-center space-x-2 sm:ml-auto"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Publish Post</span>
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
