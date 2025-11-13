const express = require('express');
const app = express();
const port = 8080;


let machines = [
    { name: 'oven', status: 'on' },
    { name: 'inventory', status: 'off' },
    { name: 'conveyor belt', status: 'off' },
    { name: 'crane', status: 'on' }
];




// krijgt alle machines en hun status
app.get('/api/machines', (req, res) => {

    res.json(machines);

});



// Simulate async status check (e.g., API call)
function getMachineStatus(machine) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ name: machine.name, status: machine.status });
        }, 500); // simulate delay
    });
}
async function checkMachinesTurnedOn() {
    for (let machine of machines) {
        const result = await getMachineStatus(machine);
        
        if (result.status === 'on') {
            console.log(`${result.name} is ${result.status.toUpperCase()}✅`);
        } else {
            console.log(`${result.name} is ${result.status.toUpperCase()}❌`);
        }
    }
}

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    checkMachinesTurnedOn();
});