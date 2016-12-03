class Menu {

    constructor(roundaboutDrawer, cellularAutomata, twojs) {
        this._roundaboutDrawer = roundaboutDrawer;
        this._cellularAutomata = cellularAutomata;
        this._twojs = twojs;
        this._pause = false;
        this._start = false;
        this._speed = 700;
    }

    nextIteration() {
        if (this._pause) {
            return;
        }
        this.counterQueues();
        this._cellularAutomata.nextIteration();
        this.eventVehicle();

        if (this._cellularAutomata.hasFinished()) {
            console.log("Finished simulation, ", this._cellularAutomata.iterations());
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

        var speed = {
            'Car': document.getElementById('car-speed'),
            'Motorcycle': document.getElementById('motorcycle-speed'),
            'Van': document.getElementById('van-speed'),
            'MiniBus': document.getElementById('minibus-speed'),
            'Bus': document.getElementById('bus-speed'),
            'Truck': document.getElementById('truck-speed')
        };

        buttonStart.addEventListener('click', this.clickStart.bind(this));
        buttonPause.addEventListener('click', this.clickPause.bind(this));
        selectSpeed.addEventListener('change', this.selectSpeed.bind(this, selectSpeed));
        this.eventSpeedVehicle(speed);

    }

    clickStart() {
        if (!this._start) {
            this._start = true;
            this.nextIteration();
        } else if (this._start && this._pause) {
            this._pause = false;
            this.nextIteration();
        }
    }

    clickPause() {
        this._pause = true;
    }

    selectSpeed(e, s) {
        var speed = e.value;
        this._speed = speed;
    }

    clickVehicle(e, s) {
        var id = e.getAttribute('id-vehicle');
        if (id) {
            var vehicle = this._cellularAutomata.getVehicle(id);
            this.tableVehicle(vehicle);
        }
    }

    tableVehicle(vehicle){
        this.changeValueInElement(document.getElementById('vehicle-id'), vehicle.id());
        this.changeValueInElement(document.getElementById('vehicle-type'), vehicle.getName());
        this.changeValueInElement(document.getElementById('vehicle-currentspeed'), vehicle.currentSpeed());
        this.changeValueInElement(document.getElementById('vehicle-maxspeed'), vehicle.maxSpeed());
    }

    eventVehicle() {
        var vehicle = document.getElementsByTagName('path');
        var vehicle_length = vehicle.length;

        for (var i = 0; i < vehicle_length; i++) {
            vehicle[i].addEventListener('click', this.clickVehicle.bind(this, vehicle[i]));
        }
    }

    eventSpeedVehicle(speedVehicle) {
        var keys = Object.keys(speedVehicle);
        var keys_length = keys.length;

        for (var i = 0; i < keys_length; i++) {
            var key = keys[i];
            speedVehicle[key].addEventListener('change', this.changeSpeedVehicle.bind(this, speedVehicle[key], key));
        }
    }

    changeSpeedVehicle(speed, key) {
        var vehicles = this._cellularAutomata.getVehicles();
        console.log(vehicles.length);

        //change the speed to the vehicle on the road
        vehicles.forEach((vehicle) => {
            if (vehicle.getName() == key) {
                vehicle.setMaxSpeed(speed.value)
            }
        });

        //change the speed to the vehicle on the queue
        this._cellularAutomata.getVehiclesQueues().forEach((queue, queueLane) => {
            queue._vehicles.forEach((vehicle) => {
                if (vehicle.getName() == key) {
                    vehicle.setMaxSpeed(speed.value);
                }
            });
        });
    }

    counterQueues() {
        var counter = new Array();
        counter['N'] = 0;
        counter['S'] = 0;
        counter['W'] = 0;
        counter['E'] = 0;

        this._cellularAutomata._vehiclesQueues.forEach((queue, queueLane) => {
            if (queueLane == 'N_ENTRANCE_0' || queueLane == 'N_ENTRANCE_1') {
                counter['N'] += queue._vehicles.length;
            } else if (queueLane == 'S_ENTRANCE_0' || queueLane == 'S_ENTRANCE_1') {
                counter['S'] += queue._vehicles.length;
            } else if (queueLane == 'W_ENTRANCE_0' || queueLane == 'W_ENTRANCE_1') {
                counter['W'] += queue._vehicles.length;
            } else if (queueLane == 'E_ENTRANCE_0' || queueLane == 'E_ENTRANCE_1') {
                counter['E'] += queue._vehicles.length;
            }
        });
        this.tableQueues(counter)
    }

    tableQueues(counter) {
        this.changeValueInElement(document.getElementById('queue-north'), counter['N']);
        this.changeValueInElement(document.getElementById('queue-south'), counter['S']);
        this.changeValueInElement(document.getElementById('queue-west'), counter['W']);
        this.changeValueInElement(document.getElementById('queue-east'), counter['E']);
    }

    changeValueInElement(element, value) {
        element.innerText = value;
    }
}

export default Menu;