import Pedestrian from './Pedestrian.js';

class Crossing {

    constructor(id, entrance, exit) {
        this._id = id;
        this._entrance = entrance;
        this._exit = exit;
        this._pedestrian = new Pedestrian(this);
        this._draw = false;
        this._cellsMap = null;
    }

    id() {
        return this._id;
    }

    pedestrian() {
        return this._pedestrian;
    }

    setDraw(draw) {
        this._draw = draw;
    }

    randPedestrian() {
        this._pedestrian.rand();
    }

    draw() {
        if (this._pedestrian.isRun()) {
            this._draw.parent._collection.forEach((lane) => {
                if (lane.groupId == this._id) {
                    var cell = 11 + (14 * this._pedestrian.state());
                    lane._collection[cell].stroke = "#F00";
                    lane._collection[cell].fill = "#FFFF00";
                }
            });
        }
    }
}

export default Crossing;