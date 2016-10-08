import Vehicle from './Vehicle.js';
import Direction from './Specification/Direction.js';

class VehicleFactory {

    static newCar(drivingRules, speed = 5) {
        return new Vehicle(2, speed, 2, drivingRules, 'Car');
    }

    static newMotorcycle(drivingRules, speed = 5) {
        return new Vehicle(1, speed, 2, drivingRules, 'Motorcycle');
    }

    static newVan(drivingRules, speed = 5) {
        return new Vehicle(3, speed, 2, drivingRules, 'Van');
    }

    static newMiniBus(drivingRules, speed = 3) {
        return new Vehicle(4, speed, 2, drivingRules, 'MiniBus');
    }

    static newBus(drivingRules, speed = 2) {
        return new Vehicle(5, speed, 1, drivingRules, 'Bus');
    }

    static newTruck(drivingRules, speed = 2) {
        return new Vehicle(5, speed, 1, drivingRules, 'Truck');
    }
}

export default VehicleFactory;
