document.getElementById('instructionBtn').onclick = function() {
    switchInstruction();
}

let isInstruction = false;
const instruction = document.querySelector('.instruction');
const laborator = document.querySelector('.laborator');

function switchInstruction() {
    isInstruction = !isInstruction;
    if (isInstruction) showInstruction();
    else hideInstruction();
}

function showInstruction() {
    instruction.classList.remove('visually-hidden');
    laborator.classList.add('visually-hidden');
}

function hideInstruction() {
    instruction.classList.add('visually-hidden');
    laborator.classList.remove('visually-hidden');
}