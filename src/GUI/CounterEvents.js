class CounterEvents {
    static _collision = 0;
    static _slip = 0;

    static collision() {
        return this._collision;
    }

    static addCollision() {
        this._collision++;
    }

    static slip() {
        return this._slip;
    }

    static addSlip() {
        this._slip++;
    }
}

export default CounterEvents;