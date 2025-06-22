document.addEventListener("DOMContentLoaded", function () {
  let tasks = [];
  let btn = document.querySelector("#addTask");
  let inputBox = document.querySelector("#taskInput");
  let list = document.querySelector("#taskList");
  const filterMenu = document.querySelector("#filterMenu");

  const createList = (task) => {
    let listItem = document.createElement("li");
    listItem.setAttribute("data-id", task.id);
    listItem.classList.add("list-item");

    let taskSpan = document.createElement("span");
    taskSpan.innerText = task.title;

    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    if (task.completed) {
      taskSpan.classList.add("completed");
    }

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      if (task.completed) taskSpan.classList.add("completed");
      else taskSpan.classList.remove("completed");
      localStorage.setItem("tasks", JSON.stringify(tasks));
    });

    if (task.pinned) {
      listItem.classList.add("pinned");
    }

    let btnpin = document.createElement("button");
    let btndel = document.createElement("button");
    btnpin.innerHTML = "📌";
    btndel.innerHTML = "🗑";

    listItem.append(checkbox, taskSpan, btnpin, btndel);
    list.append(listItem);

    btnpin.addEventListener("click", () => pinTask(task.id));
    btndel.addEventListener("click", () => deleteTask(task.id));
  };

  const updateList = () => {
    list.innerHTML = "";
    tasks.forEach((task) => createList(task));
  };

  const pinTask = (id) => {
    const taskIndex = tasks.findIndex((task) => task.id == id);
    const [task] = tasks.splice(taskIndex, 1);
    task.pinned = true;
    tasks.unshift(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    updateList();
  };

  const deleteTask = (id) => {
    tasks = tasks.filter((task) => task.id != id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    let delItem = document.querySelector(`[data-id='${id}']`);
    delItem.remove();
  };

  const addTask = () => {
    let input = inputBox.value.trim();
    if (input == "") {
      alert("You did NOT set a task");
      return;
    }

    let task = {
      id: Date.now(),
      title: input,
      completed: false,
      pinned: false,
      createdAt: Date.now(),
    };

    tasks.push(task);
    inputBox.value = "";
    localStorage.setItem("tasks", JSON.stringify(tasks));
    createList(task);
  };

  const saved = () => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      tasks = JSON.parse(stored);
      tasks.forEach((task) => createList(task));
    }
  };

  const applyFilters = () => {
    let filteredTasks = tasks.slice();
    const value = filterMenu.value;

    if (value === "default") {
      updateList();
      return;
    } else if (value == "completed") {
      filteredTasks = filteredTasks.filter((task) => task.completed);
    } else if (value == "incomplete") {
      filteredTasks = filteredTasks.filter((task) => !task.completed);
    } else if (value == "newest") {
      filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      filteredTasks.sort((a, b) => a.createdAt - b.createdAt);
    }

    list.innerHTML = "";
    filteredTasks.forEach((task) => createList(task));
  };

  btn.addEventListener("click", addTask);

  inputBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  });

  filterMenu.addEventListener("change", applyFilters);

  saved(); // Load tasks on page load
});