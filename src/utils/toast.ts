import { toast } from 'react-toastify';

// Toast utility functions với custom styling
export const showToast = {
  success: (message: string, options?: any) => {
    toast.success(`🎉 ${message}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  error: (message: string, options?: any) => {
    toast.error(`❌ ${message}`, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  info: (message: string, options?: any) => {
    toast.info(`ℹ️ ${message}`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  warning: (message: string, options?: any) => {
    toast.warning(`⚠️ ${message}`, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      ...options,
    });
  },

  // Loading toast với custom ID để có thể update sau
  loading: (message: string, toastId?: string) => {
    return toast.loading(`⏳ ${message}`, {
      position: "top-right",
      toastId: toastId || 'loading',
    });
  },

  // Update loading toast thành success
  updateToSuccess: (toastId: string, message: string) => {
    toast.update(toastId, {
      render: `🎉 ${message}`,
      type: "success",
      isLoading: false,
      autoClose: 3000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },

  // Update loading toast thành error
  updateToError: (toastId: string, message: string) => {
    toast.update(toastId, {
      render: `❌ ${message}`,
      type: "error",
      isLoading: false,
      autoClose: 4000,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  },
};

// Promise-based toast cho API calls
export const toastPromise = <T>(
  promise: Promise<T>, 
  options: {
    loading: string;
    success: string;
    error: string;
  }
) => {
  return toast.promise(promise, {
    pending: {
      render: `⏳ ${options.loading}`,
      position: "top-right",
    },
    success: {
      render: `🎉 ${options.success}`,
      position: "top-right",
      autoClose: 3000,
    },
    error: {
      render: `❌ ${options.error}`,
      position: "top-right",
      autoClose: 4000,
    }
  });
};