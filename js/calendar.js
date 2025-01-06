document.addEventListener('DOMContentLoaded', function () {
    let calendarEl = document.getElementById('calendar');
    let modal = document.getElementById('eventModal');
    let closeModal = document.querySelector('.close');
    let cancelButton = document.querySelector('.cancel-button');
    let eventForm = document.getElementById('eventForm');

    // Tooltip container
    let tooltip = document.createElement('div');
    tooltip.id = 'eventTooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.zIndex = '1000';
    tooltip.style.background = '#df8989';
    tooltip.style.border = '1px solid #ccc';
    tooltip.style.padding = '10px';
    tooltip.style.borderRadius = '5px';
    tooltip.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    tooltip.style.display = 'none';
    document.body.appendChild(tooltip);

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
        eventContent: function (arg) {
            let label = arg.event.extendedProps.label || '';
            return {
                html: `<div class="fc-event-main">
                <span>${arg.event.title}</span>
                <span class="fc-event-label">${label.replace(/-/g, ' ')}</span>
               </div>`
            };
        },
        events: async function (fetchInfo, successCallback, failureCallback) {
            const events = await fetchEvents();
            successCallback(events);
        },
        eventMouseEnter: function (info) {
            let event = info.event;
            let details = `
                <strong>${event.title}</strong><br>
                Subject: ${event.extendedProps.subject || 'N/A'}<br>
                Notes: ${event.extendedProps.notes || 'N/A'}<br>
                Label: ${event.extendedProps.label || 'N/A'}
            `;
            tooltip.innerHTML = details;
            tooltip.style.display = 'block';
            tooltip.style.left = info.jsEvent.pageX + 10 + 'px';
            tooltip.style.top = info.jsEvent.pageY + 10 + 'px';
        },
        eventMouseLeave: function () {
            tooltip.style.display = 'none';
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
