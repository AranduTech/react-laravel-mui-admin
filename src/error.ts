const error = (key: string) => {
    const el = document.getElementById(`error-${key}`);

    if (!el) {
        return null;
    }

    return el.dataset.value;
};

error.clear = () => {
    const els = document.querySelectorAll('#react-injections [id^="error-"]');

    els.forEach((el) => {
        el.remove();
    });
};

export default error;
