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
        this._listLane = ["_EXIT_0", "_EXIT_1", "_ENTRANCE_1", "_ENTRANCE_0"];
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

    randPedestrian(probability, cellsMap) {
        if (this._pedestrian.isRun()) {
            if (this._checkExitIsEmpty(cellsMap, this._pedestrian.state())) {
                return true;
            }
        }

        this._pedestrian.rand(probability);
    }

    execute(cellsMap) {
        this._clearEarlyCells(cellsMap);
        if (this._pedestrian.isRun()) {
            if (this._pedestrian.state() > 0) {
                var state = this._pedestrian.state() - 1;
                var cell = 11 + (14 * state);

                var line_array = this._getLine(state, cellsMap);
                this._changeAllocation(cellsMap, state);
                this._setCellForPedestrian(line_array, state);

            } else {
                this._changeAllocation(cellsMap, 0);
            }
        }
    }

    draw() {
        if (this._pedestrian.isRun()) {
            this._draw.parent.children.forEach((lane) => {
                if (lane.groupId == this._id) {
                    if (this._pedestrian.state() > 0) {
                        var state = this._pedestrian.state() - 1;
                        var cell = 11 + (14 * state);

                        lane.children[cell].stroke = "#F00";
                        lane.children[cell].fill = "#FFFF00";
                    }
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

    _setCellForPedestrian(lane, state) {
        if (state < 2) {
            lane[2].setPedestrian(true);
        } else {
            lane[11].setPedestrian(true);
        }
    }

    _clearEarlyCells(cellsMap) {
        for (var i = 0; i < 2; i++) {
            var cells = this._getLine(i, cellsMap);
            cells[2].setPedestrian(false);
            cells[2].setAllocation(false);
        }
        for (var i = 2; i < 4; i++) {
            var cells = this._getLine(i, cellsMap);
            cells[11].setPedestrian(false);
            cells[11].setAllocation(false);
        }
    }

    _changeAllocation(cellsMap, state) {
        var list_lane = this._listLane;

        for (var i = state; i < 4; i++) {
            var lane = cellsMap.cellsOnLane(this._id + list_lane[i]);
            if (i < 2) {
                lane[2].setAllocation(true);
            } else {
                lane[11].setAllocation(true);
            }
        }
    }

    _checkExitIsEmpty(cellsMap, state) {
        if (state < 2) {
            for (var i = state; i < 2; i++) {
                var lane = cellsMap.cellsOnLane(this._id + this._listLane[i]);
                if (!lane[2].isEmpty()) {
                    return true;
                }
            }
        }
        return false;
    }
}

export default Crossing;