/* =========================================================
   CAREPOINT CLINIC
   PATIENT SCRIPT.JS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    console.log("CarePoint Patient JS loaded.");

    /* =====================================================
       API
    ===================================================== */

    const API_URL = "https://carepoint-backend-zu71.onrender.com";


    /* =====================================================
       DOCTOR DATA
    ===================================================== */

    let doctors = [];


    /* =====================================================
       ELEMENTS
    ===================================================== */

    const doctorsGrid =
        document.querySelector(".doctors-grid");

    const doctorSelect =
        document.getElementById("doctor");

    const appointmentDate =
        document.getElementById("appointment-date");

    const appointmentTime =
        document.getElementById("appointment-time");

    const bookingForm =
        document.getElementById("booking-form");

    const appointmentsList =
        document.getElementById("appointments-list");

    const confirmationMessage =
        document.getElementById("confirmation-message");


    /* =====================================================
       LOAD DOCTORS FROM MONGODB
    ===================================================== */

    async function loadDoctors() {

        try {

            console.log("Loading doctors from MongoDB...");

            const response = await fetch(
                `${API_URL}/api/doctors`
            );

            if (!response.ok) {
                throw new Error(
                    `Server returned ${response.status}`
                );
            }

            const data = await response.json();

            if (
                data.success &&
                Array.isArray(data.doctors)
            ) {

                doctors = data.doctors;

                console.log(
                    "Doctors loaded:",
                    doctors.length
                );

                renderDoctors();

                updateDoctorSelect();

                updateTimeOptions();

                return;
            }

            throw new Error(
                "Invalid doctors response from backend."
            );

        } catch (error) {

            console.error(
                "Failed to load doctors from MongoDB:",
                error
            );

            if (doctorsGrid) {

                doctorsGrid.innerHTML = `

                    <div class="error-message">

                        <h3>
                            Unable to load doctors
                        </h3>

                        <p>
                            Please make sure the CarePoint
                            backend is running.
                        </p>

                    </div>

                `;

            }
        }
    }


    /* =====================================================
       RENDER DOCTORS
    ===================================================== */

    function renderDoctors() {

        if (!doctorsGrid) {
            return;
        }

        doctorsGrid.innerHTML = "";

        const activeDoctors =
            doctors.filter(
                doctor =>
                    doctor.active !== false
            );


        if (activeDoctors.length === 0) {

            doctorsGrid.innerHTML = `

                <div class="no-doctors">

                    <p>
                        No doctors are currently available.
                    </p>

                </div>

            `;

            return;
        }


        activeDoctors.forEach(function (doctor) {

            const card =
                document.createElement("div");

            card.className =
                "doctor-card";


            const icon =
                doctor.name
                    .toLowerCase()
                    .includes("michael")
                    ? "👨‍⚕️"
                    : "👩‍⚕️";


            const doctorId =
                doctor._id ||
                doctor.id ||
                "";


            card.innerHTML = `

                <div class="doctor-icon">
                    ${icon}
                </div>


                <div class="doctor-info">

                    <h3>
                        ${escapeHTML(
                            doctor.name
                        )}
                    </h3>


                    <p class="doctor-specialty">
                        ${escapeHTML(
                            doctor.specialty
                        )}
                    </p>


                    <div class="doctor-details">

                        <p>
                            📅
                            ${escapeHTML(
                                Array.isArray(doctor.days)
                                    ? doctor.days.join(", ")
                                    : ""
                            )}
                        </p>


                        <p>
                            🕐
                            ${escapeHTML(
                                doctor.startTime
                            )}
                            -
                            ${escapeHTML(
                                doctor.endTime
                            )}
                        </p>

                    </div>

                </div>


                <a
                    href="#booking"
                    class="doctor-button"
                    data-doctor="${escapeHTML(
                        doctor.name
                    )}"
                    data-doctor-id="${escapeHTML(
                        doctorId
                    )}"
                >
                    Book with Doctor
                </a>

            `;


            doctorsGrid.appendChild(card);

        });


        attachDoctorButtons();

    }


    /* =====================================================
       UPDATE DOCTOR SELECT
    ===================================================== */

    function updateDoctorSelect() {

        if (!doctorSelect) {
            return;
        }


        const currentValue =
            doctorSelect.value;


        doctorSelect.innerHTML = `

            <option value="">
                Select a doctor
            </option>

        `;


        doctors
            .filter(
                doctor =>
                    doctor.active !== false
            )
            .forEach(function (doctor) {

                const option =
                    document.createElement("option");


                option.value =
                    doctor.name;


                option.textContent =
                    doctor.name;


                doctorSelect.appendChild(
                    option
                );

            });


        if (
            doctors.some(
                doctor =>
                    doctor.name === currentValue &&
                    doctor.active !== false
            )
        ) {

            doctorSelect.value =
                currentValue;

        }

    }


    /* =====================================================
       DOCTOR BUTTONS
    ===================================================== */

    function attachDoctorButtons() {

        const buttons =
            document.querySelectorAll(
                ".doctor-button"
            );


        buttons.forEach(function (button) {

            button.addEventListener(
                "click",
                function () {

                    const doctorName =
                        button.dataset.doctor;


                    if (doctorSelect) {

                        doctorSelect.value =
                            doctorName;

                        updateTimeOptions();

                    }

                }
            );

        });

    }


    /* =====================================================
       GET SELECTED DOCTOR
    ===================================================== */

    function getSelectedDoctor() {

        const name =
            doctorSelect
                ? doctorSelect.value
                : "";


        return doctors.find(
            doctor =>
                doctor.name === name
        );

    }


    /* =====================================================
       DATE HELPERS
    ===================================================== */

    function getDayName(dateString) {

        if (!dateString) {
            return "";
        }


        const date =
            new Date(
                dateString + "T00:00:00"
            );


        return date.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );

    }


    /* =====================================================
       GENERATE TIME SLOTS
    ===================================================== */

    function generateTimeSlots(
        startTime,
        endTime
    ) {

        const slots = [];


        if (
            !startTime ||
            !endTime
        ) {

            return slots;

        }


        const [
            startHour,
            startMinute
        ] =
            startTime
                .split(":")
                .map(Number);


        const [
            endHour,
            endMinute
        ] =
            endTime
                .split(":")
                .map(Number);


        let currentMinutes =
            startHour * 60 +
            startMinute;


        const endMinutes =
            endHour * 60 +
            endMinute;


        while (
            currentMinutes <
            endMinutes
        ) {

            const hour =
                Math.floor(
                    currentMinutes / 60
                );


            const minute =
                currentMinutes % 60;


            const formattedHour =
                String(hour)
                    .padStart(2, "0");


            const formattedMinute =
                String(minute)
                    .padStart(2, "0");


            slots.push(
                `${formattedHour}:${formattedMinute}`
            );


            currentMinutes += 30;

        }


        return slots;

    }


    /* =====================================================
       UPDATE TIME OPTIONS
    ===================================================== */

    function updateTimeOptions() {

        if (!appointmentTime) {
            return;
        }


        appointmentTime.innerHTML = "";


        const doctor =
            getSelectedDoctor();


        if (!doctor) {

            appointmentTime.innerHTML = `

                <option value="">
                    Select a doctor first
                </option>

            `;

            return;

        }


        if (
            !appointmentDate ||
            !appointmentDate.value
        ) {

            appointmentTime.innerHTML = `

                <option value="">
                    Select a date first
                </option>

            `;

            return;

        }


        const selectedDay =
            getDayName(
                appointmentDate.value
            );


        if (
            !Array.isArray(doctor.days) ||
            !doctor.days.includes(selectedDay)
        ) {

            appointmentTime.innerHTML = `

                <option value="">
                    Doctor is not available on
                    ${escapeHTML(selectedDay)}
                </option>

            `;

            return;

        }


        const slots =
            generateTimeSlots(
                doctor.startTime,
                doctor.endTime
            );


        if (slots.length === 0) {

            appointmentTime.innerHTML = `

                <option value="">
                    No available times
                </option>

            `;

            return;

        }


        appointmentTime.innerHTML = `

            <option value="">
                Select appointment time
            </option>

        `;


        slots.forEach(function (time) {

            const option =
                document.createElement("option");


            option.value =
                time;


            option.textContent =
                formatTime(time);


            appointmentTime.appendChild(
                option
            );

        });

    }


    /* =====================================================
       FORMAT TIME
    ===================================================== */

    function formatTime(time) {

        if (!time) {
            return "";
        }


        const [
            hourString,
            minute
        ] =
            time.split(":");


        let hour =
            Number(hourString);


        const period =
            hour >= 12
                ? "PM"
                : "AM";


        hour =
            hour % 12 || 12;


        return (
            hour +
            ":" +
            minute +
            " " +
            period
        );

    }


    /* =====================================================
       DATE MINIMUM
    ===================================================== */

    if (appointmentDate) {

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


        appointmentDate.min =
            `${year}-${month}-${day}`;

    }


    /* =====================================================
       DOCTOR CHANGE
    ===================================================== */

    if (doctorSelect) {

        doctorSelect.addEventListener(
            "change",
            function () {

                updateTimeOptions();

            }
        );

    }


    /* =====================================================
       DATE CHANGE
    ===================================================== */

    if (appointmentDate) {

        appointmentDate.addEventListener(
            "change",
            function () {

                updateTimeOptions();

            }
        );

    }


    /* =====================================================
       BOOK APPOINTMENT
       SAVE DIRECTLY TO MONGODB
    ===================================================== */

    if (bookingForm) {

        bookingForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const patientName =
                    document.getElementById(
                        "patient-name"
                    )
                        ? document.getElementById(
                            "patient-name"
                        ).value.trim()
                        : "";


                const doctor =
                    doctorSelect
                        ? doctorSelect.value
                        : "";


                const date =
                    appointmentDate
                        ? appointmentDate.value
                        : "";


                const time =
                    appointmentTime
                        ? appointmentTime.value
                        : "";


                const reasonElement =
                    document.getElementById(
                        "reason"
                    );


                const reason =
                    reasonElement
                        ? reasonElement.value.trim()
                        : "";


                /* =========================================
                   VALIDATION
                ========================================= */

                if (!patientName) {

                    alert(
                        "Please enter your full name."
                    );

                    return;

                }


                if (!doctor) {

                    alert(
                        "Please select a doctor."
                    );

                    return;

                }


                if (!date) {

                    alert(
                        "Please select an appointment date."
                    );

                    return;

                }


                if (!time) {

                    alert(
                        "Please select an appointment time."
                    );

                    return;

                }


                if (!reason) {

                    alert(
                        "Please enter the reason for your visit."
                    );

                    return;

                }


                const selectedDoctor =
                    doctors.find(
                        item =>
                            item.name === doctor
                    );


                if (!selectedDoctor) {

                    alert(
                        "The selected doctor could not be found."
                    );

                    return;

                }


                const selectedDay =
                    getDayName(date);


                if (
                    !Array.isArray(
                        selectedDoctor.days
                    ) ||
                    !selectedDoctor.days.includes(
                        selectedDay
                    )
                ) {

                    alert(
                        `${doctor} is not available on ${selectedDay}.`
                    );

                    return;

                }


                /* =========================================
                   DISABLE BUTTON WHILE BOOKING
                ========================================= */

                const submitButton =
                    bookingForm.querySelector(
                        'button[type="submit"]'
                    );


                const originalButtonText =
                    submitButton
                        ? submitButton.textContent
                        : "";


                if (submitButton) {

                    submitButton.disabled =
                        true;

                    submitButton.textContent =
                        "Booking...";

                }


                try {

                    console.log(
                        "Sending appointment to MongoDB..."
                    );


                    const response =
                        await fetch(
                            `${API_URL}/api/appointments`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({

                                        patientName:
                                            patientName,

                                        doctor:
                                            doctor,

                                        date:
                                            date,

                                        time:
                                            time,

                                        reason:
                                            reason

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


                    if (
                        !data.success ||
                        !data.appointment
                    ) {

                        throw new Error(
                            "Invalid appointment response."
                        );

                    }


                    console.log(
                        "Appointment saved to MongoDB:",
                        data.appointment
                    );


                    /* =====================================
                       SUCCESS MESSAGE
                    ===================================== */

                    if (confirmationMessage) {

                        confirmationMessage.innerHTML = `

                            <div class="success-message">

                                <h3>
                                    Appointment Booked Successfully! ✅
                                </h3>

                                <p>
                                    Your appointment with
                                    <strong>
                                        ${escapeHTML(
                                            doctor
                                        )}
                                    </strong>
                                    has been submitted.
                                </p>

                                <p>
                                    Date:
                                    <strong>
                                        ${escapeHTML(
                                            date
                                        )}
                                    </strong>
                                </p>

                                <p>
                                    Time:
                                    <strong>
                                        ${escapeHTML(
                                            formatTime(time)
                                        )}
                                    </strong>
                                </p>

                                <p>
                                    Status:
                                    <strong>
                                        Pending
                                    </strong>
                                </p>

                            </div>

                        `;

                    }


                    /* =====================================
                       RESET FORM
                    ===================================== */

                    bookingForm.reset();


                    if (appointmentTime) {

                        appointmentTime.innerHTML = `

                            <option value="">
                                Select a doctor first
                            </option>

                        `;

                    }


                    /* =====================================
                       RELOAD APPOINTMENTS FROM MONGODB
                    ===================================== */

                    await loadAppointmentsFromMongoDB();


                    /* =====================================
                       SCROLL TO APPOINTMENTS
                    ===================================== */

                    const appointmentsSection =
                        document.getElementById(
                            "appointments"
                        );


                    if (
                        appointmentsSection
                    ) {

                        appointmentsSection.scrollIntoView({
                            behavior: "smooth"
                        });

                    }


                } catch (error) {

                    console.error(
                        "Failed to book appointment:",
                        error
                    );


                    alert(
                        "Failed to book appointment. " +
                        "Please make sure the CarePoint backend is running."
                    );

                } finally {

                    if (submitButton) {

                        submitButton.disabled =
                            false;

                        submitButton.textContent =
                            originalButtonText ||
                            "Book Appointment";

                    }

                }

            }
        );

    }


    /* =====================================================
       LOAD APPOINTMENTS FROM MONGODB
    ===================================================== */

    async function loadAppointmentsFromMongoDB() {

        if (!appointmentsList) {
            return;
        }


        try {

            console.log(
                "Loading appointments from MongoDB..."
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
                !Array.isArray(
                    data.appointments
                )
            ) {

                throw new Error(
                    "Invalid appointments response."
                );

            }


            console.log(
                "Appointments loaded:",
                data.appointments
            );


            renderAppointments(
                data.appointments
            );


        } catch (error) {

            console.error(
                "Failed to load appointments:",
                error
            );


            appointmentsList.innerHTML = `

                <p id="no-appointments">

                    Unable to load appointments.
                    Please make sure the backend is running.

                </p>

            `;

        }

    }


    /* =====================================================
       RENDER APPOINTMENTS
    ===================================================== */

    function renderAppointments(
        appointments
    ) {

        if (!appointmentsList) {
            return;
        }


        appointmentsList.innerHTML = "";


        if (
            !appointments ||
            appointments.length === 0
        ) {

            appointmentsList.innerHTML = `

                <p id="no-appointments">
                    No appointments booked yet.
                </p>

            `;

            return;

        }


        appointments
            .slice()
            .reverse()
            .forEach(function (appointment) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "appointment-card";


                const status =
                    appointment.status ||
                    "Pending";


                card.innerHTML = `

                    <div>

                        <h3>
                            ${escapeHTML(
                                appointment.doctor
                            )}
                        </h3>


                        <p>
                            👤
                            ${escapeHTML(
                                appointment.patientName ||
                                ""
                            )}
                        </p>


                        <p>
                            📅
                            ${escapeHTML(
                                appointment.date ||
                                ""
                            )}
                        </p>


                        <p>
                            🕐
                            ${escapeHTML(
                                formatTime(
                                    appointment.time
                                )
                            )}
                        </p>


                        <p>
                            📝
                            ${escapeHTML(
                                appointment.reason ||
                                ""
                            )}
                        </p>

                    </div>


                    <span class="status-badge">

                        ${escapeHTML(
                            status
                        )}

                    </span>

                `;


                appointmentsList.appendChild(
                    card
                );

            });

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

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


    /* =====================================================
       INITIALIZE
    ===================================================== */

    loadDoctors();

    loadAppointmentsFromMongoDB();


    console.log(
        "CarePoint Patient Dashboard initialized successfully."
    );

});