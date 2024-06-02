// Button Status
const buttonsStatus = document.querySelectorAll("[button-status]");
if(buttonsStatus.length > 0) {
    // Lấy đường dẫn
    let url = new URL(window.location.href);

    buttonsStatus.forEach(button => {
        button.addEventListener("click", () => {
            // Lấy trạng thái của button
            const status = button.getAttribute("button-status");

            // Cập nhật trạng thái button trên Url
            if(status != "") {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            // Chuyển hướng trang
            window.location.href = url.href;
        });
    });
}

// Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch) {
    // Lấy đường dẫn
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e) => {
        e.preventDefault(); // Hàm ngăn ngừa hành vi mặc định để k load lại trang web

        const value = e.target.elements.keyword.value; // Giá trị trong ô tìm kiếm
        // console.log(value);

        if(value != "") {
            url.searchParams.set("keyword", value);
        } else {
            url.searchParams.delete("keyword");
        }

        // Chuyển hướng trang
        window.location.href = url.href;
    });
}

// Pagination (Phân trang)
const buttonPagination = document.querySelectorAll("[button-pagination]"); // Lấy tất cả button
// console.log(buttonPagination);
if(buttonPagination.length > 0) {
    let url = new URL(window.location.href);

    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            // console.log(button);

            // Lấy số trang
            const page = button.getAttribute("button-pagination");
            // console.log(page);
            
            // Update số trang trên url
            url.searchParams.set("page", page);

            window.location.href = url.href;
        });
    });
}

// Change Status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector("#form-change-status"); // Lấy ra form đó
    const path = formChangeStatus.getAttribute("data-path"); // Lấy ra path
    // console.log(path);

    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            // Lấy ra trạng thái hiện tại
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");
            // console.log(statusCurrent);
            // console.log(id);

            // Thay đổi trạng thái
            const statusChange = statusCurrent == "active" ? "inactive" : "active";

            // Thêm đường dẫn vào action
            const action = path + `/${statusChange}/${id}?_method=PATCH`;

            // Update thuộc tính action trong form
            formChangeStatus.action = action; // Cách 1
            // formChangeStatus.setAttribute("action", action); // Cách 2

            // Thay thế nút Gửi đi để thay đổi trạng thái
            formChangeStatus.submit();

            // console.log(action);
            // console.log(statusChange);
            // console.log(id);
        });
    })
}

// CheckboxMulti
const checkboxMulti = document.querySelector("[checkbox-multi]");
// console.log(checkboxMulti);
if(checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

    // console.log(inputCheckAll);
    // console.log(inputsId);

    // Tích tất cả
    inputCheckAll.addEventListener("click", () => {
        // console.log(inputCheckAll.checked);
        if(inputCheckAll.checked) {
            inputsId.forEach(input => {
                input.checked = true; // ô input được tích vào
            });
        } else {
            inputsId.forEach(input => {
                input.checked = false; 
            });
        }
    });

    // Tích từng ô
    inputsId.forEach(input => {
        input.addEventListener("click", () => {
            // console.log(input);
            const countChecked = checkboxMulti.querySelectorAll(
                "input[name='id']:checked"
            ).length; // Đếm số lượng ô input đã check
            // console.log(countChecked);
            // console.log(inputsId.length); // Số lượng phần tử trên giao diện

            // Kiểm tra số lượng phần tử được check với số lượng phần tử ngoài giao diện
            if(countChecked == inputsId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}

// form-change-multi
const formChangeMulti = document.querySelector("[form-change-multi]");
// console.log(formChangeMulti);
if(formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault(); // Ngăn chặn sự kiện mặc định (ở đây là chuyển trang)

        const checkboxMulti = document.querySelector("[checkbox-multi]");

        // Lấy ra những ô input đã check
        const inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        );
        // console.log(inputsChecked)

        // console.log(e.target.elements.type.value);

        const typeChange = e.target.elements.type.value;

        // Nếu chọn xóa tất cả 
        if(typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc muốn xóa những bản ghi này không?");
            // console.log(isConfirm);

            // Nếu không xóa
            if(!isConfirm) {
                return;
            }
        }

        // Nếu chọn có xóa
        if(inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']"); // Lấy id của ô input

            inputsChecked.forEach(input => {
                // console.log(input.value);
                const id = input.value;

                if(typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value; // Tìm thẻ cha tr và lấy vị trí
                    ids.push(`${id}-${position}`); 
                } else {
                    ids.push(id); 
                }
            });

            // console.log(ids.join(", ")); // In ra chuỗi id

            inputIds.value = ids.join(", "); // Insert id lên ô input

            // console.log(ids);

            formChangeMulti.submit(); // Submit form
        } else {
            alert("Vui lòng chọn ít nhất một bản ghi");
        }
    });
}

// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if(buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item"); // Lấy ra form đó
    const path = formDeleteItem.getAttribute("data-path"); // Lấy ra path

    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const confirmDelete = confirm("Bạn có chắc muốn xóa bản ghi này?");
            
            if(confirmDelete) {
                const id = button.getAttribute("data-id"); // Lấy ra id

                // Thêm đường dẫn vào action
                const action = path + `/${id}?_method=DELETE`;

                // Update thuộc tính action trong form
                formDeleteItem.action = action;

                formDeleteItem.submit();
            }
        });
    })
}

// Show Alert
const showAlert = document.querySelector("[show-alert]");
// console.log(showAlert);
if(showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time")) || 3000; // Lấy thời gian
    // console.log(time);
    
    const closeAlert = showAlert.querySelector("[close-alert]") // Lấy nút x
    
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time); // hết time là ẩn

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    }); // click x là ẩn
}

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
// console.log(uploadImage);

if(uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

    // console.log(uploadImageInput)
    // console.log(uploadImagePreview)

    uploadImageInput.addEventListener("change", (e) => {
        // console.log(e);
        if(e.target.files.length) {
            const image = URL.createObjectURL(e.target.files[0]); // Tạo ra URL tạm thời từ ảnh
            uploadImagePreview.src = image; // Gán đường dẫn
        }
    });
}