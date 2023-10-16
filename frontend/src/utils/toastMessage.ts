import { ToastContainer, toast } from 'react-toastify';


export const errorMessage = (error: string) => {
    toast.error(error, {
        position: "top-center",
        autoClose: 3000, // Automatically close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
}

export const successMessage = (success: string) => {
    toast(success, {
        position: "top-center",
        autoClose: 3000, // Automatically close after 3 seconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
}