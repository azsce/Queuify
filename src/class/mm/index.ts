import MMQueueSimulator from "./MMQueueSimulator";

const numOfServers = 1;
const capacity = 5;
const arrivalRate = 5;
const serviceRate = 7;
const numOfSimulations = 100;

// Instantiate the simulator
const simulator = new MMQueueSimulator({
    arrivalRate: arrivalRate,
    serviceRate: serviceRate,
    capacity : capacity,
    servers: numOfServers,
    numOfSimulations: numOfSimulations
});

// Run the simulation and log data after completion
simulator.simulate().then(() => {
    // console.log("Simulation Statistics:", simulator.statistics);
    console.log("Timeline Data:", simulator.timeLineData);
    // console.log("Customer Data:", simulator.allCustomers);
});



