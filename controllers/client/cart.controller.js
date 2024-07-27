const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET] /cart/
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    });

    if(cart.products.length > 0) {
        for(const item of cart.products) {
            const productId = item.product_id; // lấy id của từng sản phẩm trong giỏ hàng

            const productInfo = await Product.findOne({
                _id: productId
            }); // lấy thông tin sản phẩm

            productInfo.priceNew = productsHelper.priceNewProduct(productInfo); // giá mới
            
            item.productInfo = productInfo;

            item.totalPrice = item.quantity * productInfo.priceNew; // tổng tiền sản phẩm
        } 
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0); // tổng tiền đơn hàng

    // console.log(cart);

    res.render("client/pages/cart/index", {
        pageTitle: "Giỏ hàng",
        cartDetail: cart
    });
}

//  [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);

    const cart = await Cart.findOne({
        _id: cartId
    });

    const existProductInCart = cart.products.find(item => item.product_id == productId);
    // console.log(existProductInCart);

    if(existProductInCart) {
        // Cập nhật quantity
        console.log("OK");
        const newQuantity = quantity + existProductInCart.quantity;
        // console.log(newQuantity);

        await Cart.updateOne(
            {
                _id: cartId,
                'products.product_id': productId
            },
            {
                'products.$.quantity': newQuantity
            }
        );
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        };
    
        // console.log(cartId);
        // console.log(productId);
        // console.log(quantity);
    
        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart }
            }
        );
    }

    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công!");

    res.redirect("back");
}

//  [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;

    // console.log(productId);
    await Cart.updateOne({
        _id: cartId
    }, {
        "$pull": { products: { "product_id": productId }}
    });

    req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng");

    res.redirect("back");
}