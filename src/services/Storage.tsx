export const setUserData = (data:any) => {
    localStorage.setItem('idToken',data);
}

export const getUserData = () => {
    localStorage.getItem('idToken');
}

export const removeUserData = () => {
    localStorage.removeItem('idToken');
}