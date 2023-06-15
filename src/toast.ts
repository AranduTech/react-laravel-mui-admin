
import toastService from "./internals/singletons/Toast"

export interface ToastOptions {
    message: string;
    type?: 'success' | 'error' | 'info' | 'warning';
    timeout?: number;
}

const toast = (options: string | ToastOptions) => {
    if (typeof options === 'string') {
        return toastService.info(options);
    }
    const { message, type, timeout } = options;

    return toastService.create(message, type, timeout);
};

toast.success = toastService.success.bind(toastService);
toast.error = toastService.error.bind(toastService);
toast.info = toastService.info.bind(toastService);
toast.warning = toastService.warning.bind(toastService);

export default toast;
