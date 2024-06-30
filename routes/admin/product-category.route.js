const express = require("express");
const multer = require("multer");
const route = express.Router();

// Upload file ảnh
const upload = multer();

const controller = require("../../controllers/admin/product-category.controller");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

route.get("/", controller.index);

// Phương thức get thêm mới danh mục sản phẩm
route.get("/create", controller.create);

// Phương thức post thêm mới danh mục sản phẩm
route.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.createPost
);

// Phương thức get chỉnh sửa danh mục sản phẩm
route.get("/edit/:id", controller.edit);

// Phương thức post chỉnh sửa danh mục sản phẩm
route.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  controller.editPatch
);

module.exports = route;
