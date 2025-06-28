import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PostCard } from "../components/PostCard";
import { Button } from "../components/ui/button";
import { LoadingSpinner } from "../components/ui/loading";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/api";
import { PenTool, Plus, BookOpen, TrendingUp, Users, Eye } from "lucide-react";

export const Dashboard = () => {
  const [userPosts, setUserPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add missing error state
  const [activeTab, setActiveTab] = useState("my-posts");
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalViews: 0,
    totalReads: 0,
  });

  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      const userData = user?.data;
      //console.log("User data from context:", userData);
      const userId = userData?._id || userData?.id;
      //console.log("User ID from context:", userId);

      // Check if user exists and has an ID
      if (!userId) {
        console.error("User not authenticated or user ID missing");
        setError("User not authenticated");
        return;
      }

      //console.log("Fetching data for user:", userId); // Debug log

      try {
        //console.log("Calling getPosts...");
        const allPostsData = await apiService.getAllPosts();
        //console.log("getPosts success:", allPostsData);
      } catch (error) {
        console.error("getPosts failed:", error);
        console.error("getPosts error details:", error.response?.data);
      }

      const [userPostsData, allPostsData] = await Promise.all([
        apiService.getUserPosts(userId),
        apiService.getAllPosts(),
      ]);

      // Handle the ApiResponse format from your backend
      const userPostsArray =
        userPostsData?.data?.data || userPostsData?.data || [];
      const allPostsArray =
        allPostsData?.data?.data || allPostsData?.data || [];

      setUserPosts(userPostsArray);
      setAllPosts(allPostsArray);

      // Calculate stats
      const totalViews = userPostsArray.reduce(
        (sum, post) => sum + (post.views || 0),
        0
      );

      setStats({
        totalPosts: userPostsArray.length,
        totalViews,
        totalReads: totalViews, // Assuming views = reads for now
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);

      // More detailed error logging
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);

        // Handle specific HTTP status codes
        if (error.response.status === 401) {
          setError("Please log in again");
        } else if (error.response.status === 404) {
          setError("Posts not found");
        } else {
          setError("Failed to fetch dashboard data");
        }
      } else if (error.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const currentPosts = activeTab === "my-posts" ? userPosts : allPosts;

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                Error Loading Dashboard
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchDashboardData} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.username || user?.name || "User"}!
            </h1>
            <p className="text-muted-foreground">
              Manage your posts and explore the community
            </p>
          </div>
          <Link to="/create">
            <Button variant="gradient" size="lg" className="mt-4 md:mt-0">
              <Plus className="mr-2 h-5 w-5" />
              Write New Post
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl p-6 border border-blue-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{stats.totalPosts}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl p-6 border border-green-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Eye className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl p-6 border border-purple-500/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Engagement</p>
                <p className="text-2xl font-bold">
                  {stats.totalPosts > 0
                    ? Math.round(stats.totalViews / stats.totalPosts)
                    : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center p-1 bg-muted rounded-lg">
            <button
              onClick={() => setActiveTab("my-posts")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "my-posts"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PenTool className="h-4 w-4 mr-2 inline" />
              My Posts
            </button>
            <button
              onClick={() => setActiveTab("all-posts")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === "all-posts"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4 mr-2 inline" />
              Community
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentPosts.length > 0 ? (
              currentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                {activeTab === "my-posts" ? (
                  <>
                    <PenTool className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start sharing your thoughts and stories with the
                      community!
                    </p>
                    <Link to="/create">
                      <Button variant="gradient">Write Your First Post</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No community posts
                    </h3>
                    <p className="text-muted-foreground">
                      Be the first to contribute to the community!
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
