import {RoundaboutDrawer} from './GUI/RoundaboutDrawer.js';
import CellsDrawer from './GUI/CellsDrawer.js';
import Translator from './GUI/Translator.js';
import UnitConverter from './GUI/UnitConverter.js';
import {RoundaboutSpecification} from './Simulation/Specification/RoundaboutSpecifications.js';
import {CellsMap} from './Simulation/CellsMap.js';
import CellularAutomata from './Simulation/CellularAutomata.js';
import CellsNeighbours from './Simulation/CellsNeighbours.js';
import {DrivingRules} from './Simulation/DrivingRules.js';
import {range} from './JsWhyYouNoImplement.js';

let roundaboutSpecifications = Array.from(range(40, 40), x => {
        return new RoundaboutSpecification(
            4.5,
            2,
            x/2,
            {
                ingoingLanes: 2,
                outgoingLanes: 2,
                lanesWidth: 3.5
            });
    });

var speed = {
    car: 5,
    truck: 2
};

var ListProbabilityPedestrian = [ 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1 ];

ListProbabilityPedestrian.forEach(probabilityPedestrian => {
    console.log("PP: " + probabilityPedestrian);

    roundaboutSpecifications.forEach(roundaboutSpecification => {
        var drivingRule = DrivingRules.newRules1(
            roundaboutSpecification.lanesCount(),
            roundaboutSpecification.adherentLanesCount()
        );

        let unitConverter = new UnitConverter(
            roundaboutSpecification.roundaboutDiameter() + roundaboutSpecification.adherentRoadLength() * 2,
            Math.min(200, 200)
        );

        let roundaboutCellsMap = new CellsMap(
            roundaboutSpecification,
            unitConverter
        );

        var cellsNeighbours = new CellsNeighbours(
            roundaboutCellsMap.cellsCountsOnInnerRoadLanes(),
            roundaboutSpecification.adherentLanesCount() / 2,
            unitConverter.metersAsCells(roundaboutSpecification.adherentRoadLength())
        );

        var results = [];
        range(0, 20).forEach(() => {
            let cellularAutomata = new CellularAutomata(
                roundaboutCellsMap,
                cellsNeighbours,
                drivingRule,
                roundaboutSpecification.adherentLanesCount() / 2,
                0,
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

        console.log("Finished simulation \t", roundaboutSpecification.islandRadius(), " \t ", results.join(","));
    });
});