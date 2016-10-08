import Vehicle from './Vehicle.js';
import Direction from './Specification/Direction.js';

class VehicleFactory {

    static newCar(drivingRules) {
        return new Vehicle(2, 5, 2, drivingRules, 'Car');
    }

    static newMotorcycle(drivingRules) {
        return new Vehicle(1, 5, 2, drivingRules, 'Motorcycle');
    }

    static newVan(drivingRules) {
        return new Vehicle(3, 5, 2, drivingRules, 'Van');
    }

    static newMiniBus(drivingRules) {
        return new Vehicle(4, 3, 2, drivingRules, 'MiniBus');
    }

    static newBus(drivingRules) {
        return new Vehicle(5, 2, 1, drivingRules, 'Bus');
    }

    static newTruck(drivingRules) {
        return new Vehicle(5, 2, 1, drivingRules, 'Truck');
    }
}

export default VehicleFactory;
