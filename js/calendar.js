document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');
    let modal = document.getElementById('eventModal');
    let closeModal = document.querySelector('.close');
    let cancelButton = document.querySelector('.cancel-button');
    let eventForm = document.getElementById('eventForm');

    // Initialize the calendar
    let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        height: '100%',
        selectable: true,
        select: function (info) {
            // Open modal and set start/end values
            document.getElementById('eventStart').value = info.startStr;
            document.getElementById('eventEnd').value = info.endStr;
            console.log(info.startStr)
            document.getElementById('booking-start-time').textContent = "Event Start Date/Time: " + " " +  info.startStr
            document.getElementById('booking-end-time').textContent = "Event End Date/Time: " + " " +  info.endStr
            modal.style.display = 'block';
        }
    });

    calendar.render();

    // Close modal logic
    closeModal.onclick = function () {
        modal.style.display = 'none';
    };

    cancelButton.onclick = function () {
        modal.style.display = 'none';
    };

    // Close modal when clicking outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Handle form submission
    eventForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Collect form data
        let title = document.getElementById('eventTitle').value;
        let name = document.getElementById('eventName').value;
        let subject = document.getElementById('eventSubject').value;
        let notes = document.getElementById('eventNotes').value;
        let start = document.getElementById('eventStart').value;
        let end = document.getElementById('eventEnd').value;
        // Add event to the calendar
        calendar.addEvent({
            title: `${title} - ${name}`,
            start: start,
            end: end,
            extendedProps: {
                subject: subject,
                notes: notes
            }
        });

        // Reset form and close modal
        eventForm.reset();
        modal.style.display = 'none';
    });
});
