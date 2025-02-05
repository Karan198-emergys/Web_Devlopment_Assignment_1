const ExpenseForm = document.getElementById("expenseForm");
const addExpenseButton = document.getElementById("add_Expense");
const closeExpenseForm = document.getElementById("Close_exForm");
const addIncomeForm = document.getElementById("add_Income");
const IncomeForm = document.getElementById("incomeForm");
const closeIncomeForm = document.getElementById("Close_inForm");
const expenseNameInput = document.getElementById("exNameInput");
const expenseTimeInput = document.getElementById("expense_TimeInput");
const expenseAmountInput = document.getElementById("expense_amount");
const exCategoryInput = document.getElementById("expenseCategroy_Input");
let expenses = JSON.parse(localStorage.getItem("expenseDB")) || [];
console.log(localStorage.getItem("expenseDB"));
const incomeAmountInput = document.getElementById("income_amountInput");
const incomeNoteInput = document.getElementById("income_NoteInput");
let tasks = JSON.parse(localStorage.getItem("DBtodo")) || [];
const exTotalCount = document.getElementById("expense_Amount");
const BusinessCount = document.getElementById("business_Total");
const socialCount = document.getElementById("social_Total");
let expenseType;
const expenseTypeRadio = document.getElementsByName("type");
const personalCount = document.getElementById("personal_Total");
const inTotalCount = document.getElementById("income_Balance");
const salaryCount = document.getElementById("salary_Total");
const financeCount = document.getElementById("finance_Total");
const outSourceCount = document.getElementById("source_Total");
let incomeType;
const incomeTypeRadio = document.getElementsByName("sourceIncome");
const searchInput = document.getElementById("searchTransaction");
const popUp = document.getElementById("clear_blurbg");

let businessTotalCount;
let businessTotal,
  expenseTotal,
  socialTotal,
  personalTotal,
  incomeTotal,
  salaryTotal,
  financeTotal,
  outSourceTotal,
  balance,
  totalExpense,
  innerContext;

//Here I'm applying the Search Logic

searchInput.addEventListener("input", filterExpenses);

function filterExpenses() {
  const searchItem = searchInput.value.toLowerCase();
  const filteredData = expenses.filter((expense) => {
    return expense.exName && expense.exName.toLowerCase().includes(searchItem);
  });
  filteredSearchexpense(filteredData);
}

function filteredSearchexpense(filteredData) {
  const cardContainer = document.querySelector(".expensesCards");
  cardContainer.innerHTML = "";

  filteredData.forEach((cardyy) => {
    let expenseItem = document.createElement("div");
    expenseItem.className = "card";
    expenseItem.innerHTML = `
            <div  class="CardContent">
                <div class="cardHead">
                    <div data-unique-id ="${cardyy.id}" class="title_name">${
      cardyy.exName
    }</div>
                    <div class="cardDelete"><button data-unique-id ="${
                      cardyy.id
                    }" style="border:none;background-color:#fff" class="exDelete_card"><i class="fa-solid fa-xmark"></i></button></div>
                </div>
                <div data-unique-id ="${cardyy.id}" class="expense_money">₹${
      cardyy.exAmount
    }</div>
                <div data-unique-id ="${cardyy.id}" class="category_time">
                    <div data-unique-id ="${cardyy.id}" class="cardCategory">${
      cardyy.exCategory
    }</div>
                    <div data-unique-id ="${cardyy.id}"
                    }" class="expense_Time">${new Date(
                      cardyy.exTime
                    ).toLocaleString()}</div>
                </div>
                <div class="amountType"></div>
            </div>`;
    cardContainer.appendChild(expenseItem);

    expenseItem.querySelector(".title_name").addEventListener("click", () => {
      editField(cardyy, "exName");
    });
    expenseItem
      .querySelector(".expense_money")
      .addEventListener("click", () => {
        editField(cardyy, "exAmount");
      });
    expenseItem
      .querySelector(".exDelete_card")
      .addEventListener("click", () => {
        expenses = expenses.filter((expense) => expense.id !== cardyy.id);
        localStorage.setItem("expenseDB", JSON.stringify(expenses));
        renderCards();
        renderexpenseCard();
        renderIncomeCards();
      });
  });
}

//here im applying the card Arrow Logic

document.getElementById("cardLeft_arrow").addEventListener("click", () => {
  const container = document.querySelector(".expensesCards");
  container.scrollBy({
    top: 0,
    left: -container.clientWidth * 0.3,
    behavior: "smooth",
  });
});

document.getElementById("cardRight_arrow").addEventListener("click", () => {
  const container = document.querySelector(".expensesCards");
  container.scrollBy({
    top: 0,
    left: container.clientWidth * 0.3,
    behavior: "smooth",
  });
});
document.addEventListener("keydown", (event) => {
  const container = document.querySelector(".expensesCards");
  const scrollAmount = container.clientWidth * 0.3;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    container.scrollBy({
      top: 0,
      left: -scrollAmount,
      behavior: "smooth",
    });
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    container.scrollBy({
      top: 0,
      left: scrollAmount,
      behavior: "smooth",
    });
  }
});

// Show Expense Form

(() => {
  if (expenses.length === 0) {
    cardContainer.innerHTML = `<div> No expenses Added</div>`;
  } else {
    renderCards();
    renderexpenseCard();
    renderIncomeCards();
  }
})();

addExpenseButton.addEventListener("click", () => {
  ExpenseForm.style.display = "flex";
  addIncomeForm.disabled = true;
});

// Close Expense Form

closeExpenseForm.addEventListener("click", () => {
  ExpenseForm.style.display = "none";
  addIncomeForm.disabled = false;
});

addIncomeForm.addEventListener("click", () => {
  IncomeForm.style.display = "flex";
  addExpenseButton.disabled = true;
});

closeIncomeForm.addEventListener("click", () => {
  IncomeForm.style.display = "none";
});
// Handle Expense Form Submission

ExpenseForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const expenseName = expenseNameInput.value.trim();
  const expenseAmount = expenseAmountInput.value.trim();
  const expenseCategory = exCategoryInput.value.trim();
  const expenseTiming = expenseTimeInput.value.trim();
  const now = new Date();

  for (const radio of expenseTypeRadio) {
    if (radio.checked) {
      expenseType = radio.value;
      break;
    }
  }

  if (
    !expenseName ||
    !expenseAmount ||
    !expenseCategory ||
    !expenseTiming ||
    !expenseType
  ) {
    showError("please Enter All the fields");
  }
  const expenseTime = new Date(expenseTiming);
  if (now < expenseTime) {
    document.getElementById("pop_up").style.height = "22%";
    showError("please Enter the Todays / Previous Date");
    return;
  }
  const expenseObj = {
    id: self.crypto.randomUUID(),
    exName: expenseName,
    exAmount: expenseAmount,
    exCategory: expenseCategory,
    exType: expenseType,
    exTime: expenseTime.toISOString(),
  };

  let today = new Date().toISOString().split("T")[0];
  expenseTimeInput.setAttribute("max", today);

  expenses.push(expenseObj);
  localStorage.setItem("expenseDB", JSON.stringify(expenses));

  renderCards();
  renderexpenseCard();
  renderIncomeCards();

  expenseNameInput.value = "";
  expenseAmountInput.value = "";
  exCategoryInput.value = "";
  expenseTimeInput.value = "";
  expenseTypeRadio.forEach((radio) => (radio.checked = false));
});

IncomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const incomeAmount = incomeAmountInput.value.trim();
  const incomeNote = incomeNoteInput.value.trim();
  let now = new Date();

  for (const radio of incomeTypeRadio) {
    if (radio.checked) {
      incomeType = radio.value;
      break;
    }
  }
  if (!incomeAmount || !incomeType) {
    showError("please enter the values");
  }

  if (!incomeAmount) {
    showError("Please Enter the Value");
    return;
  }
  if (!incomeType) {
    showError("please any of the income type");
    return;
  }
  let incomeObj = {
    inAmount: incomeAmount,
    inNote: incomeNote,
    inType: incomeType,
  };
  expenses.push(incomeObj);
  localStorage.setItem("expenseDB", JSON.stringify(expenses));
  renderIncomeCards();
});

function renderCards() {
  const cardContainer = document.querySelector(".expensesCards");
  cardContainer.innerHTML = "";

  expenses.forEach((cardyy) => {
    let expenseItem = document.createElement("div");
    expenseItem.className = "card";
    expenseItem.innerHTML = `
            <div  class="CardContent">
                <div class="cardHead">
                    <div data-unique-id ="${cardyy.id}" class="title_name">${
      cardyy.exName
    }</div>
                    <div class="cardDelete"><button data-unique-id ="${
                      cardyy.id
                    }" style="border:none;background-color:#fff" class="exDelete_card"><i class="fa-solid fa-xmark"></i></button></div>
                </div>
                <div data-unique-id ="${cardyy.id}" class="expense_money">₹${
      cardyy.exAmount
    }</div>
                <div data-unique-id ="${cardyy.id}" class="category_time">
                    <div data-unique-id ="${cardyy.id}" class="cardCategory">${
      cardyy.exCategory
    }</div>
                    <div data-unique-id ="${cardyy.id}"
                    }" class="expense_Time">${new Date(
                      cardyy.exTime
                    ).toLocaleString()}</div>
                </div>
                <div class="amountType"></div>
            </div>`;
    cardContainer.appendChild(expenseItem);

    expenseItem.querySelector(".title_name").addEventListener("click", () => {
      editField(cardyy, "exName");
    });

    expenseItem
      .querySelector(".expense_money")
      .addEventListener("click", () => {
        editField(cardyy, "exAmount");
      });
    expenseItem
      .querySelector(".exDelete_card")
      .addEventListener("click", () => {
        expenses = expenses.filter((expense) => expense.id !== cardyy.id);
        localStorage.setItem("expenseDB", JSON.stringify(expenses));
        renderCards();
        renderexpenseCard();
        renderIncomeCards();
      });
  });
}

function renderexpenseCard() {
  let expenseTotal = 0;
  let businessTotal = 0;
  let socialTotal = 0;
  let personalTotal = 0;

  expenses.forEach((e) => {
    if (e.exAmount != null) {
      expenseTotal += parseFloat(e.exAmount);

      if (e.exType === "business") {
        businessTotal += parseFloat(e.exAmount);
      } else if (e.exType === "social") {
        socialTotal += parseFloat(e.exAmount);
      } else if (e.exType === "personal") {
        personalTotal += parseFloat(e.exAmount);
      }
    }
  });

  exTotalCount.innerText = `₹${expenseTotal.toFixed(2)}`;
  BusinessCount.innerText = `₹${businessTotal.toFixed(2)}`;
  socialCount.innerText = `₹${socialTotal.toFixed(2)}`;
  personalCount.innerText = `₹${personalTotal.toFixed(2)}`;
}
function renderIncomeCards() {
  balance = 0;
  incomeTotal = 0;
  salaryTotal = 0;
  financeTotal = 0;
  outSourceTotal = 0;
  totalExpense = 0;

  expenses.forEach((e) => {
    if (e.inAmount != null) {
      incomeTotal = incomeTotal + parseFloat(e.inAmount);
      if (e.inType === "Salary") {
        salaryTotal = salaryTotal + parseFloat(e.inAmount);
      }
      if (e.inType === "Finance") {
        financeTotal = financeTotal + parseFloat(e.inAmount);
      }
      if (e.inType === "Outsource") {
        outSourceTotal = outSourceTotal + parseFloat(e.inAmount);
      }
    }
    if (e.exAmount != null) {
      totalExpense = totalExpense + parseFloat(e.exAmount);
    }

    balance = incomeTotal - totalExpense;
    expenses.incomeTotal = incomeTotal;
  });
  inTotalCount.innerText = `₹${balance.toFixed(2)}`;
  salaryCount.innerText = `₹${salaryTotal.toFixed(2)}`;
  financeCount.innerText = `₹${financeTotal.toFixed(2)}`;
  outSourceCount.innerText = `₹${outSourceTotal.toFixed(2)}`;
}

function editField(expense, field) {
  innerContext =
    field === "exTime"
      ? new Date(expense[field]).toISOString().slice(0, 16)
      : expense[field];
  console.log(innerContext);
  const input = document.createElement("input");
  input.type =
    field === "exTime"
      ? "datetime-local"
      : field === "exAmount"
      ? "number"
      : "text";
  input.value = innerContext;
  input.style.border = "none";
  input.style.outline = "none";
  input.style.width = "50%";
  input.style.backgroundColor = "#f8f8f8";

  let cardElement;
  if (field === "exName") {
    cardElement = document.querySelector(
      `.title_name[data-unique-id ="${expense.id}"]`
    );

    input.setAttribute("maxlength", "10");
    input.style.fontSize = "1.6rem";
  } else if (field === "exAmount") {
    cardElement = document.querySelector(
      `.expense_money[data-unique-id ="${expense.id}"]`
    );
  } else if (field === "exTime") {
    cardElement = document.querySelector(
      `.expense_Time[data-unique-id ="${expense.id}"]`
    );
  }

  expenseAmountInput.addEventListener("input", () => {
    if (this.value.length > 6) {
      this.value = this.value.slice(0, 6);
    }
  });

  if (cardElement) {
    cardElement.innerHTML = "";
    cardElement.appendChild(input);
    input.focus();

    input.addEventListener("blur", () => {
      saveEdit(expense, field, input.value);
    });
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        saveEdit(expense, field, input.value);
      }
    });
  }
}

function saveEdit(expense, field, newValue) {
  const currentPosition = expenses.findIndex((e) => e.id === expense.id);
  if (currentPosition === -1) {
    return;
  }
  if (field === "exTime") {
    const newDate = new Date(newValue);
    expenses[currentPosition][field] = newDate.toISOString();
  } else {
    expenses[currentPosition][field] = newValue;
  }
  localStorage.setItem("expenseDB", JSON.stringify(expenses));
  renderCards();
  renderIncomeCards();
  renderIncomeCards();
}

document.getElementById("okay").addEventListener("click", () => {
  popUp.style.display = "none";
});

function showError(message) {
  popUp.style.display = "block";
  document.getElementById("errorContent").innerHTML = message;
}
function calculateTotals() {
  let totalIncome = 0;
  let totalExpense = 0;

  expenses.forEach((expense) => {
    if (expense.inAmount) {
      totalIncome += parseFloat(expense.inAmount);
    }
    if (expense.exAmount) {
      totalExpense += parseFloat(expense.exAmount);
    }
  });

  return { totalIncome, totalExpense };
}

function renderChart() {
  const { totalIncome, totalExpense } = calculateTotals();

  const ctx = document.getElementById("incomeExpenseChart").getContext("2d");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Total Income", "Total Expense"],
      datasets: [
        {
          label: "Amount (₹)",
          data: [totalIncome, totalExpense],
          backgroundColor: ["rgba(138,255,80,1)", "rgb(0,204,255)"],
          borderColor: ["rgba(138,255,80,1)", "rgb(0,204,255)"],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", renderChart);
