document.addEventListener("DOMContentLoaded", function () {
    generateCalendar();
    populateEventLists();
});

// Generate a simple calendar for the current month
function generateCalendar() {
    const today = new Date();
    const month = today.toLocaleString("default", { month: "long" });
    const year = today.getFullYear();

    let calendarHTML = `<h3>${month} ${year}</h3><table border="1" style="width:100%; border-collapse: collapse;"><tr>`;

    // Days of the week
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    days.forEach((day) => {
        calendarHTML += `<th>${day}</th>`;
    });
    calendarHTML += `</tr><tr>`;

    // Get the first day of the month
    let firstDay = new Date(year, today.getMonth(), 1).getDay();
    let lastDate = new Date(year, today.getMonth() + 1, 0).getDate();

    // Fill empty cells for previous month days
    for (let i = 0; i < firstDay; i++) {
        calendarHTML += `<td></td>`;
    }

    // Fill the calendar with dates
    for (let date = 1; date <= lastDate; date++) {
        if ((date + firstDay - 1) % 7 === 0) {
            calendarHTML += `</tr><tr>`; // Start a new row every Sunday
        }
        calendarHTML += `<td>${date}</td>`;
    }
    calendarHTML += `</tr></table>`;

    document.getElementById("calendar").innerHTML = calendarHTML;
}

// Example events
const events = {
    "Planned Tours": [
        {
            date: "March 14, 2025",
            time: "10:00 AM",
            location: "Downtown Apartment",
        },
        { date: "March 16, 2025", time: "2:00 PM", location: "Suburban House" },
        {
            date: "March 18, 2025",
            time: "4:30 PM",
            location: "Beachfront Villa",
        },
        {
            date: "March 20, 2025",
            time: "12:00 PM",
            location: "Luxury Penthouse",
        },
        {
            date: "March 22, 2025",
            time: "3:00 PM",
            location: "Countryside Farmhouse",
        },
    ],
    Meetings: [
        { date: "March 15, 2025", time: "9:00 AM", with: "Client A" },
        { date: "March 17, 2025", time: "1:30 PM", with: "Client B" },
        { date: "March 19, 2025", time: "11:00 AM", with: "Investor C" },
        { date: "March 21, 2025", time: "2:45 PM", with: "Developer D" },
        { date: "March 23, 2025", time: "10:30 AM", with: "Agent E" },
    ],
    Invoicing: [
        { date: "March 12, 2025", amount: "$1,200", to: "Client X" },
        { date: "March 14, 2025", amount: "$800", to: "Client Y" },
        { date: "March 16, 2025", amount: "$1,500", to: "Client Z" },
        { date: "March 18, 2025", amount: "$950", to: "Client W" },
        { date: "March 20, 2025", amount: "$600", to: "Client V" },
    ],
};

// Populate the event lists dynamically
function populateEventLists() {
    populateList(
        "planned-tours",
        events["Planned Tours"].map(
            (e) => `${e.date} - ${e.time} at ${e.location}`
        )
    );
    populateList(
        "meetings",
        events["Meetings"].map((e) => `${e.date} - ${e.time} with ${e.with}`)
    );
    populateList(
        "invoicing",
        events["Invoicing"].map((e) => `${e.date} - ${e.amount} to ${e.to}`)
    );
}

// Helper function to populate event lists
function populateList(id, items) {
    const ul = document.getElementById(id);
    ul.innerHTML = items
        .slice(0, 5)
        .map((item) => `<li>${item}</li>`)
        .join("");
}
