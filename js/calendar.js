document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');
    let modal = document.getElementById('eventModal');
    let closeModal = document.querySelector('.close');
    let cancelButton = document.querySelector('.cancel-button');
    let eventForm = document.getElementById('eventForm');

    async function fetchEvents() {
        try {
            const response = await fetch('https://my-json-server.typicode.com/atul161/FullCalendar/Events'); // Replace with your JSON file path
            if (!response.ok) throw new Error('Network response was not ok');
            const events = await response.json();
            return events.map(event => ({
                title: `${event.title}`,
                start: event.start,
                end: event.end,
                extendedProps: {
                    subject: event.extendedProps.subject,
                    notes: event.extendedProps.notes,
                    label: event.extendedProps.label
                },
                classNames: [event.extendedProps.label],
            }));
        } catch (error) {
            console.error('Error fetching events:', error);
            return [];
        }
    }

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
            document.getElementById('eventStart').value = info.startStr;
            document.getElementById('eventEnd').value = info.endStr;
            document.getElementById('booking-start-time').textContent = "Event Start Date/Time: " + " " + info.startStr;
            document.getElementById('booking-end-time').textContent = "Event End Date/Time: " + " " + info.endStr;
            modal.style.display = 'block';
        },
        events: async function (fetchInfo, successCallback, failureCallback) {
            const events = await fetchEvents();
            successCallback(events);
        }
    });

    calendar.render();

    closeModal.onclick = function () {
        modal.style.display = 'none';
    };

    cancelButton.onclick = function () {
        modal.style.display = 'none';
    };

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    eventForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let title = document.getElementById('eventTitle').value;
        let name = document.getElementById('eventName').value;
        let subject = document.getElementById('eventSubject').value;
        let notes = document.getElementById('eventNotes').value;
        let start = document.getElementById('eventStart').value;
        let end = document.getElementById('eventEnd').value;
        let label = document.getElementById('eventLabel').value;

        calendar.addEvent({
            title: `${title} - ${name}`,
            start: start,
            end: end,
            extendedProps: {
                subject: subject,
                notes: notes,
                label: label
            },
            classNames: [label],
        });

        eventForm.reset();
        modal.style.display = 'none';
    });
});
