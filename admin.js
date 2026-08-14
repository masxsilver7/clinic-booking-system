// ==========================================
// CAREPOINT CLINIC
// ADMIN DASHBOARD JAVASCRIPT
// ==========================================


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const totalAppointments =
    document.getElementById("total-appointments");

const todayAppointments =
    document.getElementById("today-appointments");

const confirmedAppointments =
    document.getElementById("confirmed-appointments");

const appointmentsList =
    document.getElementById("admin-appointments-list");

const noAppointments =
    document.getElementById("admin-no-appointments");

const searchInput =
    document.getElementById("appointment-search");

const doctorFilter =
    document.getElementById("doctor-filter");

const dateFilter =
    document.getElementById("date-filter");

const refreshButton =
    document.getElementById("refresh-appointments");


// ==========================================
// GET APPOINTMENTS
// ==========================================

function getAppointments() {

    const savedAppointments =
        localStorage.getItem("appointments");


    if (!savedAppointments) {

        return [];

    }


    try {

        return JSON.parse(
            savedAppointments
        );

    } catch (error) {

        console.error(
            "Could not read appointments:",
            error
        );

        return [];

    }

}


// ==========================================
// DISPLAY DASHBOARD
// ==========================================

function updateDashboard() {

    const appointments =
        getAppointments();


    // --------------------------------------
    // TOTAL APPOINTMENTS
    // --------------------------------------

    totalAppointments.textContent =
        appointments.length;


    // --------------------------------------
    // TODAY'S APPOINTMENTS
    // --------------------------------------

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayCount =
        appointments.filter(function (appointment) {

            return appointment.date === today;

        }).length;


    todayAppointments.textContent =
        todayCount;


    // --------------------------------------
    // CONFIRMED APPOINTMENTS
    // --------------------------------------

    // Every appointment created by our
    // booking system is currently confirmed.

    confirmedAppointments.textContent =
        appointments.length;


    // --------------------------------------
    // DISPLAY TABLE
    // --------------------------------------

    displayAppointments(
        appointments
    );

}


// ==========================================
// DISPLAY APPOINTMENTS
// ==========================================

function displayAppointments(
    appointments
) {

    appointmentsList.innerHTML = "";


    // --------------------------------------
    // NO RESULTS
    // --------------------------------------

    if (appointments.length === 0) {

        noAppointments.style.display =
            "block";

        return;

    }


    noAppointments.style.display =
        "none";


    // --------------------------------------
    // CREATE TABLE ROWS
    // --------------------------------------

    appointments.forEach(
        function (appointment) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${appointment.patientName}
                </td>

                <td>
                    ${appointment.doctor}
                </td>

                <td>
                    ${appointment.date}
                </td>

                <td>
                    ${appointment.time}
                </td>

                <td>
                    ${appointment.reason}
                </td>

                <td>
                    <span class="status-confirmed">
                        Confirmed
                    </span>
                </td>

                <td>

                    <button
                        class="admin-delete-btn"
                        data-id="${appointment.id}"
                    >
                        Delete
                    </button>

                </td>

            `;


            appointmentsList.appendChild(
                row
            );

        }
    );

}


// ==========================================
// SEARCH + FILTER
// ==========================================

function filterAppointments() {

    const appointments =
        getAppointments();


    const searchTerm =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedDoctor =
        doctorFilter.value;


    const selectedDate =
        dateFilter.value;


    const filtered =
        appointments.filter(
            function (appointment) {


                // SEARCH

                const matchesSearch =
                    appointment.patientName
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    appointment.doctor
                        .toLowerCase()
                        .includes(searchTerm)

                    ||

                    appointment.reason
                        .toLowerCase()
                        .includes(searchTerm);


                // DOCTOR FILTER

                const matchesDoctor =
                    !selectedDoctor
                    ||
                    appointment.doctor ===
                    selectedDoctor;


                // DATE FILTER

                const matchesDate =
                    !selectedDate
                    ||
                    appointment.date ===
                    selectedDate;


                return (
                    matchesSearch
                    &&
                    matchesDoctor
                    &&
                    matchesDate
                );

            }
        );


    displayAppointments(
        filtered
    );

}


// ==========================================
// DELETE APPOINTMENT
// ==========================================

appointmentsList.addEventListener(
    "click",
    function (event) {


        if (
            !event.target.classList.contains(
                "admin-delete-btn"
            )
        ) {

            return;

        }


        const appointmentId =
            Number(
                event.target.dataset.id
            );


        const confirmed =
            confirm(
                "Are you sure you want to delete this appointment?"
            );


        if (!confirmed) {

            return;

        }


        let appointments =
            getAppointments();


        appointments =
            appointments.filter(
                function (appointment) {

                    return appointment.id !==
                        appointmentId;

                }
            );


        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );


        updateDashboard();

    }
);


// ==========================================
// SEARCH EVENT
// ==========================================

searchInput.addEventListener(
    "input",
    function () {

        filterAppointments();

    }
);


// ==========================================
// DOCTOR FILTER
// ==========================================

doctorFilter.addEventListener(
    "change",
    function () {

        filterAppointments();

    }
);


// ==========================================
// DATE FILTER
// ==========================================

dateFilter.addEventListener(
    "change",
    function () {

        filterAppointments();

    }
);


// ==========================================
// REFRESH BUTTON
// ==========================================

refreshButton.addEventListener(
    "click",
    function () {

        updateDashboard();

    }
);


// ==========================================
// INITIAL LOAD
// ==========================================

updateDashboard();