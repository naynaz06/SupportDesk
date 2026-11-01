
// ===================================
// 1. SELECTING HTML ELEMENTS
// ===================================
let editingRow = null;
const addTicketBtn = document.getElementById("addTicketBtn");
const ticketModal = document.getElementById("ticketModal");
const closeModal = document.getElementById("closeModal");
const toast = document.getElementById("toast");

const ticketForm = document.getElementById("ticketForm");

const ticketsTableBody = document.querySelector(
    ".tickets-table tbody"
);
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");
menuBtn.addEventListener("click", function() {
    sidebar.classList.toggle("show");
});
const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        sidebar.classList.remove("show");
    });
});


// ===================================
// 2. OPEN MODAL
// ===================================

addTicketBtn.addEventListener("click", function() {
    ticketModal.classList.add("show");
});


// ===================================
// 3. CLOSE MODAL
// ===================================

closeModal.addEventListener("click", function() {
    ticketModal.classList.remove("show");
});

ticketModal.addEventListener("click", function(event) {

    if (event.target === ticketModal) {
        ticketModal.classList.remove("show");
    }

});


// ===================================
// 4. TICKET ID GENERATOR
// ===================================

let ticketCount = 104;
// ===================================
// 5. LOCAL STORAGE FUNCTIONS
// ===================================

function saveTickets() {
    localStorage.setItem(
        "supportDeskTickets",
        ticketsTableBody.innerHTML
    );

    localStorage.setItem(
        "supportDeskTicketCount",
        ticketCount
    );
}

function loadTickets() {
    const savedTickets = localStorage.getItem("supportDeskTickets");

    if (savedTickets !== null) {
        ticketsTableBody.innerHTML = savedTickets;
    }

    const savedCount = localStorage.getItem("supportDeskTicketCount");

    if (savedCount !== null) {
        ticketCount = Number(savedCount);
    }
}

loadTickets();


// ===================================
// 5. FORM SUBMISSION
// ===================================

ticketForm.addEventListener("submit", function(event) {

    event.preventDefault();
    if (editingRow !== null) {

    const customerName = document.getElementById("customerName").value;
    const ticketSubject = document.getElementById("ticketSubject").value;
    const ticketPriority = document.getElementById("ticketPriority").value;
    const ticketDescription = document.getElementById("ticketDescription").value;

    const cells = editingRow.querySelectorAll("td");

    cells[1].textContent = customerName;
    cells[2].textContent = ticketSubject;
    editingRow.dataset.description = ticketDescription;

    const priorityBadge = cells[3].querySelector(".priority");

    priorityBadge.textContent = ticketPriority;
    priorityBadge.className = "priority " + ticketPriority.toLowerCase();

    ticketForm.reset();
    ticketModal.classList.remove("show");

    editingRow = null;

    document.getElementById("modalTitle").textContent = "Create New Ticket";
    document.getElementById("submitBtn").textContent = "Create Ticket";

    updateDashboardStats();
        saveTickets();
        showToast("Ticket updated successfully!");
    return;
}

    // Get form values

    const customerName = document.getElementById("customerName").value;

    const ticketSubject = document.getElementById("ticketSubject").value;

    const ticketPriority = document.getElementById("ticketPriority").value;
    const ticketDescription = document.getElementById("ticketDescription").value;


    // Generate ticket ID

    ticketCount++;

    const ticketId = "#TK" + ticketCount;


    // Create table row

    const newRow = document.createElement("tr");


    // Create table cells

    const idCell = document.createElement("td");
    idCell.textContent = ticketId;

    const customerCell = document.createElement("td");
    customerCell.textContent = customerName;

    const subjectCell = document.createElement("td");
    subjectCell.textContent = ticketSubject;


    // Create priority badge

    const priorityCell = document.createElement("td");

    const priorityBadge = document.createElement("span");

    priorityBadge.classList.add(
        "priority",
        ticketPriority.toLowerCase()
    );

    priorityBadge.textContent = ticketPriority;

    priorityCell.appendChild(priorityBadge);


    // Create status badge

    const statusCell = document.createElement("td");

const statusBadge = document.createElement("span");
statusBadge.classList.add("status", "open");
statusBadge.textContent = "Open";

statusCell.appendChild(statusBadge);

// Create status dropdown
const actionCell = document.createElement("td");

const statusDropdown = document.createElement("select");
statusDropdown.classList.add("status-select");

statusDropdown.innerHTML = `
    <option value="open" selected>Open</option>
    <option value="pending">Pending</option>
    <option value="resolved">Resolved</option>
`;

actionCell.appendChild(statusDropdown);
    // Create Edit button
    const editButton = document.createElement("button");

    editButton.classList.add("edit-btn");
    editButton.textContent = "Edit";

    actionCell.appendChild(editButton);
    // Create View Details button
    const viewButton = document.createElement("button");

    viewButton.classList.add("view-btn");
    viewButton.textContent = "View Details";

    actionCell.appendChild(viewButton);

    // Add cells to row
    // Create Delete button
    const deleteButton = document.createElement("button");

    deleteButton.classList.add("delete-btn");

    deleteButton.textContent = "Delete";

    actionCell.appendChild(deleteButton);

    newRow.appendChild(idCell);
    newRow.appendChild(customerCell);
    newRow.appendChild(subjectCell);
    newRow.appendChild(priorityCell);
    newRow.appendChild(statusCell);
    newRow.appendChild(actionCell);


    // Add new row to table
    newRow.dataset.description = ticketDescription;
    ticketsTableBody.appendChild(newRow);

    updateDashboardStats();
    saveTickets();
    showToast("Ticket created successfully!");


    // Reset form and close modal

    ticketForm.reset();

    ticketModal.classList.remove("show");

});


const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const noResultsMessage = document.getElementById("noResultsMessage");

function filterTickets() {
    
    const searchValue = searchInput.value.toLowerCase();
    const selectedStatus = statusFilter.value;

    const ticketRows = ticketsTableBody.querySelectorAll("tr");

    ticketRows.forEach(function(row) {
        const rowText = row.textContent.toLowerCase();

        const ticketStatus = row.querySelector(".status")
            .textContent.toLowerCase();

        const matchesSearch = rowText.includes(searchValue);

        const matchesStatus =
            selectedStatus === "all" ||
            ticketStatus === selectedStatus;

        if (matchesSearch && matchesStatus) {
            row.style.display = "";
        }
         else {
            row.style.display = "none";
        }
    });
    const visibleTickets = Array.from(ticketRows).filter(function(row) {
    return row.style.display !== "none";
    });

    if (visibleTickets.length === 0) {
        noResultsMessage.style.display = "block";
    } else {
    noResultsMessage.style.display = "none";
    }
}

searchInput.addEventListener("input", filterTickets);

statusFilter.addEventListener("change", filterTickets);

function updateDashboardStats() {
    const ticketRows = ticketsTableBody.querySelectorAll("tr");

    let total = ticketRows.length;
    let open = 0;
    let pending = 0;
    let resolved = 0;

    ticketRows.forEach(function(row) {
        const status = row.querySelector(".status")
            .textContent.toLowerCase();

        if (status === "open") {
            open++;
        } else if (status === "pending") {
            pending++;
        } else if (status === "resolved") {
            resolved++;
        }
    });
    

    document.getElementById("totalTickets").textContent = total;
    document.getElementById("openTickets").textContent = open;
    document.getElementById("pendingTickets").textContent = pending;
    document.getElementById("resolvedTickets").textContent = resolved;
}
updateDashboardStats();

ticketsTableBody.addEventListener("change", function(event) {

    if (event.target.classList.contains("status-select")) {

        const newStatus = event.target.value;

        const row = event.target.closest("tr");

        const statusBadge = row.querySelector(".status");

        statusBadge.textContent =
            newStatus.charAt(0).toUpperCase() + newStatus.slice(1);

        statusBadge.className = "status " + newStatus;

        updateDashboardStats();
        saveTickets();
        showToast("Ticket status updated successfully!");
    }

});
ticketsTableBody.addEventListener("click", function(event) {

    if (event.target.classList.contains("delete-btn")) {

        const confirmation = confirm(
            "Are you sure you want to delete this ticket?"
        );

        if (confirmation) {

            const row = event.target.closest("tr");

            row.remove();

            updateDashboardStats();
            saveTickets();
            showToast("Ticket deleted successfully!");
        }
    }

});
ticketsTableBody.addEventListener("click", function(event) {

    if (event.target.classList.contains("edit-btn")) {

        editingRow = event.target.closest("tr");

        const cells = editingRow.querySelectorAll("td");

        const customerName = cells[1].textContent;
        const ticketSubject = cells[2].textContent;
        const ticketPriority = cells[3].textContent.trim();

        document.getElementById("customerName").value = customerName;

        document.getElementById("ticketSubject").value = ticketSubject;

        document.getElementById("ticketPriority").value =
            ticketPriority;

        document.getElementById("modalTitle").textContent =
            "Edit Ticket";

        document.getElementById("submitBtn").textContent =
            "Update Ticket";

        ticketModal.classList.add("show");
    }

});
const detailsModal = document.getElementById("detailsModal");
const closeDetailsModal = document.getElementById("closeDetailsModal");

ticketsTableBody.addEventListener("click", function(event) {

    if (event.target.classList.contains("view-btn")) {

        const row = event.target.closest("tr");
        const cells = row.querySelectorAll("td");

        document.getElementById("detailTicketId").textContent = cells[0].textContent;

        document.getElementById("detailCustomer").textContent = cells[1].textContent;

        document.getElementById("detailSubject").textContent = cells[2].textContent;

        document.getElementById("detailPriority").textContent = cells[3].textContent.trim();

        document.getElementById("detailStatus").textContent = cells[4].querySelector(".status").textContent;

        document.getElementById("detailDescription").textContent =
            row.dataset.description || "No description available";

        detailsModal.classList.add("show");
    }

});

closeDetailsModal.addEventListener("click", function() {
    detailsModal.classList.remove("show");
});

detailsModal.addEventListener("click", function(event) {
    if (event.target === detailsModal) {
        detailsModal.classList.remove("show");
    }
});
// ===================================
// TOAST NOTIFICATION FUNCTION
// ===================================

function showToast(message) {
    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(function() {
        toast.style.display = "none";
    }, 3000);
}
console.log("JavaScript file is running");

console.log(toast);

showToast("Welcome to SupportDesk!");