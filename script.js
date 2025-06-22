let tasks=[];
let btn=document.querySelector("#addTask");
let inputBox=document.querySelector("#taskInput");
let list=document.querySelector("#taskList");
const createList = (task) => {
         let listItem=document.createElement("li");
         listItem.setAttribute("data-id",task.id);
         listItem.classList.add("list-item");
         let taskSpan=document.createElement("span");
         taskSpan.innerText=task.title;
         let checkbox=document.createElement("input");
         checkbox.type="checkbox";
         checkbox.checked=task.completed;//if it is already checked, useful when we refresh the page
         if (task.completed) {
         taskSpan.classList.add("completed");  // add line-through if already completed
         }
         checkbox.addEventListener("change", () => {
         task.completed = checkbox.checked;
         if(task.completed) taskSpan.classList.add("completed");
         else {
            taskSpan.classList.remove("completed");
         }
         localStorage.setItem("tasks", JSON.stringify(tasks));
         });
         if (task.pinned) {
          listItem.classList.add("pinned");
         }
         let btnpin=document.createElement("button");
         let btndel=document.createElement("button");
         btnpin.innerHTML = "📌";
         btndel.innerHTML = "🗑️";
         listItem.append(checkbox, taskSpan, btnpin, btndel);
         list.append(listItem);
         btnpin.addEventListener("click",() =>pinTask(task.id));
         btndel.addEventListener("click" ,() =>deleteTask(task.id));
}
const updateList = () => {
  list.innerHTML = "";
  tasks.forEach(task => createList(task));
};
const pinTask = (id) => {
  const taskIndex = tasks.findIndex(task => task.id == id);
  const [task]= tasks.splice(taskIndex, 1);
  task.pinned = true;
  tasks.unshift(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateList();
}
const  deleteTask = (id) => {
    tasks=tasks.filter(task=>{
       return task.id!=id;
    }
    )
    localStorage.setItem("tasks",JSON.stringify(tasks));//now task is deleted and new list of tasks is updated to storage
    let delItem =document.querySelector(`[data-id='${id}']`);
    delItem.remove();
}
const addTask= () => {
    let input= inputBox.value.trim();//to also not allow just spaces
    if(input==""){
    alert("You did NOT set a task");
    return;
}
let task = {
  id: Date.now(),
  title: input.trim(),
  completed: false,
  pinned: false,
  createdAt: Date.now()
};
    tasks.push(task);
    inputBox.value="";
    localStorage.setItem("tasks",JSON.stringify(tasks));//local storage is updated with full task list
    createList(task);
}
const saved=() => {
    tasks=JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach(task => {//old tasks printed using for-each loop with saved data in localstorage
    createList(task);    
    });
}
btn.addEventListener("click",addTask);//click button to add task
inputBox.addEventListener("keydown", (event) => {//or also use enter key
  if (event.key === "Enter") {
    addTask();
  }
});
document.addEventListener("DOMContentLoaded",saved);//this event is fired when page is reloaded
const menu = document.querySelector("#filterMenu");
const applyFilters = () => {
  let filteredTasks = tasks.slice();
  const value = menu.value;
 if (value === "default") {
  updateList(); // just reuse the standard update
  return;
 }
  else if (value =="completed") {
    filteredTasks = filteredTasks.filter(task => task.completed);
  } else if (value == "incomplete") {
    filteredTasks = filteredTasks.filter(task => !task.completed);
  } else if(value == "newest"){
    filteredTasks.sort((a, b) => b.createdAt - a.createdAt);
  } 
  else{
    filteredTasks.sort((a, b) => a.createdAt - b.createdAt);
  }
  list.innerHTML = "";
  filteredTasks.forEach(task => createList(task));
};
filterMenu.addEventListener("change", applyFilters);

