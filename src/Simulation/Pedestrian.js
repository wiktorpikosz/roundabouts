class Pedestrian {

    constructor(crossing) {
        this._crossing = crossing;
        this._run = false;
        this._state = 0; // max: 4
    }

    isRun() {
        return this._run;
    }

    rand(probability) {
        if (this._run == false) {
            //this._run = parseInt(Math.random() * 2) ? true : false;
            this._run = (Math.random() / 1) < probability;
        } else {
            if (this._state == 4) { //reset state
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