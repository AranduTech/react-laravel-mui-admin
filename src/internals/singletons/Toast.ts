import { v4 as uuidv4 } from 'uuid';

const NOTIFICATION_TIMEOUT = 10000;

/**
 * Serviço de notificações toast.
 *
 */
class Toast {

    onShow: Function | null = null;

    onClose: Function | null = null;

    /**
     * Cria uma nova notificação toast.
     *
     * @param message - Mensagem da notificação.
     * @param type - O tipo da notificação. Padrão: 'info'.
     * @param timeout - O tempo de exibição da notificação, em milissegundos.
     * Padrão: 10000.
     */
    create(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', timeout: number = NOTIFICATION_TIMEOUT) {
        if (typeof this.onShow === 'function') {
            this.onShow({
                message,
                type,
                timeout,
                key: uuidv4(),
            });
        }
        // setTimeout(() => this.dismiss(), timeout);
    }

    /**
     * Cria uma nova notificação toast de sucesso.
     *
     * @param message - Mensagem da notificação.
     */
    success(message: string) {
        this.create(message, 'success');
    }

    /**
     * Criar uma nova notificação toast de erro.
     *
     * @param message - Mensagem da notificação.
     */
    error(message: string) {
        this.create(message, 'error');
    }

    /**
     * Criar uma nova notificação toast de informação.
     *
     * @param message - Mensagem da notificação.
     */
    info(message: string) {
        this.create(message, 'info');
    }

    /**
     * Criar uma nova notificação toast de aviso.
     *
     * @param message - Mensagem da notificação.
     */
    warning(message: string) {
        this.create(message, 'warning');
    }

    /**
     * Dispensar uma notificação toast.
     *
     */
    dismiss() {
        if (typeof this.onClose === 'function') {
            this.onClose();
        }
    }

}

const toastService = new Toast();

export default toastService;