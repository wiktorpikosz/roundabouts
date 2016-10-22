class Pedestrian {

    constructor(crossing) {
        this._crossing = crossing;
        this._run = false;
        this._period = 0; // max: 3
    }

    isRun() {
        return this._run;
    }

    rand() {
        if (this._run == false) {
            this._run = parseInt(Math.random() * 2) ? true : false;
        } else {
            if (this._period == 3) { //reset state
                this._period = 0;
                this._run = false;
            } else {
                this._period++;
            }
        }
    }

    state() {
        if (this._run) {
            return this._period;
        }
        else {
            return null;
        }
    }
}

export default Pedestrian;