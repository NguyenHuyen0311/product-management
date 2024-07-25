const Cart = require("../../models/cart.model");

module.exports.cartId = async (req, res, next) => {
    if(!req.cookies.cartId) {
        const cart = new Cart(); // Tạo ra giỏ hàng
        await cart.save(); // lưu vào database

        const expiresTime = 1000 * 60 * 60 * 24 * 365; // 1 năm

        console.log(cart);
        res.cookie("cartId", cart.id, {
            expires: new Date(Date.now() + expiresTime)
        });
    } else {
        // Khi đã có giỏ hàng
    }

    next();
}