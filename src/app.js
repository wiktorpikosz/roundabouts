import {RoundaboutDrawer} from './GUI/RoundaboutDrawer.js';
import CellsDrawer from './GUI/CellsDrawer.js';
import Translator from './GUI/Translator.js';
import UnitConverter from './GUI/UnitConverter.js';
import {roundaboutBukowe, roundaboutThreeLanes} from './Simulation/Specification/RoundaboutSpecifications.js';
import {CellsMap} from './Simulation/CellsMap.js';
import CellularAutomata from './Simulation/CellularAutomata.js';
import CellsNeighbours from './Simulation/CellsNeighbours.js';
import {DrivingRules} from './Simulation/DrivingRules.js';

let unitConverter = new UnitConverter(
    roundaboutThreeLanes.roundaboutDiameter() + roundaboutThreeLanes.adherentRoadLength() * 2,
    Math.min(window.innerWidth, window.innerHeight)
);

var canvasElement = document.getElementById("canvas");
let twojs = new Two({
    width: canvasElement.clientWidth,
    height: window.innerHeight,
    autostart: true
}).appendTo(canvasElement);

let roundaboutBukoweCellsMap = new CellsMap(
    roundaboutBukowe,
    unitConverter
);

let roundaboutThreeLanesCellsMap = new CellsMap(
    roundaboutThreeLanes,
    unitConverter
);

var translator = new Translator(roundaboutBukowe, unitConverter, twojs);

let roundaboutDrawer = new RoundaboutDrawer(
    roundaboutBukowe,
    unitConverter,
    twojs,
    translator
);

let roundaboutCellsDrawer = new CellsDrawer(
    roundaboutBukowe,
    roundaboutBukoweCellsMap,
    unitConverter,
    twojs,
    translator
);

var cellsNeighbours = new CellsNeighbours(
    roundaboutBukoweCellsMap.cellsCountsOnInnerRoadLanes()
);

let drivingRules = DrivingRules.newRules1(roundaboutBukowe.lanesCount());
let cellularAutomata = new CellularAutomata(roundaboutBukoweCellsMap, cellsNeighbours, drivingRules);

roundaboutDrawer.draw();
setInterval(() => {
    cellularAutomata.nextIteration();
}, 1000);

