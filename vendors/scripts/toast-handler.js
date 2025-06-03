// toast-handler.js
toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    timeOut: "3000",
    extendedTimeOut: "1000",
};
console.log("okkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk")
let isToastShowing = false;

function showLoginSuccessToast(redirectUrl) {
    if (isToastShowing) return;

    isToastShowing = true;
    toastr.success("Login successful! Redirecting...", "Success");

    setTimeout(() => {
        isToastShowing = false;
        if (redirectUrl) window.location.href = redirectUrl;
    }, 3500);
}
