module.exports = (objectPagination, query, countProducts) => {
    // console.log(req.query.page); // Số trang hiện tại

    if(query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItem;
 
    // Tổng số trang
    objectPagination.totalPage = Math.ceil(countProducts/objectPagination.limitItem);

    return objectPagination;
}