import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../context/AuthContext";
import { PenTool, TrendingUp, Users, BookOpen } from "lucide-react";

export const HeroSection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 hero-gradient opacity-90" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />

      <div className="relative container max-w-7xl mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Share Your
              <span className="text-gradient block mt-2">Stories</span>
              with the World
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              A modern platform for writers and readers. Create compelling
              content, engage with the community, and grow your audience.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link to="/create">
                <Button
                  size="lg"
                  variant="gradient"
                  className="w-full sm:w-auto"
                >
                  <PenTool className="mr-2 h-5 w-5" />
                  Start Writing
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button
                    size="lg"
                    variant="gradient"
                    className="w-full sm:w-auto"
                  >
                    <PenTool className="mr-2 h-5 w-5" />
                    Start Writing
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-background/10 border-foreground/20 text-foreground hover:bg-background/20"
                  >
                    <BookOpen className="mr-2 h-5 w-5" />
                    Explore Posts
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-foreground/20">
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
              </div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-foreground/80">Stories Published</div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <Users className="h-8 w-8 text-primary mb-2" />
              </div>
              <div className="text-3xl font-bold">5K+</div>
              <div className="text-foreground/80">Active Writers</div>
            </div>
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center">
                <BookOpen className="h-8 w-8 text-primary mb-2" />
              </div>
              <div className="text-3xl font-bold">50K+</div>
              <div className="text-foreground/80">Monthly Readers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
