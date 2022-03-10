import { options } from "../options.js";

export function makeSelect() {
    const select = document.createElement('select');
    select.setAttribute("id", "select");

    if (options) {
        for (const key in options) {
            if (Object.hasOwnProperty.call(options, key)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = options[key].title;
                const element = options[key];
                select.append(option);
            }
        }
    }
    return select;
}
