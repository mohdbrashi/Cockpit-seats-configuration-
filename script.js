const instructions = {
    1: `- Push-back facing North (N). 
    - Turn right on L2. 
    - Then, Turn left on TWY L. 
    - Continue taxi on TWY L.
    - Turn right on TXY R, HOLD SHORT RWY 34R, contact 118.50. 
    - Return the frequency to 121.70
    - Continue taxi on NA to enter apron 15.`,
    2: `- Turn left on NA.
    - Hold short RWY 34C, contact 118.50.
    - Cross the runway. 
    - Contact 121.70, continue taxi on TXY R. 
    - HOLD SHORT RWY 34C, Contact 118.20.
    - Cross the runway. 
    - Contact 121.90, Turn left on TWY F.
    - then, right on TXY T. 
    - Then turn left on APRON 2. 
    - Parking 2-7.`,
    3: `- Push-back facing south (S).
    - Turn left on TWY U.
    - HOLD SHORT TXY F, contact 121.90.
    - Turn right on TXY F, Continue Taxi on TWY F.
    - Turn left on GE HOLD SHORT 34C, contact 118.20. 
    - Continue taxi then turn left on TXY K. 
    - Turn right on TXY V, contact 121.70. 
    - Continue taxi on TXY V, then turn right on TXY L.
    - Turn right on L2, your parking will be A4R.`
};

let assignmentCount = 0;
const maxAssignments = 3;

let trainees = [];
let seatHistory = {}; // Tracks seat usage

function updateConfigLabel() {
    document.getElementById("configLabel").innerText = `Configuration ${assignmentCount}`;
}

function saveNames() {
    const n1 = document.getElementById("name1").value.trim();
    const n2 = document.getElementById("name2").value.trim();
    const n3 = document.getElementById("name3").value.trim();

    if (!n1 || !n2 || !n3) {
        alert("Please enter all three names");
        return;
    }

    trainees = [n1, n2, n3];

    // Initialize seat history
    seatHistory = {};
    trainees.forEach(name => {
        seatHistory[name] = { left: false, right: false, observer: false };
    });

    // Start from 0, first assignSeats() will make it 1
    assignmentCount = 0;
    updateConfigLabel();

    // Assign first configuration immediately
    assignSeats();

    alert("Names saved successfully");

    // Show the instructions button
    document.getElementById("showInstructionsBtn").style.display = "inline-block";
}

function assignSeats() {

    // Check BEFORE incrementing: show popup when trying to go beyond maxAssignments
    if (assignmentCount >= maxAssignments) {
        const proceed = confirm("You’re about to exceed the limit. Do you want to continue?");
        if (!proceed) return;
    }

    if (trainees.length < 3) {
        alert("You need at least 3 trainees");
        return;
    }

    // Find trainees who haven't sat in each seat yet
    let leftCandidates = trainees.filter(t => !seatHistory[t].left);
    let rightCandidates = trainees.filter(t => !seatHistory[t].right);
    let observerCandidates = trainees.filter(t => !seatHistory[t].observer);

    // If any seat has no candidates left, reset all seat histories
    if (leftCandidates.length === 0 || rightCandidates.length === 0 || observerCandidates.length === 0) {
        trainees.forEach(t => {
            seatHistory[t] = { left: false, right: false, observer: false };
        });

        leftCandidates = [...trainees];
        rightCandidates = [...trainees];
        observerCandidates = [...trainees];
    }

    // Random selection
    const left = randomPick(leftCandidates);
    const right = randomPick(rightCandidates.filter(t => t !== left));
    const observer = randomPick(
        observerCandidates.filter(t => t !== left && t !== right)
    );

    // Update history
    seatHistory[left].left = true;
    seatHistory[right].right = true;
    seatHistory[observer].observer = true;

    // Update UI labels
    document.getElementById("leftLabel").innerText = left;
    document.getElementById("rightLabel").innerText = right;
    document.getElementById("observerLabel").innerText = observer;

    // Increase configuration number AFTER assigning seats
    assignmentCount++;
    updateConfigLabel();

    // Update popup instruction text
    document.getElementById("instructionText").innerText = instructions[assignmentCount] || "";
}

function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/* ------------------------------
   SHOW INSTRUCTIONS POPUP
--------------------------------*/
document.getElementById("showInstructionsBtn").addEventListener("click", function () {
    document.getElementById("instructionPopup").style.display = "flex";
    document.getElementById("instructionText").innerText = instructions[assignmentCount] || "";
});

document.getElementById("closePopup").addEventListener("click", function () {
    document.getElementById("instructionPopup").style.display = "none";
});
