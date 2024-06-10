const ProductCategory = require("../../models/product-category.model")

const systemConfig = require("../../config/system");

const createTreeHelper = require("../../helpers/createTree");

// [GET] /admin/products-category
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper(records);

    res.render("admin/pages/products-category/index", {
        pageTitle: "Danh mục sản phẩm",
        records: newRecords
    });
}

// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper(records);

    // console.log(records);
    // console.log(newRecords);

    res.render("admin/pages/products-category/create", {
        pageTitle: "Tạo danh mục sản phẩm",
        records: newRecords
    });
}

// [POST] /admin/products-category/create
module.exports.createPost = async (req, res) => {
    if(req.body.position == "") {
        // Đếm số lượng sản phẩm trong Mongo
        const countRecords = await ProductCategory.countDocuments();
        // console.log(countRecords);
        req.body.position = countRecords + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    // Tạo mới sản phẩm và lưu vào database
    const record = new ProductCategory(req.body);
    await record.save();

    res.redirect(`/${systemConfig.prefixAdmin}/products-category`);
}
