
export function showToast(message, status="error") {
    const toast = document.createElement("div");
    const toastStyle = toast.style;
    toast.innerText = message;
    toastStyle.position = "fixed";
    toastStyle.padding = "10px 15px";
    switch (status){
        case "error":
            toastStyle.background = "red";
            break;

        case "success":
            toastStyle.background = "green"
            break;

        default:
        toastStyle.background = "red"; // Optional default case
    }

    toastStyle.color = "white";
    toastStyle.borderRadius = "5px";
    toastStyle.zIndex = "1000";
    toastStyle.opacity = "0.8";
    toastStyle.transition = "opacity 0.3s ease";
    toastStyle.top = "12%";
    toastStyle.left = "50%";
    toastStyle.transform = "translate(-50%, -50%)";
    toastStyle.fontSize = "large"
    toastStyle.zIndex = "999"
    
    


    document.body.appendChild(toast);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        toastStyle.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}
