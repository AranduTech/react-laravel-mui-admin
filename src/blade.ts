/**
 * @deprecated
 * @param key 
 * @returns 
 */
const blade = (key: string) => {
    const el = document.getElementById(`react-data-${key}`);

    if (!el) {
        return null;
    }

    if (el.dataset.json && el.dataset.value) {
        return JSON.parse(el.dataset.value);
    }

    return el.dataset.value;
};

export default blade;
