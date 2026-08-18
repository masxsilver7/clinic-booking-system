// ==========================================
// CAREPOINT CLINIC
// ADMIN DASHBOARD SCRIPT
// MongoDB + Express Version
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    console.log("CarePoint Admin Dashboard loaded.");

    // ==========================================
    // API
    // ==========================================

    const API_URL = "https://carepoint-backend-zu71.onrender.com";


    // ==========================================
    // ELEMENTS
    // ==========================================

    const totalAppointments =
        document.getElementById("total-appointments");

    const todayAppointments =
        document.getElementById("today-appointments");

    const confirmedAppointments =
        document.getElementById("confirmed-appointments");

    const doctorCount =
        document.getElementById("doctor-count");

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


    // Doctor elements

    const doctorsGrid =
        document.getElementById("doctors-grid");

    const addDoctorButton =
        document.getElementById("add-doctor-btn");


    // Edit doctor modal

    const doctorModal =
        document.getElementById("doctor-modal");

    const closeDoctorModal =
        document.getElementById("close-doctor-modal");

    const cancelDoctorEdit =
        document.getElementById("cancel-doctor-edit");

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


    // Add doctor modal

    const addDoctorModal =
        document.getElementById("add-doctor-modal");

    const closeAddDoctorModal =
        document.getElementById("close-add-doctor-modal");

    const cancelAddDoctor =
        document.getElementById("cancel-add-doctor");

    const addDoctorForm =
        document.getElementById("add-doctor-form");

    const addDoctorName =
        document.getElementById("add-doctor-name");

    const addDoctorSpecialty =
        document.getElementById("add-doctor-specialty");

    const addStartTime =
        document.getElementById("add-start-time");

    const addEndTime =
        document.getElementById("add-end-time");


    // ==========================================
    // DATA
    // ==========================================

    let appointments = [];
    let doctors = [];
    let editingDoctorId = null;


    // ==========================================
    // LOAD APPOINTMENTS
    // ==========================================

    async function loadAppointments() {

        try {

            console.log(
                "Loading appointments..."
            );

            const response =
                await fetch(
                    `${API_URL}/api/appointments`
                );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }


            const data =
                await response.json();


            if (
                !data.success ||
                !Array.isArray(data.appointments)
            ) {

                throw new Error(
                    "Invalid appointments response."
                );

            }


            appointments =
                data.appointments;


            console.log(
                "Appointments loaded:",
                appointments.length
            );


            renderDashboard();


        } catch (error) {

            console.error(
                "Failed to load appointments:",
                error
            );


            if (appointmentsList) {

                appointmentsList.innerHTML = `
                    <tr>
                        <td
                            colspan="7"
                            style="text-align:center; padding:30px;"
                        >
                            <strong>
                                Unable to load appointments
                            </strong>

                            <br>

                            <small>
                                ${escapeHTML(error.message)}
                            </small>
                        </td>
                    </tr>
                `;

            }

        }

    }


    // ==========================================
    // LOAD DOCTORS
    // ==========================================

    async function loadDoctors() {

        try {

            console.log(
                "Loading doctors..."
            );


            const response =
                await fetch(
                    `${API_URL}/api/doctors`
                );


            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }


            const data =
                await response.json();


            if (
                !data.success ||
                !Array.isArray(data.doctors)
            ) {

                throw new Error(
                    "Invalid doctors response."
                );

            }


            doctors =
                data.doctors;


            console.log(
                "Doctors loaded:",
                doctors.length
            );


            updateDoctorCount();

            populateDoctorFilter();

            renderDoctors();


        } catch (error) {

            console.error(
                "Failed to load doctors:",
                error
            );

        }

    }


    // ==========================================
    // UPDATE DOCTOR COUNT
    // ==========================================

    function updateDoctorCount() {

        if (!doctorCount) {
            return;
        }


        doctorCount.textContent =
            doctors.length;

    }


    // ==========================================
    // POPULATE DOCTOR FILTER
    // ==========================================

    function populateDoctorFilter() {

        if (!doctorFilter) {
            return;
        }


        doctorFilter.innerHTML = `
            <option value="">
                All Doctors
            </option>
        `;


        doctors.forEach((doctor) => {

            const option =
                document.createElement("option");


            option.value =
                doctor.name;


            option.textContent =
                doctor.name;


            doctorFilter.appendChild(
                option
            );

        });

    }


    // ==========================================
    // DASHBOARD
    // ==========================================

    function renderDashboard() {

        updateDashboardStats();

        renderAppointments();

    }


    // ==========================================
    // DASHBOARD STATISTICS
    // ==========================================

    function updateDashboardStats() {

        const today =
            getTodayString();


        const todayCount =
            appointments.filter(
                (appointment) =>
                    appointment.date === today
            ).length;


        const confirmedCount =
            appointments.filter(
                (appointment) =>
                    appointment.status === "Confirmed"
            ).length;


        if (totalAppointments) {

            totalAppointments.textContent =
                appointments.length;

        }


        if (todayAppointments) {

            todayAppointments.textContent =
                todayCount;

        }


        if (confirmedAppointments) {

            confirmedAppointments.textContent =
                confirmedCount;

        }

    }


    // ==========================================
    // TODAY'S DATE
    // ==========================================

    function getTodayString() {

        const today =
            new Date();


        const year =
            today.getFullYear();


        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");


        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        return `${year}-${month}-${day}`;

    }


    // ==========================================
    // FILTER APPOINTMENTS
    // ==========================================

    function getFilteredAppointments() {

        const search =
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


        return appointments.filter(
            (appointment) => {

                const patientName =
                    String(
                        appointment.patientName || ""
                    ).toLowerCase();


                const doctor =
                    String(
                        appointment.doctor || ""
                    ).toLowerCase();


                const reason =
                    String(
                        appointment.reason || ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    patientName.includes(search) ||
                    doctor.includes(search) ||
                    reason.includes(search);


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

    }


    // ==========================================
    // RENDER APPOINTMENTS TABLE
    // ==========================================

    function renderAppointments() {

        if (!appointmentsList) {

            console.error(
                "Appointment table body not found."
            );

            return;

        }


        const filteredAppointments =
            getFilteredAppointments();


        appointmentsList.innerHTML = "";


        if (
            filteredAppointments.length === 0
        ) {

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


        filteredAppointments
            .slice()
            .sort(
                (a, b) =>
                    new Date(
                        b.createdAt || 0
                    ) -
                    new Date(
                        a.createdAt || 0
                    )
            )
            .forEach(
                (appointment) => {

                    const row =
                        document.createElement("tr");


                    const status =
                        appointment.status ||
                        "Pending";


                    const appointmentId =
                        appointment._id ||
                        appointment.id ||
                        "";


                    row.innerHTML = `

                        <td>
                            <strong>
                                ${escapeHTML(
                                    appointment.patientName
                                )}
                            </strong>
                        </td>


                        <td>
                            ${escapeHTML(
                                appointment.doctor
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                appointment.date
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                formatTime(
                                    appointment.time
                                )
                            )}
                        </td>


                        <td>
                            ${escapeHTML(
                                appointment.reason
                            )}
                        </td>


                        <td>

                            <span
                                class="status-badge status-${getStatusClass(status)}"
                            >
                                ${escapeHTML(status)}
                            </span>

                        </td>


                        <td>

                            <div
                                class="appointment-table-actions"
                            >

                                <button
                                    type="button"
                                    class="confirm-btn"
                                    data-id="${escapeHTML(
                                        appointmentId
                                    )}"
                                    ${
                                        status === "Confirmed"
                                            ? "disabled"
                                            : ""
                                    }
                                >
                                    Confirm
                                </button>


                                <button
                                    type="button"
                                    class="cancel-btn"
                                    data-id="${escapeHTML(
                                        appointmentId
                                    )}"
                                    ${
                                        status === "Cancelled"
                                            ? "disabled"
                                            : ""
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    type="button"
                                    class="delete-btn"
                                    data-id="${escapeHTML(
                                        appointmentId
                                    )}"
                                >
                                    Delete
                                </button>

                            </div>

                        </td>

                    `;


                    appointmentsList.appendChild(
                        row
                    );

                }
            );


        attachAppointmentActions();

    }


    // ==========================================
    // STATUS CLASS
    // ==========================================

    function getStatusClass(status) {

        return String(status)
            .toLowerCase()
            .replace(
                /\s+/g,
                "-"
            );

    }


    // ==========================================
    // FORMAT TIME
    // ==========================================

    function formatTime(time) {

        if (!time) {
            return "";
        }


        const parts =
            String(time).split(":");


        if (parts.length < 2) {
            return time;
        }


        let hour =
            Number(parts[0]);


        const minute =
            parts[1];


        const period =
            hour >= 12
                ? "PM"
                : "AM";


        hour =
            hour % 12 || 12;


        return `${hour}:${minute} ${period}`;

    }


    // ==========================================
    // APPOINTMENT ACTIONS
    // ==========================================

    function attachAppointmentActions() {

        document
            .querySelectorAll(".confirm-btn")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.dataset.id;


                        if (!id) {

                            alert(
                                "Appointment ID is missing."
                            );

                            return;

                        }


                        await updateAppointmentStatus(
                            id,
                            "Confirmed"
                        );

                    }
                );

            });


        document
            .querySelectorAll(".cancel-btn")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.dataset.id;


                        if (!id) {

                            alert(
                                "Appointment ID is missing."
                            );

                            return;

                        }


                        await updateAppointmentStatus(
                            id,
                            "Cancelled"
                        );

                    }
                );

            });


        document
            .querySelectorAll(".delete-btn")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    async () => {

                        const id =
                            button.dataset.id;


                        if (!id) {

                            alert(
                                "Appointment ID is missing."
                            );

                            return;

                        }


                        await deleteAppointment(
                            id
                        );

                    }
                );

            });

    }


    // ==========================================
    // UPDATE APPOINTMENT STATUS
    // ==========================================

    async function updateAppointmentStatus(
        id,
        status
    ) {

        try {

            const response =
                await fetch(
                    `${API_URL}/api/appointments/${id}/status`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            status: status
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    `Server returned ${response.status}`
                );

            }


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Failed to update appointment."
                );

            }


            await loadAppointments();


        } catch (error) {

            console.error(
                "Failed to update appointment:",
                error
            );


            alert(
                "Failed to update appointment.\n\n" +
                error.message
            );

        }

    }


    // ==========================================
    // DELETE APPOINTMENT
    // ==========================================

    async function deleteAppointment(id) {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this appointment?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/appointments/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    `Server returned ${response.status}`
                );

            }


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Failed to delete appointment."
                );

            }


            await loadAppointments();


        } catch (error) {

            console.error(
                "Failed to delete appointment:",
                error
            );


            alert(
                "Failed to delete appointment.\n\n" +
                error.message
            );

        }

    }


    // ==========================================
    // RENDER DOCTORS
    // ==========================================

    function renderDoctors() {

        if (!doctorsGrid) {
            return;
        }


        doctorsGrid.innerHTML = "";


        if (doctors.length === 0) {

            doctorsGrid.innerHTML = `
                <div class="admin-empty">

                    <div>👨‍⚕️</div>

                    <h3>
                        No doctors found
                    </h3>

                    <p>
                        Add a doctor to your medical team.
                    </p>

                </div>
            `;

            return;

        }


        doctors.forEach((doctor) => {

            const card =
                document.createElement("div");


            card.className =
                "admin-doctor-card";


            card.dataset.doctor =
                doctor.name;


            const initials =
                getInitials(
                    doctor.name
                );


            const days =
                Array.isArray(doctor.days)
                    ? doctor.days.join(", ")
                    : "";


            const activeText =
                doctor.active === false
                    ? "● Inactive"
                    : "● Active";


            const activeClass =
                doctor.active === false
                    ? "doctor-inactive"
                    : "doctor-active";


            card.innerHTML = `

                <div class="admin-doctor-avatar">
                    ${escapeHTML(initials)}
                </div>


                <div class="admin-doctor-info">

                    <h3>
                        ${escapeHTML(
                            doctor.name
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            doctor.specialty
                        )}
                    </p>

                </div>


                <div class="admin-doctor-details">

                    <div>

                        <span>📅</span>

                        <p>
                            ${escapeHTML(days)}
                        </p>

                    </div>


                    <div>

                        <span>🕐</span>

                        <p>
                            ${escapeHTML(
                                formatTime(
                                    doctor.startTime
                                )
                            )}
                            -
                            ${escapeHTML(
                                formatTime(
                                    doctor.endTime
                                )
                            )}
                        </p>

                    </div>

                </div>


                <div class="admin-doctor-footer">

                    <span class="${activeClass}">
                        ${escapeHTML(activeText)}
                    </span>


                    <button
                        type="button"
                        class="edit-doctor-btn"
                        data-id="${escapeHTML(
                            doctor._id
                        )}"
                    >
                        Edit
                    </button>

                </div>

            `;


            doctorsGrid.appendChild(
                card
            );

        });


        attachDoctorEditButtons();

    }


    // ==========================================
    // GET INITIALS
    // ==========================================

    function getInitials(name) {

        if (!name) {
            return "DR";
        }


        const cleanName =
            name
                .replace(/^Dr\.?\s*/i, "")
                .trim();


        const parts =
            cleanName.split(/\s+/);


        if (parts.length === 1) {

            return parts[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();

    }


    // ==========================================
    // EDIT DOCTOR BUTTONS
    // ==========================================

    function attachDoctorEditButtons() {

        document
            .querySelectorAll(".edit-doctor-btn")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        const doctorId =
                            button.dataset.id;


                        openEditDoctorModal(
                            doctorId
                        );

                    }
                );

            });

    }


    // ==========================================
    // OPEN EDIT DOCTOR MODAL
    // ==========================================

    function openEditDoctorModal(
        doctorId
    ) {

        const doctor =
            doctors.find(
                (item) =>
                    item._id === doctorId
            );


        if (!doctor) {

            alert(
                "Doctor not found."
            );

            return;

        }


        editingDoctorId =
            doctorId;


        editDoctorName.value =
            doctor.name || "";


        editDoctorSpecialty.value =
            doctor.specialty || "";


        editStartTime.value =
            doctor.startTime || "";


        editEndTime.value =
            doctor.endTime || "";


        document
            .querySelectorAll(".doctor-day")
            .forEach((checkbox) => {

                checkbox.checked =
                    Array.isArray(doctor.days) &&
                    doctor.days.includes(
                        checkbox.value
                    );

            });


        doctorModal.classList.add(
            "show"
        );

    }


    // ==========================================
    // CLOSE EDIT DOCTOR MODAL
    // ==========================================

    function closeEditDoctorModal() {

        if (!doctorModal) {
            return;
        }


        doctorModal.classList.remove(
            "show"
        );


        editingDoctorId =
            null;


        if (editDoctorForm) {

            editDoctorForm.reset();

        }

    }


    // ==========================================
    // SAVE EDITED DOCTOR
    // ==========================================

    async function saveEditedDoctor(
        event
    ) {

        event.preventDefault();


        if (!editingDoctorId) {

            alert(
                "No doctor selected."
            );

            return;

        }


        const days =
            Array.from(
                document.querySelectorAll(
                    ".doctor-day:checked"
                )
            ).map(
                (checkbox) =>
                    checkbox.value
            );


        if (days.length === 0) {

            alert(
                "Please select at least one working day."
            );

            return;

        }


        const updatedDoctor = {

            name:
                editDoctorName.value.trim(),

            specialty:
                editDoctorSpecialty.value.trim(),

            days:
                days,

            startTime:
                editStartTime.value,

            endTime:
                editEndTime.value

        };


        if (
            !updatedDoctor.name ||
            !updatedDoctor.specialty ||
            !updatedDoctor.startTime ||
            !updatedDoctor.endTime
        ) {

            alert(
                "Please complete all doctor fields."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/doctors/${editingDoctorId}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                updatedDoctor
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    `Server returned ${response.status}`
                );

            }


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Failed to update doctor."
                );

            }


            closeEditDoctorModal();

            await loadDoctors();


        } catch (error) {

            console.error(
                "Failed to update doctor:",
                error
            );


            alert(
                "Failed to update doctor.\n\n" +
                error.message
            );

        }

    }


    // ==========================================
    // OPEN ADD DOCTOR MODAL
    // ==========================================

    function openAddDoctorModal() {

        if (!addDoctorModal) {
            return;
        }


        if (addDoctorForm) {

            addDoctorForm.reset();

        }


        addDoctorModal.classList.add(
            "show"
        );

    }


    // ==========================================
    // CLOSE ADD DOCTOR MODAL
    // ==========================================

    function closeAddDoctorModalFunction() {

        if (!addDoctorModal) {
            return;
        }


        addDoctorModal.classList.remove(
            "show"
        );


        if (addDoctorForm) {

            addDoctorForm.reset();

        }

    }


    // ==========================================
    // ADD DOCTOR
    // ==========================================

    async function submitAddDoctor(
        event
    ) {

        event.preventDefault();


        const days =
            Array.from(
                document.querySelectorAll(
                    ".add-doctor-day:checked"
                )
            ).map(
                (checkbox) =>
                    checkbox.value
            );


        if (days.length === 0) {

            alert(
                "Please select at least one working day."
            );

            return;

        }


        const newDoctor = {

            name:
                addDoctorName.value.trim(),

            specialty:
                addDoctorSpecialty.value.trim(),

            days:
                days,

            startTime:
                addStartTime.value,

            endTime:
                addEndTime.value,

            active:
                true

        };


        if (
            !newDoctor.name ||
            !newDoctor.specialty ||
            !newDoctor.startTime ||
            !newDoctor.endTime
        ) {

            alert(
                "Please complete all doctor fields."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    `${API_URL}/api/doctors`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(
                                newDoctor
                            )
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    `Server returned ${response.status}`
                );

            }


            if (!data.success) {

                throw new Error(
                    data.message ||
                    "Failed to add doctor."
                );

            }


            closeAddDoctorModalFunction();

            await loadDoctors();


        } catch (error) {

            console.error(
                "Failed to add doctor:",
                error
            );


            alert(
                "Failed to add doctor.\n\n" +
                error.message
            );

        }

    }


    // ==========================================
    // SEARCH
    // ==========================================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderAppointments
        );

    }


    // ==========================================
    // DOCTOR FILTER
    // ==========================================

    if (doctorFilter) {

        doctorFilter.addEventListener(
            "change",
            renderAppointments
        );

    }


    // ==========================================
    // DATE FILTER
    // ==========================================

    if (dateFilter) {

        dateFilter.addEventListener(
            "change",
            renderAppointments
        );

    }


    // ==========================================
    // REFRESH
    // ==========================================

    if (refreshButton) {

        refreshButton.addEventListener(
            "click",
            async () => {

                const originalText =
                    refreshButton.textContent;


                refreshButton.disabled =
                    true;


                refreshButton.textContent =
                    "Refreshing...";


                try {

                    await loadDoctors();

                    await loadAppointments();

                } finally {

                    refreshButton.disabled =
                        false;

                    refreshButton.textContent =
                        originalText ||
                        "↻ Refresh";

                }

            }
        );

    }


    // ==========================================
    // ADD DOCTOR BUTTON
    // ==========================================

    if (addDoctorButton) {

        addDoctorButton.addEventListener(
            "click",
            openAddDoctorModal
        );

    }


    // ==========================================
    // EDIT DOCTOR FORM
    // ==========================================

    if (editDoctorForm) {

        editDoctorForm.addEventListener(
            "submit",
            saveEditedDoctor
        );

    }


    // ==========================================
    // CLOSE EDIT MODAL
    // ==========================================

    if (closeDoctorModal) {

        closeDoctorModal.addEventListener(
            "click",
            closeEditDoctorModal
        );

    }


    if (cancelDoctorEdit) {

        cancelDoctorEdit.addEventListener(
            "click",
            closeEditDoctorModal
        );

    }


    // ==========================================
    // CLOSE ADD DOCTOR MODAL
    // ==========================================

    if (closeAddDoctorModal) {

        closeAddDoctorModal.addEventListener(
            "click",
            closeAddDoctorModalFunction
        );

    }


    if (cancelAddDoctor) {

        cancelAddDoctor.addEventListener(
            "click",
            closeAddDoctorModalFunction
        );

    }


    // ==========================================
    // ADD DOCTOR FORM
    // ==========================================

    if (addDoctorForm) {

        addDoctorForm.addEventListener(
            "submit",
            submitAddDoctor
        );

    }


    // ==========================================
    // CLOSE MODALS WHEN CLICKING OUTSIDE
    // ==========================================

    if (doctorModal) {

        doctorModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    doctorModal
                ) {

                    closeEditDoctorModal();

                }

            }
        );

    }


    if (addDoctorModal) {

        addDoctorModal.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    addDoctorModal
                ) {

                    closeAddDoctorModalFunction();

                }

            }
        );

    }


    // ==========================================
    // ESC KEY
    // ==========================================

    document.addEventListener(
        "keydown",
        (event) => {

            if (event.key !== "Escape") {
                return;
            }


            closeEditDoctorModal();

            closeAddDoctorModalFunction();

        }
    );


    // ==========================================
    // AUTO REFRESH
    // ==========================================

    setInterval(
        () => {

            console.log(
                "Auto-refreshing appointments..."
            );


            loadAppointments();

        },
        30000
    );


    // ==========================================
    // ESCAPE HTML
    // ==========================================

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }


        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }


    // ==========================================
    // INITIALIZE
    // ==========================================

    async function initializeDashboard() {

        console.log(
            "Initializing CarePoint Admin Dashboard..."
        );


        await Promise.all([
            loadDoctors(),
            loadAppointments()
        ]);


        console.log(
            "CarePoint Admin Dashboard initialized successfully."
        );

    }


    initializeDashboard();

});