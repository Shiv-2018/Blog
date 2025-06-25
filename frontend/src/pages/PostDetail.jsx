import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { LoadingPage } from "../components/ui/loading";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/api";
import { formatDate } from "../lib/utils";
import {
  ArrowLeft,
  User,
  Calendar,
  Eye,
  Tag,
  Edit,
  Trash2,
  Lock,
} from "lucide-react";

export const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPost(id);
      setPost(response.data);
    } catch (err) {
      if (err.message.includes("401") || err.message.includes("unauthorized")) {
        setError("You need to login to view this post");
      } else {
        setError(err.message || "Failed to load post");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await apiService.deletePost(id);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Failed to delete post");
    }
  };

  if (loading) {
    return <LoadingPage message="Loading post..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <Lock className="h-16 w-16 text-muted-foreground mx-auto" />
              <h2 className="text-xl font-semibold">Access Restricted</h2>
              <p className="text-muted-foreground">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => navigate("/")}>
                  Go Home
                </Button>
                {!isAuthenticated && (
                  <Link to="/login">
                    <Button variant="gradient">Login</Button>
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Post not found</h2>
          <Button variant="outline" onClick={() => navigate("/")}>
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  const isAuthor = user && post.author && user._id === post.author._id;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>

          {isAuthor && (
            <div className="flex space-x-2">
              <Link to={`/edit/${post._id}`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>

        {/* Post Content */}
        <article>
          <Card>
            <CardHeader>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                {post.title}
              </h1>

              {/* Post Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{post.author?.username || "Anonymous"}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                {post.views && (
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views} views</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
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
                <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                  {post.content}
                </div>
              </div>
            </CardContent>
          </Card>
        </article>

        {/* Author Info */}
        {post.author && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{post.author.username}</h3>
                  <p className="text-sm text-muted-foreground">
                    Author • Member since{" "}
                    {formatDate(post.author.createdAt || post.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Related Posts CTA */}
        <div className="mt-8 text-center">
          <p className="text-muted-foreground mb-4">
            Enjoyed this post? Explore more content
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="outline">Browse All Posts</Button>
            </Link>
            {isAuthenticated && (
              <Link to="/create">
                <Button variant="gradient">Write a Post</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
