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
      .select("id, text, opis, deadline")
      .order("id", { ascending: false });

    todos = data || [];
  } catch {
    todos = JSON.parse(localStorage.getItem("todos")) || [];
  }

  render();
}

// -------------------------
// ADD TASK (3 → 5 pól)
// -------------------------
addBtn.onclick = async () => {
  const text = todoInput.value.trim();
  const opis = todoOpis.value.trim();
  const deadline = todoDeadline.value;

  if (!text || !opis || !deadline) {
    return showError("Wypełnij wszystkie pola!");
  }

  // automatyczne wartości
  const priority = "low";
  const status = "not_done";

  const newTodo = { text, opis, deadline, priority, status };

  todos.unshift(newTodo);
  localStorage.setItem("todos", JSON.stringify(todos));

  todoInput.value = "";
  todoOpis.value = "";
  todoDeadline.value = "";

  currentPage = 1;
  render();

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
