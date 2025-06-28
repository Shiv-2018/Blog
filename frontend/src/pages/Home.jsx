import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HeroSection } from "../components/HeroSection";
import { PostCard } from "../components/PostCard";
import { Button } from "../components/ui/button";
import { LoadingSpinner } from "../components/ui/loading";
import { useAuth } from "../context/AuthContext";
import apiService from "../services/api";
import { TrendingUp, Clock, Star } from "lucide-react";

export const Home = () => {
  const [publicPosts, setPublicPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("public");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPosts();

    if (isAuthenticated) {
      setActiveTab("all");
    } else {
      setActiveTab("public");
    }
  }, [isAuthenticated]);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      if (isAuthenticated) {
        const allPostsData = await apiService.getAllPosts();
        console.log("All posts data:", allPostsData);
        setAllPosts(allPostsData.data.data.posts || []);
      } else {
        const publicPostsData = await apiService.getPublicPosts();
        console.log("Public posts data:", publicPostsData);
        setPublicPosts(publicPostsData.data.data.posts || []);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const currentPosts = activeTab === "public" ? publicPosts : allPosts;
  console.log("Current posts:", currentPosts);

  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      {/* Featured Posts Section */}
      <section className="py-16 lg:py-24">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Discover Amazing Stories
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the latest posts from our community of talented writers
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center p-1 bg-muted rounded-lg">
              <button
                onClick={() => setActiveTab("public")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === "public"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Star className="h-4 w-4 mr-2 inline" />
                Featured
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    activeTab === "all"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <TrendingUp className="h-4 w-4 mr-2 inline" />
                  Latest
                </button>
              )}
            </div>
          </div>

          {/* Posts Grid */}
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {currentPosts.length > 0 ? (
                  currentPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      isPreview={!isAuthenticated}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Be the first to share your story with the community!
                    </p>
                    {isAuthenticated && (
                      <Link to="/create">
                        <Button variant="gradient">
                          Write Your First Post
                        </Button>
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* View More Button */}
              {currentPosts.length > 0 && (
                <div className="text-center">
                  {isAuthenticated ? (
                    <Link to="/dashboard">
                      <Button variant="outline" size="lg">
                        View All Posts
                      </Button>
                    </Link>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Login to access all posts and start writing
                      </p>
                      <div className="flex justify-center gap-4">
                        <Link to="/login">
                          <Button variant="outline">Login</Button>
                        </Link>
                        <Link to="/register">
                          <Button variant="gradient">Get Started</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 bg-gradient-to-r from-primary/10 to-blue-600/10">
          <div className="container max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Writing?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our community of writers and share your unique perspective
              with the world
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button
                  size="lg"
                  variant="gradient"
                  className="w-full sm:w-auto"
                >
                  Create Account
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
