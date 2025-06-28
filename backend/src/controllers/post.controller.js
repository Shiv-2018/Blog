import { Post } from "../models/post.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create a new post
const createPost = asyncHandler(async (req, res) => {
  const { title, content, img, tags, isPublic } = req.body;
  const userId = req.user._id;

  if (!title && !content) {
    throw new ApiError(400, "Title or content is required to create a post");
  }

  const newPost = await Post.create({
    userId,
    title,
    content,
    img,
    tags: tags || [],
    isPublic: isPublic !== undefined ? isPublic : true,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newPost, "Post created successfully"));
});

// Get a post by ID
const getPostById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Fetching post with ID:", id);

    // First check if the post exists and what userId contains
    //const rawPost = await Post.findById(id);
    // console.log("Raw post:", rawPost);
    // console.log("Raw post userId:", rawPost?.userId);
    // console.log("UserId type:", typeof rawPost?.userId);

    // Try population with more explicit options
    const post = await Post.findById(id).populate({
      path: "userId",
      select: "username email", // Add more fields to see if it works
      model: "User", // Explicitly specify the model
    });

    //console.log("After population - userId:", post?.userId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, post, "Post fetched successfully"));
  } catch (error) {
    console.error("Error in getPostById:", error);
    throw new ApiError(500, `Failed to fetch post: ${error.message}`);
  }
});

// Like/Dislike a post
const toggleLikePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  const userId = req.user._id.toString();
  const isLiked = post.likes.includes(userId);

  if (isLiked) {
    // Unlike
    post.likes = post.likes.filter((id) => id.toString() !== userId);
    await post.save();
    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: false }, "Post unliked"));
  } else {
    // Like
    post.likes.push(userId);
    await post.save();
    return res
      .status(200)
      .json(new ApiResponse(200, { isLiked: true }, "Post liked"));
  }
});
// -------------------------------------------------------------------
// Delete a post
const deletePost = asyncHandler(async (req, res) => {
  //console.log("Deleting post with ID:", req.params.id);
  const post = await Post.findById(req.params.id);

  if (!post) {
    throw new ApiError(404, "Post not found");
  }

  // console.log("post:", post);
  // console.log("post userID:", post.userId);
  // console.log("req.user:", req.user);
  // console.log("req.user._id:", req.user._id);

  if (post.userId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can delete only your own post");
  }

  await post.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Post deleted successfully"));
});
//------------------------------------------------------------------
// Get all posts of a user
const getUserPosts = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const posts = await Post.find({ userId })
    .populate("userId", "username")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, posts, "User posts fetched successfully"));
});

// Get all posts
// const getPosts = asyncHandler(async (req, res) => {
//   const posts = await Post.find({ isPublic: true })
//     .populate("userId", "username")
//     .sort({ createdAt: -1 });

//   return res
//     .status(200)
//     .json(new ApiResponse(200, posts, "Posts fetched successfully"));
// });
//------------------------------------------------------------------
const getAllPosts = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ isPublic: true })
      .populate("userId", "username avatar") // Add avatar if you have it
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments({ isPublic: true });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          posts,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalPosts / limit),
            totalPosts,
            hasNextPage: page < Math.ceil(totalPosts / limit),
            hasPrevPage: page > 1,
          },
        },
        "Posts fetched successfully"
      )
    );
  } catch (error) {
    console.error("Error in getPosts:", error);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch posts"));
  }
});
//-----------------------------------------------------------------
const getPublicPosts = asyncHandler(async (req, res) => {
  try {
    console.log("Fetching public posts...");
    const posts = await Post.find({ isPublic: true })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 })
      .limit(6);

    console.log("Fetched posts:", posts);
    return res
      .status(200)
      .json(new ApiResponse(200, posts, "Public posts fetched successfully"));
  } catch (error) {
    console.error("Error in getPublicPosts:", error.message, error.stack);
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to fetch public posts"));
  }
});

export {
  createPost,
  getPostById,
  toggleLikePost,
  deletePost,
  getUserPosts,
  getAllPosts,
  getPublicPosts,
};
