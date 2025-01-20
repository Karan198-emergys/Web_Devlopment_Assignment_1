window.addEventListener("load", () => {
  const form = document.getElementById("add_form");
  const Ongoing = document.getElementById("active-task_list");
  const Completed = document.getElementById("completed-task_list");
  const addTaskButton = document.getElementById("open_form");
  const closeFormButton = document.getElementById("close_form");
  const activeTaskCount = document.getElementById("active-list_count");
  const completeTaskCount = document.getElementById("complete-list_count");
  let sorting = document.getElementById("sortTask");
  let tasks = JSON.parse(localStorage.getItem("DBtodo")) || [];

  addTaskButton.addEventListener("click", () => {
    document.querySelector(".add-task_form").style.display = "flex";
  });

  closeFormButton.addEventListener("click", () => {
    document.querySelector(".add-task_form").style.display = "none";
  });

  sorting.addEventListener("change", sortTodos);
  function sortTodos() {
    rendertask();
    RenderCompletedtask();
  }

  document.getElementById("listSearch").addEventListener("input", filterTasks);

  function filterTasks() {
    const searchItem = document
      .getElementById("listSearch")
      .value.toLowerCase();
    const filteredData = tasks.filter((tasks) =>
      tasks.taskname.toLowerCase().includes(searchItem)
    );
    let activeSearchTask = filteredData.filter((task) => task.done === false);
    let completeSearchTask = filteredData.filter((task) => task.done === true);
    searchActivetask(activeSearchTask);
    searchCompleteTask(completeSearchTask);
  }

  function searchActivetask(activeSearchTask) {
    Ongoing.innerHTML = "";
    if (activeSearchTask.length === 0) {
      Ongoing.innerHTML = `<li style="font-size:2rem;padding:4%;margin-top:10%;color:#d6d6d6">No Task Found</li>`;
    }
    activeSearchTask.forEach((taski) => {
      if (taski.done === true) {
        return;
      }
      let todoitem = document.createElement("li");
      todoitem.innerHTML = `<div class="todo_task">
                  <div class="task_title">
                    <p class="title_name" style="font-size:2.2rem" data-index="${
                      taski.id
                    }">${taski.taskname}</p>
                    <div class="tasktime" data-index="${taski.id}">${new Date(
        taski.schedule
      ).toLocaleString()}</div>
                  </div>
                  <div class="task_category">
                   <p style="font-size: 1.4rem">Category-${taski.category}</p>
                  </div>
                  <div class="task_description">
                    <p class="todo_description" data-index="${
                      taski.id
                    }" style="text-overflow: ellipsis;word-wrap: break-word;font-size:1rem">${
        taski.description || "No description"
      }</p>
                  </div>
                  <div class="task_button">
                    <div class="task_modify">
                      <button class="delete_task" data-id="${taski.id}">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                    <div class="task_status">
                      <button class="complete_status" data-id="${taski.id}">
                        <i class="fa-solid fa-check"></i>
                      </button>
                    </div>
                  </div>
                </div>`;
      Ongoing.appendChild(todoitem);
      todoitem.querySelector(".title_name").addEventListener("click", () => {
        editfield(taski, "taskname");
      });

      todoitem.querySelector(".tasktime").addEventListener("click", () => {
        editfield(taski, "schedule");
      });
      todoitem
        .querySelector(".todo_description")
        .addEventListener("click", () => {
          editfield(taski, "description");
        });
      todoitem.querySelector(".delete_task").addEventListener("click", () => {
        tasks = tasks.filter((task) => task.id !== taski.id);
        localStorage.setItem("DBtodo", JSON.stringify(tasks));
        searchRendertask(filteredData);
        RenderCompletedtask();
        UpdatetaskCounter();
      });
      todoitem
        .querySelector(".complete_status")
        .addEventListener("click", () => {
          let taskToComplete = tasks.find((t) => t.id === taski.id);
          taskToComplete.done = true;
          localStorage.setItem("DBtodo", JSON.stringify(tasks));
          searchRendertask(filteredData);
          RenderCompletedtask();
          UpdatetaskCounter();
        });
    });
  }
  function searchCompleteTask(completeSearchTask) {
    Completed.innerHTML = "";
    if (completeSearchTask.length === 0) {
      Completed.innerHTML = `<li style="font-size:2rem;padding:4%;margin-top:10%;color:#d6d6d6">No Todos Found.</li>`;
      return;
    }
    completeSearchTask.forEach((taski) => {
      let taskitem = document.createElement("li");
      taskitem.innerHTML = `
                <div class="todo_task" style="background-color:#fff8fe;">
                  <div class="task_title">
                    <p style="font-size:2.2rem">${taski.taskname}</p>
                    <div class="tasktime">${new Date(
                      taski.schedule
                    ).toLocaleString()}</div>
                  </div>
                  <div class="task_category">
                    <p style="font-size: 1.4rem">Category-${taski.category}</p>
                  </div>
                  <div class="task_description">
                    <p style="text-overflow: ellipsis;word-wrap: break-word;font-size:1rem">${
                      taski.description
                    }</p>
                  </div>
                  <div class="task_button" style="  flex-direction: row-reverse;">
                    <button
                    class="recycle_button"><i class="fa-solid fa-rotate-left"></i></button>
                    <button class="delete_task" style="background-color:#fff8fe" data-id="${
                      taski.id
                    }">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>`;
      Completed.appendChild(taskitem);

      taskitem.querySelector(".delete_task").addEventListener("click", () => {
        tasks = tasks.filter((task) => task.id !== taski.id);
        localStorage.setItem("DBtodo", JSON.stringify(tasks));
        rendertask();
        UpdatetaskCounter();
        RenderCompletedtask();
      });
      taskitem
        .querySelector(".recycle_button")
        .addEventListener("click", () => {
          taski.done = false;
          localStorage.setItem("DBtodo", JSON.stringify(tasks));
          rendertask();
          RenderCompletedtask();
          UpdatetaskCounter();
        });
    });
  }

  // update counter implemented her e

  function UpdatetaskCounter() {
    const activeTask = tasks.filter((task) => !task.done).length;
    const completeTask = tasks.filter((task) => task.done).length;
    activeTaskCount.textContent = activeTask;
    completeTaskCount.textContent = completeTask;
  }  // clear button implemented here

  (() => {
    const active_ul = document.getElementById("active-task_list");
    if (tasks.length === 0) {
      active_ul.innerHTML = `<li style="font-size:2rem;padding:4%;margin-top:10%;color:#d6d6d6">No task to do</li>`;
      return;
    } else {
      rendertask();
      UpdatetaskCounter();
    }
  })();
  (() => {
    const complete_ul = document.getElementById("completed-task_list");
    const completed_task = tasks.filter((task) => task.done === true);

    if (completed_task.length === 0) {
      complete_ul.innerHTML = `<li style="font-size:2rem;padding:4%;margin-top:10%;color:#d6d6d6">No task to be Completed</li>`;
    } else {
      RenderCompletedtask();
      UpdatetaskCounter();
    }
  })();

  const disableClear_button = document.getElementById("cancel");
  disableClear_button.addEventListener("click", () => {
    document.getElementById("clear_blurbg").style.display = "none";
  });
  const Clear_button = document.getElementById("clear_all");
  Clear_button.addEventListener("click", () => {
    if (tasks.length === 0) {
      return;
    }
    document.getElementById("clear_blurbg").style.display = "flex";
  });

  const Clearall = document.getElementById("delete");
  Clearall.addEventListener("click", () => {
    if (tasks.length === 0) {
      return;
    }
    tasks = [];
    localStorage.setItem("DBtodo", JSON.stringify(tasks));
    Completed.innerHTML = "";
    Ongoing.innerHTML = "";
    rendertask();
    RenderCompletedtask();
    UpdatetaskCounter();
    document.getElementById("clear_blurbg").style.display = "none";
  });
  
  function UpdateClearButtonOpacity(){
    if(tasks.length === 0){
      Clear_button.style.opacity="0.4";
    }
    else {
      Clear_button.style.opacity="1";
    }
  }UpdateClearButtonOpacity();


  form.addEventListener("submit", (event) => {
    event.preventDefault();

    clearError();

    let taskname = document.getElementById("task_title").value;
    let category = document.getElementById("categories").value;
    let scheduleInput = document.getElementById("add_time").value;
    let description = document.getElementById("add-task_description").value;
    let now = new Date();
    let schedule = new Date(scheduleInput);

    let isValid = true;

    if (!taskname) {
        showError("task_name_error", "Task name is required");
        isValid = false;
    }
    if (!category) {
        showError("category_error", "Category is required");
        isValid = false;
    }
    if (!scheduleInput) {
        showError("schedule_error", "Schedule date is required");
        isValid = false;
    } else if (isNaN(schedule.getTime())) {
        showError("schedule_error", "Please enter a valid date and time");
        isValid = false;
    } else if (now > schedule) {
        showError("schedule_error", "Please enter today's date or a future date");
        isValid = false;
    }
    if (isValid) {
        const task = {
            id: self.crypto.randomUUID(),
            taskname: taskname,
            category: category,
            schedule: schedule.toISOString(),
            description: description,
            done: false
        };
        tasks.push(task);
        localStorage.setItem("DBtodo", JSON.stringify(tasks));
        rendertask();
        UpdatetaskCounter();
        UpdateClearButtonOpacity();
        form.reset();
    }
});

function showError(elementID, message) {
    const errorLabel = document.getElementById(elementID);
    errorLabel.innerHTML = `<i style="font-size:1rem" class="fa-solid fa-circle-exclamation"></i> ${message}`;
    errorLabel.style.display = "block";
    errorLabel.style.color = "red";
    errorLabel.style.fontSize = "0.8rem";
}

function clearError() {
    const allError = document.querySelectorAll(".error");
    allError.forEach((error) => {
        error.style.display = "none";
        error.textContent = "";
    });
}

  function rendertask() {
    Ongoing.innerHTML = "";
    const ongoingTask = tasks.filter((task) => !task.done);

    let sortBy = document.getElementById("sortTask").value;
    if (sortBy === "ascending") {
      ongoingTask.sort((a, b) => a.taskname.localeCompare(b.taskname));
    } else if (sortBy === "descending") {
      ongoingTask.sort((a, b) => b.taskname.localeCompare(a.taskname));
    } else if (sortBy === "Date") {
      ongoingTask.sort((a, b) => new Date(a.schedule) - new Date(b.schedule));
    }

    if (ongoingTask.length === 0) {
      Ongoing.innerHTML = `<li style="font-size:2rem;padding:4%;margin-top:10%;color:#d6d6d6">No task to do</li>`;
      return;
    }

    ongoingTask.forEach((taski) => {
      let todoitem = document.createElement("li");
      todoitem.innerHTML = `<div class="todo_task">
                  <div class="task_title">
                    <p class="title_name" style="font-size:2.2rem" data-index="${
                      taski.id
                    }">${taski.taskname}</p>
                    <div class="tasktime" data-index="${taski.id}">${new Date(
        taski.schedule
      ).toLocaleString()}</div>
                  </div>
                  <div class="task_category">
                   <p style="font-size: 1.4rem"><b>Category</b>-${taski.category}</p>
                  </div>
                  <div class="task_description">
                    <p class="todo_description" data-index="${
                      taski.id
                    }" style="text-overflow: ellipsis;word-wrap: break-word;font-size:1rem">${
        taski.description || "No description"
      }</p>
                  </div>
                  <div class="task_button">
                    <div class="task_modify">
                      <button class="delete_task" data-id="${taski.id}">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                    <div class="task_status">
                      <button class="complete_status" data-id="${taski.id}">
                        <i class="fa-solid fa-check"></i>
                      </button>
                    </div>
                  </div>
                </div>`;
      Ongoing.appendChild(todoitem);

      todoitem.querySelector(".title_name").addEventListener("click", () => {
        editfield(taski, "taskname");
      });

      todoitem.querySelector(".tasktime").addEventListener("click", () => {
        editfield(taski, "schedule");
      });
      todoitem
        .querySelector(".todo_description")
        .addEventListener("click", () => {
          editfield(taski, "description");
        });
      todoitem.querySelector(".delete_task").addEventListener("click", () => {
        tasks = tasks.filter((task) => task.id !== taski.id);
        localStorage.setItem("DBtodo", JSON.stringify(tasks));
        rendertask();
        RenderCompletedtask();
        UpdatetaskCounter();
      });
      todoitem
        .querySelector(".complete_status")
        .addEventListener("click", () => {
          let taskToComplete = tasks.find((t) => t.id === taski.id);
          taskToComplete.done = true;
          localStorage.setItem("DBtodo", JSON.stringify(tasks));
          rendertask();
          RenderCompletedtask();
          UpdatetaskCounter();
        });
    });
  }

  function RenderCompletedtask() {
    Completed.innerHTML = "";
    const completedTasks = tasks.filter((task) => task.done === true);

    let sortBy = document.getElementById("sortTask").value;
    if (sortBy === "ascending") {
      completedTasks.sort((a, b) => a.taskname.localeCompare(b.taskname));
    } else if (sortBy === "descending") {
      completedTasks.sort((a, b) => b.taskname.localeCompare(a.taskname));
    } else if (sortBy === "Date") {
      completedTasks.sort(
        (a, b) => new Date(a.schedule) - new Date(b.schedule)
      );
    }

    if (completedTasks.length === 0) {
      Completed.innerHTML = `<li style="font-size:2rem;padding:4%;margin-top:10%;color:#d6d6d6">All tasks has been completed.</li>`;
      return;
    }
    completedTasks.forEach((taski) => {
      let taskitem = document.createElement("li");
      taskitem.innerHTML = `
                <div class="todo_task" style="background-color:#fff8fe;">
                  <div class="task_title">
                    <p style="font-size:2.2rem">${taski.taskname}</p>
                    <div class="tasktime">${new Date(
                      taski.schedule
                    ).toLocaleString()}</div>
                  </div>
                  <div class="task_category">
                    <p style="font-size: 1.4rem">Category-${taski.category}</p>
                  </div>
                  <div class="task_description">
                    <p style="text-overflow: ellipsis;word-wrap: break-word;font-size:1rem">${
                      taski.description
                    }</p>
                  </div>
                  <div class="task_button" style="  flex-direction: row-reverse;">
                    <button
                    class="recycle_button"><i class="fa-solid fa-rotate-left"></i></button>
                    <button class="delete_task" style="background-color:#fff8fe" data-id="${
                      taski.id
                    }">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>`;
      Completed.appendChild(taskitem);

      taskitem.querySelector(".delete_task").addEventListener("click", () => {
        tasks = tasks.filter((task) => task.id !== taski.id);
        localStorage.setItem("DBtodo", JSON.stringify(tasks));
        rendertask();
        UpdatetaskCounter();
        RenderCompletedtask();
      });
      taskitem
        .querySelector(".recycle_button")
        .addEventListener("click", () => {
          taski.done = false;
          localStorage.setItem("DBtodo", JSON.stringify(tasks));
          rendertask();
          RenderCompletedtask();
          UpdatetaskCounter();
        });
    });
  }

  function editfield(task, field) {
    const currenttext =
      field === "schedule"
        ? new Date(task[field]).toISOString().slice(0, 16)
        : task[field];
    const input = document.createElement("input");
    input.type = field === "schedule" ? "datetime-local" : "text";
    input.value = currenttext;
    input.style.outline = "none";
    input.style.border = "none";

    if (field === "schedule") {
      const now = new Date();
      const minDate = now.toISOString().slice(0, 16);
      input.setAttribute("min", minDate);
    }

    let taskelement;
    if (field === "taskname") {
      taskelement = document.querySelector(
        `.title_name[data-index="${task.id}"]`
      );
      input.setAttribute("maxlength", "15");
      input.style.fontSize = "2.2rem";
    } else if (field === "description") {
      taskelement = document.querySelector(
        `.todo_description[data-index="${task.id}"]`
      );
      input.style.fontSize = "1.4rem";
    } else if (field === "schedule") {
      taskelement = document.querySelector(
        `.tasktime[data-index="${task.id}"]`
      );
    }

    if (taskelement) {
      taskelement.innerHTML = "";
      taskelement.appendChild(input);
      input.focus();

      input.addEventListener("blur", () => {
        saveedit(task, field, input.value);
      });
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          saveedit(task, field, input.value);
        }
      });
    }
  }
  function saveedit(task, field, newValue) {
    const currIndex = tasks.findIndex((t) => t.id === task.id);
    if (currIndex === -1) {
      return;
    }
    if (field === "schedule") {
      const newDate = new Date(newValue);
      const now = new Date();

      if (newDate < now) {
        alert("enter the Current or future Date");
        return;
      }
      tasks[currIndex][field] = newDate.toISOString();
    } else {
      tasks[currIndex][field] = newValue;
    }
    localStorage.setItem("DBtodo", JSON.stringify(tasks));
    UpdatetaskCounter();
    rendertask();
  }
});
