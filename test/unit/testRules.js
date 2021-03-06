import Direction from '../../src/Simulation/Specification/Direction.js';
import {DrivingRules} from '../../src/Simulation/DrivingRules.js';
import {CurrentRules as CurrentEntranceRules} from '../../src/Simulation/EntranceRules.js';
import {SuggestedRules as SuggestedEntranceRules} from '../../src/Simulation/EntranceRules.js';
import {CurrentRules as CurrentExitRules} from '../../src/Simulation/ExitRules.js';
import {SuggestedRules as SuggestedExitRules} from '../../src/Simulation/ExitRules.js';
import {SuggestedRulesWithChangedRightOfWay as SuggestedExitRulesWithChangedRightOfWay} from '../../src/Simulation/ExitRules.js';
import VehicleFactory from '../../src/Simulation/VehicleFactory.js'
import CellsLane from '../../src/Simulation/CellsLane.js';
import Path from '../../src/Simulation/Path.js';

describe("Rule", function() {

    var drivingRules;
    const TWO_LANE_ROUNDABOUT = 2;
    const THREE_LANE_ROUNDABOUT = 3;

    beforeEach(()=>{
        drivingRules = DrivingRules.newRules1(2);
    });

    function fakeLane(laneId, rounded=true) {
        return {"parentLane": () => {return CellsLane.newLane(laneId, 10, rounded)}};
    }

    function givenCarOnOuterLane(directionExit, exitLaneId=1) {
        var car_outer_lane = VehicleFactory.newCar(drivingRules);
        var path = new Path(null, null, 1, directionExit, exitLaneId);
        car_outer_lane.setPath(path);
        spyOn(car_outer_lane, "currentLaneId").and.returnValue(1);
        spyOn(car_outer_lane, "frontCell").and.returnValue(fakeLane(1));
        spyOn(car_outer_lane, "isOnRoundabout").and.returnValue(true);
        spyOn(car_outer_lane, "isEnteringRoundabout").and.returnValue(false);
        return car_outer_lane;
    }

    function givenCarOnMiddleLane(directionExit, exitLaneId=1) {
        var car_middle_lane = VehicleFactory.newCar(drivingRules);
        var path = new Path(null, null, 0, directionExit, exitLaneId);
        car_middle_lane.setPath(path);
        spyOn(car_middle_lane, "currentLaneId").and.returnValue(0);
        spyOn(car_middle_lane, "frontCell").and.returnValue(fakeLane(0));
        spyOn(car_middle_lane, "isOnRoundabout").and.returnValue(true);
        spyOn(car_middle_lane, "isEnteringRoundabout").and.returnValue(false);
        return car_middle_lane;
    }

    function givenCarOnEntrance(entranceLaneId, roundaboutLaneId, exitLaneId) {
        var car = VehicleFactory.newCar(drivingRules);
        var path = new Path(
            Direction.newNorth(), entranceLaneId, roundaboutLaneId, Direction.newSouth(), exitLaneId
        );
        car.setPath(path);
        spyOn(car, "frontCell").and.returnValue(
            fakeLane(`${car.entranceRoadId()}_ENTRANCE_${entranceLaneId}`, false)
        );
        spyOn(car, "isOnRoundabout").and.returnValue(false);
        spyOn(car, "isEnteringRoundabout").and.returnValue(true);
        return car;
    }

    it('exit rule #1 middle-left yields to outer-left', () => {
        var exitRules = new CurrentExitRules(TWO_LANE_ROUNDABOUT);
        var cars_exit = Direction.newNorth();
        var car_outer_lane = givenCarOnOuterLane(cars_exit);
        var car_middle_lane = givenCarOnMiddleLane(cars_exit);

        expect(exitRules.shouldYieldTo(car_middle_lane, car_outer_lane)).toBe(true);
        expect(exitRules.shouldYieldTo(car_outer_lane, car_middle_lane)).toBe(false);
    });

    it('exit rule #1 middle-left yields to outer-outer', () => {
        var exitRules = new CurrentExitRules(TWO_LANE_ROUNDABOUT);
        var north_exit = Direction.newNorth();
        var west_exit = Direction.newWest();
        var car_outer_lane = givenCarOnOuterLane(west_exit);
        var car_middle_lane = givenCarOnMiddleLane(north_exit);

        expect(exitRules.shouldYieldTo(car_middle_lane, car_outer_lane)).toBe(true);
        expect(exitRules.shouldYieldTo(car_outer_lane, car_middle_lane)).toBe(false);
    });

    it('exit rule #1 middle-left does not yield to outer-right', () => {
        var exitRules = new CurrentExitRules(TWO_LANE_ROUNDABOUT);
        var cars_exit = Direction.newNorth();
        var car_outer_lane = givenCarOnOuterLane(cars_exit, 1);
        var car_middle_lane = givenCarOnMiddleLane(cars_exit, 0);

        expect(exitRules.shouldYieldTo(car_middle_lane, car_outer_lane)).toBe(false);
        expect(exitRules.shouldYieldTo(car_outer_lane, car_middle_lane)).toBe(false);
    });

    it('exit rule #3 middle-left does not yield to right', () => {
        var exitRules = new SuggestedExitRulesWithChangedRightOfWay(TWO_LANE_ROUNDABOUT);
        var car_outer_lane = givenCarOnOuterLane(Direction.newEast(), 1);
        var car_middle_lane = givenCarOnMiddleLane(Direction.newNorth(), 0);

        expect(exitRules.shouldYieldTo(car_middle_lane, car_outer_lane)).toBe(false);
        expect(exitRules.shouldYieldTo(car_outer_lane, car_middle_lane)).toBe(true);
    });

    it('entrance rule #1 right-outer yields to outer-outer and does not yield to middle-middle', () => {
        var entranceRule = new CurrentEntranceRules(TWO_LANE_ROUNDABOUT);
        var car_outer_lane = givenCarOnOuterLane(Direction.newWest(), 1);
        var car_middle_lane = givenCarOnMiddleLane(Direction.newWest(), 1);
        var car_on_north_entrance = givenCarOnEntrance(0, 1, 0);

        expect(entranceRule.shouldYieldTo(car_on_north_entrance, car_outer_lane)).toBe(true);
        expect(entranceRule.shouldYieldTo(car_on_north_entrance, car_middle_lane)).toBe(false);
    });

    it('entrance rule #1 right-middle yields', () => {
        var entranceRule = new CurrentEntranceRules(TWO_LANE_ROUNDABOUT);
        var car_outer_lane = givenCarOnOuterLane(Direction.newWest(), 1);
        var car_middle_lane = givenCarOnMiddleLane(Direction.newWest(), 1);
        var car_on_right_lane = givenCarOnEntrance(0, 0, 0);

        expect(entranceRule.shouldYieldTo(car_on_right_lane, car_outer_lane)).toBe(true);
        expect(entranceRule.shouldYieldTo(car_on_right_lane, car_middle_lane)).toBe(true);
    });

    it('entrance rule #1 left-middle yields', () => {
        var entranceRule = new CurrentEntranceRules(TWO_LANE_ROUNDABOUT);
        var car_outer_lane = givenCarOnOuterLane(Direction.newWest(), 1);
        var car_middle_lane = givenCarOnMiddleLane(Direction.newWest(), 1);
        var car_on_left_lane = givenCarOnEntrance(1, 0, 1);
        var car_on_right_lane = givenCarOnEntrance(0, 1, 0);
        var car_on_right_lane_entering_the_same_lane = givenCarOnEntrance(0, 0, 0);

        expect(entranceRule.shouldYieldTo(car_on_left_lane, car_outer_lane)).toBe(true);
        expect(entranceRule.shouldYieldTo(car_on_left_lane, car_middle_lane)).toBe(true);
        expect(entranceRule.shouldYieldTo(car_on_left_lane, car_on_right_lane_entering_the_same_lane)).toBe(true)
        expect(entranceRule.shouldYieldTo(car_on_left_lane, car_on_right_lane)).toBe(false)
    });

    it('entrance rule #1 left-outer yields', () => {
        var entranceRule = new CurrentEntranceRules(TWO_LANE_ROUNDABOUT);
        var car_outer_lane = givenCarOnOuterLane(Direction.newWest(), 1);
        var car_middle_lane = givenCarOnMiddleLane(Direction.newWest(), 1);
        var car_on_left_lane = givenCarOnEntrance(1, 1, 1);
        var car_on_right_lane = givenCarOnEntrance(0, 0, 0);
        var car_on_right_lane_entering_the_same_lane = givenCarOnEntrance(0, 1, 0);

        expect(entranceRule.shouldYieldTo(car_on_left_lane, car_outer_lane)).toBe(true);
        expect(entranceRule.shouldYieldTo(car_on_left_lane, car_on_right_lane)).toBe(true);
        expect(entranceRule.shouldYieldTo(car_on_left_lane, car_on_right_lane_entering_the_same_lane)).toBe(true);
        expect(entranceRule.shouldYieldTo(car_on_left_lane, car_middle_lane)).toBe(false);
    });

    it('current exit rules let you take any lane from outer and left from middle', () => {
        var currentRules = new CurrentExitRules(TWO_LANE_ROUNDABOUT);
        expect(currentRules.possibleExitLanesFrom(1)).toEqual([0, 1]);
        expect(currentRules.possibleExitLanesFrom(0)).toEqual([1]);

        var currentRules = new CurrentExitRules(THREE_LANE_ROUNDABOUT);
        expect(currentRules.possibleExitLanesFrom(2)).toEqual([0, 1]);
        expect(currentRules.possibleExitLanesFrom(1)).toEqual([1]);
        expect(currentRules.possibleExitLanesFrom(0)).toEqual([]);
    });

    it('suggested exit rules let you take right lane from outer and left from middle', () => {
        var suggestedRules = new SuggestedExitRules(TWO_LANE_ROUNDABOUT);
        expect(suggestedRules.possibleExitLanesFrom(1)).toEqual([0]);
        expect(suggestedRules.possibleExitLanesFrom(0)).toEqual([1]);

        var suggestedRules = new SuggestedExitRules(THREE_LANE_ROUNDABOUT);
        expect(suggestedRules.possibleExitLanesFrom(2)).toEqual([0]);
        expect(suggestedRules.possibleExitLanesFrom(1)).toEqual([1]);
        expect(suggestedRules.possibleExitLanesFrom(0)).toEqual([]);
    });

    it('current entrance rules let you take any lane', () => {
        var currentRules = new CurrentEntranceRules(TWO_LANE_ROUNDABOUT);
        expect(currentRules.possibleRoundaboutLanesFrom(0)).toEqual([0, 1]);
        expect(currentRules.possibleRoundaboutLanesFrom(1)).toEqual([0, 1]);

        var currentRules = new CurrentEntranceRules(THREE_LANE_ROUNDABOUT);
        expect(currentRules.possibleRoundaboutLanesFrom(0)).toEqual([0, 1, 2]);
        expect(currentRules.possibleRoundaboutLanesFrom(1)).toEqual([0, 1, 2]);
    });

    it('suggested entrance rules each car keeps going its lane', () => {
        var suggestedRules = new SuggestedEntranceRules(TWO_LANE_ROUNDABOUT);
        expect(suggestedRules.possibleRoundaboutLanesFrom(0)).toEqual([1]);
        expect(suggestedRules.possibleRoundaboutLanesFrom(1)).toEqual([0]);

        var suggestedRules = new SuggestedEntranceRules(THREE_LANE_ROUNDABOUT);
        expect(suggestedRules.possibleRoundaboutLanesFrom(0)).toEqual([1, 2]);
        expect(suggestedRules.possibleRoundaboutLanesFrom(1)).toEqual([0, 1]);
    });
});