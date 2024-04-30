import React, { useState, useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useMask } from "@react-input/mask";

function FormFloatingBasicExample() {
  const [formData, setFormData] = useState({
    visitorname: "",
    visitorphone: "",
    visitoremail: "",
    // visitorType: "",
    hostphoneno: "",
    hostname: "",
    //used hostemailaddress from the endpoint for the comment field
    hostemailaddress: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const [validPhoneNumbers, setValidPhoneNumbers] = useState([]);
  const [validNames, setValidNames] = useState([]);
  const [phoneMask, setPhoneMask] = useState("+234 (___) ___-____"); // Default mask for Nigeria
  // const apiUrl = "http://ezapi.issl.ng:3333/employee";
  // const phoneNumbersUrl = "http://ezapi.issl.ng:3333/employeephone";
  const visitationRequest = "http://ezapi.issl.ng:3333/visitationrequest";

  useEffect(() => {
    // Fetching employee phone numbers
    fetch(visitationRequest)
      .then((response) => response.json())
      .then((data) =>
        setValidPhoneNumbers(data.map((record) => record.hostphoneno))
      )
      .catch((err) => console.log(err));

    //Fetching employee details
    fetch(visitationRequest)
      .then((response) => response.json())
      .then((data) => setValidNames(data.map((record) => record.hostname)))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (e.target.type === "radio") {
      setFormData({
        ...formData,
        [e.target.name]: value,
      });
    } else {
      // For other inputs, update the form data as before
      setFormData((prevData) => ({
        ...prevData,
        [id]: value,
      }));
    }

    // Reset validation errors when user types in the field
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation: checking if all required fields are filled
    const errors = {};
    for (const key in formData) {
      if (formData[key] === "") {
        errors[key] = "Please fill out this field";
      }
    }
    setValidationErrors(errors);

    //Validate hostname and hostphoneno against fetched data
    if (!validPhoneNumbers.includes(formData.hostphoneno)) {
      setError("Invalid phone number provided");
      return;
    }
    if (!validNames.includes(formData.hostname)) {
      setError("Invalid name provided");
      return;
    }

    // Submit form data to the visitationRequest endpoint
    try {
      const response = await fetch(visitationRequest, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to submit form data");
      }
      console.log("Form data submitted successfully");
      // Reset form data
      setFormData({
        visitorname: "",
        visitorphone: "",
        visitoremail: "",
        // visitorType: "",
        hostphoneno: "",
        hostname: "",
        hostemailaddress: "",
      });
      // Reset errors
      setError("");
      setValidationErrors({});
    } catch (error) {
      console.error("Error submitting form data:", error.message);
      setError("Failed to submit form data");
    }
  };

  useEffect(() => {
    if (formData.visitorphone.startsWith("+234")) {
      // Set mask for Nigeria
      setPhoneMask("+234 (___) ___-____");
    } else {
      // Default mask
      setPhoneMask("+234 (___) ___-____");
    }
  }, [formData.visitorphone]);

  const phoneNumberRef = useMask({
    mask: phoneMask,
    replacement: { _: /\d/ },
  });

  const whoToSeePhoneNumberRef = useMask({
    mask: phoneMask,
    replacement: { _: /\d/ },
  });

  return (
    <>
      <div className="formContainer">
        <div className="textContainer">
          <h2 className="visitationForm">Visitation Form</h2>
          <p className="visitationFormText">
            Fill the details below to log your appointment
          </p>
        </div>
        <div className="form">
          <Form onSubmit={handleSubmit}>
            <FloatingLabel
              controlId="visitorname"
              label="Visitor's Full Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Visitor's Full Name"
                className="mt-2"
                value={formData.visitorname}
                onChange={handleChange}
              />
              {validationErrors.visitorname && (
                <div className="error">{validationErrors.visitorname}</div>
              )}
            </FloatingLabel>
            <FloatingLabel
              controlId="visitorphone"
              label="Phone Number"
              className="mb-3"
            >
              <Form.Control
                type="tel"
                ref={phoneNumberRef}
                placeholder="Phone Number"
                value={formData.visitorphone}
                onChange={handleChange}
                // pattern="[0-9]*"
              />
              {validationErrors.visitorphone && (
                <div className="error">{validationErrors.visitorphone}</div>
              )}
            </FloatingLabel>
            <FloatingLabel
              controlId="visitoremail"
              label="Email Address"
              className="mb-3"
            >
              <Form.Control
                type="email"
                placeholder="Email Address"
                value={formData.visitoremail}
                onChange={handleChange}
              />
              {validationErrors.visitoremail && (
                <div className="error">{validationErrors.visitoremail}</div>
              )}
            </FloatingLabel>
            {/* /*
            <div className="visitorType mb-3">
              <label htmlFor="" className="floatingLabel">
                Visitor Type
              </label>
              <div className="radioContainer">
                <Form.Check
                  inline
                  label="Family"
                  type="radio"
                  id="family"
                  name="visitorType"
                  value="family"
                  checked={formData.visitorType === "family"}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  label="Friend"
                  type="radio"
                  id="friend"
                  name="visitorType"
                  value="friend"
                  checked={formData.visitorType === "friend"}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  label="Vendor"
                  type="radio"
                  id="vendor"
                  name="visitorType"
                  value="vendor"
                  checked={formData.visitorType === "vendor"}
                  onChange={handleChange}
                />
              </div>

              {validationErrors.visitorType && (
                <div className="error">{validationErrors.visitorType}</div>
              )}
            </div>
*/}{" "}
            <FloatingLabel
              controlId="hostphoneno"
              label="Who to see (Phone No)"
              className="mb-3"
            >
              <Form.Control
                type="tel"
                ref={whoToSeePhoneNumberRef}
                placeholder="Phone Number"
                value={formData.hostphoneno}
                onChange={handleChange}
              />
              {validationErrors.hostphoneno && (
                <div className="error">{validationErrors.hostphoneno}</div>
              )}
            </FloatingLabel>
            <FloatingLabel
              controlId="hostname"
              label="Who to see (Name)"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Name"
                value={formData.hostname}
                onChange={handleChange}
              />
              {validationErrors.hostname && (
                <div className="error">{validationErrors.hostname}</div>
              )}
            </FloatingLabel>
            {/* <div className="visitorType mb-3">
              <label htmlFor="" className="floatingLabel">
                Purpose for Visit
              </label>
              <div className="radioContainer">
                <Form.Check
                  inline
                  label="Official"
                  type="radio"
                  id="official"
                  name="purposeForVisit"
                  value="official"
                  checked={formData.purposeForVisit === "official"}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  label="Personal"
                  type="radio"
                  id="personal"
                  name="purposeForVisit"
                  value="personal"
                  checked={formData.purposeForVisit === "personal"}
                  onChange={handleChange}
                />
                <Form.Check
                  inline
                  label="Appointment"
                  type="radio"
                  id="appointment"
                  name="purposeForVisit"
                  value="appointment"
                  checked={formData.purposeForVisit === "appointment"}
                  onChange={handleChange}
                />
              </div>

              {validationErrors.visitorType && (
                <div className="error">{validationErrors.visitorType}</div>
              )}
              </div> */}
            <FloatingLabel controlId="hostemailaddress" label="Notes">
              <Form.Control
                as="textarea"
                placeholder="Leave a note here"
                style={{ height: "100px" }}
                value={formData.hostemailaddress}
                onChange={handleChange}
              />
              {validationErrors.hostemailaddress && (
                <div className="error">{validationErrors.hostemailaddress}</div>
              )}
            </FloatingLabel>
            {error && <div className="error">{error}</div>}
            <button type="submit" id="btn">
              Submit Request
            </button>
          </Form>
        </div>
      </div>
    </>
  );
}

export default FormFloatingBasicExample;
