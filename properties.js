document.addEventListener("DOMContentLoaded", function () {
    loadProperties();

    // Attach event listeners to filters
    document
        .getElementById("status-filter")
        .addEventListener("change", applyFilters);
    document
        .getElementById("location-filter")
        .addEventListener("input", applyFilters);
});

// Store all properties in memory
let allProperties = [];

// Load properties from JSON
function loadProperties() {
    fetch("properties/properties.json")
        .then((response) => response.json())
        .then((data) => {
            let fetchPromises = data.map((property) => {
                const fileName = property.file;

                // Return a Promise for each property fetch
                return fetch(`properties/${fileName}/${fileName}.json`)
                    .then((res) => res.json())
                    .then((propertyData) => {
                        return propertyData; // Return the fetched property
                    })
                    .catch((error) => {
                        console.error(
                            `Error loading property ${fileName}:`,
                            error
                        );
                        return null; // Return null if the fetch fails
                    });
            });

            // Wait for all fetches to complete
            Promise.all(fetchPromises).then((loadedProperties) => {
                // Remove any failed (null) fetches
                allProperties = loadedProperties.filter((p) => p !== null);

                populatePropertyList(allProperties);
            });
        })
        .catch((error) => console.error("❌ Error loading properties:", error));
}

// Apply filters based on user selection
function applyFilters() {
    const statusFilter = document.getElementById("status-filter").value;
    const locationFilter = document
        .getElementById("location-filter")
        .value.toLowerCase();

    const filteredProperties = allProperties.filter((property) => {
        // Status filter logic
        const matchesStatus =
            statusFilter === "all" ||
            property.status.toLowerCase() === statusFilter;

        // Location filter logic (matches if city, street, or house number contains the search term)
        const matchesLocation =
            locationFilter === "" ||
            property.city.toLowerCase().includes(locationFilter) ||
            property.street.toLowerCase().includes(locationFilter) ||
            property.houseNumber.includes(locationFilter);

        return matchesStatus && matchesLocation;
    });

    populatePropertyList(filteredProperties);
}

// Populate the list of properties
function populatePropertyList(properties) {
    const list = document.getElementById("property-list");
    list.innerHTML = "";

    properties.forEach((property) => {
        const li = document.createElement("li");
        li.textContent = `${property.city} - ${property.street} ${property.houseNumber}`;
        li.addEventListener("click", () => loadPropertyDetails(property));
        list.appendChild(li);
    });

    // If no properties match, display a message
    if (properties.length === 0) {
        list.innerHTML = "<p>No properties found.</p>";
    }
}

// Load property details dynamically
function loadPropertyDetails(data) {
    document.getElementById(
        "property-title"
    ).textContent = `${data.city} - ${data.street} ${data.houseNumber}`;
    document.getElementById("property-description").textContent =
        data.description;
    document.getElementById(
        "property-price"
    ).textContent = `Price: ${data.price}`;
    let status = data.status;
    let status_text = "";
    if (status === "sold") {
        status_text = "Sold";
    } else if (status === "buy") {
        status_text = "Available to Buy";
    } else if (status === "rent") {
        status_text = "Available to Rent";
    }
    document.getElementById(
        "property-status"
    ).textContent = `Status: ${status_text}`;

    // Load images
    const gallery = document.getElementById("photo-gallery");
    gallery.innerHTML = "";
    data.images.forEach((img) => {
        const imgElement = document.createElement("img");
        imgElement.src = `properties/${data.directory}/${img}`;
        imgElement.alt = "Property Image";
        gallery.appendChild(imgElement);
    });
    // fetch(`properties/${file}`)
    //     .then((response) => response.json())
    //     .then((data) => {
    //         document.getElementById(
    //             "property-title"
    //         ).textContent = `${data.city} - ${data.street} ${data.houseNumber}`;
    //         document.getElementById("property-description").textContent =
    //             data.description;
    //         document.getElementById(
    //             "property-price"
    //         ).textContent = `Price: ${data.price}`;
    //         document.getElementById(
    //             "property-status"
    //         ).textContent = `Status: ${data.status}`;

    //         // Load images
    //         const gallery = document.getElementById("photo-gallery");
    //         gallery.innerHTML = "";
    //         data.images.forEach((img) => {
    //             const imgElement = document.createElement("img");
    //             imgElement.src = `properties/${data.directory}/${img}`;
    //             imgElement.alt = "Property Image";
    //             gallery.appendChild(imgElement);
    //         });
    //     })
    //     .catch((error) =>
    //         console.error("Error loading property details:", error)
    //     );
}
