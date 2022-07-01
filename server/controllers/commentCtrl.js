const Comment = require("../models/commentModel");
const Product = require("../models/productModel");

const commentCtrl = {
  getComments: async (req, res) => {
    try {
      const comments = await Product.findById(req.params.productId)
        .select("comments")
        .populate({
          path: "comments",
          populate: {
            path: "customerId",
            select: "firstName lastName image",
          },
        });
      res.json(comments);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createComment: async (req, res) => {
    try {
      const { content } = req.body;
      const comment = new Comment({
        customerId: req.user.id,
        content,
      });
      Product.findByIdAndUpdate(
        req.params.productId,
        {
          $push: { comments: comment._id },
        },
        (err) => {
          if (err) res.json(err);
        }
      );
      await comment.save();
      res.json({ msg: "Comment is added" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteComment: async (req, res) => {
    try {
      await Comment.findByIdAndDelete(req.params.commentId);

      Product.findByIdAndUpdate(
        req.params.productId,
        { $pull: { comments: req.params.commentId } },
        (err) => {
          if (err) res.json(err);
        }
      );
      res.json({ msg: "Comment is Deleted" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateComment: async (req, res) => {
    try {
      const { content } = req.body;
      await Comment.findOneAndUpdate(
        { _id: req.params.commentId },
        { content }
      );

      res.json({ msg: "Comment is updated" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = commentCtrl;
