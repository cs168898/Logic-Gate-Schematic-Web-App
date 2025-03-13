
export function showToast(message) {
    const toast = document.createElement("div");
    toast.innerText = message;
    toast.style.position = "fixed";
    toast.style.padding = "10px 15px";
    toast.style.background = "red";
    toast.style.color = "white";
    toast.style.borderRadius = "5px";
    toast.style.zIndex = "1000";
    toast.style.fontSize = "14px";
    toast.style.opacity = "0.9";
    toast.style.transition = "opacity 0.3s ease";
    toast.style.top = "10%";
    toast.style.left = "50%";
    toast.style.transform = "translate(-50%, -50%)";


    document.body.appendChild(toast);

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
        toast.style.opacity = "0";
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}
