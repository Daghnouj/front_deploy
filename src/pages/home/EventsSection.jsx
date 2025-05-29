import "./EventsSection.css";
import h1 from "../../assets/h3.png";
import h2 from "../../assets/h4.png";
import { Link } from "react-router-dom";

const EventsSpacesSection = () => {
  return (
    <div className="container col-10 my-5">
      <h2 className="section-titlee text-center">Explore Events & Sports Spaces</h2>

      <div className="row align-items-center mb-4">
        <div className="col-md text-md-start text-center">
          <h3 className="event-home-title">Find Activity Spaces Near You</h3>
          <p className="event-text">
          Discover local events and activity spaces designed to boost well-being, movement, and community engagement.
          </p>
        </div>
        <div className="col-md">
          <img src={h1} alt="Activity space with facilities" className="event-image img-fluid mx-5" />
        </div>
      </div>

      <div className="row align-items-center">
        <div className="col-md text-start">
          <img src={h2} alt="Exclusive event setup" className="event-image img-fluid" />
        </div>
        <div className="col-md">
          <h3 className="event-home-title mx-5">Exclusive Events</h3>
          <p className="event-text mx-5">
          Browse nearby centers, gyms, or open spaces where you can participate in physical activities, therapy-friendly exercises, or group workshops tailored to your needs.
          </p>
        </div>
      </div>

      <div className="text-center mt-4">
  <Link to="/activities-centres" className="explore-btn text-decoration-none d-inline-block">
    Explore now
  </Link>
</div>
    </div>
  );
};

export default EventsSpacesSection;