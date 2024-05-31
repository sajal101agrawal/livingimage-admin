export const logout = () => {
    localStorage.clear();
    window.location.href = '/login';
    console.log("Logging out ...")
}