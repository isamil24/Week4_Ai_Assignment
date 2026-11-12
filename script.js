
// Variables
let currentNumber = "0";
let previousNumber = "";
let operator = null;
let shouldReset = false;

// Calculation History
let calculationHistory = [];

// HTML Elements
const display = document.getElementById("display");
const previous = document.getElementById("previous");
const historyList = document.getElementById("history-list");

// Update Display
function updateDisplay() {
    display.value = currentNumber;
}

// Add Numbers
function appendNumber(number) {

    if (currentNumber === "Error") {
        clearDisplay();
    }

    if (shouldReset) {
        currentNumber = "0";
        shouldReset = false;
    }

    // Prevent multiple decimal points
    if (number === "." && currentNumber.includes(".")) {
        return;
    }

    if (number === "." && currentNumber === "0") {
        currentNumber = "0.";
    }

    else if (currentNumber === "0" && number !== ".") {
        currentNumber = number;
    }

    else {
        currentNumber += number;
    }

    updateDisplay();
}

// Choose Operator
function chooseOperator(selectedOperator) {

    if (currentNumber === "Error") {
        return;
    }

    if (operator !== null && !shouldReset) {
        calculate();
    }

    previousNumber = currentNumber;
    operator = selectedOperator;

    previous.textContent =
        previousNumber + " " + operator;

    shouldReset = true;
}

// Calculate Result
function calculate() {

    if (operator === null || shouldReset) {
        return;
    }

    let a = parseFloat(previousNumber);
    let b = parseFloat(currentNumber);
    let result;

    // Save calculation before changing values
    let calculation =
        previousNumber + " " + operator + " " + currentNumber;

    switch (operator) {

        case "+":
            result = a + b;
            break;

        case "-":
            result = a - b;
            break;

        case "*":
            result = a * b;
            break;

        case "/":

            // Handle division by zero
            if (b === 0) {
                result = "Error";
            }

            else {
                result = a / b;
            }

            break;
    }

    // Show Previous Calculation
    previous.textContent = calculation + " =";

    // Format Result
    if (typeof result === "number" && Number.isFinite(result)) {

        currentNumber = String(
            parseFloat(result.toPrecision(12))
        );

        // Save calculation to history
        calculationHistory.push(
            calculation + " = " + currentNumber
        );

        updateHistory();
    }

    else {
        currentNumber = "Error";
    }

    // Reset Operator
    operator = null;
    previousNumber = "";
    shouldReset = true;

    updateDisplay();
}

// Clear Calculator
function clearDisplay() {

    currentNumber = "0";
    previousNumber = "";
    operator = null;
    shouldReset = false;

    previous.textContent = "";

    updateDisplay();
}

// Delete Last Number
function deleteNumber() {

    if (shouldReset || currentNumber === "Error") {
        return;
    }

    currentNumber = currentNumber.slice(0, -1);

    if (currentNumber === "" || currentNumber === "-") {
        currentNumber = "0";
    }

    updateDisplay();
}

// Update History
function updateHistory() {

    historyList.innerHTML = "";

    if (calculationHistory.length === 0) {

        historyList.innerHTML =
            '<li class="empty-history">No calculations yet.</li>';

        return;
    }

    calculationHistory.forEach(function(item) {

        const li = document.createElement("li");

        li.textContent = item;

        historyList.appendChild(li);

    });
}

// Show or Hide History
function toggleHistory() {

    const history = document.getElementById("history");
    const button = document.querySelector(".history-toggle");

    if (history.style.display === "none") {

        history.style.display = "block";
        button.textContent = "Hide History";

    }

    else {

        history.style.display = "none";
        button.textContent = "Show History";

    }
}

// Clear History
function clearHistory() {

    calculationHistory = [];

    updateHistory();
}

// Keyboard Support
document.addEventListener("keydown", function(event) {

    // Number keys
    if (event.key >= "0" && event.key <= "9") {

        appendNumber(event.key);

    }

    // Decimal point
    else if (event.key === ".") {

        appendNumber(".");

    }

    // Operators
    else if (["+", "-", "*", "/"].includes(event.key)) {

        chooseOperator(event.key);

    }

    // Calculate
    else if (event.key === "Enter" || event.key === "=") {

        event.preventDefault();
        calculate();

    }

    // Delete
    else if (event.key === "Backspace") {

        event.preventDefault();
        deleteNumber();

    }

    // Clear
    else if (event.key === "Escape") {

        clearDisplay();

    }

});

// Show empty history message initially
updateHistory();
