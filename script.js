// ==========================================
// CAREPOINT CLINIC
// COMPLETE JAVASCRIPT
// ==========================================


// ==========================================
// DOCTOR DATA
// ==========================================

const doctors = [
    {
        name: "Dr. Sarah Johnson",
        specialty: "General Physician",
        availableDays: ["Monday", "Wednesday", "Friday"],
        startTime: "09:00",
        endTime: "15:00"
    },

    {
        name: "Dr. Michael Brown",
        specialty: "Cardiologist",
        availableDays: ["Tuesday", "Thursday"],
        startTime: "10:00",
        endTime: "16:00"
    },

    {
        name: "Dr. Emily Williams",
        specialty: "Pediatrician",
        availableDays: ["Monday", "Tuesday", "Thursday"],
        startTime: "08:00",
        endTime: "14:00"
    }
];


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const bookingForm =
    document.getElementById("booking-form");

const patientNameInput =
    document.getElementById("patient-name");

const doctorSelect =
    document.getElementById("doctor");

const dateInput =
    document.getElementById("appointment-date");

const timeSelect =
    document.getElementById("appointment-time");

const reasonInput =
    document.getElementById("reason");

const appointmentsList =
    document.getElementById("appointments-list");

const confirmationMessage =
    document.getElementById("confirmation-message");


// Error messages

const nameError =
    document.getElementById("name-error");

const doctorError =
    document.getElementById("doctor-error");

const dateError =
    document.getElementById("date-error");

const timeError =
    document.getElementById("time-error");


// Doctor card buttons

const doctorButtons =
    document.querySelectorAll(".doctor-button");


// ==========================================
// APPOINTMENTS DATA
// ==========================================

let appointments = [];


// ==========================================
// TODAY'S DATE
// ==========================================

const today =
    new Date().toISOString().split("T")[0];

dateInput.min = today;


// ==========================================
// LOAD APPOINTMENTS FROM LOCAL STORAGE
// ==========================================

const savedAppointments =
    localStorage.getItem("appointments");

if (savedAppointments) {

    appointments =
        JSON.parse(savedAppointments);

    appointments.forEach(function (appointment) {

        displayAppointment(appointment);

    });
}


// ==========================================
// GENERATE AVAILABLE TIME SLOTS
// ==========================================

function generateTimeSlots(
    startTime,
    endTime,
    doctorName,
    selectedDate
) {

    timeSelect.innerHTML = `
        <option value="">
            Select a time
        </option>
    `;


    const startParts =
        startTime.split(":").map(Number);

    const endParts =
        endTime.split(":").map(Number);


    let currentMinutes =
        startParts[0] * 60 + startParts[1];

    const endingMinutes =
        endParts[0] * 60 + endParts[1];


    let availableSlots = 0;


    while (currentMinutes < endingMinutes) {

        const hour =
            Math.floor(currentMinutes / 60);

        const minute =
            currentMinutes % 60;


        const formattedHour =
            String(hour).padStart(2, "0");

        const formattedMinute =
            String(minute).padStart(2, "0");


        const time =
            `${formattedHour}:${formattedMinute}`;


        const alreadyBooked =
            appointments.some(function (appointment) {

                return (
                    appointment.doctor === doctorName &&
                    appointment.date === selectedDate &&
                    appointment.time === time
                );

            });


        if (!alreadyBooked) {

            const option =
                document.createElement("option");

            option.value = time;

            option.textContent = time;

            timeSelect.appendChild(option);

            availableSlots++;

        }


        currentMinutes += 30;

    }


    if (availableSlots === 0) {

        timeSelect.innerHTML = `
            <option value="">
                No available times
            </option>
        `;

    }

}


// ==========================================
// CHECK DOCTOR AVAILABILITY
// ==========================================

function updateTimeSlots() {

    const selectedDoctor =
        doctors.find(function (doctor) {

            return doctor.name ===
                doctorSelect.value;

        });


    if (!selectedDoctor) {

        timeSelect.innerHTML = `
            <option value="">
                Select a doctor first
            </option>
        `;

        return;
    }


    if (!dateInput.value) {

        timeSelect.innerHTML = `
            <option value="">
                Select a date first
            </option>
        `;

        return;
    }


    const selectedDate =
        new Date(
            dateInput.value + "T00:00:00"
        );


    const dayName =
        selectedDate.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );


    if (
        !selectedDoctor.availableDays.includes(
            dayName
        )
    ) {

        timeSelect.innerHTML = `
            <option value="">
                Doctor unavailable on ${dayName}
            </option>
        `;

        return;
    }


    generateTimeSlots(
        selectedDoctor.startTime,
        selectedDoctor.endTime,
        selectedDoctor.name,
        dateInput.value
    );

}


// ==========================================
// DOCTOR SELECT CHANGE
// ==========================================

doctorSelect.addEventListener(
    "change",
    function () {

        doctorError.textContent = "";

        doctorSelect.classList.remove(
            "input-error"
        );

        doctorSelect.classList.add(
            "input-success"
        );


        updateTimeSlots();

    }
);


// ==========================================
// DATE CHANGE
// ==========================================

dateInput.addEventListener(
    "change",
    function () {

        dateError.textContent = "";

        dateInput.classList.remove(
            "input-error"
        );


        if (!dateInput.value) {

            dateError.textContent =
                "Please select a date.";

            dateInput.classList.add(
                "input-error"
            );

            return;
        }


        if (dateInput.value < today) {

            dateError.textContent =
                "Please select a future date.";

            dateInput.classList.add(
                "input-error"
            );

            return;
        }


        dateInput.classList.add(
            "input-success"
        );


        updateTimeSlots();

    }
);


// ==========================================
// TIME CHANGE
// ==========================================

timeSelect.addEventListener(
    "change",
    function () {

        if (!timeSelect.value) {

            timeError.textContent =
                "Please select an available time.";

            timeSelect.classList.add(
                "input-error"
            );

            timeSelect.classList.remove(
                "input-success"
            );

            return;
        }


        timeError.textContent = "";

        timeSelect.classList.remove(
            "input-error"
        );

        timeSelect.classList.add(
            "input-success"
        );

    }
);


// ==========================================
// NAME VALIDATION
// ==========================================

patientNameInput.addEventListener(
    "input",
    function () {

        const name =
            patientNameInput.value.trim();


        if (name.length === 0) {

            nameError.textContent =
                "Please enter your name.";

            patientNameInput.classList.add(
                "input-error"
            );

            patientNameInput.classList.remove(
                "input-success"
            );

            return;
        }


        if (name.length < 3) {

            nameError.textContent =
                "Name must be at least 3 characters.";

            patientNameInput.classList.add(
                "input-error"
            );

            patientNameInput.classList.remove(
                "input-success"
            );

            return;
        }


        nameError.textContent = "";

        patientNameInput.classList.remove(
            "input-error"
        );

        patientNameInput.classList.add(
            "input-success"
        );

    }
);


// ==========================================
// DOCTOR CARD BUTTONS
// ==========================================

doctorButtons.forEach(function (button) {

    button.addEventListener(
        "click",
        function () {

            const selectedDoctor =
                button.getAttribute(
                    "data-doctor"
                );


            doctorSelect.value =
                selectedDoctor;


            doctorSelect.dispatchEvent(
                new Event("change")
            );

        }
    );

});


// ==========================================
// BOOK APPOINTMENT
// ==========================================

bookingForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const patientName =
            patientNameInput.value.trim();

        const doctor =
            doctorSelect.value;

        const date =
            dateInput.value;

        const time =
            timeSelect.value;

        const reason =
            reasonInput.value.trim();


        // ------------------------------
        // VALIDATE NAME
        // ------------------------------

        if (patientName.length < 3) {

            nameError.textContent =
                "Please enter at least 3 characters.";

            patientNameInput.classList.add(
                "input-error"
            );

            patientNameInput.focus();

            return;
        }


        // ------------------------------
        // VALIDATE DOCTOR
        // ------------------------------

        if (!doctor) {

            doctorError.textContent =
                "Please select a doctor.";

            doctorSelect.classList.add(
                "input-error"
            );

            doctorSelect.focus();

            return;
        }


        // ------------------------------
        // VALIDATE DATE
        // ------------------------------

        if (!date) {

            dateError.textContent =
                "Please select a date.";

            dateInput.classList.add(
                "input-error"
            );

            dateInput.focus();

            return;
        }


        if (date < today) {

            dateError.textContent =
                "Please select a future date.";

            dateInput.classList.add(
                "input-error"
            );

            dateInput.focus();

            return;
        }


        // ------------------------------
        // VALIDATE TIME
        // ------------------------------

        if (!time) {

            timeError.textContent =
                "Please select an available time.";

            timeSelect.classList.add(
                "input-error"
            );

            timeSelect.focus();

            return;
        }


        // ------------------------------
        // VALIDATE REASON
        // ------------------------------

        if (!reason) {

            alert(
                "Please enter the reason for your visit."
            );

            reasonInput.focus();

            return;
        }


        // ------------------------------
        // FIND DOCTOR
        // ------------------------------

        const selectedDoctor =
            doctors.find(function (item) {

                return item.name === doctor;

            });


        if (!selectedDoctor) {

            alert(
                "Please select a valid doctor."
            );

            return;
        }


        // ------------------------------
        // CHECK WORKING DAY
        // ------------------------------

        const selectedDate =
            new Date(
                date + "T00:00:00"
            );


        const dayName =
            selectedDate.toLocaleDateString(
                "en-US",
                {
                    weekday: "long"
                }
            );


        if (
            !selectedDoctor.availableDays.includes(
                dayName
            )
        ) {

            alert(
                `${doctor} is not available on ${dayName}.`
            );

            return;
        }


        // ------------------------------
        // CHECK DOUBLE BOOKING
        // ------------------------------

        const alreadyBooked =
            appointments.some(function (appointment) {

                return (
                    appointment.doctor === doctor &&
                    appointment.date === date &&
                    appointment.time === time
                );

            });


        if (alreadyBooked) {

            alert(
                "This appointment slot has already been booked."
            );

            updateTimeSlots();

            return;
        }


        // ------------------------------
        // CREATE APPOINTMENT
        // ------------------------------

        const appointment = {

            id: Date.now(),

            patientName: patientName,

            doctor: doctor,

            date: date,

            time: time,

            reason: reason

        };


        // ------------------------------
        // SAVE APPOINTMENT
        // ------------------------------

        appointments.push(
            appointment
        );


        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );


        // ------------------------------
        // DISPLAY APPOINTMENT
        // ------------------------------

        displayAppointment(
            appointment
        );


        // ------------------------------
        // CONFIRMATION
        // ------------------------------

        if (confirmationMessage) {

            confirmationMessage.innerHTML = `

                <h3>
                    ✓ Appointment Confirmed
                </h3>

                <p>
                    <strong>Patient:</strong>
                    ${patientName}
                </p>

                <p>
                    <strong>Doctor:</strong>
                    ${doctor}
                </p>

                <p>
                    <strong>Date:</strong>
                    ${date}
                </p>

                <p>
                    <strong>Time:</strong>
                    ${time}
                </p>

                <p>
                    <strong>Reason:</strong>
                    ${reason}
                </p>

                <p>
                    Your appointment has been
                    successfully booked.
                </p>

            `;

            confirmationMessage.classList.add(
                "show"
            );

            confirmationMessage.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }


        // ------------------------------
        // UPDATE TIME SLOTS
        // ------------------------------

        updateTimeSlots();


        // ------------------------------
        // CLEAR FORM
        // ------------------------------

        patientNameInput.value = "";

        reasonInput.value = "";

        patientNameInput.classList.remove(
            "input-success"
        );

        timeSelect.classList.remove(
            "input-success"
        );

        nameError.textContent = "";

        timeError.textContent = "";

    }
);


// ==========================================
// DISPLAY APPOINTMENT
// ==========================================

function displayAppointment(
    appointment
) {

    if (!appointmentsList) {
        return;
    }


    const noAppointments =
        document.getElementById(
            "no-appointments"
        );


    if (noAppointments) {

        noAppointments.remove();

    }


    const appointmentCard =
        document.createElement("div");


    appointmentCard.className =
        "appointment-card";


    appointmentCard.innerHTML = `

        <span class="appointment-status">
            Confirmed
        </span>

        <h3>
            ${appointment.patientName}
        </h3>

        <p>
            <strong>Doctor:</strong>
            ${appointment.doctor}
        </p>

        <p>
            <strong>Date:</strong>
            ${appointment.date}
        </p>

        <p>
            <strong>Time:</strong>
            ${appointment.time}
        </p>

        <p>
            <strong>Reason:</strong>
            ${appointment.reason}
        </p>

        <button
            class="edit-btn"
            type="button"
        >
            Edit Appointment
        </button>

        <button
            class="cancel-btn"
            type="button"
        >
            Cancel Appointment
        </button>

    `;


    // ======================================
    // EDIT
    // ======================================

    const editButton =
        appointmentCard.querySelector(
            ".edit-btn"
        );


    editButton.addEventListener(
        "click",
        function () {

            patientNameInput.value =
                appointment.patientName;


            doctorSelect.value =
                appointment.doctor;


            dateInput.value =
                appointment.date;


            updateTimeSlots();


            timeSelect.value =
                appointment.time;


            reasonInput.value =
                appointment.reason;


            appointments =
                appointments.filter(
                    function (item) {

                        return item.id !==
                            appointment.id;

                    }
                );


            localStorage.setItem(
                "appointments",
                JSON.stringify(appointments)
            );


            appointmentCard.remove();


            document
                .getElementById("booking")
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


    // ======================================
    // CANCEL
    // ======================================

    const cancelButton =
        appointmentCard.querySelector(
            ".cancel-btn"
        );


    cancelButton.addEventListener(
        "click",
        function () {

            const confirmed =
                confirm(
                    "Are you sure you want to cancel this appointment?"
                );


            if (!confirmed) {
                return;
            }


            appointments =
                appointments.filter(
                    function (item) {

                        return item.id !==
                            appointment.id;

                    }
                );


            localStorage.setItem(
                "appointments",
                JSON.stringify(appointments)
            );


            appointmentCard.remove();


            if (
                appointments.length === 0
            ) {

                appointmentsList.innerHTML = `

                    <p id="no-appointments">
                        No appointments booked yet.
                    </p>

                `;

            }


            updateTimeSlots();

        }
    );


    appointmentsList.appendChild(
        appointmentCard
    );

}