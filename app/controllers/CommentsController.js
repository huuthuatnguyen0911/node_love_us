const mongoose = require("mongoose");

const commentModel = require("../models/Comments");

class CommentsController {
  // [POST] /comment/create
  createComment(req, res) {
    const formData = req.body;

    const newComment = new commentModel(formData);

    newComment
      .save()
      .then((comment) => {
        if (comment) {
          res.status(200).json({
            mess: "Create comment successfully",
            code: "create_comment_success",
            success: true,
          });
        }
      })
      .catch((error) => {
        return res.status(500).json({
          message: `Error of server ${error.message}`,
          code: "errour_server",
          success: false,
        });
      });
  }

  // [GET] /comment/:idBlog
  getCommentWithIdBlog(req, res) {
    const idBlog = req.params.idBlog;

    commentModel
      .aggregate([
        {
          $match: {
            blog_id: new mongoose.Types.ObjectId(idBlog),
            parent_id: {
              $eq: new mongoose.Types.ObjectId("000000000000000000000000"),
            },
          },
        },
        {
          $lookup: {
            from: "comments",
            localField: "_id",
            foreignField: "parent_id",
            as: "listChildrenComments",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "listChildrenComments.commentator_id",
            foreignField: "_id",
            as: "dataChildrentrUser",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "commentator_id",
            foreignField: "_id",
            as: "dataParentUser",
          },
        },
        {
          $project: {
            _id: 1,
            content: 1,
            createdAt: 1,
            "listChildrenComments._id": 1,
            "listChildrenComments.commentator_id": 1,
            "listChildrenComments.content": 1,
            "listChildrenComments.createdAt": 1,
            "dataChildrentrUser._id": 1,
            "dataChildrentrUser.avatar": 1,
            "dataChildrentrUser.name": 1,
            "dataParentUser._id": 1,
            "dataParentUser.avatar": 1,
            "dataParentUser.name": 1,
          },
        },
        {
          $sort: { createdAt: 1 },
        },
      ])
      .then((mainComment) => {
        commentModel
          .find({ blog_id: idBlog })
          .count()
          .then((count) => {
            res.status(200).json({
              message: `Get all comment with id blog`,
              data: {
                dataComment: mainComment,
                countComment: count,
              },
              code: "get_all_comment_id",
              success: true,
            });
          });
      })
      .catch((error) => {
        return res.status(500).json({
          message: `Error of server ${error.message}`,
          code: "errour_server",
          success: false,
        });
      });
  }
}

module.exports = new CommentsController();
