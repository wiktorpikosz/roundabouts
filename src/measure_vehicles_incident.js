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
import CounterEvents from './GUI/CounterEvents.js';

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

var conditions = [
    {
        surface: 0.5,
        distance: 1,
    },
    {
        surface: 0.5,
        distance: 2,
    },
    {
        surface: 0.5,
        distance: 3,
    },
    {
        surface: 0.5,
        distance: 4,
    },
];

var ListProbabilityPedestrian = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

var speed = {
    car: 5,
    truck: 2
};


conditions.forEach(condition => {
    console.log("Condition:" + condition.distance);
    ListProbabilityPedestrian.forEach(probabilityPedestrian => {
        console.log("PP:" + probabilityPedestrian);
        var results = [];

        range(0, 20).forEach(() => {
            let cellularAutomata = new CellularAutomata(
                roundaboutBukoweCellsMap,
                cellsNeighbours,
                drivingRule,
                roundaboutBukowe.adherentLanesCount() / 2,
                0.5,
                500,
                speed,
                probabilityPedestrian,
                condition.surface,
                condition.distance
            );
            console.log = function(){}; //disabled log
            CounterEvents.reset();

            while (!cellularAutomata.hasFinished()) {
                cellularAutomata.nextIteration();
            }

            delete console.log; // enabled log
            // iterations, collision, slip
            console.log(cellularAutomata.iterations(), CounterEvents.collision(), CounterEvents.slip());
        });

        //console.log("PP: "+ probabilityPedestrian +": ", results.join(","));
    });
});