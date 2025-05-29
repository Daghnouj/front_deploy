import React from "react";
import "./FAQSection.css";

const FAQSection = () => {
  return (
    <div className="container col-9 my-5">
      <h2 className="text-center mb-5">Frequently Asked Questions</h2>
      <div className="accordion" id="faqAccordion">
        {faqData.map((faq, index) => (
          <div key={index}>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target={`#faq${index}`}>
                  {faq.question}
                </button>
              </h2>
              <div id={`faq${index}`} className="accordion-collapse collapse">
                <div className="accordion-body">{faq.answer}</div>
              </div>
            </div>
            <hr />
          </div>
        ))}
      </div>
    </div>
  );
};

const faqData = [
  { question: "What is solidarity?", answer: "Solidarity refers to unity and mutual support within a community." },
  { question: "How do I book an appointment with a therapist?", answer: "You can book an appointment by navigating to the 'Therapists' section." },
  { question: "Can I book sessions for sports activities?", answer: "Yes! You can book sports activities like yoga sessions and more." },
  { question: "What kind of blog content is available?", answer: "Our blog features mental health, self-care, and therapy insights." },
  { question: "How can I join the community space?", answer: "Join by creating an account and participating in forums." },
  { question: "How can therapists and coaches join?", answer: "Therapists can register, complete verification, and list services." },
];

export default FAQSection;
