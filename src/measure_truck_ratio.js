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

var drivingRule = DrivingRules.newRules4(
    roundaboutBukowe.lanesCount(),
    roundaboutBukowe.adherentLanesCount()
);


var truckRatios = [
    0.0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07, 0.08, 0.09,
    0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17, 0.18, 0.19,
    0.2, 0.21, 0.22, 0.23, 0.24, 0.25, 0.26, 0.27, 0.28, 0.29,
    0.3, 0.31, 0.32, 0.33, 0.34, 0.35, 0.36, 0.37, 0.38, 0.39,
    0.4, 0.41, 0.42, 0.43, 0.44, 0.45, 0.46, 0.47, 0.48, 0.49,
    0.5, 0.51, 0.52, 0.53, 0.54, 0.55, 0.56, 0.57, 0.58, 0.59,
    0.6, 0.61, 0.62, 0.63, 0.64, 0.65, 0.66, 0.67, 0.68, 0.69
];
var ListProbabilityPedestrian = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

var speed = {
    car: 5,
    truck: 2
};


truckRatios.forEach(truckRatio => {
    ListProbabilityPedestrian.forEach(probabilityPedestrian => {
        var results = [];
        range(0, 20).forEach(() => {
            let cellularAutomata = new CellularAutomata(
                roundaboutBukoweCellsMap,
                cellsNeighbours,
                drivingRule,
                roundaboutBukowe.adherentLanesCount() / 2,
                truckRatio,
                500,
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

        console.log("Ratio " + truckRatio + " PP: "+ probabilityPedestrian +": ", results.join(","));
    });
});