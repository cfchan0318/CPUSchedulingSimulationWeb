
Process = [];

/*Process = [{
    "processOrder": 1,
    "processName": "P1",
    "processDurationTime": 6,
    "processArrivalTime": 2,
    "processPriority": 1,
    "waitTime": null,
    "turnaroundTime": null,
    "color": "#FFFF00",

}, {
    "processOrder": 2,
    "processName": "P2",
    "processDurationTime": 2,
    "processArrivalTime": 5,
    "processPriority": 1,
    "waitTime": null,
    "turnaroundTime": null,
    "color": "#00FF00",
}, {
    "processOrder": 3,
    "processName": "P3",
    "processDurationTime": 8,
    "processArrivalTime": 1,
    "processPriority": 1,
    "waitTime": null,
    "turnaroundTime": null,
    "color": "#00FFFF",
},
{
    "processOrder": 4,
    "processName": "P4",
    "processDurationTime": 3,
    "processArrivalTime": 0,
    "processPriority": 1,
    "waitTime": null,
    "turnaroundTime": null,
    "color": "#FF0000",
},
{
    "processOrder": 5,
    "processName": "P5",
    "processDurationTime": 4,
    "processArrivalTime": 4,
    "processPriority": 1,
    "waitTime": null,
    "turnaroundTime": null,
    "color": "#FF00FF",
},
];
*/

sampleProcess = [{
    "processOrder": 1,
    "processName": "P1",
    "processDurationTime": 3,
    "processArrivalTime": 0,
    "processPriority": 2,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#FFFF00",

}, {
    "processOrder": 2,
    "processName": "P2",
    "processDurationTime": 5,
    "processArrivalTime": 2,
    "processPriority": 6,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#00FF00",
}, {
    "processOrder": 3,
    "processName": "P3",
    "processDurationTime": 4,
    "processArrivalTime": 1,
    "processPriority": 3,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#00FFFF",
},
{
    "processOrder": 4,
    "processName": "P4",
    "processDurationTime": 2,
    "processArrivalTime": 4,
    "processPriority": 5,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#FF0000",
},
{
    "processOrder": 5,
    "processName": "P5",
    "processDurationTime": 9,
    "processArrivalTime": 6,
    "processPriority": 7,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#FF00FF",
},
{
    "processOrder": 6,
    "processName": "P6",
    "processDurationTime": 4,
    "processArrivalTime": 5,
    "processPriority": 4,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#8B0000",
},
{
    "processOrder": 7,
    "processName": "P7",
    "processDurationTime": 10,
    "processArrivalTime": 7,
    "processPriority": 10,
    "waitTime": null,
    "turnaroundTime": null,
    "exitTime": null,
    "color": "#434343",
},
];

class qup_process {
    constructor(process) {
        this.gantt = [];
        this.process = process;
        this.totalWaitTime = 0;
        this.avgWaitTime = 0;
        this.totalTurnaroundTime = 0;
        this.avgTurnaroundTime = 0;
        this.status = null;
        this.ready_queue = [];
        this.show_gantt = [];
        this.total_time = 999;
        this.logs = [];
    }

};

//
class priorityPreemptiveLargeIsLow extends qup_process {
    execute(process) {
        var time = 0;
        var ready_queue = [];
        var total_time = this.total_time;
        var log_array = [];


        this.logs[time] = [];

        //assign remaining time to the duration for calcualtion
        for (var i = 0; i < process.length; i++) {
            process[i].timeRemain = process[i].processDurationTime;
        }

        //console.log(total_time);
        while (time < total_time) {

            console.log("The Time Now is: " + time);


            //add Processes to ready_queue if 
            for (var i = 0; i < process.length; i++) {

                //console.log(process[i].processArrivalTime);
                if (time >= Number(process[i].processArrivalTime) &&
                    !(ready_queue.includes(process[i])) &&
                    process[i].timeRemain > 0) {

                    var log = "Time=" + time + ", process: " + process[i].processName + " is added to ready queue";
                    this.logs[time].push(log);



                    ready_queue.push(process[i]);
                }
            }

            ready_queue.sort(sortByProperty("processPriority"));

            //Push Ready Queue to object for showing
            this.ready_queue[time] = JSON.parse(JSON.stringify(ready_queue));
            this.show_gantt[time] = JSON.parse(JSON.stringify(this.gantt));
            //console.log(this.show_gantt);
            //console.log(this.ready_queue);


            if (ready_queue.length > 0) {

                var job_srt = ready_queue[0];
                var job_srt_time = job_srt.timeRemain;
                var job_start_time = time;
                var exec_time = 0;


                while (exec_time < job_srt_time) {
                    console.log("The Time Now is: " + time);


                    //add Processes to ready queue During simulation
                    for (var i = 0; i < process.length; i++) {

                        if (time >= Number(process[i].processArrivalTime) &&
                            !(ready_queue.includes(process[i]))) {

                            if (process[i].timeRemain > 0) {
                                ready_queue.push(process[i]);
                                var log = "Time=" + time + ", process: " + process[i].processName + " is added to ready queue";
                                this.logs[time].push(log);
                            }

                        }
                    }


                    ready_queue.sort(sortByProperty("processPriority"));


                    if (ready_queue[0] !== job_srt) {


                        var index = findWithAttr(ready_queue, "processName", job_srt.processName);
                        if (ready_queue[index].timeRemain === 0) {

                            var log = "Time=" + time + ", process: " + process[i].processName + " terminated.";
                            this.logs[time].push(log);

                            //Add End time of process for calculation
                            var Process_index = findWithAttr(process, "processName", ready_queue[index].processName);
                            process[Process_index].exitTime = time;

                            var newGantt = {
                                "type": "process",
                                "processName": ready_queue[index].processName,
                                "burstTime": time - job_start_time,
                                "startTime": job_start_time,
                                "endTime": time,
                                "color": ready_queue[index].color,
                                "processPriority": ready_queue[index].processPriority,

                            };
                            this.gantt.push(newGantt);
                            ready_queue.splice(index, 1);

                        } else {

                            //console.log(job_srt.processName + " starts from " + job_start_time + " is done at " + time);
                            var log = "Time=" + time + ", process: " + job_srt + " stopped." + ready_queue[0] + " has higher priority of " + job_srt.processPriority;

                            this.logs[time].push(log);

                            var newGantt = {
                                "type": "process",
                                "processName": job_srt.processName,
                                "burstTime": time - job_start_time,
                                "startTime": job_start_time,
                                "endTime": time,
                                "color": job_srt.color,
                                "processPriority": job_srt.processPriority,

                            };
                            this.gantt.push(newGantt);
                        }


                        break;
                    } else if (ready_queue[0] === job_srt) {

                        var index = findWithAttr(ready_queue, "processName", job_srt.processName);
                        ready_queue[index].timeRemain -= 1;

                        time++;
                        exec_time++;
                        this.logs[time] = [];

                        if (ready_queue[index].timeRemain === 0) {

                            //console.log(ready_queue[index].processName + " starts from " + job_start_time + " is done at " + time);
                            log = "Time=" + time + ", process: " + ready_queue[index].processName + " terminated.";
                            this.logs[time].push(log);

                            //Add End time of process for calculation
                            var Process_index = findWithAttr(process, "processName", ready_queue[index].processName);
                            process[Process_index].exitTime = time;

                            var newGantt = {
                                "type": "process",
                                "processName": ready_queue[index].processName,
                                "burstTime": time - job_start_time,
                                "startTime": job_start_time,
                                "endTime": time,
                                "color": ready_queue[index].color,
                                "processPriority": ready_queue[index].processPriority,

                            };
                            this.gantt.push(newGantt);
                            ready_queue.splice(index, 1);
                        }



                    } else {
                        break;
                    }

                }


            } else {

                var allProcessDone;
                for (var i = 0; i < process.length; i++) {
                    if (process[i].timeRemain > 0) {
                        allProcessDone = false;

                    } else {
                        allProcessDone = true;
                    }
                }

                //console.log(ready_queue[index].processName + " starts from " + job_start_time + " is done at " + time);
                log = "Time=" + time + ", ALL processes terminated. Simulation Done.";
                log_array.push(log);
                this.logs[time] = log_array;
                log_array = [];

                if (allProcessDone === false) {


                    var newGantt = {
                        "type": "gap",
                        "processName": "",
                        "burstTime": 1,
                        "startTime": time,
                        "endTime": time + 1,
                        "color": "#ffffff",

                    };
                    this.gantt.push(newGantt);


                } else {


                    break;
                }

                time++;
            }
            //end of loop
        }
    }

    run() {
        //this.execute(this.process);
        drawGantt(this.gantt);
    }
}

//ok
class priorityNonPreemptiveLargeIsLow extends qup_process {
    execute(process) {
        var time = 0;
        var ready_queue = [];
        var total_time = this.total_time;

        for (var i = 0; i < process.length; i++) {
            process[i].timeRemain = process[i].processDurationTime;
        }

        //console.log(total_time);
        while (time < total_time) {

            console.log("The Time Now is: " + time);

            //add Processes to ready_queue if 
            for (var i = 0; i < process.length; i++) {
                //console.log(process[i].processArrivalTime);
                if (time >= Number(process[i].processArrivalTime) &&
                    !(ready_queue.includes(process[i])) &&
                    process[i].timeRemain > 0) {

                    ready_queue.push(process[i]);

                }
            }

            //Push Ready Queue to object for showing
            this.ready_queue[time] = JSON.parse(JSON.stringify(ready_queue));
            this.show_gantt[time] = JSON.parse(JSON.stringify(this.gantt));
            console.log(this.show_gantt);
            console.log(this.ready_queue);


            if (ready_queue.length > 0) {

                ready_queue.sort(sortByProperty("processPriority"));

                var temp_time = Number(ready_queue[0].processDurationTime);

                console.log("Process: " + ready_queue[0].processName + " Ran for " + temp_time + " and its done");

                var newGantt = {
                    "type": "process",
                    "processName": ready_queue[0].processName,
                    "burstTime": temp_time,
                    "startTime": time,
                    "endTime": time + temp_time,
                    "color": ready_queue[0].color,
                    "processPriority": ready_queue[0].processPriority,

                };
                this.gantt.push(newGantt);

                process[findWithAttr(process, "processName", ready_queue[0].processName)].timeRemain = 0;

                //Add End time of process for calculation
                var Process_index = findWithAttr(process, "processName", ready_queue[0].processName);
                process[Process_index].exitTime = time + temp_time;

                ready_queue.splice(0, 1);

                time = time + temp_time;

            } else {

                var allProcessDone;
                for (var i = 0; i < process.length; i++) {
                    if (process[i].timeRemain > 0) {
                        allProcessDone = false;

                    } else {
                        allProcessDone = true;
                    }
                }

                if (allProcessDone === false) {
                    var newGantt = {
                        "type": "gap",
                        "processName": "",
                        "burstTime": 1,
                        "startTime": time,
                        "endTime": time + 1,
                        "color": "#ffffff",

                    };
                    this.gantt.push(newGantt);


                } else {
                    break;
                }

                time++;
            }
            //end of loop
        }
    }

    run() {
        drawGantt(this.gantt);
    }
}

//ok
class priorityPreemptiveLargeIsHigh extends qup_process {
    execute(process) {
        var time = 0;
        var ready_queue = [];
        var total_time = this.total_time;

        this.logs[time] = [];

        //assign remaining time to the duration for calcualtion
        for (var i = 0; i < process.length; i++) {
            process[i].timeRemain = process[i].processDurationTime;
        }

        //console.log(total_time);
        while (time < total_time) {
            console.log("The Time Now is: " + time);

            //add Processes to ready_queue if 
            for (var i = 0; i < process.length; i++) {

                //console.log(process[i].processArrivalTime);
                if (time >= Number(process[i].processArrivalTime) &&
                    !(ready_queue.includes(process[i])) &&
                    process[i].timeRemain > 0) {


                    ready_queue.push(process[i]);
                    var log = "Time=" + time + ", process: " + process[i].processName + " is added to ready queue";
                    this.logs[time].push(log);
                }
            }

            ready_queue.sort(sortByPropertyRevese("processPriority"));

            //Push Ready Queue to object for showing
            this.ready_queue[time] = JSON.parse(JSON.stringify(ready_queue));
            this.show_gantt[time] = JSON.parse(JSON.stringify(this.gantt));
            //console.log(this.show_gantt);
            console.log(this.ready_queue);


            if (ready_queue.length > 0) {

                var job_srt = ready_queue[0];
                var job_srt_time = job_srt.timeRemain;
                var job_start_time = time;
                var exec_time = 0;


                while (exec_time < job_srt_time) {
                    console.log("The Time Now is: " + time);

                    log = "Time=" + time + ", process: " + ready_queue[0].processName + " is running.";
                    this.logs[time].push(log);

                    //add Processes to ready queue
                    for (var i = 0; i < process.length; i++) {
                        //console.log("Time remain for " + process[i].processName + " is " + process[i].timeRemain);
                        if (time >= Number(process[i].processArrivalTime) &&
                            !(ready_queue.includes(process[i]))) {

                            if (process[i].timeRemain > 0) {
                                ready_queue.push(process[i]);
                                var log = "Time=" + time + ", process: " + process[i].processName + " is added to ready queue";
                                this.logs[time].push(log);
                            }

                        }
                    }


                    ready_queue.sort(sortByPropertyRevese("processPriority"));


                    if (ready_queue[0] !== job_srt) {


                        var index = findWithAttr(ready_queue, "processName", job_srt.processName);
                        if (ready_queue[index].timeRemain === 0) {
                            //console.log(ready_queue[index].processName + " starts from " + job_start_time + " is done at " + time);
                            var log = "Time=" + time + ", process: " + ready_queue[index].processName + " terminated.";
                            this.logs[time].push(log);

                            var newGantt = {
                                "type": "process",
                                "processName": ready_queue[index].processName,
                                "burstTime": time - job_start_time,
                                "startTime": job_start_time,
                                "endTime": time,
                                "color": ready_queue[index].color,
                                "processPriority": ready_queue[index].processPriority,
                            };
                            this.gantt.push(newGantt);
                            ready_queue.splice(index, 1);
                        } else {
                            console.log(job_srt.processName + " starts from " + job_start_time + " is done at " + time);

                            var log = "Time=" + time + ", process: " + job_srt.processName + " stopped. Process " + ready_queue[0].processName + " has higher priority of " + job_srt.processPriority;
                            this.logs[time].push(log);

                            var newGantt = {
                                "type": "process",
                                "processName": job_srt.processName,
                                "burstTime": time - job_start_time,
                                "startTime": job_start_time,
                                "endTime": time,
                                "color": job_srt.color,
                                "processPriority": job_srt.processPriority,

                            };
                            this.gantt.push(newGantt);
                        }


                        break;
                    } else if (ready_queue[0] === job_srt) {

                        var index = findWithAttr(ready_queue, "processName", job_srt.processName);
                        ready_queue[index].timeRemain -= 1;

                        time++;
                        exec_time++;
                        this.logs[time] = [];

                        if (ready_queue[index].timeRemain === 0) {
                            console.log(ready_queue[index].processName + " starts from " + job_start_time + " is done at " + time);
                            log = "Time=" + time + ", process: " + ready_queue[index].processName + " terminated.";
                            this.logs[time].push(log);

                            //Add End time of process for calculation
                            var Process_index = findWithAttr(process, "processName", ready_queue[index].processName);
                            process[Process_index].exitTime = time;

                            var newGantt = {
                                "type": "process",
                                "processName": ready_queue[index].processName,
                                "burstTime": time - job_start_time,
                                "startTime": job_start_time,
                                "endTime": time,
                                "color": ready_queue[index].color,
                                "processPriority": ready_queue[index].processPriority,

                            };
                            this.gantt.push(newGantt);
                            ready_queue.splice(index, 1);
                        }


                    } else {
                        break;
                    }

                }


            } else {

                var allProcessDone;
                for (var i = 0; i < process.length; i++) {
                    if (process[i].timeRemain > 0) {
                        allProcessDone = false;

                    } else {
                        allProcessDone = true;
                    }
                }


                if (allProcessDone === false) {
                    var newGantt = {
                        "type": "gap",
                        "processName": "",
                        "burstTime": 1,
                        "startTime": time,
                        "endTime": time + 1,
                        "color": "#ffffff",

                    };
                    this.gantt.push(newGantt);


                } else {

                    var log = "Time=" + time + ", ALL processes terminated. Simulation Done.";
                    this.logs[time].push(log);
                    //log_array = [];

                    break;
                }

                time++;
            }
            //end of loop
        }
    }

    run() {
        //this.execute(this.process);
        drawGantt(this.gantt);
    }
}

//Test ok
class priorityNonPreemptiveLargeIsHigh extends qup_process {
    execute(process) {
        var time = 0;
        var ready_queue = [];
        var total_time = this.total_time;

        for (var i = 0; i < process.length; i++) {
            process[i].timeRemain = process[i].processDurationTime;
        }

        //console.log(total_time);
        while (time < total_time) {

            console.log("The Time Now is: " + time);

            //add Processes to ready_queue if 
            for (var i = 0; i < process.length; i++) {
                //console.log(process[i].processArrivalTime);
                if (time >= Number(process[i].processArrivalTime) &&
                    !(ready_queue.includes(process[i])) &&
                    process[i].timeRemain > 0) {

                    ready_queue.push(process[i]);

                }
            }

            //Push Ready Queue to object for showing
            this.ready_queue[time] = JSON.parse(JSON.stringify(ready_queue));
            this.show_gantt[time] = JSON.parse(JSON.stringify(this.gantt));
            //console.log(this.show_gantt);
            //console.log(this.ready_queue);


            if (ready_queue.length > 0) {

                ready_queue.sort(sortByPropertyRevese("processPriority"));

                var temp_time = Number(ready_queue[0].processDurationTime);

                console.log("Process: " + ready_queue[0].processName + " Ran for " + temp_time + " and its done");

                var newGantt = {
                    "type": "process",
                    "processName": ready_queue[0].processName,
                    "burstTime": temp_time,
                    "startTime": time,
                    "endTime": time + temp_time,
                    "color": ready_queue[0].color,
                    "processPriority": ready_queue[0].processPriority,

                };
                this.gantt.push(newGantt);

                process[findWithAttr(process, "processName", ready_queue[0].processName)].timeRemain = 0;
                //Add End time of process for calculation
                var Process_index = findWithAttr(process, "processName", ready_queue[0].processName);
                process[Process_index].exitTime = time + temp_time;

                ready_queue.splice(0, 1);

                time = time + temp_time;

            } else {

                var allProcessDone;
                for (var i = 0; i < process.length; i++) {
                    if (process[i].timeRemain > 0) {
                        allProcessDone = false;

                    } else {
                        allProcessDone = true;
                    }
                }

                if (allProcessDone === false) {
                    var newGantt = {
                        "type": "gap",
                        "processName": "",
                        "burstTime": 1,
                        "startTime": time,
                        "endTime": time + 1,
                        "color": "#ffffff",

                    };
                    this.gantt.push(newGantt);


                } else {
                    break;
                }

                time++;
            }
            //end of loop
        }
    }

    run() {
        drawGantt(this.gantt);
    }
}

class shortestJobFirst extends qup_process {
    execute(process) {
        var time = 0;
        var ready_queue = [];
        var total_time = this.total_time;

        for (var i = 0; i < process.length; i++) {
            process[i].timeRemain = process[i].processDurationTime;
        }

        //console.log(total_time);
        while (time < total_time) {

            console.log("The Time Now is: " + time);

            //add Processes to ready_queue if 
            for (var i = 0; i < process.length; i++) {
                //console.log(process[i].processArrivalTime);
                if (time >= Number(process[i].processArrivalTime) &&
                    !(ready_queue.includes(process[i])) &&
                    process[i].timeRemain > 0) {

                    ready_queue.push(process[i]);

                }
            }

            //Push Ready Queue to object for showing
            this.ready_queue[time] = JSON.parse(JSON.stringify(ready_queue));
            this.show_gantt[time] = JSON.parse(JSON.stringify(this.gantt));
            //console.log(this.show_gantt);
            //console.log(this.ready_queue);


            if (ready_queue.length > 0) {

                ready_queue.sort(sortByProperty("processDurationTime"));

                var temp_time = Number(ready_queue[0].processDurationTime);

                console.log("Process: " + ready_queue[0].processName + " Ran for " + temp_time + " and its done");

                var newGantt = {
                    "type": "process",
                    "processName": ready_queue[0].processName,
                    "burstTime": temp_time,
                    "startTime": time,
                    "endTime": time + temp_time,
                    "color": ready_queue[0].color,
                    "processPriority": ready_queue[0].processPriority,

                };
                this.gantt.push(newGantt);

                process[findWithAttr(process, "processName", ready_queue[0].processName)].timeRemain = 0;
                var Process_index = findWithAttr(process, "processName", ready_queue[0].processName);
                process[Process_index].exitTime = time + temp_time;

                ready_queue.splice(0, 1);

                time = time + temp_time;

            } else {

                var allProcessDone;
                for (var i = 0; i < process.length; i++) {
                    if (process[i].timeRemain > 0) {
                        allProcessDone = false;

                    } else {
                        allProcessDone = true;
                    }
                }

                if (allProcessDone === false) {
                    var newGantt = {
                        "type": "gap",
                        "processName": "",
                        "burstTime": 1,
                        "startTime": time,
                        "endTime": time + 1,
                        "color": "#ffffff",

                    };
                    this.gantt.push(newGantt);


                } else {


                    break;
                }

                time++;
            }
            //end of loop
        }
    }

    run() {

        drawGantt(this.gantt);
    }
}

class shortestRemainingTime extends qup_process {
    execute(process) {
        var time = 0;
        var ready_queue = [];
        var total_time = this.total_time;

        //assign remaining time to the duration for calcualtion
        for (var i = 0; i < process.length; i++) {
            process[i].timeRemain = process[i].processDurationTime;
        }

        //console.log(total_time);
        while (time < total_time) {
            console.log("The Time Now is: " + time);

            //add Processes to ready_queue if 
            for (var i = 0; i < process.length; i++) {

                //console.log(process[i].processArrivalTime);
                if (time >= Number(process[i].processArrivalTime) &&
                    !(ready_queue.includes(process[i])) &&
                    process[i].timeRemain > 0) {


                    ready_queue.push(process[i]);
                }
            }

            ready_queue.sort(sortByProperty("timeRemain"));

            //Push Ready Queue to object for showing
            this.ready_queue[time] = JSON.parse(JSON.stringify(ready_queue));
            this.show_gantt[time] = JSON.parse(JSON.stringify(this.gantt));
            //console.log(this.show_gantt);
            //console.log(this.ready_queue);


            if (ready_queue.length > 0) {

                var job_srt = ready_queue[0];
                var job_srt_time = job_srt.timeRemain;
                var job_start_time = time;
                var exec_time = 0;


                while (exec_time < job_srt_time) {
                    console.log("The Time Now is: " + time);

                    //add Processes to ready queue
                    for (var i = 0; i < process.length; i++) {
                        //console.log("Time remain for " + process[i].processName + " is " + process[i].timeRemain);
                        if (time >= Number(process[i].processArrivalTime) &&
                            !(ready_queue.includes(process[i]))) {

                            if (process[i].timeRemain > 0) {
                                ready_queue.push(process[i]);
                            }

                        }
                    }


                    ready_queue.sort(sortByProperty("timeRemain"));

                    if (ready_queue[0] !== job_srt) {


                        var index = findWithAttr(ready_queue, "processName", job_srt.processName);
                        if (ready_queue[index].timeRemain === 0) {
                            console.log(ready_queue[index].processName + " starts from " + job_start_time + " is done at " + time);

                            //add exitTime for calculation
                            var Process_index = findWithAttr(process, "processName", ready_queue[0].processName);
                            process[Process_index].exitTime = time;


                            var newGantt = {
                                "type": "process",
                                "processName": ready_queue[index].processName,
                                "burstTime": time - job_start_time,
                                "startTime": job_start_time,
                                "endTime": time,
                                "color": ready_queue[index].color,
                                "processPriority": ready_queue[index].processPriority,


                            };
                            this.gantt.push(newGantt);
                            ready_queue.splice(index, 1);
                        } else {
                            console.log(job_srt.processName + " starts from " + job_start_time + " is done at " + time);

                            //add exitTime for calculation
                            var Process_index = findWithAttr(process, "processName", ready_queue[0].processName);
                            process[Process_index].exitTime = time;

                            var newGantt = {
                                "type": "process",
                                "processName": job_srt.processName,
                                "burstTime": time - job_start_time,
                                "startTime": job_start_time,
                                "endTime": time,
                                "color": job_srt.color,
                                "processPriority": job_srt.processPriority,
                            };
                            this.gantt.push(newGantt);
                        }


                        break;
                    } else if (ready_queue[0] === job_srt) {

                        var index = findWithAttr(ready_queue, "processName", job_srt.processName);
                        ready_queue[index].timeRemain -= 1;

                        time++;
                        exec_time++;

                        if (ready_queue[index].timeRemain === 0) {
                            //console.log(ready_queue[index].processName + " starts from " + job_start_time + " is done at " + time);

                            var Process_index = findWithAttr(process, "processName", ready_queue[index].processName);
                            process[Process_index].exitTime = time;

                            var newGantt = {
                                "type": "process",
                                "processName": ready_queue[index].processName,
                                "burstTime": time - job_start_time,
                                "startTime": job_start_time,
                                "endTime": time,
                                "color": ready_queue[index].color,
                                "processPriority": ready_queue[index].processPriority,

                            };
                            this.gantt.push(newGantt);
                            ready_queue.splice(index, 1);
                        }


                    } else {
                        break;
                    }

                }


            } else {

                var allProcessDone;
                for (var i = 0; i < process.length; i++) {
                    if (process[i].timeRemain > 0) {
                        allProcessDone = false;

                    } else {
                        allProcessDone = true;
                    }
                }

                if (allProcessDone === false) {
                    var newGantt = {
                        "type": "gap",
                        "processName": "",
                        "burstTime": 1,
                        "startTime": time,
                        "endTime": time + 1,
                        "color": "#ffffff",

                    };
                    this.gantt.push(newGantt);


                } else {


                    break;
                }

                time++;
            }
            //end of loop
        }
    }

    run() {
        //this.execute(this.process);
        drawGantt(this.gantt);
    }
}

class round_robin extends qup_process {
    execute(process) {

        var time = 0;
        var time_quantum = 3;
        var ready_queue = [];
        var total_time = this.total_time;

        for (var i = 0; i < process.length; i++) {
            total_time += process[i].processDurationTime;
            //assign remaining time to the duration for calcualtion
            process[i].timeRemain = process[i].processDurationTime;
        }



        //console.log(total_time);
        while (time < total_time) {

            //console.log("The Time Now is: " + time);

            //add Processes to ready_queue if 
            for (var i = 0; i < process.length; i++) {
                //console.log(process[i].processArrivalTime);
                if (time >= Number(process[i].processArrivalTime) &&
                    !(ready_queue.includes(process[i])) &&
                    process[i].timeRemain > 0) {

                    ready_queue.push(process[i]);

                }
            }


            //Push Ready Queue to object for showing
            this.ready_queue[time] = JSON.parse(JSON.stringify(ready_queue));
            this.show_gantt[time] = JSON.parse(JSON.stringify(this.gantt));
            //console.log(this.show_gantt[time]);
            //console.log(this.ready_queue[time]);


            if (ready_queue.length > 0) {
                if (ready_queue[0].timeRemain > time_quantum) {

                    ready_queue[0].timeRemain -= time_quantum;

                    var newGantt = {
                        "type": "process",
                        "processName": ready_queue[0].processName,
                        "burstTime": time_quantum,
                        "startTime": time,
                        "endTime": time + time_quantum,
                        "processPriority": ready_queue[0].processPriority,
                        "color": ready_queue[0].color,

                    };
                    this.gantt.push(newGantt);



                    ready_queue.push(ready_queue[0]);
                    ready_queue.splice(0, 1);


                    time = time + time_quantum;



                } else if (ready_queue[0].timeRemain <= time_quantum) {

                    var exec_time = ready_queue[0].timeRemain;
                    ready_queue[0].timeRemain -= ready_queue[0].timeRemain;
                    //console.log("Process: " + ready_queue[0].processName + " Ran for " + exec_time + " and its done");

                    var newGantt = {
                        "type": "process",
                        "processName": ready_queue[0].processName,
                        "burstTime": exec_time,
                        "startTime": time,
                        "endTime": time + exec_time,
                        "processPriority": ready_queue[0].processPriority,
                        "color": ready_queue[0].color,

                    };

                    var Process_index = findWithAttr(process, "processName", ready_queue[0].processName);
                    process[Process_index].exitTime = time + exec_time;

                    ready_queue.splice(0, 1);
                    this.gantt.push(newGantt);

                    time = time + exec_time;

                }


            } else {
                var allProcessDone;
                for (var i = 0; i < process.length; i++) {
                    if (process[i].timeRemain > 0) {
                        allProcessDone = false;

                    } else {
                        allProcessDone = true;
                    }
                }

                if (allProcessDone === false) {
                    var newGantt = {
                        "type": "gap",
                        "processName": "",
                        "burstTime": 1,
                        "startTime": time,
                        "endTime": time + 1,
                        "color": "#ffffff",


                    };
                    this.gantt.push(newGantt);


                } else {


                    break;
                }


                time++;
            }



            //end of loop
        }
    }


    run() {
        //console.log(this.process);

        drawGantt(this.gantt);
    }

}


//Test ok
class fcfs extends qup_process {
    execute(process) {
        var time = 0;
        var ready_queue = [];
        var total_time = this.total_time;

        for (var i = 0; i < process.length; i++) {
            process[i].timeRemain = process[i].processDurationTime;
        }

        //console.log(total_time);
        while (time < total_time) {


            //add Processes to ready_queue if 
            for (var i = 0; i < process.length; i++) {
                //console.log(process[i].processArrivalTime);
                if (time >= Number(process[i].processArrivalTime) &&
                    !(ready_queue.includes(process[i])) &&
                    process[i].timeRemain > 0) {

                    ready_queue.push(process[i]);

                }
            }

            //Push Ready Queue to object for showing
            this.ready_queue[time] = JSON.parse(JSON.stringify(ready_queue));
            this.show_gantt[time] = JSON.parse(JSON.stringify(this.gantt));

            if (ready_queue.length > 0) {


                ready_queue.sort(sortByProperty("processArrivalTime"));

                var temp_time = Number(ready_queue[0].processDurationTime);

                console.log("Process: " + ready_queue[0].processName + " Ran for " + temp_time + " and its done");

                var newGantt = {
                    "type": "process",
                    "processName": ready_queue[0].processName,
                    "burstTime": temp_time,
                    "startTime": time,
                    "endTime": time + temp_time,
                    "color": ready_queue[0].color,
                    "processPriority": ready_queue[0].processPriority,

                };
                this.gantt.push(newGantt);

                process[findWithAttr(process, "processName", ready_queue[0].processName)].timeRemain = 0;
                //Add End time of process for calculation
                var Process_index = findWithAttr(process, "processName", ready_queue[0].processName);
                process[Process_index].exitTime = time + temp_time;

                ready_queue.splice(0, 1);

                time = time + temp_time;

            } else {

                var allProcessDone;
                for (var i = 0; i < process.length; i++) {
                    if (process[i].timeRemain > 0) {
                        allProcessDone = false;

                    } else {
                        allProcessDone = true;
                    }
                }

                if (allProcessDone === false) {
                    var newGantt = {
                        "type": "gap",
                        "processName": "",
                        "burstTime": 1,
                        "startTime": time,
                        "endTime": time + 1,
                        "color": "#ffffff",

                    };
                    this.gantt.push(newGantt);


                } else {
                    break;
                }

                time++;
            }
            //end of loop
        }
    }

    run() {
        drawGantt(this.gantt);
    }
}



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
                "exitTime": 0,
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

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}


//Frontend
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
            simulation = new round_robin(Process);
            simulation.execute(simulation.process);

        } else if ($("input[id='mode']:checked").val() == "fcfs") {
            simulation = new fcfs(Process);
            simulation.execute(simulation.process);

        } else if ($("input[id='mode']:checked").val() == "sjf") {
            simulation = new shortestJobFirst(Process);
            simulation.execute(simulation.process);

        } else if ($("input[id='mode']:checked").val() == "srt") {
            simulation = new shortestRemainingTime(Process);
            simulation.execute(simulation.process);

        } else if ($("input[id='mode']:checked").val() == "pri-nonpre") {
            simulation = new priorityNonPreemptiveLargeIsLow(Process);
            simulation.execute(simulation.process);
        } else if ($("input[id='mode']:checked").val() == "pri-pre") {
            simulation = new priorityPreemptiveLargeIsLow(Process);
            simulation.execute(simulation.process);
        } else if ($("input[id='mode']:checked").val() == "pri-nonpre-rev") {
            simulation = new priorityNonPreemptiveLargeIsHigh(Process);
            simulation.execute(simulation.process);
        } else if ($("input[id='mode']:checked").val() == "pri-pre-rev") {
            simulation = new priorityPreemptiveLargeIsHigh(Process);
            simulation.execute(simulation.process);
        }


        if (simulation != null) {
            alert("Simulation is finished. \n" +
                "You can now click Calculate All or Click Previous/Next" +
                " to check how the algorithm works!\n" +
                "Thanks for using qup! :)");

        }



        drawGanttForCertainTime(simulation.show_gantt, 0);
        displayCurrentTime(display_time);
        calculateAllTime(simulation);

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
            display_time = simulation.gantt[simulation.gantt.length - 1].endTime;
            displayCurrentTime(display_time);
            displaySummary(simulation);
            drawLogs(simulation.logs,display_time);
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
            drawGanttForCertainTime(simulation.show_gantt, display_time);
            drawLogsForCertainTime(simulation.logs, display_time);
            drawReadyQueueForCertainTime(simulation.ready_queue, display_time);
        } else {
            alert("there's nothing before you start the simulation lol.");
        }
    });

    $("#next").click(function () {
        if (display_time >= simulation.gantt[simulation.gantt.length - 1].endTime) {
            displaySummary(simulation);
            alert("there's nothing this far lol.");
        } else {
            display_time++;
            displayCurrentTime(display_time);
            drawGanttForCertainTime(simulation.show_gantt, display_time);
            drawLogsForCertainTime(simulation.logs, display_time);
            drawReadyQueueForCertainTime(simulation.ready_queue, display_time);
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
    var bar = "";
    for (var t = 0; t < time; t++) {
        for (var i = 0; i < logs[t].length; i++) {
            bar += "<div class='row'>" + logs[t][i] + "</div>"
        }
    }
    $(".LogContainer").html(bar);
}

function drawLogsForCertainTime(logs, time) {

    var bar = "";
    for (var i = 0; i < logs[time].length; i++) {
        bar += "<div class='row'>" + logs[time][i] + "</div>"
    }
    $(".LogContainer").html(bar);

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
function findAndRemove(array, property, value) {
    for (var key in array) {
        if (array[key][property] == value) {
            array.splice(key, 1);
        }
    }
}

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



