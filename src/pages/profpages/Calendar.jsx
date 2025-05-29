import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import EventModal from './EventModal';
import './Calendar.css';

const Calendar = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    summary: '',
    description: '',
    start: '',
    end: ''
  });

  axios.defaults.baseURL = 'https://deploy-back-3.onrender.com';
  axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  const refreshEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/availability/availabilities');

      const receivedEvents = response.data.map(event => ({
        id: event.id,
        title: event.summary,
        start: new Date(event.start),
        end: new Date(event.end),
        backgroundColor: '#1a73e8',
        extendedProps: {
          description: event.description,
          professional: event.professional
        }
      }));

      setEvents(receivedEvents);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const handleDateClick = (arg) => {
    setForm({
      summary: '',
      description: '',
      start: arg.dateStr + 'T09:00',
      end: arg.dateStr + 'T10:00'
    });
    setModalOpen(true);
  };

  const handleEventClick = (info) => {
    setSelectedEvent(info.event);
    setForm({
      id: info.event.id,
      summary: info.event.title,
      description: info.event.extendedProps.description,
      start: info.event.start.toISOString().slice(0, 16),
      end: info.event.end.toISOString().slice(0, 16)
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        summary: form.summary,
        description: form.description,
        start: form.start,
        end: form.end
      };

      if (selectedEvent) {
        await axios.put(`/api/availability/availabilities/${form.id}`, payload);
      } else {
        await axios.post('/api/availability/availabilities', payload);
      }

      setModalOpen(false);
      await refreshEvents();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Supprimer cette disponibilité ?')) {
      try {
        await axios.delete(`/api/availability/availabilities/${form.id}`);
        setModalOpen(false);
        await refreshEvents();
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur de suppression');
      }
    }
  };

  const renderEventContent = (eventInfo) => {
    const start = new Date(eventInfo.event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const end = new Date(eventInfo.event.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <div className="custom-event">
        <span className="event-title">{eventInfo.event.title}</span>
        <span className="event-date">{start} - {end}</span>
      </div>
    );
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h2>Calendrier des disponibilités</h2>
      </div>

      {error && <div className="error-message">⚠️ {error}</div>}
      {loading && <div className="loading">Chargement des disponibilités...</div>}

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        events={events}
        eventContent={renderEventContent}
        height="auto"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek'
        }}
        locale="fr"
        eventDisplay="block"
        dayMaxEventRows={3}
        eventOrder="start,-duration,allDay,title"
      />

      <EventModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedEvent(null);
        }}
        onSubmit={handleSubmit}
        onDelete={selectedEvent ? handleDelete : null}
        form={form}
        setForm={setForm}
        isEdit={!!selectedEvent}
        error={error}
      />
    </div>
  );
};

export default Calendar;
