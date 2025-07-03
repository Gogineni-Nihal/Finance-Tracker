document.addEventListener("DOMContentLoaded", function () {
  const balanceEl = document.getElementById("balance");
  const incomeEl = document.getElementById("income");
  const expenseEl = document.getElementById("expense");
  const transactionList = document.getElementById("transactionList");
  const transactionForm = document.getElementById("transactionForm");
  const viewAll = document.getElementById("viewAll");
  const modal = document.getElementById("modal");
  const closeModal = document.getElementById("closeModal");
  const fullTransactionList = document.getElementById("fullTransactionList");

  const accountBtn = document.getElementById("accountBtn");
  const accountModal = document.getElementById("accountModal");
  const closeAccount = document.getElementById("closeAccount");

  // Format as Indian Rupee
  const formatINR = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);

  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

  // Add transaction
  transactionForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const desc = document.getElementById("desc").value.trim();
    const amount = parseFloat(document.getElementById("amount").value);
    const type = document.getElementById("type").value;

    if (!desc || isNaN(amount)) return;

    transactions.push({ desc, amount, type });
    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateDashboard();
    transactionForm.reset();
  });

  function updateDashboard() {
    transactionList.innerHTML = "";
    let income = 0,
      expense = 0;

    const recent = transactions.slice(-5);
    recent.forEach((t, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${t.desc} (${t.type})</span>
        <span>
          ${formatINR(t.amount)}
          <button class="delete-btn" data-index="${transactions.length - 5 + index}">🗑️</button>
        </span>
      `;
      transactionList.appendChild(li);
    });

    // Totals
    transactions.forEach((t) => {
      if (t.type === "income") income += t.amount;
      else expense += t.amount;
    });

    balanceEl.textContent = formatINR(income - expense);
    incomeEl.textContent = formatINR(income);
    expenseEl.textContent = formatINR(expense);

    // Attach delete to recent list
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        transactions.splice(index, 1);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        updateDashboard();
      });
    });
  }

  // Full transaction modal
  viewAll.addEventListener("click", () => {
    fullTransactionList.innerHTML = "";
    transactions.forEach((t, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${t.desc} (${t.type})</span>
        <span>
          ${formatINR(t.amount)}
          <button class="delete-btn" data-index="${index}">🗑️</button>
        </span>
      `;
      fullTransactionList.appendChild(li);
    });

    // Delete for modal list
    document.querySelectorAll(".modal .delete-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.target.getAttribute("data-index");
        transactions.splice(index, 1);
        localStorage.setItem("transactions", JSON.stringify(transactions));
        modal.style.display = "none";
        updateDashboard();
      });
    });

    modal.style.display = "flex";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  // My Account modal
  accountBtn.addEventListener("click", () => {
    document.getElementById("accName").textContent =
      localStorage.getItem("financeName") || "N/A";
    document.getElementById("accEmail").textContent =
      localStorage.getItem("financeEmail") || "N/A";
    document.getElementById("accUsername").textContent =
      localStorage.getItem("financeUser") || "N/A";
    accountModal.style.display = "flex";
  });

  closeAccount.addEventListener("click", () => {
    accountModal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
    if (e.target === accountModal) accountModal.style.display = "none";
  });

  // Load data
  updateDashboard();
});
