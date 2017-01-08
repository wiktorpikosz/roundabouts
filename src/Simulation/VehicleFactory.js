import Vehicle from './Vehicle.js';
import Direction from './Specification/Direction.js';

class VehicleFactory {

    static newCar(drivingRules, speed = 5, surface = 1, distance = 0) {
        return new Vehicle(2, speed, 2, drivingRules, 'Car', surface, distance);
    }

    static newMotorcycle(drivingRules, speed = 5, surface = 1, distance = 0) {
        return new Vehicle(1, speed, 2, drivingRules, 'Motorcycle', surface, distance);
    }

    static newVan(drivingRules, speed = 5, surface = 1, distance = 0) {
        return new Vehicle(3, speed, 2, drivingRules, 'Van', surface, distance);
    }

    static newMiniBus(drivingRules, speed = 3, surface = 1, distance = 0) {
        return new Vehicle(4, speed, 2, drivingRules, 'MiniBus', surface, distance);
    }

    static newBus(drivingRules, speed = 2, surface = 1, distance = 0) {
        return new Vehicle(5, speed, 1, drivingRules, 'Bus', surface, distance);
    }

    static newTruck(drivingRules, speed = 2, surface = 1, distance = 0) {
        return new Vehicle(5, speed, 1, drivingRules, 'Truck', surface, distance);
    }
}

export default VehicleFactory;
