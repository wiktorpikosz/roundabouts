class Vehicle {

    constructor(lengthCells, maxSpeed, maxSpeedWhenTurning, drivingRules, name) {
        this._lengthCells = lengthCells;
        this._currentSpeed = 1;
        this._maxSpeed = maxSpeed;
        this._id = Math.round(Math.random() * 16777215);
        this._currentCells = [];
        this._maxSpeedWhenTurning = maxSpeedWhenTurning;
        this._drivingRules = drivingRules;
        this._name = name
    }

    maxSpeedWhenTurning() {
        return this._maxSpeedWhenTurning;
    }

    currentSpeed() {
        return this._currentSpeed;
    }

    maxSpeed() {
        return this._maxSpeed;
    }

    currentLaneId() {
        return this.frontCell().parentLane().id();
    }

    destinationExit() {
        return this._path.destinationExit();
    }

    destinationExitLaneId() {
        return this._path.destinationExitLaneId();
    }

    entranceLaneId() {
        return this._path.entranceLaneId();
    }

    roundaboutLaneId() {
        return this._path.roundaboutLaneId();
    }

    entranceRoadId() {
        return this._path.entranceRoadId();
    }

    setPath(path) {
        this._path = path;
    }

    moveToNextIteration(cellsMap, cellsNeighbours) {
        //Entering roundabout
        if (cellsNeighbours.approachedEntrance(this)) {
            this._onEntrance(cellsMap, cellsNeighbours);
            return;
        }

        //Taking exit
        if (cellsNeighbours.approachedDestinationExit(this)) {
            this._onExit(cellsMap);
            return;
        }

        if (this._passPedestrian()) {
            //console.log("Stop, crosswalk: " + this._id);
            this._stop();
            return;
        }

        if (!this._drivingRules.roundaboutRules.isOnRightOfWay()) {
            if (
                this._drivingRules.roundaboutRules.shouldYieldToVehicleOnTheLeft(cellsMap, cellsNeighbours, this) &&
                cellsNeighbours.isApproachingAnyExit(this)
            ) {
                if (!cellsMap.nothingInFrontOf(this, this._currentSpeed + 1)) {
                    var breakUpTo = this._distanceFromPrecedingVehicle(cellsMap);
                    this._break(breakUpTo);
                } else {
                    this._breakBy(1);
                }

                cellsMap.moveVehicleBy(this, this._currentSpeed);
                return;
            }

            if (
                this._drivingRules.roundaboutRules.shouldYieldToVehicleOnTheLeft(cellsMap, cellsNeighbours, this) &&
                cellsNeighbours.approachedAnyExit(this)
            ) {
                this._stop();
                return;
            }
        }

        this._accelrateIfPossible(cellsMap, cellsNeighbours);
        this._keepSafeDistanceFromPrecedeeingVehicle(cellsMap);

        if (this._isApproachingExit(cellsNeighbours) || this._isApproachingRoundabout(cellsNeighbours)) {
            if (this.currentSpeed() > this.maxSpeedWhenTurning()) {
                this._breakBy(1);
            }
        }
        cellsMap.moveVehicleBy(this, this._currentSpeed);
    }

    _currentLine() {
        return this.frontCell().parentLane();
    }

    _accelrateIfPossible(cellsMap, cellsNeighbours) {
        if (cellsMap.nothingInFrontOf(this, this._currentSpeed + 1)) {
            if (!this._isApproachingExit(cellsNeighbours) && !this._isApproachingRoundabout(cellsNeighbours)) {
                this._accelerate();
            }
        }
    }

    _keepSafeDistanceFromPrecedeeingVehicle(cellsMap) {
        if (!cellsMap.nothingInFrontOf(this, this._currentSpeed + 1)) {
            var breakUpTo = this._distanceFromPrecedingVehicle(cellsMap);
            this._break(breakUpTo);
        }
    }

    remove() {
        this._currentCells.forEach(cell => {
            cell.setVehicle(null);
        });
        this._currentCells = [];
    }

    moveToCells(cells) {
        if (cells.length != this.lengthCells()) {
            throw new Error("Vehicle received invalid directions!");
        }
        this._currentCells.forEach(cell => {
            cell.setVehicle(null);
        });
        cells.forEach(cell => {
            cell.setVehicle(this);
        });
        this._currentCells = cells;
    }

    currentCells() {
        return this._currentCells;
    }

    frontCell() {
        return this.currentCells()[0];
    }

    lengthCells() {
        return this._lengthCells;
    }

    id() {
        return this._id;
    }

    isOnRoundabout() {
        return this.currentCells().every(cell => {
            return cell.parentLane().isRoundaboutLane();
        });
    }

    isEnteringRoundabout() {
        return this.currentCells().some(cell => {
            return cell.parentLane().isEntranceLane();
        });
    }

    getName() {
        return this._name;
    }

    _accelerate(by = 1) {
        if (this._currentSpeed + by < this._maxSpeed) {
            this._currentSpeed += by;
        } else {
            this._currentSpeed = this._maxSpeed;
        }
    }

    _break(to) {
        this._currentSpeed = to;
    }

    _breakBy(by) {
        if (this._currentSpeed - by >= 0) {
            this._currentSpeed -= by;
        }
    }

    _stop() {
        this._break(0);
    }

    _hasStopped() {
        return this._currentSpeed == 0;
    }

    _distanceFromPrecedingVehicle(cellsMap) {
        var distanceNotEmpty = this._currentSpeed;
        while (!cellsMap.nothingInFrontOf(this, distanceNotEmpty)) {
            distanceNotEmpty--;
        }
        return distanceNotEmpty;
    }

    _isApproachingExit(cellsNeighbours) {
        return cellsNeighbours.isApproachingDestinationExit(this) &&
            this.frontCell().parentLane().isRoundaboutLane();
    }

    _isApproachingRoundabout(cellsNeighbours) {
        return cellsNeighbours.isApproachingRoundabout(this) &&
            this.frontCell().parentLane().isEntranceLane();
    }

    _onEntrance(cellsMap, cellsNeighbours) {
        var vehiclesOnTheLeft = cellsMap.vehiclesOnTheLeft(this, cellsNeighbours);
        for (let vehicle of vehiclesOnTheLeft.values()) {
            if (this._drivingRules.entranceRules.shouldYieldTo(this, vehicle)) {
                this._stop()
                return;
            }
        }
        var vehicleOnTheRight = cellsMap.vehicleOnTheRight(this);
        if (vehicleOnTheRight && this._drivingRules.entranceRules.shouldYieldTo(this, vehicleOnTheRight)) {
            this._stop()
            return;
        }

        var firstCellOnRoundabout = cellsNeighbours.firstCellNumberOnEntrance(
            this.entranceRoadId(),
            this.entranceLaneId(),
            this.roundaboutLaneId()
        );
        var nothingInFrontOnRoundabout = cellsMap.nothingOnRoundaboutFrom(
            this.roundaboutLaneId(),
            firstCellOnRoundabout,
            this.maxSpeedWhenTurning()
        );
        if (this._hasStopped() && nothingInFrontOnRoundabout) {
            this._accelerate(this.maxSpeedWhenTurning());
        }
        if (this.currentSpeed() > this.maxSpeedWhenTurning()) {
            this._break(this.maxSpeedWhenTurning());
        }
        if (nothingInFrontOnRoundabout) {
            cellsMap.takeEntrance(this, cellsNeighbours);
        }
    }

    _onExit(cellsMap) {
        if (!cellsMap.exitLaneEmpty(this, this.maxSpeedWhenTurning())) {
            this._stop();
            return;
        }
        var vehicleOnTheRight = cellsMap.vehicleOnTheRight(this);
        if (vehicleOnTheRight && this._drivingRules.exitRules.shouldYieldTo(this, vehicleOnTheRight)) {
            this._stop();
        } else {
            if (this._hasStopped()) {
                this._accelerate(this.maxSpeedWhenTurning());
            }
            cellsMap.takeExit(this);
        }
        return;
    }

    _checkTypeLine() {
        var type = this._currentLine().id();

        if (typeof type == 'string') {
            if (type.search(/ENTRANCE/) > 0) {
                return "ENTRANCE";
            }
            else {
                return "EXIT";
            }
        } else {
            return "ROUNDED";
        }
    }

    _passPedestrian() {
        var currentNumber = this.frontCell().number();
        var lane = this._currentLine().allCells();
        var type = this._checkTypeLine();

        if (type == "ENTRANCE") {

            if(this._checkPedestrian(currentNumber, lane, 7, 10)){
                if(currentNumber == 7 || currentNumber == 8){
                    this._break(1);
                    return false;
                }
                return true;
            }
        }
        else if(type == "EXIT") {
            if(this._checkPedestrian(currentNumber, lane, 0, 1)){
                if(currentNumber == 0){
                    this._break(1);
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    _checkPedestrian(currentNumber, lane, minNumber, maxNumber) {
        if (currentNumber >= minNumber && currentNumber <= maxNumber) {
            if (lane[11].isPedestrian() || lane[11].isAllocation()) {
                return true;
            }
        }
        return false;
    }

    setMaxSpeed(speed) {
        this._maxSpeed = speed;
    }
}

export default Vehicle;
