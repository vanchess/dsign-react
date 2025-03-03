export class DateTime 
{
    #dateTime;

    constructor(dt) {
        this.#dateTime = dt;
    }

    static now() {
        const dt = new Date();
        return new DateTime(dt);
    }

    valueOf() {
        return this.#dateTime.valueOf();
    }

    static fromISO(str) {
        return new DateTime(new Date(str));
    }

    /** Возвращает первое число следующего месяца */
    nextMonth() {
        if (this.getMonth() == 11) { // скорее всего нет необходимости обрабатывать этот случай отдельно
            return new DateTime(new Date(this.getFullYear() + 1, 0, 1));
        }
        return new DateTime( new Date(this.getFullYear(), this.getMonth() + 1, 1));
    }

    /** Возвращает первое число предыдущего месяца */
    prevMonth() {
        // .setDate(0); // 0 will result in the last day of the previous month
        if (this.getMonth() == 0) {
            return new DateTime(new Date(this.getFullYear() - 1, 11, 1));
        }
        return new DateTime( new Date(this.getFullYear(), this.getMonth() - 1, 1));
    }

    getMonth() {
        return this.#dateTime.getMonth();
    }

    getFullYear() {
        return this.#dateTime.getFullYear();
    }

}