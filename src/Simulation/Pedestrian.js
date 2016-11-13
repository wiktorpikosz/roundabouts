class Pedestrian {

    constructor(crossing) {
        this._crossing = crossing;
        this._run = false;
        this._state = 0; // max: 3
    }

    isRun() {
        return this._run;
    }

    rand() {
        if (this._run == false) {
            this._run = parseInt(Math.random() * 2) ? true : false;
        } else {
            if (this._state == 3) { //reset state
                this._state = 0;
                this._run = false;
            } else {
                this._state++;
            }
        }
    }

    state() {
        if (this._run) {
            return this._state;
        }
        else {
            return null;
        }
    }
}

export default Pedestrian;