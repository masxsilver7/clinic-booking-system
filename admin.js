// ==========================================
// CAREPOINT CLINIC
// ADMIN DASHBOARD
// ==========================================


// ==========================================
// GET ELEMENTS
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
// GET APPOINTMENTS FROM LOCAL STORAGE
// ==========================================

function getAppointments() {

    const savedAppointments =
        localStorage.getItem("appointments");


    if (!savedAppointments) {

        return [];

    }


    try {

        const appointments =
            JSON.parse(savedAppointments);


        // Make sure every old appointment
        // has a status.

        return appointments.map(
            function (appointment) {

                if (!appointment.status) {

                    appointment.status =
                        "Confirmed";

                }

                return appointment;

            }
        );

    } catch (error) {

        console.error(
            "Error loading appointments:",
            error
        );

        return [];

    }

}


// ==========================================
// SAVE APPOINTMENTS
// ==========================================

function saveAppointments(
    appointments
) {

    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );

}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    const appointments =
        getAppointments();


    saveAppointments(
        appointments
    );


    // TOTAL

    totalAppointments.textContent =
        appointments.length;


    // TODAY

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayCount =
        appointments.filter(
            function (appointment) {

                return appointment.date === today;

            }
        ).length;


    todayAppointments.textContent =
        todayCount;


    // CONFIRMED

    const confirmedCount =
        appointments.filter(
            function (appointment) {

                return appointment.status ===
                    "Confirmed";

            }
        ).length;


    confirmedAppointments.textContent =
        confirmedCount;


    // TABLE

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


    if (appointments.length === 0) {

        noAppointments.style.display =
            "block";

        return;

    }


    noAppointments.style.display =
        "none";


    appointments.forEach(
        function (appointment) {

            const row =
                document.createElement("tr");


            // STATUS CLASS

            let statusClass =
                "status-pending";


            if (
                appointment.status ===
                "Confirmed"
            ) {

                statusClass =
                    "status-confirmed";

            }


            if (
                appointment.status ===
                "Cancelled"
            ) {

                statusClass =
                    "status-cancelled";

            }


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

                    <select
                        class="status-select ${statusClass}"
                        data-id="${appointment.id}"
                    >

                        <option
                            value="Pending"
                            ${
                                appointment.status ===
                                "Pending"
                                ? "selected"
                                : ""
                            }
                        >
                            Pending
                        </option>


                        <option
                            value="Confirmed"
                            ${
                                appointment.status ===
                                "Confirmed"
                                ? "selected"
                                : ""
                            }
                        >
                            Confirmed
                        </option>


                        <option
                            value="Cancelled"
                            ${
                                appointment.status ===
                                "Cancelled"
                                ? "selected"
                                : ""
                            }
                        >
                            Cancelled
                        </option>

                    </select>

                </td>


                <td>

                    <button
                        type="button"
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
// CHANGE STATUS
// ==========================================

appointmentsList.addEventListener(
    "change",
    function (event) {

        if (
            !event.target.classList.contains(
                "status-select"
            )
        ) {

            return;

        }


        const appointmentId =
            Number(
                event.target.dataset.id
            );


        const newStatus =
            event.target.value;


        const appointments =
            getAppointments();


        const appointment =
            appointments.find(
                function (item) {

                    return item.id ===
                        appointmentId;

                }
            );


        if (!appointment) {

            return;

        }


        appointment.status =
            newStatus;


        saveAppointments(
            appointments
        );


        updateDashboard();

    }
);


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


        saveAppointments(
            appointments
        );


        updateDashboard();

    }
);


// ==========================================
// FILTER APPOINTMENTS
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


                const patientName =
                    String(
                        appointment.patientName || ""
                    ).toLowerCase();


                const doctorName =
                    String(
                        appointment.doctor || ""
                    ).toLowerCase();


                const reason =
                    String(
                        appointment.reason || ""
                    ).toLowerCase();


                const matchesSearch =
                    patientName.includes(
                        searchTerm
                    )
                    ||
                    doctorName.includes(
                        searchTerm
                    )
                    ||
                    reason.includes(
                        searchTerm
                    );


                const matchesDoctor =
                    !selectedDoctor
                    ||
                    appointment.doctor ===
                    selectedDoctor;


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
// SEARCH
// ==========================================

searchInput.addEventListener(
    "input",
    filterAppointments
);


// ==========================================
// DOCTOR FILTER
// ==========================================

doctorFilter.addEventListener(
    "change",
    filterAppointments
);


// ==========================================
// DATE FILTER
// ==========================================

dateFilter.addEventListener(
    "change",
    filterAppointments
);


// ==========================================
// REFRESH
// ==========================================

refreshButton.addEventListener(
    "click",
    updateDashboard
);


// ==========================================
// INITIALIZE
// ==========================================

updateDashboard();