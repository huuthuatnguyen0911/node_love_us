const mongoose = require("mongoose");
const ResponseModel = require("../models/ResponseModel");

const blogModel = require("../models/Blog");

class BlogController {
  // [GET] /blog/get-blog-main
  index(req, res) {
    const blogSortDesc = blogModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "dataAuthor",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          main_image: 1,
          list_category: 1,
          content: 1,
          countEye: 1,
          status: 1,
          createdAt: 1,
          slug: 1,
          "dataAuthor._id": 1,
          "dataAuthor.avatar": 1,
          "dataAuthor.name": 1,
        },
      },
    ]);

    const listAuthors = blogModel.aggregate([
      {
        $sort: { countEye: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "dataAuthor",
        },
      },
      {
        $project: {
          "dataAuthor._id": 1,
          "dataAuthor.avatar": 1,
          "dataAuthor.name": 1,
        },
      },
    ]);

    const blogOfAuthorMostRead = blogModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "authorId",
          foreignField: "_id",
          as: "dataAuthor",
        },
      },
      {
        $sort: { countEye: -1 },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 1,
          title: 1,
          main_image: 1,
          list_category: 1,
          countEye: 1,
          status: 1,
          createdAt: 1,
          slug: 1,
          "dataAuthor._id": 1,
          "dataAuthor.avatar": 1,
          "dataAuthor.name": 1,
        },
      },
    ]);

    const blogMostRead = blogModel.aggregate([
      {
        $limit: 10,
      },
    ]);

    Promise.all([blogSortDesc, listAuthors, blogOfAuthorMostRead, blogMostRead])
      .then(
        ([
          dataSortDesc,
          dataAuthors,
          datablogOfAuthorMostRead,
          dataBlogMostRead,
        ]) => {
          return res.status(200).json({
            data: {
              sortDescBlogs: dataSortDesc,
              authors: [...dataAuthors],
              datablogOfAuthorMostRead: datablogOfAuthorMostRead,
              blogModelReads: dataBlogMostRead,
            },
            success: true,
          });
        }
      )
      .catch((error) => {
        return res.status(500).json({
          message: `Error of server ${error.message}`,
          code: "errour_server",
          success: false,
        });
      });
  }

  // [POST] /blog/create
  createBlog(req, res) {
    const formData = req.body;
    const image = req.file.filename;

    const formDataBlogNew = {
      main_image: `images/${image}`,
      title: formData.title,
      list_category: formData.list_category,
      content: formData.content,
      status: formData.status,
      authorId: formData.authorId,
    };

    const blogModelNew = new blogModel(formDataBlogNew);

    blogModelNew
      .save()
      .then((blog) => {
        res.status(200).json({
          mess: "Create blog successfully",
          code: "create_blog_success",
          success: true,
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

  // [GET] /blog/me/:id
  getBlogMeByIdUser(req, res) {
    const idUser = req.params.idUser;

    blogModel
      .aggregate([
        {
          $match: {
            authorId: new mongoose.Types.ObjectId(idUser),
            status: { $eq: false },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "dataAuthor",
          },
        },
        {
          $sort: { createdAt: 1 },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            main_image: 1,
            content: 1,
            createdAt: 1,
            slug: 1,
            "dataAuthor._id": 1,
            "dataAuthor.avatar": 1,
            "dataAuthor.name": 1,
          },
        },
      ])
      .then((docs) => {
        res.status(200).json({
          message: `Get all blog of me admin`,
          data: docs,
          code: "get_all_admin",
          success: true,
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

  // [GET] /blog/me/:idUser/public
  getBlogMeByIdUserPublic(req, res) {
    const idUser = req.params.idUser;

    blogModel
      .aggregate([
        {
          $match: {
            authorId: new mongoose.Types.ObjectId(idUser),
            status: { $eq: true },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "dataAuthor",
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            main_image: 1,
            content: 1,
            createdAt: 1,
            slug: 1,
            "dataAuthor._id": 1,
            "dataAuthor.avatar": 1,
            "dataAuthor.name": 1,
          },
        },
      ])
      .then((docs) => {
        res.status(200).json({
          message: `Get all blog of me admin`,
          data: docs,
          code: "get_all_admin",
          success: true,
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

  // [GET] /blog/me/:idUser/count
  countDocumentsDeletedWithID(req, res) {
    const idUser = req.params.idUser;

    blogModel
      .countDocumentsDeleted({
        authorId: new mongoose.Types.ObjectId(idUser),
      })
      .then((deleteCount) => {
        res.status(200).json({
          message: `Count successfully`,
          code: "count_success",
          data: {
            countDelete: deleteCount,
          },
          success: true,
        });
      });
  }

  // [GET] /blog/me/:idBlog
  getBlogWithIdBlog(req, res) {
    const idBlog = req.params.idBlog;

    blogModel
      .findById(idBlog)
      .then((data) => {
        res.status(200).json({
          message: `Find  blog with id successfully`,
          data: data,
          code: "find_blog_id_success",
          success: true,
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

  // [PUT] /blog/me/:idBlog/update
  updateBlog(req, res) {
    const idBlog = req.params.idBlog;

    const formData = req.body;
    // const image = req.file.filename;

    if (!req.file) {
      const dataBlogsNew = {
        title: formData.title,
        list_category: formData.list_category,
        content: formData.content,
        status: formData.status,
      };
      blogModel
        .updateOne({ _id: idBlog }, dataBlogsNew)
        .then(() => {
          res.status(200).json({
            mess: "Update blog successfully",
            code: "update_blog_success",
            success: true,
          });
        })
        .catch((error) => {
          return res.status(500).json({
            message: `Error of server ${error.message}`,
            code: "errour_server",
            success: false,
          });
        });
    } else {
      const image = req.file.filename;

      const dataBlogsNew = {
        main_image: `images/${image}`,
        title: formData.title,
        list_category: formData.list_category,
        content: formData.content,
        status: formData.status,
      };

      blogModel
        .updateOne({ _id: idBlog }, dataBlogsNew)
        .then(() => {
          res.status(200).json({
            mess: "Update blog successfully",
            code: "update_blog_success",
            success: true,
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

  // [GET] /blog/all
  getAllBlog(req, res) {
    blogModel
      .aggregate([
        {
          $match: {
            status: { $eq: true },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "dataAuthor",
          },
        },
        {
          $sort: { createdAt: 1 },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            main_image: 1,
            content: 1,
            createdAt: 1,
            slug: 1,
            "dataAuthor._id": 1,
            "dataAuthor.avatar": 1,
            "dataAuthor.name": 1,
          },
        },
      ])
      .then((docs) => {
        res.status(200).json({
          message: `Get all blog`,
          data: docs,
          code: "get_all_admin",
          success: true,
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

  // [GET] /blog/:slugBlog
  getBlogWithSlug(req, res) {
    const slug_blog = req.params.slugBlog;

    blogModel
      .aggregate([
        {
          $match: {
            slug: slug_blog,
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "authorId",
            foreignField: "_id",
            as: "dataAuthor",
          },
        },
        { $limit: 1 },
        {
          $project: {
            _id: 1,
            title: 1,
            main_image: 1,
            list_category: 1,
            countEye: 1,
            content: 1,
            createdAt: 1,
            slug: 1,
            "dataAuthor._id": 1,
            "dataAuthor.avatar": 1,
            "dataAuthor.name": 1,
          },
        },
      ])
      .then((blog) => {
        res.status(200).json({
          message: `Get blog with slug successfully`,
          code: "get_blog_slug_success",
          data: blog,
          success: true,
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

  // [GET] /blog/most-read/:authorId/:limit
  getBlogMostRead(req, res) {
    const authorId = req.params.authorId;
    const limit = req.params.limit;

    if (authorId == "all") {
      blogModel
        .find({})
        .limit(limit)
        .sort({ countEye: "desc" })
        .then((blogs) => {
          return res.status(200).json({
            code: "get_blog_most_read_success",
            data: blogs,
            success: true,
          });
        })
        .catch((error) => {
          return res.status(500).json({
            message: `Error of server ${error.message}`,
            code: "errour_server",
            success: false,
          });
        });
    } else {
      blogModel
        .find({ authorId: authorId })
        .limit(limit)
        .sort({ countEye: "desc" })
        .then((blogs) => {
          return res.status(200).json({
            message: `Get all blog most read successfully`,
            code: "get_blog_most_read_success",
            data: blogs,
            success: true,
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

  // [GET] /blog/getBlogWithQuery?limit={limit}&idAuthor={idAuthor}&sortName={sortName}&sort={sort}
  getTopBlogWithQuery(req, res) {
    const limit = req.query.limit || "";
    const idAuthor = req.query.idAuthor || "";

    if (req.query) {
      blogModel
        .find({})
        .limit(limit)
        .sort({ countEye: "desc" })
        .then((blogs) => {
          return res.status(200).json({
            message: `Get all blog most read successfully`,
            code: "get_blog_most_read_success",
            data: blogs,
            success: true,
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

  // [GET] /blog/count-blog-with-year/:year
  countBlogWithMonthAndYear(req, res) {
    const year = req.params.year;
    blogModel
      .aggregate([
        {
          $project: {
            yearRe: { $year: "$createdAt" },
            monthRe: { $month: "$createdAt" },
          },
        },
        {
          $match: {
            yearRe: parseInt(year),
          },
        },
        {
          $group: {
            _id: "$monthRe",
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ])
      .then((data) => {
        res.status(200).json(ResponseModel(true, "Count blog with year", data));
      })
      .catch((err) => {
        res.status(500).json(ResponseModel(false, err.message, ""));
      });
  }

  // [DELETE] /blog/me/:idBlog/delete
  deleteBlog(req, res) {
    const idBlog = req.params.idBlog;

    blogModel
      .delete({ _id: idBlog })
      .then(() => {
        res.status(200).json({
          message: `Delete successfully`,
          code: "delete_success",
          success: true,
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

module.exports = new BlogController();
