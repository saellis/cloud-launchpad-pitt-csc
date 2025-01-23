// @ts-check

const todoInput = document.querySelector("#newTodo");
const todoList = document.querySelector("#todoList");
const todoForm = document.querySelector("form");

/**
 * Reads todo items from the browser's local storage
 * @returns {string[]}
 */
function readTodos() {
  return fetch("/readTodos", {
    method: "GET",
  }).then(
    (response) => response.json()
  ).then(
    (todos) => {
      Object.entries(todos).forEach(createTodoItemHTML);
    }
  );
}

// Initialize todos
readTodos();

/**
 * Adds a todo item to the browser's local storage
 * @param {string} todo - The text content for the todo item
 * @returns {void}
 */
function addTodo(todo) {
  fetch("/addTodo", {
    method: "POST",
    body: JSON.stringify({"item": todo}),
    headers: {
      "Content-Type": "application/json",
    },
    }
  ).then(
    (response) => response.json()
  ).then(
    (data) => createTodoItemHTML([data.id, todo])
  );
}

/**
 * Remove a todo item from the browser's local storage
 * @param {number} id - The index of the todo item to remove
 * @returns {void}
 */
function removeTodo(id) {
  fetch("/removeTodo", {
    method: "POST",
    body: JSON.stringify({"id": id}),
    headers: {
      "Content-Type": "application/json",
    },
    }
  );
}

/**
 * Creates and appends a new todo item element to the todo list
 * @param {string} todo - The text content for the todo item
 * @returns {void}
 */
function createTodoItemHTML(todoEntry) {
  let id = todoEntry[0];
  let todo = todoEntry[1];
  const todoListItem = document.createElement("li");
  const todoListItemCheckbox = document.createElement("input");
  const todoListItemLabel = document.createElement("label");
  todoListItemCheckbox.type = "checkbox";
  todoListItemCheckbox.name = `todo${id}`;
  todoListItem.dataset.id = id;
  todoListItemLabel.textContent = todo;
  todoListItemLabel.htmlFor = todoListItemCheckbox.name;

  todoListItemCheckbox.addEventListener("change", (e) => {
    if (!(e.target instanceof HTMLInputElement) || !e.target.checked) return;

    e.target.disabled = true;

    removeTodo(id);

    const listItem = e.target.parentElement;

    setTimeout(() => {
      listItem.remove();
    }, 1000);
  });

  todoListItem.appendChild(todoListItemCheckbox);
  todoListItem.appendChild(todoListItemLabel);
  todoList.appendChild(todoListItem);
}

/**
 * Form that adds a new todo item to the todo list
 */
todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(e.target);
  const todoValue = formData.get("newTodo");
  const todoBox = document.getElementById("newTodo");
  todoBox.value = "";

  addTodo(todoValue);
});
