import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './professionals.css';
import { Link } from 'react-router-dom';

const Professionals = () => {
  const [professionals, setProfessionals] = useState([]);
  const [filters, setFilters] = useState({
    specialty: '',
    location: '',
    search: ''
  });
  const [filterOptions, setFilterOptions] = useState({
    specialties: [],
    locations: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [professionalsRes, filtersRes] = await Promise.all([
          axios.get("http://localhost:5000/api/professionals", { params: filters }),
          axios.get("http://localhost:5000/api/professionals/filters")
        ]);
       
        setProfessionals(professionalsRes.data);
        setFilterOptions(filtersRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
   
    fetchData();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }));
  };

  return (
    <div className="container my-5">
      <div className="row mb-4">
        <div className="col-3 mt-5">
          <h2 className="fw-bold mt-5">Our Professionals</h2>
        </div>
      </div>

      <div className="row mb-5 align-items-center mt-5">
        <div className="col-3 mb-2">
          <select
            name="specialty"
            className="form-select border-dark rounded-5"
            onChange={handleFilterChange}
            value={filters.specialty}
          >
            <option value="">All Specialties</option>
            {filterOptions.specialties.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
       
        <div className="col-3 mb-2">
          <select
            name="location"
            className="form-select border-dark rounded-5"
            onChange={handleFilterChange}
            value={filters.location}
          >
            <option value="">All Locations</option>
            {filterOptions.locations.map(l => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>
       
        <div className="col-3 offset-3 mb-2">
          <input
            type="text"
            className="form-control border-dark rounded-5"
            placeholder="Search professionals..."
            onChange={handleSearchChange}
            value={filters.search}
          />
        </div>
      </div>

      <div className="row">
        {professionals
          .filter(professional => professional.isActive) // Filtre des professionnels actifs
          .map((professional) => (
            <div key={professional._id} className="col-3 mb-4 d-flex justify-content-center">
              <Link to={`/professionals/${professional._id}`} className="professional-card">
                <img
                  src={professional.photo ? `http://localhost:5000/uploads/${professional.photo}` : '/placeholder-professional.jpg'}
                  alt={professional.nom}
                  className="professional-image"
                />
                <div className="card-info">
                  <h5>{professional.nom}</h5>
                  <p className="specialty">{professional.specialite}</p>
                  <p className="location">{professional.adresse}</p>
                  <button className="book-button">Book Now</button>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Professionals;