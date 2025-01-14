window.addEventListener("load", () => {
  const form = document.getElementById("add_form");
  const Ongoing = document.getElementById("active-task_list");
  const Completed = document.getElementById("completed-task_list");
  const addTaskButton = document.getElementById("open_form");
  const closeFormButton = document.getElementById("close_form");
  const activeTaskCount = document.getElementById("active-list_count");
  const completeTaskCount = document.getElementById("complete-list_count");
  let tasks = JSON.parse(localStorage.getItem("DBtodo")) || [];

  addTaskButton.addEventListener("click", () => {
    document.querySelector(".add-task_form").style.display = "flex";
  });

  closeFormButton.addEventListener("click", () => {
    document.querySelector(".add-task_form").style.display = "none";
  });

  function UpdatetaskCounter() {
    const activeTask = tasks.filter((task) => !task.done).length;
    const completeTask = tasks.filter((task) => task.done).length;
    activeTaskCount.textContent = activeTask;
    completeTaskCount.textContent = completeTask;
  }

  const Clear_button = document.getElementById("clear_all");
  Clear_button.addEventListener("click", () => {
    if (tasks.length === 0) {
      return;
    } else {
      const confirmation = confirm("Are you sure want to Clear your tasks");
      if (confirmation) {
        tasks = [];
        localStorage.setItem("DBtodo", JSON.stringify(tasks));
        Ongoing.innerHTML = "";
        Completed.innerHTML = "";
        alert("your task has been cleared");
        rendertask();
        RenderCompletedtask();
        UpdatetaskCounter();
      }
    }
  });

  (() => {
    const active_ul = document.getElementById("active-task_list");
    if (tasks.length === 0) {
      active_ul.innerHTML = `<li style="font-size:2rem;padding:4%;margin-top:10%;color:#d6d6d6">No Task To Do</li>`;
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

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let taskname = document.getElementById("task_title").value;
    let category = document.getElementById("categories").value;
    let scheduleInput = document.getElementById("add_time").value;
    let description = document.getElementById("add-task_description").value;

    if (!taskname || !category || !scheduleInput || !description) {
      alert("All the Fields are mandatory");
      return;
    }

    const schedule = new Date(scheduleInput);
    const now = new Date();

    if (schedule < now) {
      alert("Please enter the today date Or future date");
      return;
    }

    const scheduletime = schedule.getTime();
    console.log(scheduletime);

    if (isNaN(schedule.getTime())) {
      alert("Please enter a valid Date and Time");
      return;
    }
    const task = {
      id: new Date().getTime(),
      taskname: taskname,
      category: category,
      schedule: schedule.toISOString(),
      description: description,
      done: false,
    };

    tasks.push(task);
    localStorage.setItem("DBtodo", JSON.stringify(tasks));
    rendertask();
    UpdatetaskCounter();
    form.reset();
  });

  function rendertask() {
    Ongoing.innerHTML = "";
    let todos = JSON.parse(localStorage.getItem("DBtodo")) || [];

    todos.sort((a, b) => new Date(a.schedule) - new Date(b.schedule));

    todos.forEach((taski, index) => {
      if (taski.done === true) {
        return;
      }
      let taskitem = document.createElement("li");

      taskitem.innerHTML = `
                <div class="todo_task">
                  <div class="task_title">
                    <p class="title_name" style="font-size:2.2rem" data-index="${index}">${
        taski.taskname
      }</p>
                    <div class="tasktime" data-index="${index}">${new Date(
        taski.schedule
      ).toLocaleString()}</div>
                  </div>
                  <div class="task_category">
                   <p style="font-size: 1.4rem">Category-${taski.category}</p>
                  </div>
                  <div class="task_description">
                    <p class="todo_description" data-index="${index}" style="text-overflow: ellipsis;word-wrap: break-word;font-size:1rem">${
        taski.description
      }</p>
                  </div>
                  <div class="task_button">
                    <div class="task_modify">
                      <button class="delete_task" data-index="${index}">
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                    <div class="task_status">
                      <button class="complete_status" data-index="${index}">
                        <i class="fa-solid fa-check"></i>
                      </button>
                    </div>
                  </div>
                </div>`;
      Ongoing.appendChild(taskitem);

      taskitem.querySelector(".title_name").addEventListener("click", () => {
        editfield(taski, "taskname", index);
      });
      taskitem
        .querySelector(".todo_description")
        .addEventListener("click", () => {
          editfield(taski, "description", index);
        });
      taskitem.querySelector(".tasktime").addEventListener("click", () => {
        editfield(taski, "schedule", index);
      });

      taskitem.querySelector(".delete_task").addEventListener("click", () => {
        tasks.splice(index, 1);
        localStorage.setItem("DBtodo", JSON.stringify(tasks));
        (() => {})();
        UpdatetaskCounter();
        rendertask();
      });

      taskitem
        .querySelector(".complete_status")
        .addEventListener("click", () => {
          tasks[index].done = true;
          localStorage.setItem("DBtodo", JSON.stringify(tasks));
          rendertask();
          UpdatetaskCounter();
          RenderCompletedtask();
        });
    });
  }

  function RenderCompletedtask() {
    Completed.innerHTML = "";
    const completedTasks = tasks.filter((task) => task.done === true);

    if (completedTasks.length === 0) {
      Completed.innerHTML = `<li style="font-size:2rem;padding:4%;margin-top:10%;color:#d6d6d6">No Task Completed till Now</li>`;
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
                  <div class="task_button">
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
    });
  }

  function editfield(task, field, index) {
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
        `.title_name[data-index="${index}"]`
      );
      input.setAttribute("maxlength", "15");
      input.style.fontSize = "2.2rem";
    } else if (field === "description") {
      taskelement = document.querySelector(
        `.todo_description[data-index="${index}"]`
      );
    } else if (field === "schedule") {
      taskelement = document.querySelector(`.tasktime[data-index="${index}"]`);
    }

    if (taskelement) {
      taskelement.innerHTML = "";
      taskelement.appendChild(input);
      input.focus();

      input.addEventListener("blur", () => {
        saveedit(task, field, input.value, index);
      });
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          saveedit(task, field, input.value, index);
        }
      });
    }
  }
  function saveedit(task, field, newValue, index) {
    if (field === "schedule") {
      const newDate = new Date(newValue);
      const now = new Date();

      if (newDate < now) {
        alert("enter the Current or future Date");
        return;
      }
      tasks[index][field] = newDate.toISOString();
    } else {
      tasks[index][field] = newValue;
    }
    localStorage.setItem("DBtodo", JSON.stringify(tasks));
    UpdatetaskCounter();
    rendertask();
  }
});
