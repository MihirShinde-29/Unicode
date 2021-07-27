// Task class: Represents a Task
class Expense {
    constructor(title, price, quantity, totalPrice) {
        this.title = title;
        this.price = price;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }
}

// UI Class
class UI {
    static displayExpenses() {
        const expenses = Store.getExpenses();
        const sortedExpenses = expenses.sort((a, b) => {
            if (a.totalPrice < b.totalPrice) {
                return 1;
            }
            else {
                return -1;
            }
        })
        sortedExpenses.forEach((expense) => UI.addExpenseToList(expense));
    }

    static displayAmount() {
        document.querySelector('#income-ui').textContent = Store.getIncome();
        document.querySelector('#savings-ui').textContent = Store.getSavings();
    }

    static addExpenseToList(expense) {
        const list = document.querySelector('#expense-list');
        
        const row = document.createElement('tr');
        
        row.className = "table-active text-center";
        
        row.innerHTML = `
        <td>${expense.title}</td>
        <td>${expense.price}</td>
        <td>${expense.quantity}</td>
        <td>${expense.totalPrice}</td>
        <td>
            <a href = "#" class = "btn btn-success btn-sm pay">Pay</a>  
            <a href = "#" class = "btn btn-danger btn-sm delete">X</a>  
            <a href = "#" class = "btn btn-dark btn-sm edit">Edit</a>  
        </td>
        `;
        
        list.appendChild(row);
    }
    
    static deleteExpense(el) {
        if(el.classList.contains('delete')) {
            // Remove task for store
            Store.removeExpense(el.parentElement.parentElement.firstElementChild.textContent);
           
            el.parentElement.parentElement.remove();
            
            // Show delete message
            UI.showAlert('Expense Removed', 'warning');
        }
    }

    static editExpense(ed) {
        if(ed.classList.contains('edit')) {
            if (document.querySelector('#title').value == 0 && 
            document.querySelector('#price').value == 0  && 
            document.querySelector('#quantity').value == 0) {
                let expense = ed.parentElement.parentElement.querySelectorAll('td');
                console.log(expense);
                let title = expense[0].textContent;
                let price = expense[1].textContent;
                let quantity = expense[2].textContent;
                let totalPrice = expense[3].textContent;
    
                document.querySelector('#title').value = title;
                document.querySelector('#price').value = price;
                document.querySelector('#quantity').value = quantity;
                document.querySelector('#total-amount').value = totalPrice;
                // Remove expense for store
                Store.removeExpense(ed.parentElement.parentElement.firstElementChild.textContent);
                
                ed.parentElement.parentElement.remove();
    
                UI.showAlert('You can now edit your expense', 'warning');
            } else {
                UI.showAlert('Clear the fields before editing', 'warning');
            }
        }
    }

    static payExpense(ec) {
        if(ec.classList.contains('pay')) {
            // Add amount spent
            const expense = ec.parentElement.parentElement.querySelectorAll('td');
            const totalPrice = parseInt(expense[3].textContent);
            const title = 'Expense Paid for ' + expense[0].textContent;

            const income = parseInt(document.querySelector('#income-ui').textContent);
            const savings = parseInt(document.querySelector('#savings-ui').textContent);
            if (income >= totalPrice) {
                const reducedIncome = (income - totalPrice) + '';

                Store.replaceIncome(reducedIncome);

                document.querySelector('#income-ui').textContent = reducedIncome;
            } else {
                const reducedSavings = (savings + income - totalPrice) + '';

                Store.replaceIncome('0');
                Store.replaceSavings(reducedSavings);

                document.querySelector('#income-ui').textContent = '0';
                document.querySelector('#savings-ui').textContent = reducedSavings;
            }
            if ((savings + income - totalPrice) < 0) {
                document.querySelector('#savings-ui').classList.remove('text-success');
                document.querySelector('#savings-ui').classList.add('text-danger');
            }
            // Remove expense from store
            Store.removeExpense(expense[0].textContent);
            
            ec.parentElement.parentElement.remove();

            UI.showAlert(title, 'success');            
        }
    }

    static resetIncome(e) {
        Store.resetIncome();

        if (document.querySelector('#income-ui').textContent != 0) {
            UI.showAlert('Income has been reset', 'warning');   
        }

        document.querySelector('#income-ui').textContent = Store.getIncome();
    }

    static resetSavings(e) {
        Store.resetSavings();
        
        if (document.querySelector('#savings-ui').textContent != 0) {
            UI.showAlert('Savings has been reset', 'warning');
        }

        document.querySelector('#savings-ui').textContent = Store.getSavings();
    }

    static clearExpenseFields() {
        document.querySelector('#title').value = "";
        document.querySelector('#price').value = "";
        document.querySelector('#quantity').value = "";
        document.querySelector('#total-amount').value = "";
    }

    static clearIncomeFields() {
        document.querySelector('#income').value = "";
        document.querySelector('#saving').value = "";
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className} mt-4`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('#expense');
        const form = document.querySelector('#display-amount');
        container.insertBefore(div, form);
        
        // Vanish in 2 sec
        setTimeout (() => document.querySelector('.alert').remove(), 3000);
    }
}

// Store Class
class Store {
    static getExpenses() {
        let expenses;
        if (localStorage.getItem('expenses') === null) {
            expenses = [];
        } else {
            expenses = JSON.parse(localStorage.getItem('expenses'));
        }
        return expenses;
    }

    static addExpense(expense) {
        const expenses = Store.getExpenses();
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    static removeExpense(title) {
        const expenses = Store.getExpenses();
        expenses.forEach((expense, index) => {
            if(expense.title === title) {
                expenses.splice(index, 1);
            }
        });
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    static getIncome() {
        let income;
        if (localStorage.getItem('income') === null) {
            income = ['0'];
        } else {
            income = JSON.parse(localStorage.getItem('income'));
        }
        return income;
    }

    static getSavings() {
        let savings;
        if (localStorage.getItem('savings') === null) {
            savings = ['0'];
        } else {
            savings = JSON.parse(localStorage.getItem('savings'));
        }
        return savings;
    }

    static addIncome(amount) {
        const income  = Store.getIncome();
        const total = parseInt(income[0]) + parseInt(amount);
        const incomeString = '' + total;
        income.pop();
        income.push(incomeString);
        localStorage.setItem('income', JSON.stringify(income));
    }

    static addSavings(amount) {
        const savings  = Store.getSavings();
        const total = parseInt(savings[0]) + parseInt(amount);
        const savingsString = '' + total;
        savings.pop();
        savings.push(savingsString);
        localStorage.setItem('savings', JSON.stringify(savings));
    }

    static resetIncome() {
        const income = Store.getIncome();
        income.pop();
        income.push('0');
        localStorage.setItem('income', JSON.stringify(income));
    }

    static resetSavings() {
        const savings = Store.getSavings();
        savings.pop();
        savings.push('0');
        localStorage.setItem('savings', JSON.stringify(savings));
    }

    static replaceIncome(reducedIncome) {
        const income  = Store.getIncome();
        income.pop();
        income.push(reducedIncome);
        localStorage.setItem('income', JSON.stringify(income));
    }

    static replaceSavings(reducedSavings) {
        const savings  = Store.getSavings();
        savings.pop();
        savings.push(reducedSavings);
        localStorage.setItem('savings', JSON.stringify(savings));
    }
}

// Event: Display Content
document.addEventListener('DOMContentLoaded', () => {
    UI.displayExpenses();
    UI.displayAmount();
});

// Event Class
document.querySelector('#expense-form').addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.classList.contains('expense')) {
        // Get form values
        const title = document.querySelector('#title').value;
        const price = document.querySelector('#price').value;
        const quantity = document.querySelector('#quantity').value;
        const totalPrice = document.querySelector("#total-amount").value;
        
        // Validate
        if(title === '' || price === '' || price === '0' || quantity === '' || quantity === '0') {
            UI.showAlert('Please fill in all fields!', 'danger');
        } else {
            // Instatiate Task
            const expense = new Expense(title, price, quantity, totalPrice);
        
            // Add Task to UI
            UI.addExpenseToList(expense);
    
            // Add task to store
            Store.addExpense(expense);
            
            // Show success message
            UI.showAlert('Expense Added!', 'success');
    
            // Clear fields
            UI.clearExpenseFields();
        }
    }
});

document.querySelector('#balance-form').addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.classList.contains('submit')) {
        // Get form values
        const income = document.querySelector('#income').value;
        const savings = document.querySelector('#saving').value;
        
        // Validate
        if((income === '' || income === '0') && (savings === '0' || savings === '')) {
            UI.showAlert('Please fill in all fields!', 'danger');
        } else {    
            if (income != '' && income != '0') {
                Store.addIncome(income);

                document.querySelector('#income-ui').textContent = Store.getIncome();
                document.querySelector('#savings-ui').textContent = Store.getSavings();
            }
            if (savings != '0' && savings != '') {
                Store.addSavings(savings);
                
                document.querySelector('#savings-ui').textContent = Store.getSavings();
                document.querySelector('#income-ui').textContent = Store.getIncome();

            }
            if (parseInt(document.querySelector('#savings-ui').textContent) > 0) {
                document.querySelector('#savings-ui').classList.remove('text-danger');
                document.querySelector('#savings-ui').classList.add('text-success');
            }
            
            // Show success message
            UI.showAlert('Aomunt Updated', 'success');
    
            // Clear fields
            UI.clearIncomeFields();
        }
    }
});

// Event
document.querySelector('#expense-list').addEventListener('click', (e) => {
    // Delete expense from UI
    UI.deleteExpense(e.target);

    // Edit expense from UI
    UI.editExpense(e.target);

    // Pay Expense from UI
    UI.payExpense(e.target);
});

// Event: Income and Savings
document.querySelector('.reset-container').addEventListener('click', (e) => {
    if (e.target.classList.contains("reset-income")) {
        UI.resetIncome(e.target);
    }
    if (e.target.classList.contains("reset-saving")) {
        UI.resetSavings(e.target);
    }
});

document.querySelector("#quantity").addEventListener('keyup', () => {
    const price = document.querySelector("#price").value;
    const quantity = document.querySelector("#quantity").value;
    const totalPrice = (parseInt(price) * parseInt(quantity)) + '';
    if (totalPrice != "NaN") {
        document.querySelector("#total-amount").value = totalPrice;
    } else {
        document.querySelector("#total-amount").value = '';
    }
});