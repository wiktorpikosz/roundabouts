import {DrivingRules} from '../Simulation/DrivingRules.js';
import CellularAutomata from '../Simulation/CellularAutomata.js';
import Menu from '../GUI/Menu.js';

class Dialog {
    constructor(roundaboutBukowe, roundaboutDrawer, roundaboutBukoweCellsMap, cellsNeighbours, twojs) {
        this._roundaboutBukowe = roundaboutBukowe;
        this._roundaboutDrawer = roundaboutDrawer;
        this._roundaboutBukoweCellsMap = roundaboutBukoweCellsMap;
        this._cellsNeighbours = cellsNeighbours;
        this._twojs = twojs;

        this._cellularAutomata = null;
        this._menu = null;
        this._rule = 0;
        this._speed = {};
        this._dialog();
    }

    _dialog() {
        var modal = document.getElementById('dialog');
        var button = document.getElementById('dialog-continue');
        var selectRules = document.getElementById('rules');

        modal.style.display = "block";

        button.addEventListener("click", this._clickContinue.bind(this, modal, selectRules));
    }

    _clickContinue(modal, selectRules) {
        modal.style.display = "none";
        this.rule = selectRules.value;
        this._configSpeed();
        this._run();
    }

    _rules() {
        switch (this.rule) {
            case '1':
                return DrivingRules.newRules1(
                    this._roundaboutBukowe.lanesCount(),
                    this._roundaboutBukowe.adherentLanesCount()
                );
            case '2':
                return DrivingRules.newRules2(
                    this._roundaboutBukowe.lanesCount(),
                    this._roundaboutBukowe.adherentLanesCount()
                );
            case '3':
                return DrivingRules.newRules3(
                    this._roundaboutBukowe.lanesCount(),
                    this._roundaboutBukowe.adherentLanesCount()
                );
            case '4':
                return DrivingRules.newRules4(
                    this._roundaboutBukowe.lanesCount(),
                    this._roundaboutBukowe.adherentLanesCount()
                );
            case '5':
                return DrivingRules.newRules5(
                    this._roundaboutBukowe.lanesCount(),
                    this._roundaboutBukowe.adherentLanesCount()
                );
            default:
                throw Error("Problem with selecting the rule");
        }

    }

    _configSpeed() {
        var car = document.getElementById("init-car-speed");
        var motorcycle = document.getElementById("init-motorcycle-speed");
        var truck = document.getElementById("init-truck-speed");
        var van = document.getElementById("init-van-speed");
        var minibus = document.getElementById("init-minibus-speed");
        var bus = document.getElementById("init-bus-speed");

        var speed = {
            car: car.value,
            motorcycle: motorcycle.value,
            truck: truck.value,
            van: van.value,
            minibus: minibus.value,
            bus: bus.value
        };

        this._speed = speed;
        this._changeValueInVehicle(speed);
    }

    _changeValueInVehicle(speed) {
        document.getElementById("car-speed").value = speed.car;
        document.getElementById("motorcycle-speed").value = speed.motorcycle;
        document.getElementById("van-speed").value = speed.van;
        document.getElementById("minibus-speed").value = speed.minibus;
        document.getElementById("bus-speed").value = speed.bus;
        document.getElementById("truck-speed").value = speed.truck;
    }

    _factoryMenu() {
        this._menu = new Menu(
            this._roundaboutDrawer,
            this._cellularAutomata,
            this._twojs
        );
    }

    _factoryCellularAutomata() {
        this._cellularAutomata = new CellularAutomata(
            this._roundaboutBukoweCellsMap,
            this._cellsNeighbours,
            this._rules(),
            this._roundaboutBukowe.adherentLanesCount() / 2,
            0.5,
            500,
            this._speed
        );
    }

    _run() {
        this._factoryCellularAutomata();
        this._factoryMenu();
        this._roundaboutDrawer.draw();
        this._menu.init();
    }
}

export default Dialog;
