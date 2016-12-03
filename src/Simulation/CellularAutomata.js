import Vehicle from './Vehicle.js';
import VehicleFactory from './VehicleFactory.js';
import {ExitRoadEnd} from './CellsMap.js';
import Direction from './Specification/Direction.js';
import {range} from '../JsWhyYouNoImplement.js';
import Path from './Path.js';

class VehicleQueue {
    constructor() {
        this._vehicles = [];
    }

    addVehicle(vehicle) {
        this._vehicles.push(vehicle);
    }

    nextVehicle() {
        return this._vehicles.pop();
    }

    isEmpty() {
        return this._vehicles.length == 0;
    }
}

class CellularAutomata {

    constructor(cellsMap, cellsNeighbours, drivingRules, ingoingLanesCount, truckRatio = 0, vehicleCount = 500, speed = {}, probabilityPedestrian = 0) {
        this._iterations = 0;
        this._cellsMap = cellsMap;
        this._cellsNeighbours = cellsNeighbours;
        this._drivingRules = drivingRules;
        this._vehicles = [];
        this._probabilityPedestrian = probabilityPedestrian;

        var vehicles = [];
        range(0, Math.round(vehicleCount * (1 - truckRatio))).forEach(() => {
            vehicles.push(VehicleFactory.newCar(this._drivingRules, parseInt(speed.car)));
        });
        range(0, Math.round(vehicleCount * truckRatio)).forEach(() => {
            vehicles.push(VehicleFactory.newTruck(this._drivingRules, parseInt(speed.truck)));
        });
        vehicles.forEach(vehicle => {
            vehicle.setPath(drivingRules.randomPath());
        });
        vehicles = vehicles.sort(() => {
            return 0.5 < Math.random();
        });

        this._vehiclesQueues = new Map();
        Direction.allDirections().forEach(entranceRoadDirection => {
            range(0, ingoingLanesCount).forEach(entranceLaneId => {
                this._vehiclesQueues.set(
                    `${entranceRoadDirection.id()}_ENTRANCE_${entranceLaneId}`,
                    new VehicleQueue()
                );
            });
        });

        vehicles.forEach(vehicle => {
            var queue = this._vehiclesQueues.get(`${vehicle.entranceRoadId()}_ENTRANCE_${vehicle.entranceLaneId()}`);
            queue.addVehicle(vehicle);
        });
        this._addVehiclesFromQueue();
    }

    nextIteration() {
        this._iterations++;
        this._moveVehicles();
        this._addVehiclesFromQueue();
        this._cellsMap.notifyAll();
        this._goPedestrian();
    }

    hasFinished() {
        var allQueuesEmpty = Array.from(this._vehiclesQueues.values()).every(queue => {
            return queue.isEmpty();
        });
        var allVehiclesLeft = this._vehicles.length == 0;
        return allVehiclesLeft && allQueuesEmpty;
    }

    iterations() {
        return this._iterations;
    }

    _moveVehicles() {
        for (var i = 0; i < this._vehicles.length; i++) {
            var vehicle = this._vehicles[i];
            try {
                vehicle.moveToNextIteration(this._cellsMap, this._cellsNeighbours);
            } catch (e) {
                if (e instanceof ExitRoadEnd) {
                    vehicle.remove();
                    this._vehicles.splice(i, 1);
                } else {
                    throw e;
                }
            }
        }
    }

    _addVehiclesFromQueue() {
        this._vehiclesQueues.forEach((queue, queueLane) => {
            var vehicle = queue.nextVehicle();
            if (vehicle) {
                if (this._cellsMap.nothingOnEntrance(queueLane, vehicle.lengthCells())) {
                    this._vehicles.push(vehicle);
                    this._cellsMap.addVehicle(vehicle, queueLane, vehicle.lengthCells() - 1);
                } else {
                    queue.addVehicle(vehicle);
                }
            }
        });
    }

    getVehicle(id) {
        for (var i = 0; i < this._vehicles.length; i++) {
            if (this._vehicles[i].id() == id) {
                return this._vehicles[i];
            }
        }
    }

    getVehicles() {
        return this._vehicles;
    }

    getVehiclesQueues() {
        return this._vehiclesQueues;
    }

    adherentRoads() {
        return this._cellsMap._roundaboutSpecification.adherentRoads();
    }

    _goPedestrian() {
        this.adherentRoads().forEach((road) => {
            road.crossing().randPedestrian(this._probabilityPedestrian, this._cellsMap);
            road.crossing().execute(this._cellsMap);
        })
    }
}

export default CellularAutomata;
