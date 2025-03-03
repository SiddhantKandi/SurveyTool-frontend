import { toast } from "react-toastify";

export const showLoadingToast = (message) => {
    return toast.loading(message, {
        position: "bottom-right",
        autoClose: false, 
        hideProgressBar: false,
    });
};


export const updateToast = (toastId, message, type) => {
    toast.update(toastId, {
        render: message,
        type: type,
        autoClose: 1000, 
        hideProgressBar: false, 
        isLoading: false, 
    });
};
