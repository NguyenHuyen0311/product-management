module.exports.registerPost = (req, res, next) => {
    // Nếu không điền vào ô họ tên
    if(!req.body.fullName) {
        req.flash("error", `Họ tên không được để trống!`);
        res.redirect("back");
        return;
    }

    if(!req.body.email) {
        req.flash("error", `Email không được để trống!`);
        res.redirect("back");
        return;
    }

    if(!req.body.password) {
        req.flash("error", `Mật khẩu không được để trống!`);
        res.redirect("back");
        return;
    }

    next(); // Chạy sang controller
}