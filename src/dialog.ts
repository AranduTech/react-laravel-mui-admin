import dialogService, { DialogOptions } from "./internals/singletons/Dialog";


const dialog = (options: DialogOptions | string) => {
    if (typeof options === 'string') {
        return dialogService.alert(options);
    }
    return dialogService.create(options);
}

dialog.alert = dialogService.alert.bind(dialogService);
dialog.confirm = dialogService.confirm.bind(dialogService);
dialog.form = dialogService.form.bind(dialogService);

export default dialog;

