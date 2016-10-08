class Menu {

    constructor(roundaboutDrawer, cellularAutomata) {
        this._roundaboutDrawer = roundaboutDrawer;
        this._cellularAutomata = cellularAutomata;
        this._pause = false;
        this._start = false;
        this._speed = 700;
    }

    nextIteration() {
        if (this._pause) {
            return;
        }

        this._cellularAutomata.nextIteration();
        this.eventVehicle();

        if (this._cellularAutomata.hasFinished()) {
            console.log("Finished simulation, ", cellularAutomata.iterations());
            this._start = false;
            return;
        }
        setTimeout(()=> {
            this.nextIteration();
        }, this._speed);
    }

    init() {
        var buttonStart = document.getElementById('start');
        var buttonPause = document.getElementById('pause');
        var selectSpeed = document.getElementById('speed');


        buttonStart.addEventListener('click', this.clickStart.bind(this));
        buttonPause.addEventListener('click', this.clickPause.bind(this));
        selectSpeed.addEventListener('change', this.selectSpeed.bind(this, selectSpeed));

    }

    clickStart(){
        if(!this._start) {
            this._start = true;
            this.nextIteration();
        } else if(this._start && this._pause) {
            this._pause = false;
            this.nextIteration();
        }
    }

    clickPause(){
        this._pause = true;
    }

    selectSpeed(e, s){
        var speed = e.value;
        this._speed = speed;
    }

    clickVehicle(e, s){
        var id = e.getAttribute('id-vehicle');
        if(id) {
            var vehicle = this._cellularAutomata.getVehicle(id);

            console.log(vehicle);
        }
    }

    eventVehicle(){
        var vehicle = document.getElementsByTagName('path');
        var vehicle_length = vehicle.length;

        for(var i = 0; i < vehicle_length; i++) {
            vehicle[i].addEventListener('click', this.clickVehicle.bind(this, vehicle[i]));
        }
    }
}

export default Menu;