import Comment from "../models/commentSchema.js";

// Get all comments
export const getCommentData = async (req, res) => {
    try {
        // Retrieve all comments from the database and return the comments
        const comments = await Comment.find({});

        return res.status(200).json(comments);
        
    } catch (error) {
        console.error("Error fetching comments:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



// Create a new comment entry
export const createComment = async (req, res) => {
    try {
        // Extract comment data from request body
        const { commenter, comment } = req.body;

        // Check if a comment entry with the same commenter and comment already exists
        const existingComment = await Comment.findOne({ commenter, comment });

        if (existingComment) {
            return res.status(400).json({ message: "Comment with the same commenter and comment already exists" });
        }

        // Create a new comment with likes set to 0 by default and save it to datbase
        const newComment = new Comment({ commenter, comment, likes: 0 });
        await newComment.save();

        return res.status(201).json({ message: "Comment created successfully" });

    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



// Update Likes of a comment
export async function updateLikes(req, res) {
    try {
        // Find the comment by its ID  and if not found, return 404 Not Found
        const comment = await Comment.findById(req.params.id);        
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Increment the likes count for the comment and save the updated comment
        comment.likes = comment.likes + 1;
        
        const updatedComment = await comment.save();

        // Return the updated comment
        return res.json(updatedComment);

    } catch (error) {
        console.error("Error updating likes:", error);
        return res.status(400).json({ message: error.message });
    }
}




// Delete an existing comment entry
export const deleteComment = async (req, res) => {
    try {
        // Extract comment ID from request parameters
        const _id = req.params.id;

        // Find the comment entry by ID and if the comment entry does not exist, return 404 Not Found
        const existingComment = await Comment.findById(_id);
        
        if (!existingComment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Delete the comment entry from the database and return success message
        await existingComment.deleteOne();
        
        return res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error) {
        console.error("Error deleting comment:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};