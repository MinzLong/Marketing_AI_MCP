
import { toast, Bounce } from 'react-toastify';

export const showSuccessToast = (message) => {
  toast.success(`${message}!`, {
    style: {
      minWidth: '400px',
      maxWidth: '600px',
      background: '#1e2b34',      // Darker greenish background
      color: '#e0ffe0',           // Light green text
      border: '1px solid #00adb5' // Teal border
    },
    position: "top-right",
    autoClose: 2999,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Bounce,
  });
}

export const showErrorToast = (message) => {
  toast.error(`${message}`, {
    style: {
      minWidth: '400px',
      maxWidth: '600px',
      background: '#3a0f0f',       // Dark red background
      color: '#ffdada',            // Light red/pinkish text
      border: '1px solid #ff4c4c', // Red border
    },
    position: "top-right",
    autoClose: 2999,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Bounce,
  });
}


const delay = (ms) => new Promise(res => setTimeout(res, ms));
export const showWarningToast = async (message) => {
  toast.warn(`${message}!`, {
    style: {
      minWidth: '400px',
      maxWidth: '600px',
      background: '#2e2a1e',     // Warm dark background
      color: '#ffe9b3',          // Soft yellowish text
      border: '1px solid #ffc107' // Amber border
    },
    position: "top-right",
    autoClose: 2999,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Bounce,
  });

  await delay(1200);
};