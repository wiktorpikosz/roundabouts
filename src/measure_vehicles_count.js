import {RoundaboutDrawer} from './GUI/RoundaboutDrawer.js';
import CellsDrawer from './GUI/CellsDrawer.js';
import Translator from './GUI/Translator.js';
import UnitConverter from './GUI/UnitConverter.js';
import {roundaboutBukowe, roundaboutThreeLanes} from './Simulation/Specification/RoundaboutSpecifications.js';
import {CellsMap} from './Simulation/CellsMap.js';
import CellularAutomata from './Simulation/CellularAutomata.js';
import CellsNeighbours from './Simulation/CellsNeighbours.js';
import {DrivingRules} from './Simulation/DrivingRules.js';
import {range} from './JsWhyYouNoImplement.js';

let unitConverter = new UnitConverter(
    roundaboutBukowe.roundaboutDiameter() + roundaboutBukowe.adherentRoadLength() * 2,
    Math.min(200, 200)
);

let roundaboutBukoweCellsMap = new CellsMap(
    roundaboutBukowe,
    unitConverter
);

var cellsNeighbours = new CellsNeighbours(
    roundaboutBukoweCellsMap.cellsCountsOnInnerRoadLanes(),
    roundaboutBukowe.adherentLanesCount() / 2,
    unitConverter.metersAsCells(roundaboutBukowe.adherentRoadLength())
);

var ListDrivingRule = [
    DrivingRules.newRules1(
        roundaboutBukowe.lanesCount(),
        roundaboutBukowe.adherentLanesCount()
    ),
    DrivingRules.newRules2(
        roundaboutBukowe.lanesCount(),
        roundaboutBukowe.adherentLanesCount()
    ),
    DrivingRules.newRules3(
        roundaboutBukowe.lanesCount(),
        roundaboutBukowe.adherentLanesCount()
    ),
    DrivingRules.newRules4(
        roundaboutBukowe.lanesCount(),
        roundaboutBukowe.adherentLanesCount()
    ),
    DrivingRules.newRules5(
        roundaboutBukowe.lanesCount(),
        roundaboutBukowe.adherentLanesCount()
    ),
];


var vehiclesCount = range(0, 100);

var speed = {
    car: 5,
    truck: 2
};

var ListProbabilityPedestrian = [ 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1 ];
var itRules = 1;

ListDrivingRule.forEach(drivingRule => {
    console.log("DriveRule: " + itRules);

    ListProbabilityPedestrian.forEach(probabilityPedestrian => {

        console.log("ProbabilityPedestrian: " + probabilityPedestrian);
        vehiclesCount.forEach(vehicleCount => {
            var results = [];
            range(0, 20).forEach(() => {
                let cellularAutomata = new CellularAutomata(
                    roundaboutBukoweCellsMap,
                    cellsNeighbours,
                    drivingRule,
                    roundaboutBukowe.adherentLanesCount() / 2,
                    0,
                    vehicleCount,
                    speed,
                    probabilityPedestrian,
                    1,
                    0
                );

                while (!cellularAutomata.hasFinished()) {
                    cellularAutomata.nextIteration();
                }
                results.push(cellularAutomata.iterations());
            });

            //console.log("Finished simulation with vehicles count ", vehicleCount, ": ",  results.join(","));
            console.log(vehicleCount + ", " +  results.join(","));
        });
    });
    itRules++;
});