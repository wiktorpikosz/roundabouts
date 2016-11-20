import Pedestrian from './Pedestrian.js';

class Crossing {

    constructor(id, entrance, exit) {
        this._id = id;
        this._entrance = entrance;
        this._exit = exit;
        this._pedestrian = new Pedestrian(this);
        this._draw = false;
        this._allocationCell = [];
        this._lane = null;
        this._cell = null;
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

    randPedestrian(probability) {
        this._pedestrian.rand(probability);
    }

    draw(cellsMap) {
        this._clearEarlyCells(cellsMap);
        if (this._pedestrian.isRun()) {
            this._draw.parent._collection.forEach((lane) => {
                if (lane.groupId == this._id) {
                    var state = this._pedestrian.state();
                    var cell = 11 + (14 * state);

                    var line_array = this._getLine(state, cellsMap);
                    this._changeAllocation(cellsMap, state);
                    this._setCellForPedestrian(line_array);

                    lane.children[cell].stroke = "#F00";
                    lane.children[cell].fill = "#FFFF00";
                }
            });
        }
    }

    _getLine(state, cellsMap) {
        switch (state) {
            case 0:
                return cellsMap.cellsOnLane(this._id + "_EXIT_0");
            case 1:
                return cellsMap.cellsOnLane(this._id + "_EXIT_1");
            case 2:
                return cellsMap.cellsOnLane(this._id + "_ENTRANCE_1");
            case 3:
                return cellsMap.cellsOnLane(this._id + "_ENTRANCE_0");
        }
    }

    _setCellForPedestrian(lane) {
        lane[11].setPedestrian(true);
    }

    _clearEarlyCells(cellsMap) {
        for (var i = 0; i < 4; i++) {
            var cells = this._getLine(i, cellsMap);
            cells[11].setPedestrian(false);
            cells[11].setAllocation(false);
        }
    }

    _changeAllocation(cellsMap, state) {
        var list_lane = ["_EXIT_0", "_EXIT_1", "_ENTRANCE_1", "_ENTRANCE_0"];

        for (var i = state; i <= 3; i++) {
            var lane = cellsMap.cellsOnLane(this._id + list_lane[i]);
            lane[11].setAllocation(true);
        }
    }
}

export default Crossing;