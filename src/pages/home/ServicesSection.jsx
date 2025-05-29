import "./ServicesSection.css";

const ServicesSection = () => {
  return (
    <div className="container col-10 text-center my-5 ">
      <h2 style={{ marginBottom: '60px', marginTop:'120px', fontSize:'46px', fontWeight:'bold' }}>OUR SERVICES</h2>
      <div className="row">
        <div className="col-md-4"><div className="service-box">Individual Therapy</div></div>
        <div className="col-md-4"><div className="service-box">Community space</div></div>
        <div className="col-md-4"><div className="service-box">Gallery & articles</div></div>
      </div>
      <div className="row mt-5" style={{ marginBottom:'150px' }}>
        <div className="col-md-4"><div className="service-box">Parenting Guidance</div></div>
        <div className="col-md-4"><div className="service-box">Activities & Wellness</div></div>
        <div className="col-md-4"><div className="service-box">Activities locations</div></div>
      </div>
    </div>
  );
};

export default ServicesSection;
