// ==========================================
// CAREPOINT CLINIC
// PATIENT BOOKING SYSTEM
// ==========================================


// ==========================================
// GET ELEMENTS
// ==========================================

const bookingForm =
    document.getElementById("booking-form");

const patientNameInput =
    document.getElementById("patient-name");

const doctorSelect =
    document.getElementById("doctor");

const appointmentDate =
    document.getElementById("appointment-date");

const appointmentTime =
    document.getElementById("appointment-time");

const reasonInput =
    document.getElementById("reason");

const appointmentsList =
    document.getElementById("appointments-list");

const noAppointments =
    document.getElementById("no-appointments");

const confirmationMessage =
    document.getElementById(
        "confirmation-message"
    );


// Error messages

const nameError =
    document.getElementById("name-error");

const doctorError =
    document.getElementById("doctor-error");

const dateError =
    document.getElementById("date-error");

const timeError =
    document.getElementById("time-error");


// ==========================================
// DOCTOR SCHEDULES
// ==========================================

const doctorSchedules = {

    "Dr. Sarah Johnson": {

        days: [1, 3, 5],

        startHour: 9,

        endHour: 15

    },


    "Dr. Michael Brown": {

        days: [2, 4],

        startHour: 10,

        endHour: 16

    },


    "Dr. Emily Williams": {

        days: [1, 2, 4],

        startHour: 8,

        endHour: 14

    }

};


// ==========================================
// GET APPOINTMENTS
// ==========================================

function getAppointments() {

    const saved =
        localStorage.getItem(
            "appointments"
        );


    if (!saved) {

        return [];

    }


    try {

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "Error reading appointments:",
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
// GENERATE TIME SLOTS
// ==========================================

function generateTimeSlots() {

    const doctor =
        doctorSelect.value;

    const date =
        appointmentDate.value;


    appointmentTime.innerHTML = "";


    if (!doctor) {

        appointmentTime.innerHTML = `
            <option value="">
                Select a doctor first
            </option>
        `;

        return;

    }


    if (!date) {

        appointmentTime.innerHTML = `
            <option value="">
                Select a date first
            </option>
        `;

        return;

    }


    const selectedDate =
        new Date(
            date + "T00:00:00"
        );


    const day =
        selectedDate.getDay();


    const schedule =
        doctorSchedules[doctor];


    if (
        !schedule.days.includes(day)
    ) {

        appointmentTime.innerHTML = `
            <option value="">
                Doctor unavailable on this day
            </option>
        `;

        return;

    }


    const appointments =
        getAppointments();


    let slotCreated = false;


    for (
        let hour = schedule.startHour;
        hour < schedule.endHour;
        hour++
    ) {

        for (
            let minute = 0;
            minute < 60;
            minute += 30
        ) {

            const formattedHour =
                String(hour)
                    .padStart(2, "0");


            const formattedMinute =
                String(minute)
                    .padStart(2, "0");


            const time =
                `${formattedHour}:${formattedMinute}`;


            const alreadyBooked =
                appointments.some(
                    function (appointment) {

                        return (
                            appointment.doctor === doctor
                            &&
                            appointment.date === date
                            &&
                            appointment.time === time
                            &&
                            appointment.status !== "Cancelled"
                        );

                    }
                );


            if (!alreadyBooked) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    time;

                option.textContent =
                    time;

                appointmentTime.appendChild(
                    option
                );

                slotCreated = true;

            }

        }

    }


    if (!slotCreated) {

        appointmentTime.innerHTML = `
            <option value="">
                No available times
            </option>
        `;

    }

}


// ==========================================
// DOCTOR CHANGE
// ==========================================

doctorSelect.addEventListener(
    "change",
    function () {

        generateTimeSlots();

    }
);


// ==========================================
// DATE CHANGE
// ==========================================

appointmentDate.addEventListener(
    "change",
    function () {

        generateTimeSlots();

    }
);


// ==========================================
// SET MINIMUM DATE
// ==========================================

function setMinimumDate() {

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


    const formattedDate =
        `${year}-${month}-${day}`;


    appointmentDate.min =
        formattedDate;

}


setMinimumDate();


// ==========================================
// BOOK APPOINTMENT
// ==========================================

bookingForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        // Clear errors

        nameError.textContent = "";

        doctorError.textContent = "";

        dateError.textContent = "";

        timeError.textContent = "";


        let valid = true;


        // NAME

        const patientName =
            patientNameInput.value.trim();


        if (patientName.length < 2) {

            nameError.textContent =
                "Please enter your full name.";

            valid = false;

        }


        // DOCTOR

        const doctor =
            doctorSelect.value;


        if (!doctor) {

            doctorError.textContent =
                "Please select a doctor.";

            valid = false;

        }


        // DATE

        const date =
            appointmentDate.value;


        if (!date) {

            dateError.textContent =
                "Please select an appointment date.";

            valid = false;

        }


        // TIME

        const time =
            appointmentTime.value;


        if (!time) {

            timeError.textContent =
                "Please select an appointment time.";

            valid = false;

        }


        if (!valid) {

            return;

        }


        // REASON

        const reason =
            reasonInput.value.trim();


        if (!reason) {

            alert(
                "Please enter the reason for your visit."
            );

            return;

        }


        // GET EXISTING APPOINTMENTS

        const appointments =
            getAppointments();


        // CREATE APPOINTMENT

        const appointment = {

            id: Date.now(),

            patientName: patientName,

            doctor: doctor,

            date: date,

            time: time,

            reason: reason,

            status: "Pending"

        };


        // SAVE

        appointments.push(
            appointment
        );


        saveAppointments(
            appointments
        );


        // CONFIRMATION

        confirmationMessage.innerHTML = `

            <div class="success-message">

                <h3>
                    Appointment Booked Successfully!
                </h3>

                <p>
                    Your appointment with
                    <strong>${doctor}</strong>
                    has been submitted.
                </p>

                <p>
                    Date: <strong>${date}</strong>
                </p>

                <p>
                    Time: <strong>${time}</strong>
                </p>

                <p>
                    Status:
                    <strong>Pending</strong>
                </p>

            </div>

        `;


        // RESET FORM

        bookingForm.reset();


        appointmentTime.innerHTML = `
            <option value="">
                Select a doctor first
            </option>
        `;


        // UPDATE LIST

        displayAppointments();


        // SCROLL

        document
            .getElementById("appointments")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


// ==========================================
// DISPLAY APPOINTMENTS
// ==========================================

function displayAppointments() {

    const appointments =
        getAppointments();


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

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "appointment-card";


            // STATUS

            let statusClass =
                "appointment-pending";

            let statusIcon =
                "🟡";


            if (
                appointment.status ===
                "Confirmed"
            ) {

                statusClass =
                    "appointment-confirmed";

                statusIcon =
                    "🟢";

            }


            if (
                appointment.status ===
                "Cancelled"
            ) {

                statusClass =
                    "appointment-cancelled";

                statusIcon =
                    "🔴";

            }


            card.innerHTML = `

                <div class="appointment-header">

                    <h3>
                        ${appointment.doctor}
                    </h3>

                    <span
                        class="${statusClass}"
                    >
                        ${statusIcon}
                        ${appointment.status}
                    </span>

                </div>


                <div class="appointment-details">

                    <p>
                        📅
                        <strong>Date:</strong>
                        ${appointment.date}
                    </p>

                    <p>
                        🕐
                        <strong>Time:</strong>
                        ${appointment.time}
                    </p>

                    <p>
                        📝
                        <strong>Reason:</strong>
                        ${appointment.reason}
                    </p>

                </div>


                ${
                    appointment.status !==
                    "Cancelled"

                    ?

                    `
                    <button
                        class="cancel-appointment"
                        data-id="${appointment.id}"
                    >
                        Cancel Appointment
                    </button>
                    `

                    :

                    ""
                }

            `;


            appointmentsList.appendChild(
                card
            );

        }
    );

}


// ==========================================
// CANCEL APPOINTMENT
// ==========================================

appointmentsList.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.classList.contains(
                "cancel-appointment"
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
                "Are you sure you want to cancel this appointment?"
            );


        if (!confirmed) {

            return;

        }


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
            "Cancelled";


        saveAppointments(
            appointments
        );


        displayAppointments();

        generateTimeSlots();

    }
);


// ==========================================
// INITIAL DISPLAY
// ==========================================

displayAppointments();// ==========================================
// BOOK WITH DOCTOR BUTTONS
// ==========================================

const doctorButtons =
    document.querySelectorAll(".doctor-button");


doctorButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const selectedDoctor =
                    button.getAttribute(
                        "data-doctor"
                    );


                // Select the doctor
                doctorSelect.value =
                    selectedDoctor;


                // Generate available times
                generateTimeSlots();


                // Scroll to booking form
                document
                    .getElementById("booking")
                    .scrollIntoView({
                        behavior: "smooth"
                    });

            }
        );

    }
);