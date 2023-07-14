function timer(deadline) {

    function calcTimer(endData) {
        let diff = Date.parse(endData) - Date.parse(new Date());
        let days = 0, hours = 0, minutes = 0, seconds = 0;

        if (diff > 0) {
            days = Math.floor(diff / (1000 * 60 * 60 * 24)),
            hours = Math.floor((diff / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((diff / 1000 / 60) % 60),
            seconds = Math.floor((diff / 1000) % 60);
        }
        return {diff, days, hours, minutes, seconds}
    }

    function addZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else return num;
    }

    function setTimer() {
        const days = document.querySelector('#days'),
            hours = document.querySelector('#hours'),
            minutes = document.querySelector('#minutes'),
            seconds = document.querySelector('#seconds'),
            timer = setInterval(updateTimer, 1000);

        updateTimer();

        function updateTimer() {
            let t = calcTimer(deadline);

            days.innerHTML = addZero(t.days);
            hours.innerHTML = addZero(t.hours);
            minutes.innerHTML = addZero(t.minutes);
            seconds.innerHTML = addZero(t.seconds);

            if (t.diff == 0) {
                clearInterval(timer);
            }
        }
    }

    setTimer();

}

export default timer;