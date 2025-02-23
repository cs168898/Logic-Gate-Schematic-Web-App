export function sideBarFunction() {
    function openSidebar() {
        console.log("Sidebar opened");
    }

    // Corrected selection
    const sidebarIcon = document.getElementById("sidebar-icon");
    
    if (sidebarIcon) {
        sidebarIcon.addEventListener("click", openSidebar);
    } else {
        consolel.log('sidebar dont exist')
    }
}
