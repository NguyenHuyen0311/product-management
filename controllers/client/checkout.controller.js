const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products");

// [GET] /checkout/
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

    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    });
}