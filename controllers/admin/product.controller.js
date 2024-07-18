const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model")
const Account = require("../../models/account.model")

const systemConfig = require("../../config/system");

const filterStatusHelper = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");
// [GET] /admin/products
module.exports.index = async (req, res) => {
    try {
        const filterStatus = filterStatusHelper(req.query); // Bộ lọc
        let objectSearch = searchHelper(req.query); // Tìm kiếm

        // console.log(objectSearch);

        let find = {
            deleted: false
        };

        if(req.query.status) {
            // Lọc sản phẩm theo trạng thái
            find.status = req.query.status;
        }

        // Tìm kiếm theo từ khóa
        if(req.query.keyword) {
            find.title = objectSearch.regex;
        }

        // Pagination (Phân trang) 
        let initPagination = {
            currentPage: 1,
            limitItem: 4
        };
        // Đếm sản phẩm
        const countProducts = await Product.countDocuments(find);
        // console.log(countProducts);

        const objectPagination = paginationHelper(initPagination, req.query, countProducts);

        // Sort (Sắp xếp sản phẩm theo tiêu chí khác nhau)
        let sort = {};

        if(req.query.sortKey && req.query.sortValue) {
            sort[req.query.sortKey] = req.query.sortValue;
        } else {
            sort.position = "desc";
        }
        

        const products = await Product.find(find)
            .sort(sort) // sắp xếp sản phẩm
            .limit(objectPagination.limitItem)
            .skip(objectPagination.skip);

        for (const product of products) {
            const user = await Account.findOne({
                _id: product.createdBy.account_id
            });
            // console.log(user);
            if(user) {
                product.createdBy.accountFullName = user.fullName; // tên người tạo
            }

        }

        // res.render("admin/pages/products/index", {
        //     pageTitle: "Danh sách sản phẩm",
        //     products: products,
        //     filterStatus: filterStatus,
        //     keyword: objectSearch.keyword,
        //     pagination: objectPagination
        // });


        // Tìm sản phẩm không được tìm thấy ở trang nào đó thì trở lại trang 1 và vẫn giữ nguyên keyword trên url
        // console.log(products);

        if(products.length > 0 || countProducts == 0) {
            res.render("admin/pages/products/index", {
                pageTitle: "Danh sách sản phẩm",
                products: products,
                filterStatus: filterStatus,
                keyword: objectSearch.keyword,
                pagination: objectPagination
            });
        } else {
            // console.log(req.query);
            let stringQuery = "";

            // Nối chuỗi keyword trên url
            for (const key in req.query) {
                // console.log(key);
                if(key != "page") {
                    stringQuery += `&${key}=${req.query[key]}`;
                }
            }
            // console.log(stringQuery);
            const href = `${req.baseUrl}?page=1&${stringQuery}`;
            // console.log(href);

            // Nếu không tìm thấy sản phẩm thì quay về trang 1
            // res.redirect(`/${systemConfig.prefixAdmin}/products`);
            res.redirect(href);
        }
    } catch (error) {
        res.redirect("back");
    }
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    // Thay đổi trạng thái 1 sản phẩm
    // console.log(req.params.status);
    // console.log(req.params.id);

    // Lấy ra trạng thái và id
    const status = req.params.status;
    const id = req.params.id;

    // console.log("OK");

    // Update trạng thái
    await Product.updateOne({ _id: id }, { status: status});

    // Hiển thị thông báo
    req.flash("success", "Cập nhật trạng thái thành công!");

    // Về trước đó
    res.redirect("back");
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    // console.log(req.body);

    // const {type, ids} = req.body; // Cách 1
    // Cách 2
    const type = req.body.type;
    const ids = req.body.ids.split(", "); // Lấy ra id

    // console.log(type);
    // console.log(ids);
    // console.log(ids.split(", "));

    switch (type) {
        case "active":
        case "inactive":
            await Product.updateMany({_id: {$in: ids}}, { status: type }); // Thay đổi trạng thái nhiều sản phẩn
            req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm!`); // Hiển thị thông báo
            break;
        case "delete-all":
            await Product.updateMany({_id: {$in: ids}}, { 
                deleted: true,
                deletedAt: new Date() 
            }); // Thay đổi xóa nhiều sản phẩn
            req.flash("success", `Xóa thành công ${ids.length} sản phẩm!`); // Hiển thị thông báo
            break;
        case "change-position":
            // console.log(ids);
            for (const item of ids) {
                // console.log(item.split("-"));
                const [id, position] = item.split("-");
                // console.log(id);
                // console.log(position);
                // console.log("-------------");

                await Product.updateOne({_id: id}, { position: position });
            } // Thay đổi vị trí sản phẩn
            req.flash("success", `Thay đổi vị trí thành công ${ids.length} sản phẩm!`); // Hiển thị thông báo
            break;
        default:
            break;
    }
    res.redirect("back"); // Ở lại trang hiện tại
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id; // Lấy ra id
    // console.log(id);

    // await Product.deleteOne({_id: id}); // Xóa vĩnh viễn
    
    await Product.updateOne({_id: id}, { 
        deleted: true, 
        deletedAt: new Date() // Thời gian xóa sản phẩm
    }); // Xóa mềm
    
    req.flash("success", `Xóa sản phẩm thành công!`); // Hiển thị thông báo

    res.redirect("back");
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    let find = {
        deleted: false
    }

    const records = await ProductCategory.find(find);

    const newRecords = createTreeHelper(records);

    res.render("admin/pages/products/create", {
        pageTitle: "Tạo mới sản phẩm",
        records: newRecords
    });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    // Thêm authorization -server
    // const permissions = res.locals.role.permissions;

    // if(permissions.includes("products_create")) {
            // console.log("Cho tạo mới");
    // } else {
    //     return;
    // }

    // console.log(req.body);

    // Thay đổi type dữ liệu
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if(req.body.position == "") {
        // Đếm số lượng sản phẩm trong Mongo
        const countProducts = await Product.countDocuments();
        // console.log(countProducts);
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    // console.log(req.body);

    // Log lịch sử sản phẩm
    // console.log(res.locals.user.id);
    req.body.createdBy = {
        account_id: res.locals.user.id
    };

    // Lấy đường dẫn ảnh và upload ảnh
    // if(req.file && req.file.filename) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;
    // }
    // console.log(req.file);

    // Tạo mới sản phẩm và lưu vào database
    const product = new Product(req.body);
    await product.save();

    res.redirect(`/${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        // console.log(id);

        const product = await Product.findOne({ 
            _id: id,
            deleted: false
        });
        // console.log(product);
    
        const records = await ProductCategory.find({
            deleted: false
        });
    
        const newRecords = createTreeHelper(records);
    
        res.render("admin/pages/products/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            product: product,
            records: newRecords
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] /admin/edit/:id
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    // Thay đổi type dữ liệu
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    req.body.position = parseInt(req.body.position);

    // Lấy đường dẫn ảnh và upload ảnh
    if(req.file && req.file.filename) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;
    }

    await Product.updateOne({ _id: id }, req.body);

    req.flash("success", "Cập nhật sản phẩm thành công!");

    res.redirect("back");
}

// [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const product = await Product.findOne({ 
            _id: id,
            deleted: false
        });

        res.render("admin/pages/products/detail", {
            pageTitle: "Chi tiết sản phẩm",
            product: product
        });
    } catch (error) {
        res.redirect(`/${systemConfig.prefixAdmin}/products`);
    }
}