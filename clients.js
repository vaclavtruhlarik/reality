document.addEventListener("DOMContentLoaded", function () {
    loadClients();
});

let allClients = [];

// Load clients dynamically
function loadClients() {
    fetch("clients/clients.json")
        .then((response) => response.json())
        .then((clientList) => {
            let fetchPromises = clientList.map((client) =>
                fetch(`clients/${client.file}`)
                    .then((res) => res.json())
                    .then((clientData) => {
                        clientData.file = client.file; // Store file reference
                        allClients.push(clientData);
                    })
                    .catch((error) =>
                        console.error(
                            `Error loading client ${client.file}:`,
                            error
                        )
                    )
            );

            Promise.all(fetchPromises).then(() => {
                populateClientLists();
            });
        })
        .catch((error) => console.error("Error loading clients:", error));
}

// Populate client lists
function populateClientLists() {
    const currentClientsList = document.getElementById("current-clients");
    const oldClientsList = document.getElementById("old-clients");

    currentClientsList.innerHTML = "";
    oldClientsList.innerHTML = "";

    allClients.forEach((client) => {
        const li = document.createElement("li");
        li.textContent = `${client.name}`;
        li.dataset.file = client.file;
        li.addEventListener("click", () => toggleClientDetails(li, client));

        if (client.status === "Current") {
            currentClientsList.appendChild(li);
        } else {
            oldClientsList.appendChild(li);
        }
    });
}

// Toggle client details display
function toggleClientDetails(li, client) {
    let detailsDiv = li.querySelector(".client-details");

    if (detailsDiv) {
        detailsDiv.remove(); // Collapse details if already expanded
    } else {
        detailsDiv = document.createElement("div");
        detailsDiv.classList.add("client-details");
        detailsDiv.innerHTML = `
            <p><strong>Email:</strong> ${client.email}</p>
            <p><strong>Phone:</strong> ${client.phone}</p>
            <p><strong>Address:</strong> ${client.address}</p>
            <p><strong>Status:</strong> ${client.status}</p>
        `;
        li.appendChild(detailsDiv);
        detailsDiv.style.display = "block";
    }
}
