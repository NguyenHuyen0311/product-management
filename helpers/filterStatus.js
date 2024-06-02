module.exports = (query) => {
    // console.log(req.query.status);
    let filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ];

    // Trạng thái của nút bấm active
    if(query.status) {
        const index = filterStatus.findIndex((item) => {
            return item.status == query.status;
        });

        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex((item) => {
            return item.status == "";
        });

        filterStatus[index].class = "active";
    }

    // console.log(filterStatus);

    return filterStatus;
}