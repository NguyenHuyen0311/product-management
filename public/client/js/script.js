// Show Alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time")) || 3000; // Lấy thời gian

    const closeAlert = showAlert.querySelector("[close-alert]") // Lấy nút x
    
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time); // hết time là ẩn

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    }); // click x là ẩn
}

// Button Go Back
const buttonGoBack = document.querySelectorAll("[button-go-back]");
if(buttonGoBack.forEach(button => {
    button.addEventListener("click", () => {
        history.back();
    });
}));
