const $ = id => document.getElementById(id);

const addBtn = $("addBtn");
const todoInput = $("todoInput");
const todoOpis = $("todoOpis");
const todoDeadline = $("todoDeadline");

const todoList = $("todoList");
const pagination = $("pagination");
const errorBox = $("errorMessage");

let todos = [];
const itemsPerPage = 3;
let currentPage = 1;

// -------------------------
// LOAD TODOS
// -------------------------
loadTodos();

async function loadTodos() {
  try {
    const { data } = await supabase
      .from("whattodoapp")
      .select("id, text, opis, deadline, priority, status")
      .order("id", { ascending: false });

    todos = data || [];
  } catch {
    todos = JSON.parse(localStorage.getItem("todos")) || [];
  }

  render();
}

// -------------------------
// ADD TASK
// -------------------------
addBtn.onclick = async () => {
  const text = todoInput.value.trim();
  const opis = todoOpis.value.trim();
  const deadline = todoDeadline.value;

  if (!text || !opis || !deadline) return showError("Wypełnij wszystkie pola!");

  const newTodo = {
    text,
    opis,
    deadline,
    priority: "low",
    status: "not_done"
  };

  todos.unshift(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));
  render();

  todoInput.value = "";
  todoOpis.value = "";
  todoDeadline.value = "";

  try {
    const { data } = await supabase
      .from("whattodoapp")
      .insert([newTodo])
      .select();

    if (data?.length) {
      todos[0] = data[0];
      localStorage.setItem("todos", JSON.stringify(todos));
      render();
    }
  } catch {}
};

// -------------------------
// DELETE TASK
// -------------------------
async function deleteTodo(id) {
  // usuń lokalnie
  todos = todos.filter(t => t.id !== id);
  localStorage.setItem("todos", JSON.stringify(todos));
  render();

  try {
    await supabase
      .from("whattodoapp")
      .delete()
      .eq("id", id);
  } catch {}
}

// -------------------------
// EDIT TASK
// -------------------------
async function editTodo(id) {
  const task = todos.find(t => t.id === id);
  if (!task) return;

  const newText = prompt("Nowy tekst:", task.text);
  if (!newText) return;

  const newOpis = prompt("Nowy opis:", task.opis);
  if (!newOpis) return;

  const newDeadline = prompt("Nowy deadline (YYYY-MM-DD):", task.deadline);
  if (!newDeadline) return;

  // aktualizacja lokalnie
  task.text = newText;
  task.opis = newOpis;
  task.deadline = newDeadline;

  localStorage.setItem("todos", JSON.stringify(todos));
  render();

  // aktualizacja w supabase
  try {
    await supabase
      .from("whattodoapp")
      .update({
        text: newText,
        opis: newOpis,
        deadline: newDeadline
      })
      .eq("id", id);
  } catch {}
}

// -------------------------
// RENDER LIST
// -------------------------
function render() {
  renderTodos();
  renderPagination();
}

function renderTodos() {
  todoList.innerHTML = "";
  const start = (currentPage - 1) * itemsPerPage;

  todos.slice(start, start + itemsPerPage).forEach((item) => {
    const li = document.createElement("li");
    li.className = "todo-item";

    li.innerHTML = `
      <div class="todo-text">
        <strong>${item.text}</strong><br>
        <small>${item.opis}</small><br>
        <small>📅 ${item.deadline}</small>
      </div>

      <div>
        <button class="edit-btn" onclick="editTodo(${item.id})">Edytuj</button>
        <button class="delete-btn" onclick="deleteTodo(${item.id})">Usuń</button>
      </div>
    `;

    todoList.append(li);
  });
}

// -------------------------
// PAGINATION
// -------------------------
function renderPagination() {
  pagination.innerHTML = "";
  const pages = Math.max(1, Math.ceil(todos.length / itemsPerPage));

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("button");
    btn.className = "pagination-btn";
    btn.textContent = i;
    btn.disabled = i === currentPage;
    btn.onclick = () => { currentPage = i; render(); };
    pagination.append(btn);
  }
}

// -------------------------
// ERROR BOX
// -------------------------
function showError(text) {
  errorBox.textContent = text;
  errorBox.style.display = "block";
  setTimeout(() => (errorBox.style.display = "none"), 2500);
}
