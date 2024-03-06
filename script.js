const formatter = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    signDisplay: "always",
});


const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const list = document.getElementById("transactionList");
const status = document.getElementById("status");
const form = document.getElementById("transactionForm");
const description = document.getElementById("description");
const amount = document.getElementById("amount");



const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];



//Add Transaction

function addTransaction(e) {
    e.preventDefault();
    if (description.value === '' || amount.value === '') {
        alert('please add description and amount')
    } else {
        const transaction = {
            id: generateID(),
            description: description.value,
            amount: + amount.value,
        }

        transactions.push(transaction);

        addTransactionDOM(transaction);
        updateValues();
        updateLocalStorage();
        description.value = '';
        amount.value = '';
    }
}



//Generate Random ID
function generateID() {
    return Math.floor(Math.random() * 1000000000);
}


//Add Transactions to DOM list
function addTransactionDOM(transaction) {
    //GET sign
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    //Add Class Based on Value
    item.classList.add(
        transaction.amount < 0 ? "minus" : "plus"
    );

    item.innerHTML = `
    ${transaction.description} <span>${sign}${Math.abs(
        transaction.amount)}
        </span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
    `;
    list.appendChild(item);
}



//Update the balance income and expence
function updateValues() {
    const amounts = transactions.map(
        (transaction) => transaction.amount);

    const total = amounts
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const money_plus = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const money_minus = (amounts.filter((item) => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1)
        .toFixed(2);

    balance.innerText = `£${total}`;
    income.innerText = `£${money_plus}`;
    expense.innerText = `£${money_minus}`;
}




//Remove Transaction by ID
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();
    Init();
}


//update Local Storage Transaction
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}


//Initialize App
function Init() {
    list.innerHTML = "";
    transactions.forEach(addTransactionDOM);
    updateValues();
}

Init();

form.addEventListener('submit', addTransaction);
