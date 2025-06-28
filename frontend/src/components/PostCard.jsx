import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { formatRelativeTime, truncateText } from "../lib/utils";
import { User, Calendar, Eye, Lock } from "lucide-react";

export const PostCard = ({ post, isPreview = false }) => {
  const isLocked = isPreview && !post.isPublic;
  //console.log("Post username:", post.userId.username);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link to={`/post/${post._id}`}>
              <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h3>
            </Link>
            <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
              {truncateText(post.content || post.excerpt, 120)}
            </p>
          </div>
          {isLocked && (
            <Lock className="h-4 w-4 text-muted-foreground ml-2 flex-shrink-0" />
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{post.userId.username || "Anonymous"}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{formatRelativeTime(post.createdAt)}</span>
            </div>
            {post.views && (
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{post.views}</span>
              </div>
            )}
          </div>

          {isLocked ? (
            <Button variant="outline" size="sm" disabled>
              <Lock className="h-3 w-3 mr-1" />
              Login to Read
            </Button>
          ) : (
            <Link to={`/post/${post._id}`}>
              <Button variant="ghost" size="sm" className="text-primary">
                Read More
              </Button>
            </Link>
          )}
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
