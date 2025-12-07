const SUPABASE_URL = "https://YOUR_URL.supabase.co";
const SUPABASE_KEY = "YOUR_ANON_KEY";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let currentPage = 1;
const pageSize = 5;

// --------------------- ADD TASK -------------------------
async function addTask() {
    const text = document.getElementById("todoText").value.trim();
    const opis = document.getElementById("todoOpis").value.trim();
    const deadline = document.getElementById("todoDeadline").value.trim();

    if (!text || !opis || !deadline) {
        showError("Wszystkie 3 pola muszą być wypełnione!");
        return;
    }

    const { error } = await supabaseClient
        .from("whattodoapp")
        .insert({
            text,
            opis,
            deadline,
            priority: "Low",
            status: "not_done"
        });

    if (error) {
        showError("Błąd dodawania zadania: " + error.message);
        return;
    }

    document.getElementById("todoText").value = "";
    document.getElementById("todoOpis").value = "";
    document.getElementById("todoDeadline").value = "";

    loadTasks();
}

// --------------------- LOAD TASKS -------------------------
async function loadTasks() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize - 1;

    const { data, error } = await supabaseClient
        .from("whattodoapp")
        .select("*")
        .order("id", { ascending: false })
        .range(start, end);

    if (error) {
        showError("Błąd pobierania danych: " + error.message);
        return;
    }

    const list = document.getElementById("todoList");
    list.innerHTML = "";

    data.forEach(task => {
        const li = document.createElement("li");
        li.className = "todo-item";
        li.innerHTML = `
            <span class="todo-text">${task.text}</span>
            <button class="edit-btn" onclick="editTask(${task.id})">Edytuj</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Usuń</button>
        `;
        list.appendChild(li);
    });
}

// --------------------- DELETE TASK -------------------------
async function deleteTask(id) {
    const { error } = await supabaseClient
        .from("whattodoapp")
        .delete()
        .eq("id", id);

    if (error) {
        showError("Błąd usuwania: " + error.message);
        return;
    }

    loadTasks();
}

// --------------------- EDIT TASK -------------------------
async function editTask(id) {
    const newText = prompt("Nowa treść zadania:");
    if (!newText) return;

    const { error } = await supabaseClient
        .from("whattodoapp")
        .update({ text: newText })
        .eq("id", id);

    if (error) {
        showError("Błąd aktualizacji: " + error.message);
        return;
    }

    loadTasks();
}

// --------------------- ERROR MESSAGE -------------------------
function showError(msg) {
    const box = document.getElementById("errorBox");
    box.style.display = "block";
    box.textContent = msg;

    setTimeout(() => {
        box.style.display = "none";
    }, 3000);
}

loadTasks();
