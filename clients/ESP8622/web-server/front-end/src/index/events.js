import { addQueryString, getFormattedTime, getStatusText, hideSelect, showSelect, } from "@src/index/functions.ts";
import { errorText, status, time } from "@src/index/elements.ts";
import handleError from "@src/index/error.ts";
export const counter = {
    id: null,
    countdown: 0,
};
export const startCountdown = () => {
    counter.id = setInterval(() => {
        time.innerText = getFormattedTime(--counter.countdown);
        if (counter.countdown === 0) {
            clearInterval(counter.id);
            status.innerText = getStatusText(false);
            status.classList.remove("text-success");
            time.innerText = "00:00";
            counter.id = null;
            showSelect();
        }
    }, 1000);
};
export const handleClick = (e) => {
    const target = e.target;
    const path = target.dataset.path;
    if (!path)
        return;
    return fetch(addQueryString(path), {
        method: "POST",
    })
        .then((res) => {
        errorText.innerText = "";
        if (res.status === 400)
            return res.json().then((r) => Promise.reject(r));
        if (res.ok)
            return res.json();
        return Promise.reject(res.statusText);
    })
        .then((timer) => {
        status.innerText = getStatusText(timer.active);
        status.classList.remove("text-success");
        time.innerText = "00:00";
        hideSelect();
        if (counter.id)
            clearInterval(counter.id);
        if (timer.active) {
            status.classList.add("text-success");
            counter.countdown = timer.time;
            time.innerText = getFormattedTime(counter.countdown);
            startCountdown();
        }
        else {
            showSelect();
        }
    })
        .catch(handleError);
};
