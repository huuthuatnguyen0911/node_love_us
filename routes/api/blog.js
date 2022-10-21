const express = require("express");
const router = express.Router();

const BlogController = require("../../app/controllers/BlogController");
const upload = require("../../app/middlewares/uploadMiddleware");

// [MIDDLEWARE]
const {
  checkAdmin,
  checkLogin,
} = require("../../app/middlewares/checkAccount");

router.put(
  "/me/:idBlog/update",
  checkLogin,
  checkAdmin,
  upload.single("main_image"),
  BlogController.updateBlog
);

router.post(
  "/create",
  checkLogin,
  checkAdmin,
  upload.single("main_image"),
  BlogController.createBlog
);

router.get(
  "/me/:idUser/draft",
  checkLogin,
  checkAdmin,
  BlogController.getBlogMeByIdUser
);

router.get(
  "/me/:idUser/count",
  checkLogin,
  checkAdmin,
  BlogController.countDocumentsDeletedWithID
);

router.get(
  "/me/:idUser/public",
  checkLogin,
  checkAdmin,
  BlogController.getBlogMeByIdUserPublic
);

router.get(
  "/me/:idBlog",
  checkLogin,
  checkAdmin,
  BlogController.getBlogWithIdBlog
);
router.get("/test_data_blog", function (req, res) {
  const query = req.query.thanh;
  console.log(query);
  res.status(200).json({
    data: query,
  });
});
router.get("/get-top-blog-with-query", BlogController.getTopBlogWithQuery);
router.get("/all", BlogController.getAllBlog);
router.get("/most-read/:authorId/:limit", BlogController.getBlogMostRead);
router.get("/get-blog-main/index", BlogController.index);
router.get(
  "/count-blog-with-year/:year",
  BlogController.countBlogWithMonthAndYear
);
router.delete(
  "/me/:idBlog/delete",
  checkLogin,
  checkAdmin,
  BlogController.deleteBlog
);
router.get("/:slugBlog", BlogController.getBlogWithSlug);

module.exports = router;
