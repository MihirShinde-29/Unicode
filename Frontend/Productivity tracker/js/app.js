// Class: Represents a Task
class Task {
    constructor(name, time, date, compulsion) {
        this.name = name;
        this.time = time;
        this.date = date;
        this.compulsion = compulsion;
        if (compulsion === "yes") {
            this.priority = 1;
        } else {
            this.priority = 0;
        }
    }
}

// UI class: Handle UI Tasks
class UI {
    static displayTask() {
        const tasks = Store.getTasks();
        const sortedTasks = tasks.sort((a, b) => {
            if (a.priority < b.priority) {
                return 1;
            }
            else {
                return -1;
            }
        })
        sortedTasks.forEach((task) => UI.addTaskToList(task));
    }
    
    static addTaskToList(task) {
        const list = document.querySelector('#task-list');
        
        const row = document.createElement('tr');
        
        row.className = "table-active text-center";
        
        row.innerHTML = `
        <td>${task.name}</td>
        <td>${task.time}</td>
        <td>${task.date}</td>
        <td>${task.compulsion}</td>
        <td>
            <a href = "#" class = "btn btn-success btn-sm complete">✔️</a>
            <a href = "#" class = "btn btn-danger btn-sm delete">X</a>
            <a href = "#" class = "btn btn-dark btn-sm edit">Edit</a>
        </td>
        `;
        
        list.appendChild(row);
    }
    
    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className} mt-4`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('#task-container');
        const form = document.querySelector('#task-text');
        container.insertBefore(div, form);
        
        // Vanish in 2 sec
        setTimeout (() => document.querySelector('.alert').remove(), 2000);
    }

    static deleteTask(el) {
        if(el.classList.contains('delete')) {
            // Remove task for store
            Store.removeTask(el.parentElement.parentElement.firstElementChild.textContent);
           
            el.parentElement.parentElement.remove();
            
            // Show delete message
            UI.showAlert('Task Removed', 'warning');
        }
    }
    
    static editTask(ed) {
        if(ed.classList.contains('edit')) {
            let task = ed.parentElement.parentElement.querySelectorAll('td');
            let name = task[0].textContent;
            let time = task[1].textContent;
            let date = task[2].textContent;
            document.querySelector('#name').value = name;
            document.querySelector('#time').value = time;
            document.querySelector('#date').value = date;
            // Remove task for store
            Store.removeTask(ed.parentElement.parentElement.firstElementChild.textContent);
            
            ed.parentElement.parentElement.remove();

            UI.showAlert('You can now edit your task', 'warning');
        }
    }
    
    static completeTask(ec) {
        if(ec.classList.contains('complete')) {
            // Add time spent
            let task = ec.parentElement.parentElement.querySelectorAll('td');
            let time = task[1].textContent;

            // Add Time Spent
            Store.addTime(time);
            document.querySelector('#time-spent').textContent = Store.getTime();
            
            // Remove task for store
            Store.removeTask(ec.parentElement.parentElement.firstElementChild.textContent);
            
            ec.parentElement.parentElement.remove();

            UI.showAlert('Task Completed!', 'success');
        }
    }

    static clearFields() {
        document.querySelector('#name').value = "";
        document.querySelector('#time').value = "";
        document.querySelector('#date').value = "";
    }

    static resetTimeSpent(e) {
        if(e.classList.contains('reset')) {
            Store.resetTime();

            document.querySelector('#time-spent').textContent = Store.getTime();

            UI.showAlert('Time Spent has been reset', 'warning');
        }
    }
}

// Store class: Handle Storage
class Store {
    static getTasks() {
        let tasks;
        if (localStorage.getItem('tasks') === null) {
            tasks = [];
        } else {
            tasks = JSON.parse(localStorage.getItem('tasks'));
        }
        return tasks;
    }
    
    static addTask(task) {
        const tasks = Store.getTasks();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    static removeTask(name) {
        const tasks = Store.getTasks();
        tasks.forEach((task, index) => {
            if(task.name === name) {
                tasks.splice(index, 1);
            }
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    static getTime() {
        let timeSpent;
        if (localStorage.getItem('timeSpent') === null) {
            timeSpent = ['0'];
        } else {
            timeSpent = JSON.parse(localStorage.getItem('timeSpent'));
        }
        return timeSpent;
    }
    
    static addTime(times) {
        const timeSpent  = Store.getTime();
        const time = parseInt(timeSpent[0]) + parseInt(times);
        const timeString = '' + time;
        timeSpent.pop();
        timeSpent.push(timeString);
        localStorage.setItem('timeSpent', JSON.stringify(timeSpent));
    }

    static resetTime() {
        const timeSpent = Store.getTime();
        timeSpent.pop();
        timeSpent.push('0');
        localStorage.setItem('timeSpent', JSON.stringify(timeSpent));
    }
}

// Event: Display Tasks
document.addEventListener('DOMContentLoaded', UI.displayTask());

// Event: Display Time Spent
document.querySelector('#time-spent').textContent = Store.getTime();

// Event: Add a Task
document.querySelector('#task-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Get form values
    const name = document.querySelector('#name').value;
    const time = document.querySelector('#time').value;
    const date = document.querySelector('#date').value;
    const complusion = document.querySelector("input[type='radio'][name='compulsion']:checked").value;
    
    // Validate
    if(name === '' || time === '' || time === '0' || date === '') {
        UI.showAlert('Please fill in all fields!', 'danger');
    } else {
        // Instatiate Task
        const task = new Task(name, time, date, complusion);
    
        // Add Task to UI
        UI.addTaskToList(task);

        // Add task to store
        Store.addTask(task);
    
        // Show success message
        UI.showAlert('Task Added!', 'success');

        // Clear fields
        UI.clearFields();
    }
});

// Event
document.querySelector('#task-list').addEventListener('click', (e) => {
    // Delete task from UI
    UI.deleteTask(e.target);

    // Edit task from UI
    UI.editTask(e.target);

    // Complete task from UI
    UI.completeTask(e.target);
});

// Event: Reset Time Spent
document.querySelector('#total-time').addEventListener('click', (e) => {
    // Reset Time for UI
    UI.resetTimeSpent(e.target);
});