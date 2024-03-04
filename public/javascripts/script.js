'use strict';



// select all DOM elements

const headerTime = document.querySelector("[data-header-time]");
const menuTogglers = document.querySelectorAll("[data-menu-toggler]");
const menu = document.querySelector("[data-menu]");
const themeBtns = document.querySelectorAll("[data-theme-btn]");
const modalTogglers = document.querySelectorAll("[data-modal-toggler]");
const taskList = document.querySelector("[data-task-list]");
const taskInput = document.querySelector("[data-task-input]");
const submitBtn = document.querySelector("[data-submit-btn]");
const modal = document.querySelector("[data-info-modal]");
let taskItem = {};
let taskRemover = {};
let taskCounter = 0;


// store current date from build-in date object
const date = new Date();

// import task complete sound
const taskCompleteSound = new Audio("public/task-complete.mp3");



/**
 * convert weekday number to weekday name
 * totalParameter: 1;
 * parameterValue: <number> 0-6;
 */

const getWeekDayName = function (dayNumber) {
    switch (dayNumber) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Satureday";
        default:
            return "Not a valid day";
    }
}



/**
 * convert month number to month name
 * totalParameter: 1;
 * parameterValue: <number> 0-11;
 */

const getMonthName = function (monthNumber) {
    switch (monthNumber) {
        case 0:
            return "Jan";
        case 1:
            return "Feb";
        case 2:
            return "Mar";
        case 3:
            return "Apr";
        case 4:
            return "May";
        case 5:
            return "Jun";
        case 6:
            return "Jul";
        case 7:
            return "Aug";
        case 8:
            return "Sep";
        case 9:
            return "Oct";
        case 10:
            return "Nov";
        case 11:
            return "Dec";
        default:
            return "Not a valid month";
    }
}



// store weekday name, month name & month-of-day number
const weekDayName = getWeekDayName(date.getDay());
const monthName = getMonthName(date.getMonth());
const monthOfDay = date.getDate();

// update headerTime date
headerTime.textContent = `${weekDayName}, ${monthName} ${monthOfDay}`;



/**
 * toggle active class on element
 * totalParameter: 1;
 * parameterValue: <object> elementNode;
 */

const elemToggler = function (elem) { elem.classList.toggle("active"); }



/**
 * toggle active class on multiple elements
 * totalParameter: 2;
 * parameterValue: <object> elementNode, <function> any;
 */

const addEventOnMultiElem = function (elems, event) {
    for (let i = 0; i < elems.length; i++) {
        elems[i].addEventListener("click", event);
    }
}



/**
 * create taskItem elementNode and return it
 * totalParameter: 1;
 * parameterValue: <string> any;
 */

const taskItemNode = function (taskText) {

    const createTaskItem = document.createElement("li");
    createTaskItem.classList.add("task-item");
    createTaskItem.setAttribute("data-task-item", "");

    createTaskItem.innerHTML = `
  
    <button class="item-icon" data-task-remove="complete">
      <span class="check-icon"></span>
    </button>

    <p class="item-text">${taskText}</p>

    <button class="item-action-btn" aria-label="Remove task" data-task-remove>
      <ion-icon name="trash-outline" aria-hidden="true"></ion-icon>
    </button>

  `;

    return createTaskItem;

}



/**
 * task input validation
 * totalParameter: 1;
 * parameterValue: <string> any
 */

const taskInputValidation = function (taskIsValid) {

    if (taskIsValid) {
        /**
         * if there is an existing task
         * then the new task will be added before it
         */
        if (taskList.childElementCount > 0) {
            taskList.insertBefore(taskItemNode(taskInput.value), taskItem[0]);
        } else {
            taskList.appendChild(taskItemNode(taskInput.value));
        }

        // after adding task on taskList, input field should be empty
        taskInput.value = "";

        // update taskItem DOM selection
        taskItem = document.querySelectorAll("[data-task-item]");
        taskRemover = document.querySelectorAll("[data-task-remove]");

    } else {
        // if user pass any falsy value like(0, "", undefined, null, NaN)
        console.log("Please write something!");
    }
}



/**
 * removeTask when click on delete button or check button
 */

const removeTask = function () {

    // select clicked taskItem
    const parentElement = this.parentElement;

    /**
     * if the task is completed, the taskItem would be remove after 250ms
     * if deleted than taskItem remove instant
     */
    if (this.dataset.taskRemove === "complete") {

        parentElement.classList.add("complete"); // add "complete" class on taskItem
        taskCompleteSound.play(); // play taskCompleteSound

        setTimeout(function () {
            parentElement.remove(); // remove taskItem

        }, 250);

    } else {
        parentElement.remove(); // remove taskItem

    }

}



/**
 * addTask function
 */
let accumulatedTasks = [];

const addTask = function () {
    if (taskCounter < 3) {
        taskInputValidation(taskInput.value);
        addEventOnMultiElem(taskRemover, removeTask);
        accumulatedTasks.push({ text: taskInput.value });

        if (taskCounter >= 2) {
            hideTaskInput();
        }
    } else {
        hideTaskInput();
    }
}




/**
 * add keypress listener on taskInput
 */

taskInput.addEventListener("keypress", function (e) {

    // addTask if user press 'Enter'
    switch (e.key) {
        case "Enter":
            addTask();
            break;
    }

});



// toggle active class on menu when click on menuBtn or dropdownLink 
const toggleMenu = function () { elemToggler(menu); }
addEventOnMultiElem(menuTogglers, toggleMenu);

// toggle active class on modal when click on dropdownLink or modal Ok button
const toggleModal = function () { elemToggler(modal); }
addEventOnMultiElem(modalTogglers, toggleModal);



/**
 * add "loaded" class on body when website is fully loaded
 */

window.addEventListener("load", function () {
    document.body.classList.add("loaded");
});



/**
 * change body background when click on any themeBtn
 */

const themeChanger = function () {
    // store hue value from clicked themeBtn
    const hueValue = this.dataset.hue;

    // create css custom property on root and set value from hueValue
    document.documentElement.style.setProperty("--hue", hueValue);

    // remove "active" class from all themeBtns
    for (let i = 0; i < themeBtns.length; i++) {
        if (themeBtns[i].classList.contains("active")) {
            themeBtns[i].classList.remove("active");
        }
    }

    // add "active" class on clicked themeBtn
    this.classList.add("active");
}

// add event on all themeBtns
addEventOnMultiElem(themeBtns, themeChanger);

const hideTaskInput = () => {
    taskInput.classList.add('hide');
    submitBtn.classList.remove('hide');
}

// On submission we want to send the user input to server 
submitBtn.addEventListener("click", function (event) {

    event.preventDefault();

    fetch('/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taskItems: accumulatedTasks }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Server response:', data);
            
            accumulatedTasks = [];
        })
        .catch(error => {
            console.error('Error posting data to server:', error);
        });
});