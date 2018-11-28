/**
 * Created on 25.11.2018 - 08:38
 * part of bms_UI
 * @author user12043
 */

const fullVoltageOfCell = 4.2;

let interval;
let cellsNumber = 10;
let totalVoltage = cellsNumber * fullVoltageOfCell;
let currentValues = [];
$(document).ready(function () {
    let $batteriesTable = $("#batteriesTable");
    let $tr = $(document.createElement("tr"));

    function createCells(cellsNumber) {
        for (let i = 0; i < cellsNumber; i++) {
            if (i % 5 === 0) {
                $tr = $(document.createElement("tr"));
            }
            let $element = $("#batteryTemplate").clone();
            $element.removeAttr("id");
            $element.css("display", "");
            $element.find(".batteryStatValue").html(0).attr("id", ("batteryStatValue_" + i));
            $element.find(".voltage").html(0).attr("id", ("voltage_" + i));
            $element.find(".batteryStatContainer").css("background", getBackgroundAttribute(0)).attr("id", ("batteryStatContainer_" + i));
            $tr.append($element);
            $batteriesTable.find("tbody").append($tr);
        }
        totalVoltage = cellsNumber * fullVoltageOfCell;
    }

    createCells(cellsNumber);

    function setCellValue(index, voltage, status) {
        let setStatus = (status) ? (status) : (Math.round((100 * voltage) / fullVoltageOfCell));
        $("#batteryStatValue_" + index).html(setStatus);
        $("#voltage_" + index).html(voltage.toFixed(2));
        $("#batteryStatContainer_" + index).css("background", getBackgroundAttribute(setStatus));
    }

    function setValues(voltages) {
        console.log(typeof voltages);
        let currentTotalVoltage = 0;
        for (let i = 0; i < cellsNumber; i++) {
            let setVoltage;
            if (voltages === undefined || voltages === null) {
                setVoltage = (Math.random() * (fullVoltageOfCell * 10)) / 10;
            } else if (typeof voltages == "number") {
                console.log(voltages);
                setVoltage = voltages;
            } else {
                setVoltage = voltages[i];
            }
            setCellValue(i, setVoltage);
            currentValues.splice(i, 0, setVoltage);
            currentTotalVoltage += setVoltage;
        }
        let totalStatus = (Math.round((100 * currentTotalVoltage) / totalVoltage));
        setCellValue("total", currentTotalVoltage, totalStatus);
    }

    function getBackgroundAttribute(status) {
        let color = "red";
        if (status > 60) {
            color = "green";
        } else if (status > 20) {
            color = "yellow";
        }
        return "linear-gradient(90deg, " + color + " " + status + "%, transparent 0%)";
    }

    $("#toggleSimulationButton").click((event) => {
        if (!interval) {
            console.log("Starting simulation!");
            interval = setInterval(setValues, 1000, undefined);
            $("#toggleFetchButton").prop("disabled", true);
            $(event.target).html("Stop simulation");
        } else {
            console.log("Stopping simulation!");
            clearInterval(interval);
            interval = undefined;
            setValues(0);
            $("#toggleFetchButton").prop("disabled", false);
            $(event.target).html("Start simulation");
        }
    });

    $("#toggleFetchButton").click((event) => {
        if (!interval) {
            interval = setInterval(fetchData, 1000);
            $("#toggleSimulationButton").prop("disabled", true);
            $(event.target).html("Stop fetching");
        } else {
            clearInterval(interval);
            interval = undefined;
            setValues(0);
            $("#toggleSimulationButton").prop("disabled", false);
            $(event.target).html("Start fetching");
        }
    });

    function fetchData() {
        $.ajax({
            url: "api/read",
            method: "GET",
            success: function (data, status, xhr) {
                // let array = data.split(",").map(Number);
                setValues(JSON.parse(data));
            },
            error: function (xhr, status, error) {
                $("#dataHeader").html("Error: \n" + error);
            }
        });
    }
});
