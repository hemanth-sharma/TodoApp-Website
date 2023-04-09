let todo = [];
let url = "http://127.0.0.1:5000";

const inputField = document.getElementById("input-field");
const taskList = document.getElementById("task-list");
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", ()=>{
    const request = new XMLHttpRequest();
    request.open("GET", `${url}/logout`);
    request.send();
    request.addEventListener("load", function(){
        if(!(request.status === 200)){
            console.log("error in logout");
        }
        else{
            console.log("logout hit");
        }
    });
})



getTodosFromServer();

inputField.addEventListener("keypress", function(event){
    const task = inputField.value;
    if(event.key === "Enter" && task === ""){
        inputField.classList.add("warning");
        inputField.value = "";
    }
    else if(event.key === "Enter"){ 
        let x = task.trim();
        if(!(x === "")){
            todo.push(task);
            render(task);
            const request = new XMLHttpRequest();
            request.open("POST", `${url}/todo`);
            request.setRequestHeader("content-type", "application/json");
            request.send(JSON.stringify({task}));
            request.addEventListener("load", function(){
                if(!(request.status === 200)){
                    console.log("error in xml");
                }
            });
        }
        else{
            inputField.classList.add("warning");
            inputField.value = "";
        }
        
    }
})


function updateUserInfo(user){
    const usernameEl = document.getElementById("username");
    const emailEl = document.getElementById("email"); 
    const usernameHeader = document.getElementById("username-header");
    usernameEl.textContent = user.username;
    usernameHeader.innerHTML = `<h1>${user.username}</h1>`;
    emailEl.textContent = user.email;

}
function render(task){
    inputField.classList.remove("warning");
    const li = document.createElement("li");
    const taskName = document.createElement("div");
    taskName.textContent = task;
    taskName.setAttribute("contenteditable", "false");
    taskName.classList.add("task-name");

    const taskIcon = document.createElement("div");
    taskIcon.classList.add("task-icons");

    // creating task icons and buttons
    const inputCheckbox = document.createElement("input");
    inputCheckbox.setAttribute("type", "checkbox");
    inputCheckbox.setAttribute("name", "checkbox-btn");
    inputCheckbox.setAttribute("class", "checkbtn");

    const updateBtn = document.createElement("button");
    let pencilIcon = document.createElement("i");
    pencilIcon.setAttribute("class", "fa fa-pencil");
    updateBtn.appendChild(pencilIcon);
    updateBtn.setAttribute('class', "update-btn");
    // updateBtn.setAttribute('class', "click-style");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "X";
    deleteBtn.setAttribute("class", "delete-btn");

    taskIcon.appendChild(inputCheckbox);
    taskIcon.appendChild(updateBtn);
    taskIcon.appendChild(deleteBtn);

    // inserting child elements into div
    li.appendChild(taskName);
    li.appendChild(taskIcon);

    taskList.appendChild(li);

    // adding events on update, delete, and checkbox btn
    updateBtn.addEventListener("click", updateTask);
    deleteBtn.addEventListener("click", removeTask);
    inputCheckbox.addEventListener("change", taskCompleted);

    inputField.value = "";
}

let oldTask;
let newTask;
function updateTask(event){
    console.log("Update");
    event.target.parentNode.parentNode.parentNode.firstChild.classList.toggle('clicked');
    // Adding a class to the div if its already clicked 
    if(event.target.parentNode.parentNode.parentNode.firstChild.classList.contains("clicked")){
        oldTask = event.target.parentNode.parentNode.parentNode.firstChild.innerText;
        event.target.parentNode.parentNode.parentNode.firstChild.setAttribute("contenteditable", "true");
        event.target.parentNode.parentNode.parentNode.firstChild.focus();
        console.log("value when clicked = === oldtask = ", oldTask);
        event.target.parentNode.classList.add("click-style");
    }
    else{
        event.target.parentNode.classList.remove("click-style");
        event.target.parentNode.parentNode.parentNode.firstChild.setAttribute("contenteditable", "false");
        newTask = event.target.parentNode.parentNode.parentNode.firstChild.innerText;
        console.log("oldtask = ", oldTask);
        console.log("newtask = ", newTask);
        // repacing newTask value in localStorage
        updateOnServerStorage(event, newTask, todo.indexOf(oldTask));
    }
    // let task = event.target.parentNode.parentNode.parentNode.firstChild.innerText;
    // console.log(oldTask);
    // console.log(newTask);
    console.log(event.target.parentNode.parentNode.parentNode.firstChild);
}
function removeTask(event){
    // console.log("Task removed");
    const item = event.target.parentNode.parentNode.firstChild.innerText;
    const index = todo.indexOf(item);
    event.target.parentNode.parentNode.parentNode.removeChild(event.target.parentNode.parentNode);
    updateOnServerStorage(event, null,index);
}
function taskCompleted(event){
    if(event.target.checked){
        event.target.parentNode.parentNode.firstChild.classList.add("task-done");
    }
    else{
        event.target.parentNode.parentNode.firstChild.classList.remove("task-done");
    }
}

// setTimeout(getTodosFromServer, 5000);
function getTodosFromServer(){
    const requestTodos = new XMLHttpRequest();
    requestTodos.open("GET", `${url}/todo`); 
    requestTodos.setRequestHeader("content-type", "application/json");
    requestTodos.send();
    requestTodos.addEventListener("load", function(){
        if(requestTodos.status === 200){
            // console.log(requestTodos.responseText);
            const user = JSON.parse(requestTodos.responseText);
            // console.log(user[0]);
            updateUserInfo(user[0]);
            const todos = user[0].todo;
            console.log(todos);
            todos.forEach(function(task){
                render(task);
            });
        }
        else{
            console.log("Error occured");
        }
    });
}
function updateOnServerStorage(event, newTask, newIndex){
    const requestForDelete = new XMLHttpRequest();
    requestForDelete.open("POST", `${url}/updateTask`);
    requestForDelete.setRequestHeader("content-type", "application/json");
    requestForDelete.send(JSON.stringify({newTask, newIndex}));
    requestForDelete.addEventListener("load", function(){
        if(!(requestForDelete.status === 200)){
            console.log("error in deleting");
        }
    });
}