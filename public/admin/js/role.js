// Permissions
const tablePermissions = document.querySelector("[table-permissions]");
// console.log(tablePermissions);

if(tablePermissions) {
    const buttonSubmit = document.querySelector("[button-submit]"); // lấy button cập nhật
    // console.log(buttonSubmit);

    buttonSubmit.addEventListener("click", () => {
        let result = [];

        const rows = tablePermissions.querySelectorAll("[data-name]"); // lấy ra tất cả các hàng của bảng
        // console.log(rows);

        rows.forEach(row => {
            const name = row.getAttribute("data-name"); // lấy ra tên từng hàng
            // console.log(name);
            const inputs = row.querySelectorAll("input"); // lấy ra tất cả ô input
            // console.log(inputs);
            if(name == "id") {
                inputs.forEach(input => {
                    const value = input.value; // lấy id của ô input
                    result.push({
                        id: value,
                        permissions: []
                    });
                })
            } else {
                inputs.forEach((input, index) => {
                    const checked = input.checked; // ô input đã check
                    // console.log(name);
                    // console.log(checked);
                    // console.log(index);
                    // console.log("-----------------------");

                    if(checked) {
                        result[index].permissions.push(name); // thêm tên vào mảng permissions
                    }
                })
            }
        });

        // console.log(result);
        // console.log(JSON.stringify(result)); // chuyển mảng kết quả thành string

        const formChangePermissions = document.querySelector("#form-change-permissions") // lấy ra form
        const inputPermissions = formChangePermissions.querySelector("input"); // lấy ô input ở form
        // console.log(inputPermissions);
        inputPermissions.value = JSON.stringify(result); // gán giá trị cho ô input
        formChangePermissions.submit(); 
    });
}

// Permissions Data Default
const dataRecords = document.querySelector("[data-records]"); // lấy ra data các ô được chọn
// console.log(dataRecords); 

if(dataRecords) {
    const records = JSON.parse(dataRecords.getAttribute("data-records")); // lấy ra data và chuyển thành mảng javascript
    // console.log(records);
    const tablePermissions = document.querySelector("[table-permissions]"); // lấy ra bảng

    records.forEach((record, index) => {
        const permissions = record.permissions;
        // console.log(record.title);
        // console.log(index);
        // console.log(permissions);
        
        permissions.forEach(permissions => {
            const row = tablePermissions.querySelector(`tr[data-name="${permissions}"]`); // lấy ra hàng có data tương ứng
            // console.log(row);
            const input = row.querySelectorAll("input")[index]; // lấy ra ô input tương ứng
            // console.log(input);
            input.checked = true; // ô input được check
        });
        // console.log("--------------------");
    });
}
