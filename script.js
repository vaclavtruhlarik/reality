document.addEventListener("DOMContentLoaded", function () {
    generateCalendar();
    fetchEvents(); // Load events from JSON file
});

// Colors for different event types
const eventColors = {
    "Planned Tours": "blue",
    Meetings: "green",
    Invoicing: "red",
};

// Generate a calendar that starts on Monday
function generateCalendar(events = {}) {
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();

    let calendarHTML = `<h3>${month} ${year}</h3><table border="1" style="width:100%; border-collapse: collapse;"><tr>`;

    // Days of the week starting from Monday
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    days.forEach((day) => {
        calendarHTML += `<th>${day}</th>`;
    });
    calendarHTML += `</tr><tr>`;

    // Get first day of the month (0=Sunday, 1=Monday, ..., 6=Saturday)
    let firstDay = new Date(year, today.getMonth(), 1).getDay();
    if (firstDay === 0) firstDay = 7; // Convert Sunday (0) to last (7)

    let lastDate = new Date(year, today.getMonth() + 1, 0).getDate();

    // Fill empty cells before first day
    for (let i = 1; i < firstDay; i++) {
        calendarHTML += `<td></td>`;
    }

    // Fill the calendar with dates and event markers
    for (let date = 1; date <= lastDate; date++) {
        if ((firstDay + date - 2) % 7 === 0) {
            calendarHTML += `</tr><tr>`; // Start a new row every Monday
        }

        // Check if events exist for this date
        let eventMarkers = getEventMarkers(events, date);

        calendarHTML += `<td><strong>${date}</strong>${eventMarkers}</td>`;
    }

    calendarHTML += `</tr></table>`;
    document.getElementById("calendar").innerHTML = calendarHTML;
}

// Fetch event data and update calendar
function fetchEvents() {
    fetch("events.json")
        .then((response) => response.json())
        .then((data) => {
            generateCalendar(data);
            populateList(
                "planned-tours",
                data["Planned Tours"].map(
                    (e) => `${e.date} - ${e.time} at ${e.location}`
                )
            );
            populateList(
                "meetings",
                data["Meetings"].map(
                    (e) => `${e.date} - ${e.time} with ${e.with}`
                )
            );
            populateList(
                "invoicing",
                data["Invoicing"].map(
                    (e) => `${e.date} - ${e.amount} to ${e.to}`
                )
            );
        })
        .catch((error) => console.error("Error loading events:", error));
}

// Generate event markers for the calendar
function getEventMarkers(events, date) {
    let markers = "";

    Object.keys(events).forEach((type) => {
        events[type].forEach((event) => {
            let eventDate = parseInt(event.date.split(" ")[1]); // Extract day from "March 14, 2025"
            if (eventDate === date) {
                markers += `<div class="event-dot" style="background:${eventColors[type]};"></div>`;
            }
        });
    });

    return markers;
}

// Helper function to populate event lists
function populateList(id, items) {
    const ul = document.getElementById(id);
    ul.innerHTML = items
        .slice(0, 5)
        .map((item) => `<li>${item}</li>`)
        .join("");
}
