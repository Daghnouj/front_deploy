import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BookingForm.css";
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import opldImage from "../assets/opld1.png";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE_URL = "https://deploy-back-3.onrender.com/api";

const BookingForm = () => {
  const { therapistId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    ville: "",
    antecedentsMedicaux: "",
    probleme: "",
    phone: "",
    date: "",
    therapistId: therapistId,
    therapeutename: "",
    specialite: "",
  });

  const [loading, setLoading] = useState({
    therapist: true,
    slots: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [therapistInfo, setTherapistInfo] = useState(null);

  useEffect(() => {
  const fetchTherapistData = async () => {
    try {
      const [therapistRes, slotsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/professionals/${therapistId}`),
        axios.get(`${API_BASE_URL}/booking/availabilities/${therapistId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      setTherapistInfo(therapistRes.data);
      setFormData(prev => ({
        ...prev,
        therapeutename: therapistRes.data.nom,
        specialite: therapistRes.data.specialite 
        }));

        setAvailableSlots(slotsRes.data?.data?.map(slot => ({
          ...slot,
          start: new Date(slot.start),
          end: new Date(slot.end)
        })) || []);

      } catch (error) {
        toast.error("Error loading therapist data");
        navigate('/professionals');
      } finally {
        setLoading(prev => ({ ...prev, therapist: false }));
      }
    };

    if (therapistId) {
      fetchTherapistData();
    } else {
      navigate('/professionals');
    }
  }, [therapistId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateSelect = (selectedDate) => {
    if (!(selectedDate instanceof Date) || isNaN(selectedDate)) {
      toast.error("Invalid date selection");
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      date: selectedDate.toISOString()
    }));
    setShowModal(false);
  };

  const isFormValid = () => {
    const requiredFields = [
      'nom', 'prenom', 'email', 'ville',
      'antecedentsMedicaux', 'probleme', 
      'phone', 'date'
    ];
    
    return requiredFields.every(field => 
      formData[field] && formData[field].trim() !== ''
    );
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      ...formData,
      date: new Date(formData.date).toISOString(),
      specialite: therapistInfo.specialite // Ensure this is included
    };
    
    await axios.post(`${API_BASE_URL}/booking/bookings`, payload, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });

      toast.success("Booking confirmed!");
      setSuccessMessage("Your appointment has been successfully booked!");
      
      setTimeout(() => {
      }, 3000);

    } catch (error) {
      toast.error(error.response?.data?.error || "Booking error");
    }
  };

  if (loading.therapist) {
    return <div className="container text-center mt-5"><Spinner animation="border" /></div>;
  }

  return (
    <div className="container col-md-10 p-4 mb-5 mt-5">
      <div className="text-start mb-5 mt-5">
        <h2>Booking with {therapistInfo?.nom}</h2>
        <p className="fw-bold fs-5">
          Please fill in your details to complete the booking with {therapistInfo?.specialite} specialist
        </p>
      </div>

      <div className="row align-items-center bloc2">
        <div className="col-md">
          <form onSubmit={handleSubmit} className="row g-3 gx-5">
            {['nom', 'prenom', 'email', 'probleme'].map((field) => (
              <div key={field} className="col-md-6 mb-3">
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="form-control custom-input"
                  value={formData[field]}
                  onChange={handleChange}
                  required
                  
                />
              </div>
            ))}

            <div className="col-md-6 mb-3">
              <select
                name="ville"
                className="form-control custom-input"
                value={formData.ville}
                onChange={handleChange}
                required
              >
                <option value="">City</option>
                {[
                  'Tunis', 'Ariana', 'Ben Arous', 'Manouba',
                  'Nabeul', 'Zaghouan', 'Bizerte', 'Béja',
                  'Jendouba', 'Le Kef', 'Siliana', 'Kairouan',
                  'Kasserine', 'Sidi Bouzid', 'Sousse', 'Monastir',
                  'Mahdia', 'Sfax', 'Gafsa', 'Tozeur',
                  'Kébili', 'Gabès', 'Médenine', 'Tataouine'
                ].map(ville => (
                  <option key={ville} value={ville}>{ville}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <select
                name="antecedentsMedicaux"
                className="form-control custom-input"
                value={formData.antecedentsMedicaux}
                onChange={handleChange}
                required
              >
                <option value="">Medical History</option>
                {['Diabetes', 'Hypertension', 'Cardiaque', 'Other'].map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                className="form-control custom-input"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <button
                type="button"
                className=" text-black text-start custom-buttonnn"
                onClick={() => setShowModal(true)}
                disabled={!availableSlots.length}
              >
                {formData.date 
  ? new Date(formData.date).toLocaleString('fr-FR') 
  : <span style={{ marginLeft: '20px' }}>Select Time Slot</span>}
              </button>
              {!availableSlots.length && <small className="text-danger d-block mt-1">No available slots</small>}
            </div>

            <div className="text-start mt-4">
              <button 
                type="submit" 
                className="btn btn-warning text-dark custom-buttonn"
                disabled={!isFormValid() || loading.slots}
              >
                {loading.slots ? (
                  <Spinner animation="border" size="sm" />
                ) : (
                  "send"
                )}
              </button>
            </div>

            {successMessage && (
              <div className="mt-4">
                <Alert variant="success">
                  {successMessage}
                </Alert>
              </div>
            )}
          </form>
        </div>

        <div className="col-md-5 mb-3 d-flex justify-content-center">
          <img src={opldImage} alt="Illustration" className="image-placeholder" />
        </div>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Available Time Slots</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {availableSlots.length ? (
            <div className="d-flex flex-wrap">
              {availableSlots.map((slot, index) => (
                <Button
                  key={index}
                  variant="outline-primary"
                  className="m-2"
                  onClick={() => handleDateSelect(slot.start)}
                >
                  {slot.start.toLocaleString('fr-FR')}
                </Button>
              ))}
            </div>
          ) : (
            <p>No available time slots</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BookingForm;