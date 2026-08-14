// ======================================================
// CAREPOINT CLINIC
// ADMIN DASHBOARD - COMPLETE JAVASCRIPT
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    // ==================================================
    // ELEMENTS
    // ==================================================

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

    const doctorsGrid =
        document.getElementById("doctors-grid");

    const doctorCount =
        document.getElementById("doctor-count");

    // ==================================================
    // DOCTOR MODAL
    // ==================================================

    const doctorModal =
        document.getElementById("doctor-modal");

    const editDoctorForm =
        document.getElementById("edit-doctor-form");

    const editDoctorName =
        document.getElementById("edit-doctor-name");

    const editDoctorSpecialty =
        document.getElementById("edit-doctor-specialty");

    const editStartTime =
        document.getElementById("edit-start-time");

    const editEndTime =
        document.getElementById("edit-end-time");

    const closeDoctorModal =
        document.getElementById("close-doctor-modal");

    const cancelDoctorEdit =
        document.getElementById("cancel-doctor-edit");

    const addDoctorButton =
        document.getElementById("add-doctor-btn");


    // ==================================================
    // CHECK MODAL
    // ==================================================

    if (!doctorModal) {

        console.error(
            "ERROR: doctor-modal was not found."
        );

        return;

    }


    if (!editDoctorForm) {

        console.error(
            "ERROR: edit-doctor-form was not found."
        );

        return;

    }


    // ==================================================
    // DOCTORS
    // ==================================================

    let doctors = [

        {
            id: 1,
            name: "Dr. Sarah Johnson",
            specialty: "General Physician",
            days: [
                "Monday",
                "Wednesday",
                "Friday"
            ],
            startTime: "09:00",
            endTime: "15:00"
        },

        {
            id: 2,
            name: "Dr. Michael Brown",
            specialty: "Cardiologist",
            days: [
                "Tuesday",
                "Thursday"
            ],
            startTime: "10:00",
            endTime: "16:00"
        },

        {
            id: 3,
            name: "Dr. Emily Williams",
            specialty: "Pediatrician",
            days: [
                "Monday",
                "Tuesday",
                "Thursday"
            ],
            startTime: "08:00",
            endTime: "14:00"
        }

    ];


    // ==================================================
    // LOAD DOCTORS
    // ==================================================

    function loadDoctors() {

        const savedDoctors =
            localStorage.getItem(
                "carepointDoctors"
            );


        if (!savedDoctors) {

            localStorage.setItem(
                "carepointDoctors",
                JSON.stringify(doctors)
            );

            return;

        }


        try {

            const parsed =
                JSON.parse(savedDoctors);


            if (Array.isArray(parsed)) {

                doctors = parsed;

            }

        } catch (error) {

            console.error(
                "Could not load doctors:",
                error
            );

        }

    }


    // ==================================================
    // SAVE DOCTORS
    // ==================================================

    function saveDoctors() {

        localStorage.setItem(
            "carepointDoctors",
            JSON.stringify(doctors)
        );

    }


    // ==================================================
    // APPOINTMENTS
    // ==================================================

    function getAppointments() {

        const saved =
            localStorage.getItem(
                "appointments"
            );


        if (!saved) {

            return [];

        }


        try {

            const appointments =
                JSON.parse(saved);


            if (!Array.isArray(appointments)) {

                return [];

            }


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


    // ==================================================
    // SAVE APPOINTMENTS
    // ==================================================

    function saveAppointments(
        appointments
    ) {

        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );

    }


    // ==================================================
    // UPDATE DASHBOARD
    // ==================================================

    function updateDashboard() {

        const appointments =
            getAppointments();


        if (totalAppointments) {

            totalAppointments.textContent =
                appointments.length;

        }


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


        if (todayAppointments) {

            todayAppointments.textContent =
                todayCount;

        }


        const confirmedCount =
            appointments.filter(
                function (appointment) {

                    return appointment.status ===
                        "Confirmed";

                }
            ).length;


        if (confirmedAppointments) {

            confirmedAppointments.textContent =
                confirmedCount;

        }


        displayAppointments(
            appointments
        );

    }


    // ==================================================
    // DISPLAY APPOINTMENTS
    // ==================================================

    function displayAppointments(
        appointments
    ) {

        if (!appointmentsList) {

            return;

        }


        appointmentsList.innerHTML = "";


        if (appointments.length === 0) {

            if (noAppointments) {

                noAppointments.style.display =
                    "block";

            }

            return;

        }


        if (noAppointments) {

            noAppointments.style.display =
                "none";

        }


        appointments.forEach(
            function (appointment) {

                const row =
                    document.createElement("tr");


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
                        ${appointment.patientName || "N/A"}
                    </td>

                    <td>
                        ${appointment.doctor || "N/A"}
                    </td>

                    <td>
                        ${appointment.date || "N/A"}
                    </td>

                    <td>
                        ${appointment.time || "N/A"}
                    </td>

                    <td>
                        ${appointment.reason || "N/A"}
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


    // ==================================================
    // APPOINTMENT STATUS
    // ==================================================

    if (appointmentsList) {

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

                            return Number(item.id) ===
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


        // ==================================================
        // DELETE APPOINTMENT
        // ==================================================

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


                if (
                    !confirm(
                        "Are you sure you want to delete this appointment?"
                    )
                ) {

                    return;

                }


                let appointments =
                    getAppointments();


                appointments =
                    appointments.filter(
                        function (appointment) {

                            return Number(
                                appointment.id
                            ) !== appointmentId;

                        }
                    );


                saveAppointments(
                    appointments
                );


                updateDashboard();

            }
        );

    }


    // ==================================================
    // FILTER
    // ==================================================

    function filterAppointments() {

        const appointments =
            getAppointments();


        const searchTerm =
            searchInput
                ? searchInput.value
                    .toLowerCase()
                    .trim()
                : "";


        const selectedDoctor =
            doctorFilter
                ? doctorFilter.value
                : "";


        const selectedDate =
            dateFilter
                ? dateFilter.value
                : "";


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
                        !selectedDoctor ||
                        appointment.doctor ===
                        selectedDoctor;


                    const matchesDate =
                        !selectedDate ||
                        appointment.date ===
                        selectedDate;


                    return (
                        matchesSearch &&
                        matchesDoctor &&
                        matchesDate
                    );

                }
            );


        displayAppointments(
            filtered
        );

    }


    if (searchInput) {

        searchInput.addEventListener(
            "input",
            filterAppointments
        );

    }


    if (doctorFilter) {

        doctorFilter.addEventListener(
            "change",
            filterAppointments
        );

    }


    if (dateFilter) {

        dateFilter.addEventListener(
            "change",
            filterAppointments
        );

    }


    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            updateDashboard
        );

    }


    // ==================================================
    // FIND DOCTOR
    // ==================================================

    function getDoctorByName(
        name
    ) {

        return doctors.find(
            function (doctor) {

                return doctor.name === name;

            }
        );

    }


    // ==================================================
    // GET SELECTED DAYS
    // ==================================================

    function getSelectedDays() {

        const checkboxes =
            document.querySelectorAll(
                ".doctor-day"
            );


        const days = [];


        checkboxes.forEach(
            function (checkbox) {

                if (checkbox.checked) {

                    days.push(
                        checkbox.value
                    );

                }

            }
        );


        return days;

    }


    // ==================================================
    // SET SELECTED DAYS
    // ==================================================

    function setSelectedDays(
        days
    ) {

        const checkboxes =
            document.querySelectorAll(
                ".doctor-day"
            );


        checkboxes.forEach(
            function (checkbox) {

                checkbox.checked =
                    days.includes(
                        checkbox.value
                    );

            }
        );

    }


    // ==================================================
    // OPEN DOCTOR MODAL
    // ==================================================

    function openDoctorModal(
        doctorName
    ) {

        const doctor =
            getDoctorByName(
                doctorName
            );


        if (!doctor) {

            console.error(
                "Doctor not found:",
                doctorName
            );

            return;

        }


        editDoctorName.value =
            doctor.name;


        editDoctorSpecialty.value =
            doctor.specialty;


        editStartTime.value =
            doctor.startTime;


        editEndTime.value =
            doctor.endTime;


        setSelectedDays(
            doctor.days
        );


        editDoctorForm.dataset.editingDoctor =
            doctor.name;


        doctorModal.classList.add(
            "active"
        );


        doctorModal.style.display =
            "flex";

    }


    // ==================================================
    // CLOSE MODAL
    // ==================================================

    function closeModal() {

        doctorModal.classList.remove(
            "active"
        );


        doctorModal.style.display =
            "none";


        editDoctorForm.reset();


        delete editDoctorForm.dataset.editingDoctor;

    }


    // ==================================================
    // EDIT BUTTON
    // ==================================================

    if (doctorsGrid) {

        doctorsGrid.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(
                        ".edit-doctor-btn"
                    );


                if (!button) {

                    return;

                }


                const doctorName =
                    button.dataset.doctor;


                openDoctorModal(
                    doctorName
                );

            }
        );

    }


    // ==================================================
    // CLOSE BUTTONS
    // ==================================================

    if (closeDoctorModal) {

        closeDoctorModal.addEventListener(
            "click",
            closeModal
        );

    }


    if (cancelDoctorEdit) {

        cancelDoctorEdit.addEventListener(
            "click",
            closeModal
        );

    }


    // ==================================================
    // CLICK OUTSIDE MODAL
    // ==================================================

    doctorModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                doctorModal
            ) {

                closeModal();

            }

        }
    );


    // ==================================================
    // ESCAPE KEY
    // ==================================================

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                doctorModal.classList.contains(
                    "active"
                )
            ) {

                closeModal();

            }

        }
    );


    // ==================================================
    // SAVE DOCTOR
    // ==================================================

    editDoctorForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const originalName =
                editDoctorForm.dataset.editingDoctor;


            const doctor =
                getDoctorByName(
                    originalName
                );


            if (!doctor) {

                return;

            }


            const newName =
                editDoctorName.value.trim();


            const newSpecialty =
                editDoctorSpecialty.value.trim();


            const newStartTime =
                editStartTime.value;


            const newEndTime =
                editEndTime.value;


            const newDays =
                getSelectedDays();


            if (!newName) {

                alert(
                    "Please enter the doctor's name."
                );

                return;

            }


            if (!newSpecialty) {

                alert(
                    "Please enter the doctor's specialty."
                );

                return;

            }


            if (newDays.length === 0) {

                alert(
                    "Please select at least one working day."
                );

                return;

            }


            if (
                !newStartTime ||
                !newEndTime
            ) {

                alert(
                    "Please select the working hours."
                );

                return;

            }


            const oldName =
                doctor.name;


            doctor.name =
                newName;


            doctor.specialty =
                newSpecialty;


            doctor.days =
                newDays;


            doctor.startTime =
                newStartTime;


            doctor.endTime =
                newEndTime;


            saveDoctors();


            // Update appointments
            // using old doctor name

            const appointments =
                getAppointments();


            appointments.forEach(
                function (appointment) {

                    if (
                        appointment.doctor ===
                        oldName
                    ) {

                        appointment.doctor =
                            newName;

                    }

                }
            );


            saveAppointments(
                appointments
            );


            renderDoctors();

            updateDoctorFilter();

            updateDashboard();

            closeModal();


            alert(
                "Doctor information updated successfully."
            );

        }
    );


    // ==================================================
    // RENDER DOCTORS
    // ==================================================

    function renderDoctors() {

        if (!doctorsGrid) {

            return;

        }


        doctorsGrid.innerHTML = "";


        doctors.forEach(
            function (doctor) {

                const initials =
                    doctor.name
                        .replace(
                            "Dr. ",
                            ""
                        )
                        .split(" ")
                        .map(
                            function (word) {

                                return word
                                    .charAt(0);

                            }
                        )
                        .join("")
                        .substring(
                            0,
                            2
                        )
                        .toUpperCase();


                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "admin-doctor-card";


                card.dataset.doctor =
                    doctor.name;


                card.innerHTML = `

                    <div class="admin-doctor-avatar">
                        ${initials}
                    </div>

                    <div class="admin-doctor-info">

                        <h3>
                            ${doctor.name}
                        </h3>

                        <p>
                            ${doctor.specialty}
                        </p>

                    </div>

                    <div class="admin-doctor-details">

                        <div>

                            <span>
                                📅
                            </span>

                            <p>
                                ${doctor.days.join(", ")}
                            </p>

                        </div>

                        <div>

                            <span>
                                🕐
                            </span>

                            <p>
                                ${doctor.startTime}
                                -
                                ${doctor.endTime}
                            </p>

                        </div>

                    </div>

                    <div class="admin-doctor-footer">

                        <span class="doctor-active">
                            ● Active
                        </span>

                        <button
                            type="button"
                            class="edit-doctor-btn"
                            data-doctor="${doctor.name}"
                        >
                            Edit
                        </button>

                    </div>

                `;


                doctorsGrid.appendChild(
                    card
                );

            }
        );


        if (doctorCount) {

            doctorCount.textContent =
                doctors.length;

        }

    }


    // ==================================================
    // UPDATE DOCTOR FILTER
    // ==================================================

    function updateDoctorFilter() {

        if (!doctorFilter) {

            return;

        }


        const currentValue =
            doctorFilter.value;


        doctorFilter.innerHTML = `

            <option value="">
                All Doctors
            </option>

        `;


        doctors.forEach(
            function (doctor) {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    doctor.name;


                option.textContent =
                    doctor.name;


                doctorFilter.appendChild(
                    option
                );

            }
        );


        const stillExists =
            doctors.some(
                function (doctor) {

                    return doctor.name ===
                        currentValue;

                }
            );


        if (stillExists) {

            doctorFilter.value =
                currentValue;

        }

    }


    // ==================================================
    // ADD DOCTOR
    // ==================================================

    if (addDoctorButton) {

        addDoctorButton.addEventListener(
            "click",
            function () {

                alert(
                    "Add Doctor will be added in the next stage."
                );

            }
        );

    }


    // ==================================================
    // SIDEBAR NAVIGATION
    // ==================================================

    const adminNavLinks =
        document.querySelectorAll(
            ".admin-nav-link"
        );


    adminNavLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function (event) {

                    event.preventDefault();


                    adminNavLinks.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    link.classList.add(
                        "active"
                    );


                    const targetId =
                        link
                            .getAttribute("href")
                            .replace(
                                "#",
                                ""
                            );


                    const targetSection =
                        document.getElementById(
                            targetId
                        );


                    if (!targetSection) {

                        return;

                    }


                    targetSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );


    // ==================================================
    // MOBILE MENU
    // ==================================================

    const mobileMenuButton =
        document.querySelector(
            ".mobile-menu-button"
        );


    const sidebar =
        document.querySelector(
            ".admin-sidebar"
        );


    if (
        mobileMenuButton &&
        sidebar
    ) {

        mobileMenuButton.addEventListener(
            "click",
            function () {

                sidebar.classList.toggle(
                    "mobile-open"
                );

            }
        );

    }


    // ==================================================
    // START APPLICATION
    // ==================================================

    loadDoctors();

    renderDoctors();

    updateDoctorFilter();

    updateDashboard();

});