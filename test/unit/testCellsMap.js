import { CellsMap } from '../../src/Simulation/CellsMap.js';
import Cell from '../../src/Simulation/Cell.js';
import UnitConverter from '../../src/GUI/UnitConverter.js';
import {roundaboutBukowe} from '../../src/Simulation/Specification/RoundaboutSpecifications.js';
import VehicleFactory from '../../src/Simulation/VehicleFactory.js';
import CellsNeighbours from '../../src/Simulation/CellsNeighbours.js';
import { range } from '../../src/JsWhyYouNoImplement.js';

describe("Test roundabout cells map", function() {

    var unitConverter;
    var cellsMap;
    var cellsNeighbours;

    beforeEach(()=>{
        unitConverter  = new UnitConverter(
            0,
            800
        );
        cellsMap = new CellsMap(roundaboutBukowe, unitConverter);
        cellsNeighbours = new CellsNeighbours(80);
    });

    it('Accurately says if there is nothing in front of a vehicle', () => {
        var car1 = VehicleFactory.newCar();
        var car2 = VehicleFactory.newCar();

        var distanceBetweenCar1And2 = 1;
        cellsMap.addVehicle(car1, 0, distanceBetweenCar1And2 + car1.lengthCells());
        cellsMap.addVehicle(car2, 0, 0);

        expect(cellsMap.nothingInFrontOf(car1, 2)).toBe(true);
        expect(cellsMap.nothingInFrontOf(car2, distanceBetweenCar1And2 + 1)).toBe(false);
        expect(cellsMap.nothingInFrontOf(car2, distanceBetweenCar1And2)).toBe(true);
    });

    it('Lets a truck take an exit', () => {
        var iterations = [
            [
                {laneId: 1, cellNumber: 15},
                {laneId: 1, cellNumber: 14},
                {laneId: 1, cellNumber: 13},
                {laneId: 1, cellNumber: 12},
                {laneId: 1, cellNumber: 11},
            ],
            [
                {laneId: 1, cellNumber: 17},
                {laneId: 1, cellNumber: 16},
                {laneId: 1, cellNumber: 15},
                {laneId: 1, cellNumber: 14},
                {laneId: 1, cellNumber: 13},
            ],
            [
                {laneId: 'N_EXIT_0', cellNumber: 1},
                {laneId: 'N_EXIT_0', cellNumber: 0},
                {laneId: 1, cellNumber: 17},
                {laneId: 1, cellNumber: 16},
                {laneId: 1, cellNumber: 15},
            ],
            [
                {laneId: 'N_EXIT_0', cellNumber: 3},
                {laneId: 'N_EXIT_0', cellNumber: 2},
                {laneId: 'N_EXIT_0', cellNumber: 1},
                {laneId: 'N_EXIT_0', cellNumber: 0},
                {laneId: 1, cellNumber: 17},
            ],
            [
                {laneId: 'N_EXIT_0', cellNumber: 5},
                {laneId: 'N_EXIT_0', cellNumber: 4},
                {laneId: 'N_EXIT_0', cellNumber: 3},
                {laneId: 'N_EXIT_0', cellNumber: 2},
                {laneId: 'N_EXIT_0', cellNumber: 1},
            ],
            [
                {laneId: 'N_EXIT_0', cellNumber: 7},
                {laneId: 'N_EXIT_0', cellNumber: 6},
                {laneId: 'N_EXIT_0', cellNumber: 5},
                {laneId: 'N_EXIT_0', cellNumber: 4},
                {laneId: 'N_EXIT_0', cellNumber: 3},
            ],
            [
                {laneId: 'N_EXIT_0', cellNumber: 9},
                {laneId: 'N_EXIT_0', cellNumber: 8},
                {laneId: 'N_EXIT_0', cellNumber: 7},
                {laneId: 'N_EXIT_0', cellNumber: 6},
                {laneId: 'N_EXIT_0', cellNumber: 5},
            ],
            [
                {laneId: 'N_EXIT_0', cellNumber: 11},
                {laneId: 'N_EXIT_0', cellNumber: 10},
                {laneId: 'N_EXIT_0', cellNumber: 9},
                {laneId: 'N_EXIT_0', cellNumber: 8},
                {laneId: 'N_EXIT_0', cellNumber: 7},
            ],
            [
                {laneId: 'N_EXIT_0', cellNumber: 13},
                {laneId: 'N_EXIT_0', cellNumber: 12},
                {laneId: 'N_EXIT_0', cellNumber: 11},
                {laneId: 'N_EXIT_0', cellNumber: 10},
                {laneId: 'N_EXIT_0', cellNumber: 9},
            ]
        ];

        var truck = VehicleFactory.newTruck();
        truck.setDestinationExit('N');
        truck.setDestinationExitLaneId(0);
        cellsMap.addVehicle(truck, 1, 13);

        iterations.forEach(cellSpecification => {
            truck.moveToNextIteration(cellsMap, cellsNeighbours);
            var expectedCells = expectedCellsFrom(cellSpecification);
            expectCellsToEqual(truck.currentCells(), expectedCells);
        });

        expect(() => { truck.moveToNextIteration(cellsMap, cellsNeighbours); }).toThrow();
    });;

    it('Lets a car take an exit', () => {
        var iterations = [
            [
                {laneId: 1, cellNumber: 2},
                {laneId: 1, cellNumber: 1},
            ],
            [
                {laneId: 1, cellNumber: 5},
                {laneId: 1, cellNumber: 4},
            ],
            [
                {laneId: 1, cellNumber: 9},
                {laneId: 1, cellNumber: 8},
            ],
            [
                {laneId: 1, cellNumber: 12},
                {laneId: 1, cellNumber: 11},
            ],
            [
                {laneId: 1, cellNumber: 14},
                {laneId: 1, cellNumber: 13},
            ],
            [
                {laneId: 1, cellNumber: 16},
                {laneId: 1, cellNumber: 15},
            ],
            [
                {laneId: 1, cellNumber: 18},
                {laneId: 1, cellNumber: 17},
            ],
            [
                {laneId: 'N_EXIT_0', cellNumber: 1},
                {laneId: 'N_EXIT_0', cellNumber: 0},
            ],
            [
                {laneId: 'N_EXIT_0', cellNumber: 4},
                {laneId: 'N_EXIT_0', cellNumber: 3},
            ],
            [
                {laneId: 'N_EXIT_0', cellNumber: 8},
                {laneId: 'N_EXIT_0', cellNumber: 7},
            ],
            [
                {laneId: 'N_EXIT_0', cellNumber: 13},
                {laneId: 'N_EXIT_0', cellNumber: 12},
            ]
        ];

        var car = VehicleFactory.newCar();
        car.setDestinationExit('N');
        car.setDestinationExitLaneId(0);
        cellsMap.addVehicle(car, 1, 0);

        iterations.forEach(cellSpecification => {
            car.moveToNextIteration(cellsMap, cellsNeighbours);
            var expectedCells = expectedCellsFrom(cellSpecification);
            expectCellsToEqual(car.currentCells(), expectedCells);
        });

        expect(() => { car.moveToNextIteration(cellsMap, cellsNeighbours); }).toThrow();
    });

    it("vehicles will not crash if one going slow and another is approaching quickly", () => {
        var car = VehicleFactory.newCar();
        car.setDestinationExit('N');
        car.setDestinationExitLaneId(0);
        cellsMap.addVehicle(car, 1, 40);

        var truck = VehicleFactory.newTruck();
        truck.setDestinationExit('N');
        truck.setDestinationExitLaneId(0);
        cellsMap.addVehicle(truck, 1, 69);

        function nextIteration() {
            car.moveToNextIteration(cellsMap, cellsNeighbours);
            truck.moveToNextIteration(cellsMap, cellsNeighbours);
        }

        range(0, 22).forEach(i => {
            expect(() => {nextIteration();}).not.toThrow();
        });
    });


    it('will slow down when approaching exit', () => {
        var expectedSpeeds = [
          2, 3, 4, 4, 3, 2, 2
        ];
        var car = VehicleFactory.newCar();
        car.setDestinationExit('N');
        car.setDestinationExitLaneId(0);
        cellsMap.addVehicle(car, 1, 79);

        expectedSpeeds.forEach(expectedSpeed => {
            car.moveToNextIteration(cellsMap, cellsNeighbours);
            expect(car.currentSpeed()).toEqual(expectedSpeed);
        });
    });

    function expectCellsToEqual(firstCells, secondCells) {
        firstCells.forEach((firstCell, index) => {
                expect(firstCell.equals(secondCells[index])).toBe(true);
            }
        )
        expect(firstCells.length).toEqual(secondCells.length);
    }

    function expectedCellsFrom(array) {
        return Array.from(array, cellSpecification => {
                var cell = new Cell(cellSpecification.cellNumber);
                var cellsLane = {id: () => {}};
                spyOn(cellsLane, "id").and.returnValue(cellSpecification.laneId);
                cell.assignToLane(cellsLane);
                return cell;
            }
        );
    }
});
