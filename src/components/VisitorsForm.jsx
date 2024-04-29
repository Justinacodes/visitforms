import React, { useState, useEffect } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useMask } from "@react-input/mask";

function FormFloatingBasicExample() {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    emailAddress: "",
    visitorType: "",
    whoToSeePhoneNumber: "",
    whoToSeeName: "",
    purposeForVisit: "",
    comments: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const [validPhoneNumbers, setValidPhoneNumbers] = useState([]);
  const [validNames, setValidNames] = useState([]);
  const [phoneMask, setPhoneMask] = useState("+234 (___) ___-__-__"); // Default mask for Nigeria
  const apiUrl = "http://ezapi.issl.ng:3333/employee";
  const phoneNumbersUrl = "http://ezapi.issl.ng:3333/employeephone";
  const visitationRequest = "http://ezapi.issl.ng:3333/visitationrequest"

  useEffect(() => {
    // Fetching employee phone numbers
    fetch(phoneNumbersUrl)
      .then((response) => response.json())
      .then((data) =>
        setValidPhoneNumbers(data.map((record) => record.phoneno))
      )
      .catch((err) => console.log(err));

    // Fetching employee details
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => setValidNames(data.map((record) => record.name)))
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

   // Validate whoToSeeName and whoToSeePhoneNumber against fetched data
   if (!validPhoneNumbers.includes(formData.whoToSeePhoneNumber)) {
     setError("Invalid phone number provided");
     return;
   }
   if (!validNames.includes(formData.whoToSeeName)) {
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
       fullName: "",
       phoneNumber: "",
       emailAddress: "",
       visitorType: "",
       whoToSeePhoneNumber: "",
       whoToSeeName: "",
       purposeForVisit: "",
       comments: "",
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
    if (formData.phoneNumber.startsWith("+234")) {
      // Set mask for Nigeria
      setPhoneMask("+234 (___) ___-__-__");
    } else {
      // Default mask
      setPhoneMask("+234 (___) ___-__-__");
    }
  }, [formData.phoneNumber]);

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
              controlId="fullName"
              label="Visitor's Full Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Visitor's Full Name"
                className="mt-2"
                value={formData.fullName}
                onChange={handleChange}
              />
              {validationErrors.fullName && (
                <div className="error">{validationErrors.fullName}</div>
              )}
            </FloatingLabel>

            <FloatingLabel
              controlId="phoneNumber"
              label="Phone Number"
              className="mb-3"
            >
              <Form.Control
                type="tel"
                ref={phoneNumberRef}
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                // pattern="[0-9]*"
              />
              {validationErrors.phoneNumber && (
                <div className="error">{validationErrors.phoneNumber}</div>
              )}
            </FloatingLabel>

            <FloatingLabel
              controlId="emailAddress"
              label="Email Address"
              className="mb-3"
            >
              <Form.Control
                type="email"
                placeholder="Email Address"
                value={formData.emailAddress}
                onChange={handleChange}
              />
              {validationErrors.emailAddress && (
                <div className="error">{validationErrors.emailAddress}</div>
              )}
            </FloatingLabel>

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

            <FloatingLabel
              controlId="whoToSeePhoneNumber"
              label="Who to see (Phone No)"
              className="mb-3"
            >
              <Form.Control
                type="tel"
                //ref={whoToSeePhoneNumberRef}
                placeholder="Phone Number"
                value={formData.whoToSeePhoneNumber}
                onChange={handleChange}
              />
              {validationErrors.whoToSeePhoneNumber && (
                <div className="error">
                  {validationErrors.whoToSeePhoneNumber}
                </div>
              )}
            </FloatingLabel>

            <FloatingLabel
              controlId="whoToSeeName"
              label="Who to see (Name)"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Name"
                value={formData.whoToSeeName}
                onChange={handleChange}
              />
              {validationErrors.whoToSeeName && (
                <div className="error">{validationErrors.whoToSeeName}</div>
              )}
            </FloatingLabel>

            <div className="visitorType mb-3">
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
              </div>

              {validationErrors.visitorType && (
                <div className="error">{validationErrors.visitorType}</div>
              )}
            </div>

            <FloatingLabel controlId="comments" label="Comments">
              <Form.Control
                as="textarea"
                placeholder="Leave a comment here"
                style={{ height: "100px" }}
                value={formData.comments}
                onChange={handleChange}
              />
              {validationErrors.comments && (
                <div className="error">{validationErrors.comments}</div>
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
