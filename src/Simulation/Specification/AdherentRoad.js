import {range} from '../../JsWhyYouNoImplement.js';
import Lane from './Lane.js';
import Crossing from '../Crossing';

class AdherentRoad {

    constructor(direction, length, entrancesLanes, exitLanes) {
        this._length = length;
        this._direction = direction;
        this._entrancesLanes = entrancesLanes;
        this._exitsLanes = exitLanes;
        this.newCrossing();
    }

    id() {
        return this._direction.id();
    }

    length() {
        return this._length;
    }

    allLanes() {
        return this._exitsLanes.concat(this._entrancesLanes);
    }

    static newRoad(direction, length, laneWidth, entrancesLanesCount, exitLanesCount) {
        var entranceLanes = Array.from(range(0, entrancesLanesCount), entranceNumber => {
            return new Lane(`${direction.id()}_ENTRANCE_${entranceNumber}`, length, laneWidth, false)
        });
        entranceLanes.reverse();
        var exitLanes = Array.from(range(0, exitLanesCount), exitNumber => {
            return new Lane(`${direction.id()}_EXIT_${exitNumber}`, length, laneWidth, false)
        });

        return new AdherentRoad(direction, length, entranceLanes, exitLanes);
    }

    newCrossing(){
        var entrance = this._direction.id() + "_ENTRANCE_";
        var exit = this._direction.id() + "_EXIT_";
        this._crossing = new Crossing(this._direction.id(), [entrance+"09", entrance+"19"], [exit+"11", exit+"01"]);
    }

    crossing(){
        return this._crossing;
    }
}

export default AdherentRoad;
