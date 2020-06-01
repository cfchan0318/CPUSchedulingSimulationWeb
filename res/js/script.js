Process = [];
sampleProcess = [{
    "processOrder": 1,
    "processName": "P1",
    "processDurationTime": 1,
    "processArrivalTime": 0,
    "processPriority": 2,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#FFFF00",

}, {
    "processOrder": 2,
    "processName": "P2",
    "processDurationTime": 7,
    "processArrivalTime": 1,
    "processPriority": 6,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#00FF00",
}, {
    "processOrder": 3,
    "processName": "P3",
    "processDurationTime": 3,
    "processArrivalTime": 2,
    "processPriority": 3,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#00FFFF",
},
{
    "processOrder": 4,
    "processName": "P4",
    "processDurationTime": 6,
    "processArrivalTime": 3,
    "processPriority": 5,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#FF0000",
},
{
    "processOrder": 5,
    "processName": "P5",
    "processDurationTime": 5,
    "processArrivalTime": 4,
    "processPriority": 4,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#FF00FF",
},
{
    "processOrder": 6,
    "processName": "P6",
    "processDurationTime": 15,
    "processArrivalTime": 5,
    "processPriority": 10,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#8B0000",
},
{
    "processOrder": 7,
    "processName": "P7",
    "processDurationTime": 8,
    "processArrivalTime": 15,
    "processPriority": 9,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#434343",
},
];

class simulation {
    constructor(processList) {

        //Setup
        this.process = processList;
        this.timeQuantum = $("#timeQuantum").val();

        //Summary Related
        this.totalWaitTime = 0;
        this.avgWaitTime = 0;
        this.totalTurnaroundTime = 0;
        this.avgTurnaroundTime = 0;

        //Algorithm related
        this.ready_queue = [];
        this.gantt = [];
        this.time = 0;

        //all time logs
        this.logActions = [];
        this.logReadyQueue = [];
        this.logGantt = [];
    }

    //Setup
    setProcessesTimeRemain() {
        for (var i = 0; i < this.process.length; i++) {
            this.process[i].timeRemain = this.process[i].processDurationTime;
        }
    }

    addProcessToReadyQueue() {
        //add Processes to ready_queue if 
        for (var i = 0; i < this.process.length; i++) {
            //console.log(process[i].processArrivalTime);
            if (this.time >= Number(this.process[i].processArrivalTime) &&
                !(this.ready_queue.includes(this.process[i])) &&
                this.process[i].exitTime === null) {

                this.ready_queue.push(this.process[i]);
                var log = `Time[${this.time}] Process ${this.process[i].processName} is added to the ready queue at ${this.time}`;
                this.pushActionsToLog(this.time, log);
            }
        }
    }

    allProcessTerminated() {
        var term = this.process.every(element => element.timeRemain === 0);
        return term;
    }

    //Gantt Chart Related
    addProcessGantt(process, startTime, endTime) {
        var newGantt = {
            "type": "process",
            "processName": process.processName,
            "burstTime": endTime - startTime,
            "startTime": startTime,
            "endTime": endTime,
            "color": process.color,
            "processPriority": process.processPriority,

        };
        this.gantt.push(newGantt);
    }

    addBlankGantt(time) {
        var newGantt = {
            "type": "gap",
            "processName": "",
            "burstTime": 1,
            "startTime": time,
            "endTime": time + 1,
            "color": "#ffffff",

        };
        this.gantt.push(newGantt);
    }

    pushReadyQueueToLog(time) {
        this.logReadyQueue[time] = JSON.parse(JSON.stringify(this.ready_queue));
    }

    pushGanttToLog(time) {
        this.logGantt[time] = JSON.parse(JSON.stringify(this.gantt));
    }

    pushActionsToLog(time, log) {
        if (this.logActions[time] !== undefined) {
            this.logActions[time].push(log);
        } else {
            this.logActions[time] = [];
            this.logActions[time].push(log);
        }
    }

    addExitTimeToProcess(name, time) {
        var Process_index = findWithAttr(this.process, "processName", name);
        this.process[Process_index].exitTime = time;
        this.process[Process_index].timeRemain = 0;
    }

    removeProcessFromReadyQueue(name) {
        var Process_index = findWithAttr(this.ready_queue, "processName", name);
        this.ready_queue.splice(Process_index, 1);
    }

    reduceTimeRemainByOne(name) {
        var Process_index = findWithAttr(this.process, "processName", name);
        this.process[Process_index].timeRemain -= 1;
    }

    getTimeRemain(name) {
        var Process_index = findWithAttr(this.process, "processName", name);
        return this.process[Process_index].timeRemain;
    }

};

class priorityNonPreemptiveLargeIsLow extends simulation {

    execute() {
        this.setProcessesTimeRemain();
        while (!this.allProcessTerminated()) {

            this.addProcessToReadyQueue();
            this.pushReadyQueueToLog(this.time);

            if (this.ready_queue.length > 0) {

                this.ready_queue.sort(sortByProperty("processPriority"));

                var executionTime = Number(this.ready_queue[0].processDurationTime);
                var startTime = this.time;
                var endTime = this.time + executionTime;

                this.addExitTimeToProcess(this.ready_queue[0].processName, endTime);

                var log = `Time[${startTime}]: Process ${this.ready_queue[0].processName} starts running at ${startTime}`;
                this.pushActionsToLog(startTime, log);

                this.addProcessGantt(this.ready_queue[0], this.time, endTime);

                var log = `Time[${endTime}]: Process ${this.ready_queue[0].processName} terminated at ${endTime}`;
                this.pushActionsToLog(endTime, log);

                this.ready_queue.splice(0, 1);
                this.pushGanttToLog(startTime);

                this.time = endTime;

            } else {
                if (this.allProcessTerminated()) {
                    break;
                } else {
                    this.addBlankGantt(this.time);
                    this.time++;
                }
            }
        }

    }

    run() {
        drawGantt(this.logGantt[this.logGantt.length - 1]);
    }
}

class priorityNonPreemptiveLargeIsHigh extends simulation {

    execute() {
        this.setProcessesTimeRemain();
        while (!this.allProcessTerminated()) {

            this.addProcessToReadyQueue();
            this.pushReadyQueueToLog(this.time);

            if (this.ready_queue.length > 0) {

                this.ready_queue.sort(sortByPropertyRevese("processPriority"));

                var executionTime = Number(this.ready_queue[0].processDurationTime);
                var startTime = this.time;
                var endTime = this.time + executionTime;

                this.addExitTimeToProcess(this.ready_queue[0].processName, endTime);

                var log = `Time[${startTime}]: Process ${this.ready_queue[0].processName} starts running at ${startTime}`;
                this.pushActionsToLog(startTime, log);

                this.addProcessGantt(this.ready_queue[0], this.time, endTime);

                var log = `Time[${endTime}]: Process ${this.ready_queue[0].processName} terminated at ${endTime}`;
                this.pushActionsToLog(endTime, log);

                this.ready_queue.splice(0, 1);
                this.pushGanttToLog(startTime);

                this.time = endTime;

            } else {
                if (this.allProcessTerminated()) {
                    break;
                } else {
                    this.addBlankGantt(this.time);
                    this.time++;
                }
            }
        }

    }

    run() {
        drawGantt(this.logGantt[this.logGantt.length - 1]);
    }
}

class priorityPreemptiveLargeIsLow extends simulation {
    execute() {
        this.setProcessesTimeRemain();
        while (!this.allProcessTerminated()) {

            this.addProcessToReadyQueue();
            this.pushReadyQueueToLog(this.time);

            if (this.ready_queue.length > 0) {

                this.ready_queue.sort(sortByProperty("processPriority"));

                var priorJob = this.ready_queue[0];
                var endTime = this.time + Number(this.getTimeRemain(this.ready_queue[0].processName));
                var startTime = this.time;

                var log = `Time[${startTime}]: Process ${this.ready_queue[0].processName} starts running at ${startTime} (Priority: ${this.ready_queue[0].processPriority})`;
                this.pushActionsToLog(startTime, log);

                while (this.time < endTime) {
                    this.addProcessToReadyQueue();
                    this.pushReadyQueueToLog(this.time);
                    this.ready_queue.sort(sortByProperty("processPriority"));

                    if (this.ready_queue[0] !== priorJob) {
                        break;
                    } else {
                        this.reduceTimeRemainByOne(priorJob.processName);
                        this.time++;
                    }
                }

                if (this.getTimeRemain(priorJob.processName) == 0) {

                    this.addExitTimeToProcess(priorJob.processName, this.time);
                    this.removeProcessFromReadyQueue(priorJob.processName);
                    var log = `Time[${this.time}]: Process ${priorJob.processName} terminated at ${this.time}`;
                    this.pushActionsToLog(this.time, log);

                } else {
                    var log = `Time[${this.time}]: Process ${priorJob.processName} stopped at ${this.time} (Priority : ${priorJob.processPriority})`;
                    this.pushActionsToLog(this.time, log);

                    if (this.ready_queue.length > 0) {
                        var log = `Time[${this.time}]: Process ${this.ready_queue[0].processName} has higher priority (Priority: ${this.ready_queue[0].processPriority})`;
                        this.pushActionsToLog(this.time, log);
                    }
                }

                this.addProcessGantt(priorJob, startTime, this.time);
                this.pushGanttToLog(startTime);
                
            } else {
                if (this.allProcessTerminated()) {
                    break;
                } else {
                    this.addBlankGantt(this.time);
                    this.time++;
                }
            }
        }

    }

    run() {
        drawGantt(this.logGantt[this.logGantt.length - 1]);
    }
}

class priorityPreemptiveLargeIsHigh extends simulation {
    execute() {
        this.setProcessesTimeRemain();
        while (!this.allProcessTerminated()) {

            this.addProcessToReadyQueue();
            this.pushReadyQueueToLog(this.time);

            if (this.ready_queue.length > 0) {

                this.ready_queue.sort(sortByPropertyRevese("processPriority"));

                var priorJob = this.ready_queue[0];
                var endTime = this.time + Number(this.getTimeRemain(this.ready_queue[0].processName));
                var startTime = this.time;

                var log = `Time[${startTime}]: Process ${this.ready_queue[0].processName} starts running at ${startTime} (Priority: ${this.ready_queue[0].processPriority})`;
                this.pushActionsToLog(startTime, log);

                while (this.time < endTime) {
                    this.addProcessToReadyQueue();
                    this.pushReadyQueueToLog(this.time);
                    this.ready_queue.sort(sortByPropertyRevese("processPriority"));

                    if (this.ready_queue[0] !== priorJob) {
                        break;
                    } else {
                        this.reduceTimeRemainByOne(priorJob.processName);
                        this.time++;
                    }
                }

                if (this.getTimeRemain(priorJob.processName) == 0) {

                    this.addExitTimeToProcess(priorJob.processName, this.time);
                    this.removeProcessFromReadyQueue(priorJob.processName);
                    var log = `Time[${this.time}]: Process ${priorJob.processName} terminated at ${this.time}`;
                    this.pushActionsToLog(this.time, log);

                } else {
                    var log = `Time[${this.time}]: Process ${priorJob.processName} stopped at ${this.time} (Priority : ${priorJob.processPriority})`;
                    this.pushActionsToLog(this.time, log);

                    if (this.ready_queue.length > 0) {
                        var log = `Time[${this.time}]: Process ${this.ready_queue[0].processName} has higher priority (Priority: ${this.ready_queue[0].processPriority})`;
                        this.pushActionsToLog(this.time, log);
                    }
                }

                this.addProcessGantt(priorJob, startTime, this.time);
                this.pushGanttToLog(startTime);
                
            } else {
                if (this.allProcessTerminated()) {
                    break;
                } else {
                    this.addBlankGantt(this.time);
                    this.time++;
                }
            }
        }

    }

    run() {
        drawGantt(this.logGantt[this.logGantt.length - 1]);
    }
}

class shortestJobFirst extends simulation {
    execute() {
        this.setProcessesTimeRemain();
        while (!this.allProcessTerminated()) {

            this.addProcessToReadyQueue();
            this.pushReadyQueueToLog(this.time);

            if (this.ready_queue.length > 0) {

                this.ready_queue.sort(sortByProperty("processDurationTime"));

                var executionTime = Number(this.ready_queue[0].processDurationTime);
                var startTime = this.time;
                var endTime = this.time + executionTime;

                this.addExitTimeToProcess(this.ready_queue[0].processName, endTime);

                var log = `Time[${startTime}]: Process ${this.ready_queue[0].processName} starts running at ${startTime}`;
                this.pushActionsToLog(startTime, log);

                this.addProcessGantt(this.ready_queue[0], this.time, endTime);

                var log = `Time[${endTime}]: Process ${this.ready_queue[0].processName} terminated at ${endTime}`;
                this.pushActionsToLog(endTime, log);

                this.ready_queue.splice(0, 1);
                this.pushGanttToLog(startTime);

                this.time = endTime;

            } else {
                if (this.allProcessTerminated()) {
                    break;
                } else {
                    this.addBlankGantt(this.time);
                    this.time++;
                }
            }
        }

    }

    run() {
        drawGantt(this.logGantt[this.logGantt.length - 1]);
    }
}

class shortestRemainingTime extends simulation {
    execute() {
        this.setProcessesTimeRemain();
        while (!this.allProcessTerminated()) {

            this.addProcessToReadyQueue();
            this.pushReadyQueueToLog(this.time);

            if (this.ready_queue.length > 0) {

                this.ready_queue.sort(sortByProperty("timeRemain"));

                var srtJob = this.ready_queue[0];
                var endTime = this.time + Number(this.getTimeRemain(this.ready_queue[0].processName));
                var startTime = this.time;

                var log = `Time[${startTime}]: Process ${this.ready_queue[0].processName} starts running at ${startTime} (Remaining Time: ${this.ready_queue[0].timeRemain})`;
                this.pushActionsToLog(startTime, log);

                while (this.time < endTime) {
                    this.addProcessToReadyQueue();
                    this.pushReadyQueueToLog(this.time);
                    this.ready_queue.sort(sortByProperty("timeRemain"));

                    if (this.ready_queue[0] !== srtJob) {
                        break;
                    } else {
                        this.reduceTimeRemainByOne(srtJob.processName);
                        this.time++;
                    }
                }

                if (this.getTimeRemain(srtJob.processName) == 0) {

                    this.addExitTimeToProcess(srtJob.processName, this.time);
                    this.removeProcessFromReadyQueue(srtJob.processName);
                    var log = `Time[${this.time}]: Process ${srtJob.processName} terminated at ${this.time}`;
                    this.pushActionsToLog(this.time, log);

                } else {
                    var log = `Time[${this.time}]: Process ${srtJob.processName} stopped at ${this.time} (Remaining Time: ${srtJob.timeRemain})`;
                    this.pushActionsToLog(this.time, log);

                    if (this.ready_queue.length > 0) {
                        var log = `Time[${this.time}]: Process ${this.ready_queue[0].processName} has shorter remaining time (Remaining Time: ${this.ready_queue[0].timeRemain})`;
                        this.pushActionsToLog(this.time, log);
                    }
                }

                this.addProcessGantt(srtJob, startTime, this.time);
                this.pushGanttToLog(startTime);

            } else {
                if (this.allProcessTerminated()) {
                    break;
                } else {
                    this.addBlankGantt(this.time);
                    this.time++;
                }
            }
        }

    }

    run() {
        drawGantt(this.logGantt[this.logGantt.length - 1]);
    }
}

class roundRobin extends simulation {
    execute() {
        this.setProcessesTimeRemain();
        while (!this.allProcessTerminated()) {

            this.addProcessToReadyQueue();
            this.pushReadyQueueToLog(this.time);

            if (this.ready_queue.length > 0) {

                if (this.ready_queue[0].timeRemain > Number(this.timeQuantum)) {

                    var startTime = this.time;
                    var endTime = this.time + Number(this.timeQuantum);
                    var log = `Time[${startTime}]: Process ${this.ready_queue[0].processName} starts running at ${startTime}`;
                    this.pushActionsToLog(startTime, log);

                    this.addProcessGantt(this.ready_queue[0], this.time, endTime);
                    this.pushGanttToLog(startTime);

                    this.ready_queue[0].timeRemain -= this.timeQuantum;

                    var log = `Time[${endTime}]: Process ${this.ready_queue[0].processName} stopped at ${endTime}`;
                    this.pushActionsToLog(endTime, log);

                    this.ready_queue.push(this.ready_queue[0]);
                    this.ready_queue.splice(0, 1);

                    this.time = endTime;

                } else {

                    var startTime = this.time;
                    var endTime = this.time + this.ready_queue[0].timeRemain;

                    this.addExitTimeToProcess(this.ready_queue[0].processName, endTime);

                    var log = `Time[${startTime}]: Process ${this.ready_queue[0].processName} starts running at ${startTime}`;
                    this.pushActionsToLog(startTime, log);

                    this.addProcessGantt(this.ready_queue[0], this.time, endTime);

                    var log = `Time[${endTime}]: Process ${this.ready_queue[0].processName} terminated at ${endTime}`;
                    this.pushActionsToLog(endTime, log);

                    this.ready_queue.splice(0, 1);
                    this.pushGanttToLog(startTime);

                    this.time = endTime;
                }

            } else {
                if (this.allProcessTerminated()) {
                    break;
                } else {
                    this.addBlankGantt(this.time);
                    this.time++;
                }
            }
        }

    }
    run() {
        drawGantt(this.logGantt[this.logGantt.length - 1]);
    }
}

class FCFS extends simulation {
    execute() {
        this.setProcessesTimeRemain();
        while (!this.allProcessTerminated()) {

            this.addProcessToReadyQueue();
            this.pushReadyQueueToLog(this.time);

            if (this.ready_queue.length > 0) {

                this.ready_queue.sort(sortByProperty("processArrivalTime"));

                var executionTime = Number(this.ready_queue[0].processDurationTime);
                var startTime = this.time;
                var endTime = this.time + executionTime;

                this.addExitTimeToProcess(this.ready_queue[0].processName, endTime);

                var log = `Time[${startTime}]: Process ${this.ready_queue[0].processName} starts running at ${startTime}`;
                this.pushActionsToLog(startTime, log);

                this.addProcessGantt(this.ready_queue[0], this.time, endTime);

                var log = `Time[${endTime}]: Process ${this.ready_queue[0].processName} terminated at ${endTime}`;
                this.pushActionsToLog(endTime, log);

                this.ready_queue.splice(0, 1);
                this.pushGanttToLog(startTime);

                this.time = endTime;

            } else {
                if (this.allProcessTerminated()) {
                    break;
                } else {
                    this.addBlankGantt(this.time);
                    this.time++;
                }
            }
        }

    }

    run() {
        drawGantt(this.logGantt[this.logGantt.length - 1]);
    }
}

//Asset
function sortByProperty(property) {
    return function (a, b) {
        if (a[property] > b[property])
            return 1;
        else if (a[property] < b[property])
            return -1;

        return 0;
    }
}

function sortByPropertyRevese(property) {
    return function (a, b) {
        if (a[property] < b[property])
            return 1;
        else if (a[property] > b[property])
            return -1;

        return 0;
    }
}



//Frontend
//Asset Variable
var order = 1;

// Create Process
function createProcess(processName, processDurationTime, processArrivalTime, processPriority) {
    var hasMatch = false;

    if (processName === "" || processDurationTime === "" || processArrivalTime === "") {
        updateProcessList();
    } else {

        for (var index = 0; index < Process.length; ++index) {
            if (Process[index].processName == processName) {
                hasMatch = true;
            }
        }

        if (isNaN(processDurationTime) || isNaN(processArrivalTime)) {
            alert("DurationTime and/or ArrivalTime must be numbers");
        }
        else if (hasMatch) {
            alert("Duplicate Process Name");
        }
        else {

            var colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
                '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
                '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
                '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
                '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
                '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
            var color = colors[Process.length];

            if (processPriority === undefined) {
                processPriority = 1;
            }
            newProcess = {
                "processOrder": order,
                "processName": processName,
                "processDurationTime": processDurationTime,
                "processArrivalTime": processArrivalTime,
                "processPriority": processPriority,
                "color": color,
                "waitTime": 0,
                "turnaroundTime": 0,
                "exitTime": null,

            };

            Process.push(newProcess);
            updateProcessList();
            order++;
        }

    }


}
//Update Process
function editProcess(processName) {
    var newName = prompt("Please Enter the new process name:");
    for (var x in Process) {
        if (Process[x]["processName"] == processName) {
            Process[x]["processName"] = newName;
            $("#rowProcessName" + processName).html(newName);
        }
    }
}

//Delete Process
function removeProcess(processName) {
    findAndRemove(Process, 'processName', processName);
    $('#rowProcessName' + processName).remove();
}

//Process List
function updateProcessList() {
    $("#processList tbody").html("");
    Process.forEach(element => {
        addProcessToTable(element);
    });
}

function calculateAllTime(process_class) {
    for (var i = 0; i < process_class.process.length; i++) {
        process_class.process[i].turnaroundTime = process_class.process[i].exitTime - process_class.process[i].processArrivalTime;
        process_class.process[i].waitTime = process_class.process[i].turnaroundTime - process_class.process[i].processDurationTime;
        process_class.totalTurnaroundTime += process_class.process[i].turnaroundTime;
        process_class.totalWaitTime += process_class.process[i].waitTime;
    }
    process_class.avgWaitTime = process_class.totalWaitTime / process_class.process.length;
    process_class.avgTurnaroundTime = process_class.totalTurnaroundTime / process_class.process.length;


}



//Interactive buttons
$(document).ready(function () {

    $('#createProcess').click(function () {
        var processName = $("#processName").val();
        var processDurationTime = $("#processDurationTime").val();
        var processArrivalTime = $("#processArrivalTime").val();
        var processPriority = 1;
        if ($("processPriority").val() !== 1) { processPriority = $("processPriority").val() }
        createProcess(processName, processDurationTime, processArrivalTime, processPriority);
    });

    var display_time = 0;

    var simulation;

    $('#startSimulation').click(function () {
        const temp_Process = JSON.parse(JSON.stringify(Process));


        if ($("input[id='mode']:checked").val() == "rr") {

            simulation = new roundRobin(Process);
            simulation.execute();

        } else if ($("input[id='mode']:checked").val() == "fcfs") {
            simulation = new FCFS(Process);
            simulation.execute();

        } else if ($("input[id='mode']:checked").val() == "sjf") {
            simulation = new shortestJobFirst(Process);
            simulation.execute();


        } else if ($("input[id='mode']:checked").val() == "srt") {
            simulation = new shortestRemainingTime(Process);
            simulation.execute();


        } else if ($("input[id='mode']:checked").val() == "pri-nonpre") {
            simulation = new priorityNonPreemptiveLargeIsLow(Process);
            simulation.execute();

        } else if ($("input[id='mode']:checked").val() == "pri-pre") {
            simulation = new priorityPreemptiveLargeIsLow(Process);
            simulation.execute();

        } else if ($("input[id='mode']:checked").val() == "pri-nonpre-rev") {
            simulation = new priorityNonPreemptiveLargeIsHigh(Process);
            simulation.execute();

        } else if ($("input[id='mode']:checked").val() == "pri-pre-rev") {

            simulation = new priorityPreemptiveLargeIsHigh(Process);
            simulation.execute();

        }


        if (simulation != null) {
            try {

                alert("Simulation is finished. \n" +
                    "You can now click Calculate All or Click Previous/Next" +
                    " to check how the algorithm works!\n" +
                    "Thanks for using qup! :)");
            } catch{
                alert("error");
            }
        }

        displayCurrentTime(display_time);
        calculateAllTime(simulation);
        drawReadyQueueForCertainTime(simulation.logReadyQueue, display_time);
        drawGanttForCertainTime(simulation.logGantt, display_time);
        drawLogsForCertainTime(simulation.logActions, display_time);

        //Reset
        Process = [];
        Process = JSON.parse(JSON.stringify(temp_Process));

    });

    $("#sampleProcess").click(function () {
        Process = [];
        Process = JSON.parse(JSON.stringify(sampleProcess));
        Process.forEach(element => {
            addProcessToTable(element);
        });
    });


    $("#calculateAll").click(function () {
        if (simulation !== null) {

            simulation.run();
            let lastGantt = simulation.logGantt[simulation.logGantt.length - 1];
            display_time = lastGantt[lastGantt.length - 1].endTime;
            displayCurrentTime(display_time);
            displaySummary(simulation);
            drawLogs(simulation.logActions, display_time);
        }
    });

    //Save Process to cookie
    $("#save").click(function () {
        var json_str = JSON.stringify(Process);
        createCookie("savedProcess", json_str);
        alert("Processes You created are saved.");
    });

    //Load Process to cookie
    $("#load").click(function () {
        var json_str = getCookie('savedProcess');
        Process = JSON.parse(json_str);
        Process.forEach(element => {
            addProcessToTable(element);
        });
    });



    $("#previous").click(function () {
        if (display_time >= 0) {
            display_time--;
            displayCurrentTime(display_time);
            drawGanttForCertainTime(simulation.logGantt, display_time);
            drawLogsForCertainTime(simulation.logActions, display_time);
            drawReadyQueueForCertainTime(simulation.logReadyQueue, display_time);
        } else {
            alert("there's nothing before you start the simulation lol.");
        }
    });

    $("#next").click(function () {
        let lastGantt = simulation.logGantt[simulation.logGantt.length - 1];
        if (display_time >= lastGantt[lastGantt.length - 1].endTime) {
            displaySummary(simulation);
            alert("there's nothing this far lol.");
        } else {
            display_time++;
            displayCurrentTime(display_time);
            drawGanttForCertainTime(simulation.logGantt, display_time);
            drawLogsForCertainTime(simulation.logActions, display_time);
            drawReadyQueueForCertainTime(simulation.logReadyQueue, display_time);
        }
    });

});


function addProcessToTable(process) {

    $("#processList tbody").append(
        "<tr  id='rowProcessName" + process.processName + "'> " +
        " <td>" + process.processName + "</td>" +
        " <td>" + process.processDurationTime + "</td>" +
        " <td>" + process.processArrivalTime + "</td>" +
        " <td>" + process.processPriority + "</td>" +
        "<td>" +
        "<div class=\"dropdown\">" +
        "<button class=\"btn-sm btn-primary dropdown-toggle\" type=\"button\" id = \"dropdownMenuButton\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" >" +
        "</button> " +
        "<div class= \"dropdown-menu\" aria-labelledby=\"dropdownMenuButton\" >" +
        "<a class=\"dropdown-item\" href='#' onclick='editProcess(\"" + process.processName + "\");' >Edit</a>" +
        "<a class=\"dropdown-item\" href='#' onclick='removeProcess(\"" + process.processName + "\");' >Delete</a>" +
        "</div >" +
        "</div > " +
        "</td>" +
        "</tr>"
    );
}

//Gantt Chart
function drawGantt(gantt) {


    var bar = "";

    for (var i = 0; i < gantt.length; i++) {

        if (gantt[i].type === "process") {
            var bar = bar + "<div class=\"gantt-inner\">" +
                "<div class=\"gantt-process\">" +
                "<div class=\"gantt-name\">" + gantt[i].processName + "</div>" +
                "<div class=\"gantt-burst\">(" + gantt[i].burstTime + ")</div>" +
                "<h6> Priority: " + gantt[i].processPriority + "</h6>" +
                "</div>" +
                "<div class=\"gantt-bar\" style=\"width:" + gantt[i].burstTime * 6 + "rem; background-color:" + gantt[i].color + ";\"></div>" +
                "<div class=\"gantt-time\">" +
                "<div class=\"gantt-start\">" + gantt[i].startTime + "</div>" +
                "<div class=\"gantt-end\">" + gantt[i].endTime + "</div>" +
                "</div>" +
                "</div>";

        } else if (gantt[i].type === "gap") {

            var bar = bar + "<div class=\"gantt-inner\">" +
                "<div class=\"gantt-process\">" +
                "</div>" +
                "<div class=\"gantt-bar\" style=\"width:" + gantt[i].burstTime * 6 + "rem; background-color:" + gantt[i].color + ";\"></div>" +
                "<div class=\"gantt-time\">" +
                "</div>" +
                "</div>";

        }
    }
    $(".gantt-container").html(bar);
}

//Gantt Chart
function drawGanttForCertainTime(gantt, time) {
    try {
        if (gantt[time].length > 0) {

            var bar = "";

            for (var i = 0; i < gantt[time].length; i++) {

                if (gantt[time][i].type === "process") {
                    var bar = bar + "<div class=\"gantt-inner\">" +
                        "<div class=\"gantt-process\">" +
                        "<div class=\"gantt-name\">" + gantt[time][i].processName + "</div>" +
                        "<div class=\"gantt-burst\">(" + gantt[time][i].burstTime + ")</div>" +
                        "<h6> Priority: " + gantt[time][i].processPriority + "</h6>" +
                        "</div>" +
                        "<div class=\"gantt-bar\" style=\"width:" + gantt[time][i].burstTime * 6 + "rem; background-color:" + gantt[time][i].color + ";\"></div>" +
                        "<div class=\"gantt-time\">" +
                        "<div class=\"gantt-start\">" + gantt[time][i].startTime + "</div>" +
                        "<div class=\"gantt-end\">" + gantt[time][i].endTime + "</div>" +
                        "</div>" +
                        "</div>";

                } else if (gantt[time][i].type === "gap") {

                    var bar = bar + "<div class=\"gantt-inner\">" +
                        "<div class=\"gantt-process\">" +
                        "</div>" +
                        "<div class=\"gantt-bar\" style=\"width:" + gantt[time][i].burstTime * 6 + "rem; background-color:" + gantt[time][i].color + ";\"></div>" +
                        "<div class=\"gantt-time\">" +
                        "</div>" +
                        "</div>";

                }
            }
            $(".gantt-container").html(bar);

        }
    } catch{
        //catch nothing
    }

}

//Ready Queue
function drawReadyQueueForCertainTime(ready_queue, time) {
    try {
        if (ready_queue[time].length > 0) {
            var bar = "";
            for (var i = 0; i < ready_queue[time].length; i++) {
                order = i + 1;
                bar += "#" + order + ": " + ready_queue[time][i].processName + "<br/>"
            }
            $(".readyQueueContainer").html(bar);
        }
    } catch{
        //catch nothing
    }
}

//Logs
function drawLogs(logs, time) {
    try {
        var bar = "";
        for (var t = 0; t <= time; t++) {
            for (var i = 0; i < logs[t].length; i++) {
                bar += "<div class='row'>" + logs[t][i] + "</div>"
            }
        }
        $(".LogContainer").html(bar);

    } catch{ }

}

function drawLogsForCertainTime(logs, time) {
    try {
        var bar = "";
        for (var i = 0; i < logs[time].length; i++) {
            bar += "<div class='row'>" + logs[time][i] + "</div>"
        }
        $(".LogContainer").html(bar);
    } catch{ }


}

function displayCurrentTime(time) {
    $("#currentTime").html(time);
}

function displaySummary(instance) {
    var summary = "";
    for (var i = 0; i < instance.process.length; i++) {
        summary += "<div class='card  col-lg-3 col-md-4 col-xs-12'><p>" +
            "<div class='card-body'>" +
            "<h5 class='card-title'>" + instance.process[i].processName + "</h6>" +
            "Arrival Time: " + instance.process[i].processArrivalTime + "<br/>" +
            "Exit Time: " + instance.process[i].exitTime + "<br/>" +
            "Burst Time: " + instance.process[i].processDurationTime + "<br/>" +
            "Wait Time: " + instance.process[i].turnaroundTime + "-" + instance.process[i].processDurationTime + " = " + instance.process[i].waitTime + "<br/>" +
            "Turnaround Time: " + instance.process[i].exitTime + "-" + instance.process[i].processArrivalTime + " = " + instance.process[i].turnaroundTime + "</p>"
            + "</div>"
            + "</div>";
    }
    $("#summary").html(summary);

    $("#summary_totalWaitTime").html("Total Wait Time: " + instance.totalWaitTime);
    $("#summary_avgWaitTime").html("Average Wait Time: " + instance.avgWaitTime);
    $("#summary_totalTurnaroundTime").html("Total Turnaround Time: " + instance.totalTurnaroundTime);
    $("#summary_avgTurnaroundTime").html("Average Turnaround Time: " + instance.avgTurnaroundTime);

}
//Asset


function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}


function sortByProperty(property) {
    return function (a, b) {
        if (a[property] > b[property])
            return 1;
        else if (a[property] < b[property])
            return -1;

        return 0;
    }
}

function sortByPropertyRevese(property) {
    return function (a, b) {
        if (a[property] < b[property])
            return 1;
        else if (a[property] > b[property])
            return -1;

        return 0;
    }
}

function createCookie() {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (5 * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    else {
        expires = "";
    }
    document.cookie = "processList=" + Process + expires + "; path=/";
}

function getCookie() {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf("processList" + "=");
        if (c_start != -1) {
            c_start = c_start + "processList" + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) {
                c_end = document.cookie.length;
            }
            Process = unescape(document.cookie.substring(c_start, c_end));
        }
    }
}