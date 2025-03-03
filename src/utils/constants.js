export const VITE_APP_BASE_URL = "http://localhost:8001/api/v1/";
export const VITE_APP_FRONT_URL = "http://localhost:5173/";

export const capitalizeFirstLetter = (string) => {
    if (string.length === 0) return "";
    return string.charAt(0).toUpperCase() + string.slice(1);
};