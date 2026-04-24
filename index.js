// Initialize tasks from LocalStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;

const taskList = document.getElementById("task-list");
const filterBtns = document.querySelectorAll(".filter-btn");

// Load tasks on startup
document.addEventListener("DOMContentLoaded", () => renderTasks("all"));

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add or Update Task
function addTask() {
    const titleInput = document.getElementById("task-title");
    const descInput = document.getElementById("task-desc");
    const dateInput = document.getElementById("task-date");

    if (titleInput.value === "" || dateInput.value === "") {
        alert("Please fill in the Title and Due Date!");
        return;
    }

    const taskData = {
        id: Date.now(), // Unique ID
        title: titleInput.value,
        desc: descInput.value,
        date: dateInput.value,
        completed: false
    };

    tasks.push(taskData);
    saveTasks();
    renderTasks("all");
    clearInputs();
}

// Delete Task
function deleteTask(id) {
    if(confirm("Are you sure you want to delete this task?")) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks("all");
    }
}

// Toggle Complete Status
function toggleComplete(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    saveTasks();
    renderTasks("all");
}

// Edit Task (Populates input fields)
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    document.getElementById("task-title").value = task.title;
    document.getElementById("task-desc").value = task.desc;
    document.getElementById("task-date").value = task.date;
    
    // Remove the old task so the "Add" button effectively acts as "Update"
    // Alternatively, we could change button logic, but this is simpler for now
    deleteTask(id); 
}

// Render Tasks based on Filter
function renderTasks(filter) {
    taskList.innerHTML = "";
    
    const now = new Date().getTime();

    tasks.forEach(task => {
        // Filter Logic
        if (filter === "pending" && task.completed) return;
        if (filter === "completed" && !task.completed) return;

        const li = document.createElement("li");
        
        // Reminder Feature: Check if deadline is passed or close
        const taskDate = new Date(task.date).getTime();
        if (taskDate < now && !task.completed) {
            li.classList.add("urgent"); // Adds red border if overdue
        }
        if (task.completed) {
            li.classList.add("completed");
        }

        li.innerHTML = `
            <div class="task-header">
                <span class="task-title">${task.title}</span>
            </div>
            <div class="task-desc">${task.desc}</div>
            <div class="task-date">Due: ${new Date(task.date).toLocaleString()} ${taskDate < now && !task.completed ? "(Overdue!)" : ""}</div>
            
            <div class="actions">
                <button class="btn-sm check-btn" onclick="toggleComplete(${task.id})">
                    ${task.completed ? "Undo" : "Done"}
                </button>
                <button class="btn-sm edit-btn" onclick="editTask(${task.id})">Edit</button>
                <button class="btn-sm delete-btn" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

// Filter Button Styling
function filterTasks(status) {
    filterBtns.forEach(btn => btn.classList.remove("active"));
    
    // Highlight clicked button
    event.target.classList.add("active");
    renderTasks(status);
}

function clearInputs() {
    document.getElementById("task-title").value = "";
    document.getElementById("task-desc").value = "";
    document.getElementById("task-date").value = "";
}