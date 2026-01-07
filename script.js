let assignmentCount = 0;
const maxAssignments = 3;

function updateConfigLabel() {
    document.getElementById("configLabel").innerText = `Configuration ${assignmentCount}`;
}

let trainees = [];
let seatHistory = {}; // Tracks seat usage


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
    trainees.forEach(name => {
        seatHistory[name] = { left: false, right: false, observer: false };
    });

    // Reset counter and show Configuration 1
    assignmentCount = 1;
    updateConfigLabel();

    alert("Names saved successfully");
}



function assignSeats() {

    // Check BEFORE incrementing
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
    const observer = randomPick(observerCandidates.filter(t => t !== left && t !== right));

    // Update history
    seatHistory[left].left = true;
    seatHistory[right].right = true;
    seatHistory[observer].observer = true;

    // Update UI
    document.getElementById("leftLabel").innerText = left;
    document.getElementById("rightLabel").innerText = right;
    document.getElementById("observerLabel").innerText = observer;

    // NOW increment
    assignmentCount++;
    updateConfigLabel();
}


function randomPick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}