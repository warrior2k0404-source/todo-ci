const API_URL = "http://localhost:8000";


// GET ALL TODOS
async function getTodos() {

    const response = await fetch(`${API_URL}/todos`);

    const todos = await response.json();

    const todoList = document.getElementById("todoList");

    todoList.innerHTML = "";

    todos.forEach(todo => {

        const li = document.createElement("li");

        li.className = "todo-item";
        li.id = `todo-${todo._id}`;

        li.innerHTML = `
            <span class="todo-title ${todo.completed ? "completed" : ""}">
                ${todo.title}
            </span>

            <div class="todo-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTodo('${todo._id}', '${todo.title}', ${todo.completed})">
                    ${todo.completed ? "Undo" : "Done"}
                </button>

                <button
                    class="edit-btn"
                    onclick="editTodo('${todo._id}', '${todo.title}', ${todo.completed})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTodo('${todo._id}')">
                    Delete
                </button>

            </div>
        `;

        todoList.appendChild(li);
    });
}


// CREATE TODO
async function createTodo() {

    const titleInput = document.getElementById("todoTitle");

    const title = titleInput.value.trim();

    if (!title) {
        alert("Please enter a todo");
        return;
    }

    await fetch(`${API_URL}/todos`, {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title,
            completed: false
        })
    });

    titleInput.value = "";

    getTodos();
}


// EDIT TODO
async function editTodo(id, currentTitle, completed) {

    const todoItem = document.getElementById(`todo-${id}`);

    todoItem.innerHTML = `
        <input
            type="text"
            id="edit-${id}"
            value="${currentTitle}"
            class="edit-input"
        >

        <div class="todo-actions">

            <button
                class="save-btn"
                onclick="saveTodo('${id}', ${completed})">
                Save
            </button>

            <button
                class="cancel-btn"
                onclick="getTodos()">
                Cancel
            </button>

        </div>
    `;
}
async function saveTodo(id, completed) {

    const input = document.getElementById(`edit-${id}`);

    const newTitle = input.value.trim();

    if (!newTitle) {
        alert("Todo cannot be empty");
        return;
    }

    await fetch(`${API_URL}/todos/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: newTitle,
            completed: completed
        })
    });

    getTodos();
}

// TOGGLE COMPLETED
async function toggleTodo(id, title, completed) {

    await fetch(`${API_URL}/todos/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            title: title,
            completed: !completed
        })
    });

    getTodos();
}


// DELETE TODO
async function deleteTodo(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this todo?"
    );

    if (!confirmDelete) {
        return;
    }

    await fetch(`${API_URL}/todos/${id}`, {

        method: "DELETE"
    });

    getTodos();
}


// LOAD TODOS WHEN PAGE OPENS
getTodos();