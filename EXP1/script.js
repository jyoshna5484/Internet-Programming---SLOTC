/* Hearthside Library: a small client-side library system for classroom demos. */
const STORAGE_KEYS = {
  users: "hearthside-users",
  books: "hearthside-books",
  loans: "hearthside-loans",
  materials: "hearthside-materials",
  fines: "hearthside-fines",
  messages: "hearthside-messages",
  currentUser: "hearthside-current-user"
};
const DAILY_FINE = 5;
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const SEMESTERS = ["Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5", "Semester 6", "Semester 7", "Semester 8"];

function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function dateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function readStore(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (value === null) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(value);
    return Array.isArray(fallback) && !Array.isArray(parsed) ? fallback : parsed;
  } catch (error) {
    console.warn(`Could not read ${key} from localStorage.`, error);
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Could not save ${key} to localStorage.`, error);
    return false;
  }
}

const today = new Date();
const sampleIssueDate = dateKey(addDays(today, -24));
const sampleDueDate = dateKey(addDays(today, -10));
const state = {
  users: readStore(STORAGE_KEYS.users, [
    { id: "student-demo", name: "C. C. Jyoshna", email: "student@library.local", password: "student123", department: "Computer Science", year: "3rd Year", role: "student" },
    { id: "librarian-demo", name: "Library Admin", email: "admin@library.local", password: "admin123", department: "Library Services", year: "Staff", role: "admin" }
  ]),
  books: readStore(STORAGE_KEYS.books, [
    { id: "book-dbms", title: "Database System Concepts", author: "Abraham Silberschatz", subject: "Database systems", copies: 5, description: "A clear foundation in database architecture, relational models, SQL, transactions, and the systems that support modern data." },
    { id: "book-python", title: "Python Programming", author: "John Zelle", subject: "Programming", copies: 4, description: "A practical introduction to computational thinking, Python fundamentals, data structures, and building useful programs." },
    { id: "book-networks", title: "Computer Networks", author: "Andrew S. Tanenbaum", subject: "Computer networks", copies: 3, description: "Explore network architectures, protocols, routing, wireless systems, and the principles behind connected computing." },
    { id: "book-algorithms", title: "Introduction to Algorithms", author: "Thomas H. Cormen", subject: "Algorithms", copies: 2, description: "An in-depth study of algorithm design and analysis, from sorting and graphs to dynamic programming and optimization." },
    { id: "book-design", title: "The Design of Everyday Things", author: "Don Norman", subject: "Design", copies: 3, description: "A thoughtful guide to human-centered design, affordances, feedback, and making everyday objects easier to understand." },
    { id: "book-web", title: "Learning Web Design", author: "Jennifer Niederst Robbins", subject: "Web development", copies: 4, description: "Build a strong foundation in HTML, CSS, responsive layouts, and the practical craft of creating for the web." }
  ]),
  loans: readStore(STORAGE_KEYS.loans, [
    { id: "loan-demo", userId: "student-demo", bookId: "book-dbms", bookTitle: "Database System Concepts", issueDate: sampleIssueDate, dueDate: sampleDueDate, returnedOn: "" }
  ]),
  materials: readStore(STORAGE_KEYS.materials, [
    { id: "material-dbms", title: "Database Systems — Revision Notes", year: "3rd Year", semester: "Semester 5", description: "Relational algebra, normalization, SQL joins, indexing, and transaction fundamentals." },
    { id: "material-python", title: "Python Programming — Practice Sheet", year: "1st Year", semester: "Semester 2", description: "Short exercises covering functions, collections, file handling, and introductory object-oriented programming." },
    { id: "material-networks", title: "Computer Networks — Quick Review", year: "3rd Year", semester: "Semester 6", description: "OSI and TCP/IP models, addressing, routing basics, transport protocols, and network security." },
    { id: "material-algorithms", title: "Algorithms — Problem Set", year: "2nd Year", semester: "Semester 4", description: "Practice problems on complexity, searching, sorting, trees, graphs, and greedy strategies." }
  ]),
  fines: readStore(STORAGE_KEYS.fines, []),
  messages: readStore(STORAGE_KEYS.messages, []),
  currentUserId: readStore(STORAGE_KEYS.currentUser, null)
};

function saveState(key) {
  const values = {
    users: state.users,
    books: state.books,
    loans: state.loans,
    materials: state.materials,
    fines: state.fines,
    messages: state.messages,
    currentUser: state.currentUserId
  };
  return writeStore(STORAGE_KEYS[key], values[key]);
}

function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character]);
}

function getCurrentUser() {
  return state.users.find((user) => user.id === state.currentUserId) || null;
}

function setMessage(element, message, isError = false) {
  if (!element) return;
  element.textContent = message;
  element.classList.toggle("error", isError);
}

function activeLoans(bookId) {
  return state.loans.filter((loan) => loan.bookId === bookId && !loan.returnedOn).length;
}

function availableCopies(book) {
  return Math.max(0, Number(book.copies) - activeLoans(book.id));
}

// Calculates an overdue charge from calendar days, stopping on the return date.
function overdueFine(loan) {
  if (!loan.dueDate) return 0;
  const endDate = loan.returnedOn || dateKey(new Date());
  const due = new Date(`${loan.dueDate}T00:00:00Z`);
  const end = new Date(`${endDate}T00:00:00Z`);
  const daysLate = Math.max(0, Math.floor((end - due) / 86400000));
  return daysLate * DAILY_FINE;
}

function manualFineTotal(userId) {
  return state.fines.filter((fine) => fine.userId === userId && !fine.paid).reduce((total, fine) => total + Number(fine.amount), 0);
}

function bookCoverClass(book) {
  let sum = 0;
  for (const character of book.id) sum += character.charCodeAt(0);
  return `cover-${(sum % 6) + 1}`;
}

function renderShell() {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");
  const user = getCurrentUser();
  const page = document.body.dataset.page;
  const navItems = [
    ["index.html", "Home", "home"], ["books.html", "Books", "books"],
    ["materials.html", "Materials", "materials"], ["borrow-history.html", "My loans", "history"],
    ["profile.html", "Profile", "profile"], ["contact.html", "Contact", "contact"], ["admin.html", "Librarian", "admin"]
  ];
  if (header) {
    const nav = navItems.map(([href, label, key]) => {
      const active = page === key || (page === "book-details" && key === "books");
      return `<a href="${href}"${active ? ' aria-current="page"' : ""}>${label}</a>`;
    }).join("");
    header.className = "site-header";
    header.innerHTML = `<div class="shell nav-wrap">
      <a class="brand" href="index.html" aria-label="Hearthside Library home"><span class="brand-mark" aria-hidden="true">h.</span><span class="brand-name">Hearthside</span></a>
      <button class="nav-toggle" type="button" aria-label="Open navigation" aria-expanded="false">☰</button>
      <nav class="site-nav" aria-label="Main navigation">${nav}</nav>
      <div class="nav-account">${user ? `<a class="account-link" href="profile.html">${escapeHTML(user.name.split(" ")[0])}</a><button class="button button-outline button-small" type="button" data-action="logout">Sign out</button>` : `<a class="button button-dark button-small" href="login.html">Sign in</a>`}</div>
    </div>`;
  }
  if (footer) {
    footer.innerHTML = `<div class="shell footer-inner"><span class="footer-brand">Hearthside Library</span><p>Room to read. Space to grow.</p><div class="footer-links"><a href="books.html">Books</a><a href="materials.html">Study materials</a><a href="contact.html">Contact</a></div></div>`;
  }
}

function createBookCard(book) {
  const available = availableCopies(book);
  return `<article class="book-card">
    <div class="book-cover ${bookCoverClass(book)}" aria-hidden="true"><span>${escapeHTML(book.title)}</span></div>
    <p class="book-subject">${escapeHTML(book.subject)}</p>
    <h3>${escapeHTML(book.title)}</h3><p class="book-author">${escapeHTML(book.author)}</p>
    <p class="availability${available ? "" : " unavailable"}">${available ? `${available} available` : "Currently on loan"}</p>
    <a class="button button-outline button-small" href="book-details.html?id=${encodeURIComponent(book.id)}">View details <span aria-hidden="true">→</span></a>
  </article>`;
}

function renderFeaturedBooks() {
  const container = document.getElementById("featured-books");
  if (container) container.innerHTML = state.books.slice(0, 4).map(createBookCard).join("");
}

function renderBooks(searchTerm = "") {
  const grid = document.getElementById("book-grid");
  if (!grid) return;
  const query = searchTerm.trim().toLowerCase();
  const matches = state.books.filter((book) => `${book.title} ${book.author} ${book.subject}`.toLowerCase().includes(query));
  grid.innerHTML = matches.map(createBookCard).join("");
  const count = document.getElementById("book-count");
  const empty = document.getElementById("book-empty");
  if (count) count.textContent = `${matches.length} ${matches.length === 1 ? "book" : "books"}`;
  if (empty) empty.hidden = matches.length > 0;
}

function renderBookDetails() {
  const container = document.getElementById("book-detail");
  if (!container) return;
  const id = new URLSearchParams(window.location.search).get("id");
  const book = state.books.find((item) => item.id === id);
  if (!book) {
    container.innerHTML = `<div class="empty-state"><p>We could not find that book in the collection.</p><a class="button button-dark" href="books.html">Browse books</a></div>`;
    return;
  }
  const available = availableCopies(book);
  const user = getCurrentUser();
  container.innerHTML = `<article class="detail-layout">
    <div class="book-cover ${bookCoverClass(book)}" aria-hidden="true"><span>${escapeHTML(book.title)}</span></div>
    <div><p class="eyebrow">${escapeHTML(book.subject)}</p><h1>${escapeHTML(book.title)}</h1><p class="detail-author">by ${escapeHTML(book.author)}</p>
      <p class="detail-description">${escapeHTML(book.description)}</p>
      <div class="detail-facts"><div><span>Availability</span><strong>${available} of ${Number(book.copies)} copies</strong></div><div><span>Loan period</span><strong>14 days</strong></div></div>
      ${available ? (user && user.role === "student" ? `<button id="borrow-book" class="button button-dark" type="button" data-book-id="${escapeHTML(book.id)}">Borrow this book <span aria-hidden="true">→</span></button>` : `<a class="button button-dark" href="login.html">Sign in to borrow <span aria-hidden="true">→</span></a>`) : `<button class="button button-outline" type="button" disabled>Currently unavailable</button>`}
      <p id="detail-message" class="form-message" role="status" aria-live="polite"></p>
    </div>
  </article>`;
}

// Shows only the signed-in student's records and updates overdue charges each time the page opens.
function renderHistory() {
  const user = getCurrentUser();
  const body = document.getElementById("history-body");
  if (!body) return;
  const empty = document.getElementById("history-empty");
  if (!user || user.role !== "student") {
    body.innerHTML = "";
    empty.hidden = false;
    empty.innerHTML = `Sign in with a student account to see your loans. <a href="login.html">Sign in</a>`;
    document.getElementById("active-loans").textContent = "—";
    document.getElementById("fine-total").textContent = "—";
    return;
  }
  const loans = state.loans.filter((loan) => loan.userId === user.id).sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  body.innerHTML = loans.map((loan) => {
    const fine = overdueFine(loan);
    const status = loan.returnedOn ? "Returned" : fine ? "Overdue" : "Issued";
    const pillClass = loan.returnedOn ? "returned" : fine ? "overdue" : "";
    return `<tr><td>${escapeHTML(loan.bookTitle || getBookTitle(loan.bookId))}</td><td>${formatDate(loan.issueDate)}</td><td>${formatDate(loan.dueDate)}</td><td><span class="status-pill ${pillClass}">${status}</span></td><td>₹${fine}</td><td>${loan.returnedOn ? "—" : `<button class="button button-outline button-small" type="button" data-action="student-return" data-loan-id="${escapeHTML(loan.id)}">Return</button>`}</td></tr>`;
  }).join("");
  empty.hidden = loans.length > 0;
  document.getElementById("active-loans").textContent = String(loans.filter((loan) => !loan.returnedOn).length);
  const total = loans.reduce((sum, loan) => sum + overdueFine(loan), 0) + manualFineTotal(user.id);
  document.getElementById("fine-total").textContent = `₹${total}`;
}

function getBookTitle(bookId) {
  return state.books.find((book) => book.id === bookId)?.title || "Removed book";
}

function renderMaterials() {
  const list = document.getElementById("material-list");
  if (!list) return;
  const year = document.getElementById("material-year").value;
  const semester = document.getElementById("material-semester").value;
  const materials = state.materials.filter((material) => (!year || material.year === year) && (!semester || material.semester === semester));
  list.innerHTML = materials.map((material) => `<article class="material-card">
    <span class="material-icon" aria-hidden="true">TXT</span><div><h2>${escapeHTML(material.title)}</h2><p>${escapeHTML(material.year)} · ${escapeHTML(material.semester)}</p><p>${escapeHTML(material.description)}</p></div>
    <button class="button button-outline button-small" type="button" data-action="download-material" data-material-id="${escapeHTML(material.id)}">Download ↓</button>
  </article>`).join("");
  document.getElementById("material-count").textContent = `${materials.length} ${materials.length === 1 ? "resource" : "resources"}`;
  document.getElementById("material-empty").hidden = materials.length > 0;
}

function renderProfile() {
  const container = document.getElementById("profile-content");
  if (!container) return;
  const user = getCurrentUser();
  if (!user || user.role !== "student") {
    container.innerHTML = `<div class="empty-state">Sign in with your student account to view your profile. <a href="login.html">Sign in</a></div>`;
    return;
  }
  const initials = user.name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  container.innerHTML = `<section class="profile-card"><div class="profile-top"><span class="profile-avatar" aria-hidden="true">${escapeHTML(initials)}</span><div><h2>${escapeHTML(user.name)}</h2><p>Student member</p></div></div>
    <div class="profile-details"><div><span>Email address</span><strong>${escapeHTML(user.email)}</strong></div><div><span>Department</span><strong>${escapeHTML(user.department)}</strong></div><div><span>Year of study</span><strong>${escapeHTML(user.year)}</strong></div><div><span>Member since</span><strong>${formatDate(user.createdAt || dateKey(new Date()))}</strong></div></div></section>`;
}

function currentAdmin() {
  const user = getCurrentUser();
  return user && user.role === "admin";
}

function renderAdmin() {
  const gate = document.getElementById("admin-gate");
  const workspace = document.getElementById("admin-workspace");
  if (!gate || !workspace) return;
  gate.hidden = currentAdmin();
  workspace.hidden = !currentAdmin();
  if (currentAdmin()) {
    renderAdminBooks();
    renderIssueOptions();
    renderAdminLoans();
    renderAdminMaterials();
  }
}

function renderAdminBooks() {
  const body = document.getElementById("admin-books-body");
  if (!body) return;
  body.innerHTML = state.books.map((book) => `<tr><td>${escapeHTML(book.title)}</td><td>${escapeHTML(book.author)}</td><td>${availableCopies(book)} / ${Number(book.copies)}</td><td><div class="button-row"><button class="button button-outline button-small" type="button" data-action="edit-book" data-book-id="${escapeHTML(book.id)}">Edit</button><button class="button button-danger button-small" type="button" data-action="delete-book" data-book-id="${escapeHTML(book.id)}">Delete</button></div></td></tr>`).join("");
}

function renderIssueOptions() {
  const select = document.getElementById("issue-book");
  if (!select) return;
  const available = state.books.filter((book) => availableCopies(book) > 0);
  select.innerHTML = available.length ? available.map((book) => `<option value="${escapeHTML(book.id)}">${escapeHTML(book.title)} (${availableCopies(book)} available)</option>`).join("") : `<option value="">No books available</option>`;
  select.disabled = available.length === 0;
}

function renderAdminLoans() {
  const body = document.getElementById("admin-loans-body");
  if (!body) return;
  body.innerHTML = state.loans.map((loan) => {
    const user = state.users.find((item) => item.id === loan.userId);
    return `<tr><td>${escapeHTML(user?.email || "Unknown student")}</td><td>${escapeHTML(loan.bookTitle || getBookTitle(loan.bookId))}</td><td>${formatDate(loan.dueDate)}</td><td><span class="status-pill ${loan.returnedOn ? "returned" : overdueFine(loan) ? "overdue" : ""}">${loan.returnedOn ? "Returned" : overdueFine(loan) ? "Overdue" : "Issued"}</span></td><td>${loan.returnedOn ? "—" : `<button class="button button-outline button-small" type="button" data-action="admin-return" data-loan-id="${escapeHTML(loan.id)}">Mark returned</button>`}</td></tr>`;
  }).join("");
}

function renderAdminMaterials() {
  const container = document.getElementById("admin-materials");
  if (!container) return;
  container.innerHTML = state.materials.map((material) => `<div class="admin-material-row"><div><strong>${escapeHTML(material.title)}</strong><br><span>${escapeHTML(material.year)} · ${escapeHTML(material.semester)}</span></div><button class="button button-danger button-small" type="button" data-action="delete-material" data-material-id="${escapeHTML(material.id)}" aria-label="Delete ${escapeHTML(material.title)}">Delete</button></div>`).join("");
}

function updateBookAvailability() {
  renderAdminBooks();
  renderIssueOptions();
  renderFeaturedBooks();
  if (document.getElementById("book-grid")) renderBooks(document.getElementById("book-search").value);
  if (document.getElementById("book-detail")) renderBookDetails();
}

// Creates a downloadable text handout from the material stored in the browser.
function downloadMaterial(materialId) {
  const material = state.materials.find((item) => item.id === materialId);
  if (!material) return;
  const content = `${material.title}\n${material.year} · ${material.semester}\n\n${material.description}\n\nHearthside Library study material`;
  const file = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${material.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "")}.txt`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function setCurrentUser(userId) {
  state.currentUserId = userId;
  saveState("currentUser");
}

function logout() {
  setCurrentUser(null);
  window.location.href = "index.html";
}

function handleLogin(event, formId, messageId, adminOnly = false) {
  event.preventDefault();
  const form = document.getElementById(formId);
  const email = form.querySelector('input[type="email"]').value.trim().toLowerCase();
  const password = form.querySelector('input[type="password"]').value;
  const user = state.users.find((item) => item.email.toLowerCase() === email && item.password === password && (!adminOnly || item.role === "admin"));
  const message = document.getElementById(messageId);
  if (!user) {
    setMessage(message, adminOnly ? "Those librarian details are not correct." : "Email or password was not recognised.", true);
    return;
  }
  setCurrentUser(user.id);
  if (adminOnly) {
    setMessage(message, "Signed in. Opening the staff desk…");
    renderShell();
    renderAdmin();
  } else {
    window.location.href = "profile.html";
  }
}

function handleRegistration(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const values = new FormData(form);
  const email = String(values.get("email")).trim().toLowerCase();
  const message = document.getElementById("register-message");
  if (values.get("password") !== values.get("confirm")) {
    setMessage(message, "The passwords do not match.", true);
    return;
  }
  if (state.users.some((user) => user.email.toLowerCase() === email)) {
    setMessage(message, "An account with this email already exists.", true);
    return;
  }
  state.users.push({
    id: makeId("student"), name: String(values.get("name")).trim(), email,
    password: String(values.get("password")), department: String(values.get("department")).trim(),
    year: String(values.get("year")), role: "student", createdAt: dateKey(new Date())
  });
  saveState("users");
  form.reset();
  setMessage(message, "Account created. You can now sign in.");
}

function issueBook(user, book) {
  const issueDate = dateKey(new Date());
  state.loans.push({ id: makeId("loan"), userId: user.id, bookId: book.id, bookTitle: book.title, issueDate, dueDate: dateKey(addDays(new Date(), 14)), returnedOn: "" });
  saveState("loans");
}

function returnLoan(loanId) {
  const loan = state.loans.find((item) => item.id === loanId && !item.returnedOn);
  if (!loan) return false;
  loan.returnedOn = dateKey(new Date());
  saveState("loans");
  return true;
}

function editBook(bookId) {
  const book = state.books.find((item) => item.id === bookId);
  if (!book) return;
  document.getElementById("admin-book-id").value = book.id;
  document.getElementById("admin-book-title").value = book.title;
  document.getElementById("admin-book-author").value = book.author;
  document.getElementById("admin-book-subject").value = book.subject;
  document.getElementById("admin-book-copies").value = book.copies;
  document.getElementById("book-form-title").textContent = "Update a book";
  document.getElementById("book-save-button").textContent = "Save changes";
  document.getElementById("book-cancel-button").hidden = false;
  document.getElementById("admin-book-title").focus();
}

function resetBookForm() {
  document.getElementById("admin-book-form").reset();
  document.getElementById("admin-book-id").value = "";
  document.getElementById("book-form-title").textContent = "Add a book";
  document.getElementById("book-save-button").textContent = "Add book";
  document.getElementById("book-cancel-button").hidden = true;
}

function saveBook(event) {
  event.preventDefault();
  if (!currentAdmin()) return;
  const id = document.getElementById("admin-book-id").value;
  const copies = Number(document.getElementById("admin-book-copies").value);
  const activeCount = id ? activeLoans(id) : 0;
  const message = document.getElementById("admin-book-message");
  if (copies < 1 || copies < activeCount) {
    setMessage(message, `Total copies must be at least ${Math.max(1, activeCount)}.`, true);
    return;
  }
  const details = {
    title: document.getElementById("admin-book-title").value.trim(),
    author: document.getElementById("admin-book-author").value.trim(),
    subject: document.getElementById("admin-book-subject").value.trim(),
    copies
  };
  if (id) {
    const book = state.books.find((item) => item.id === id);
    if (!book) return;
    Object.assign(book, details);
    setMessage(message, "Book details updated.");
  } else {
    state.books.push({ id: makeId("book"), ...details, description: "A library book available for student borrowing." });
    setMessage(message, "Book added to the collection.");
  }
  saveState("books");
  resetBookForm();
  updateBookAvailability();
}

function handleGlobalClick(event) {
  const toggle = event.target.closest(".nav-toggle");
  if (toggle) {
    const nav = document.querySelector(".site-nav");
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    return;
  }
  const button = event.target.closest("[data-action], #borrow-book, #admin-logout, #book-cancel-button");
  if (!button) return;
  const action = button.dataset.action;
  if (action === "logout" || button.id === "admin-logout") {
    logout();
  } else if (button.id === "book-cancel-button") {
    resetBookForm();
    setMessage(document.getElementById("admin-book-message"), "");
  } else if (button.id === "borrow-book") {
    const user = getCurrentUser();
    const book = state.books.find((item) => item.id === button.dataset.bookId);
    const message = document.getElementById("detail-message");
    if (!user || user.role !== "student") {
      setMessage(message, "Sign in with a student account before borrowing.", true);
    } else if (!book || availableCopies(book) < 1) {
      setMessage(message, "This book is no longer available to borrow.", true);
    } else {
      issueBook(user, book);
      renderBookDetails();
      renderHistory();
      setMessage(document.getElementById("detail-message"), "Book issued. Your due date is in 14 days.");
    }
  } else if (action === "student-return") {
    if (returnLoan(button.dataset.loanId)) {
      renderHistory();
      updateBookAvailability();
      setMessage(document.getElementById("history-message"), "Book returned. Your fine has been updated.");
    }
  } else if (action === "admin-return") {
    if (currentAdmin() && returnLoan(button.dataset.loanId)) {
      renderAdminLoans();
      updateBookAvailability();
      setMessage(document.getElementById("issue-message"), "Book marked as returned.");
    }
  } else if (action === "edit-book" && currentAdmin()) {
    editBook(button.dataset.bookId);
  } else if (action === "delete-book" && currentAdmin()) {
    const book = state.books.find((item) => item.id === button.dataset.bookId);
    if (!book) return;
    if (activeLoans(book.id)) {
      setMessage(document.getElementById("admin-book-message"), "Return this book's active loans before deleting it.", true);
    } else if (window.confirm(`Delete “${book.title}” from the catalogue?`)) {
      state.books = state.books.filter((item) => item.id !== book.id);
      saveState("books");
      updateBookAvailability();
      setMessage(document.getElementById("admin-book-message"), "Book deleted from the collection.");
    }
  } else if (action === "download-material") {
    downloadMaterial(button.dataset.materialId);
  } else if (action === "delete-material" && currentAdmin()) {
    state.materials = state.materials.filter((item) => item.id !== button.dataset.materialId);
    saveState("materials");
    renderAdminMaterials();
    if (document.getElementById("material-list")) renderMaterials();
  }
}

function setupForms() {
  document.getElementById("login-form")?.addEventListener("submit", (event) => handleLogin(event, "login-form", "login-message"));
  document.getElementById("register-form")?.addEventListener("submit", handleRegistration);
  document.getElementById("admin-login-form")?.addEventListener("submit", (event) => handleLogin(event, "admin-login-form", "admin-login-message", true));
  document.getElementById("admin-book-form")?.addEventListener("submit", saveBook);
  document.getElementById("book-cancel-button")?.addEventListener("click", () => {
    resetBookForm();
    setMessage(document.getElementById("admin-book-message"), "");
  });
  document.getElementById("issue-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("issue-student").value.trim().toLowerCase();
    const user = state.users.find((item) => item.email.toLowerCase() === email && item.role === "student");
    const book = state.books.find((item) => item.id === document.getElementById("issue-book").value);
    const message = document.getElementById("issue-message");
    if (!currentAdmin()) return;
    if (!user) return setMessage(message, "No student account matches that email.", true);
    if (!book || availableCopies(book) < 1) return setMessage(message, "Select a book that is currently available.", true);
    issueBook(user, book);
    event.currentTarget.reset();
    renderAdminLoans();
    updateBookAvailability();
    setMessage(message, `${book.title} issued to ${user.name}. Due ${formatDate(dateKey(addDays(new Date(), 14)))}.`);
  });
  document.getElementById("fine-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!currentAdmin()) return;
    const email = document.getElementById("fine-student").value.trim().toLowerCase();
    const user = state.users.find((item) => item.email.toLowerCase() === email && item.role === "student");
    const amount = Number(document.getElementById("fine-amount").value);
    const message = document.getElementById("fine-message");
    if (!user) return setMessage(message, "No student account matches that email.", true);
    state.fines.push({ id: makeId("fine"), userId: user.id, amount, reason: document.getElementById("fine-reason").value.trim(), paid: false, createdAt: dateKey(new Date()) });
    saveState("fines");
    event.currentTarget.reset();
    setMessage(message, `Fine of ₹${amount} recorded for ${user.name}.`);
  });
  document.getElementById("admin-material-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!currentAdmin()) return;
    state.materials.push({
      id: makeId("material"), title: document.getElementById("admin-material-title").value.trim(),
      year: document.getElementById("admin-material-year").value,
      semester: document.getElementById("admin-material-semester").value,
      description: document.getElementById("admin-material-description").value.trim()
    });
    saveState("materials");
    event.currentTarget.reset();
    renderAdminMaterials();
    setMessage(document.getElementById("admin-material-message"), "Study material published.");
  });
  document.getElementById("contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    state.messages.push({ id: makeId("message"), name: String(values.get("name")).trim(), email: String(values.get("email")).trim(), message: String(values.get("message")).trim(), sentAt: dateKey(new Date()) });
    saveState("messages");
    event.currentTarget.reset();
    setMessage(document.getElementById("contact-feedback"), "Thanks for getting in touch. Your message has been saved.");
  });
  document.getElementById("material-filter")?.addEventListener("submit", (event) => {
    event.preventDefault();
    renderMaterials();
  });
  document.getElementById("book-search")?.addEventListener("input", (event) => renderBooks(event.currentTarget.value));
}

function initializePage() {
  renderShell();
  setupForms();
  renderFeaturedBooks();
  const searchInput = document.getElementById("book-search");
  if (searchInput) {
    searchInput.value = new URLSearchParams(window.location.search).get("q") || "";
    renderBooks(searchInput.value);
  }
  renderBookDetails();
  renderHistory();
  renderMaterials();
  renderProfile();
  renderAdmin();
  document.addEventListener("click", handleGlobalClick);
}

document.addEventListener("DOMContentLoaded", initializePage);
