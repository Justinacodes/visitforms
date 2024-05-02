import React, { useState, useEffect } from "react";
import axios from "axios";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useMask } from "@react-input/mask";

function FormFloatingBasicExample() {
  const [formData, setFormData] = useState({
    visitorname: "",
    visitorphone: "",
    visitoremail: "",
    hostphoneno: "",
    hostname: "",
    hostemailaddress: "",
    plannedvisittime: "",
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState("");
  const [validPhoneNumbers, setValidPhoneNumbers] = useState([]);
  const [phoneMask, setPhoneMask] = useState("+234 (___) ___-____");
  const [validNames, setValidNames] = useState([]);
  const apiUrl = "http://ezapi.issl.ng:3333/employee";
  const phoneNumbersUrl = "http://ezapi.issl.ng:3333/employeephone";
  const visitationRequest = "http://ezapi.issl.ng:3333/visitationrequest";

  useEffect(() => {
    // Fetching employee phone numbers
    axios.get(phoneNumbersUrl)
      .then((response) => setValidPhoneNumbers(response.data.map((record) => record.phoneno)))
      .catch((err) => console.error("Error fetching phone numbers:", err));

    // Fetching employee names
    axios.get(apiUrl)
      .then((response) => setValidNames(response.data.map((record) => record.name)))
      .catch((err) => console.error("Error fetching employee names:", err));
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    let convertedValue = value;
    if (id === "visitorphone" || id === "hostphoneno") {
      // If the input is a phone number, ensure it's a string after masking
      convertedValue = value.toString();
    }
    setFormData((prevData) => ({
      ...prevData,
      [id]: convertedValue,
    }));
    setValidationErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const errors = {};
    for (const key in formData) {
      if (formData[key] === "") {
        errors[key] = "Please fill out this field";
      }
    }
    setValidationErrors(errors);
  
    // Ensure hostphoneno is a string
    const hostPhoneNo = formData.hostphoneno.toString();
    console.log(hostPhoneNo);
  
    if (!validPhoneNumbers.includes(hostPhoneNo)) {
      setError("Invalid phone number provided");
      return;
    }
    if (!validNames.includes(formData.hostname)) {
      setError("Invalid name provided");
      return;
    }
  
    try {
      // Fetch staff Id based on host phone number
      const staffIdResponse = await axios.get(`${phoneNumbersUrl}?phoneno=eq.${hostPhoneNo}`);
      console.log(staffIdResponse)
      const fetchedStaffId = staffIdResponse.data[0]?.staffid; // Use optional chaining
      if (!fetchedStaffId) {
        setError("Staff Id not found for the provided phone number");
        return;
      }
  
      // Get the current time and format it as HH:mm:ss
      const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
  
      // Prepare form data with default values for status and statusbystaffid
      const defaultFormData = {
        ...formData,
        status: "Pending",
        statusbystaffid: "Awaiting Check In",
        staffid: fetchedStaffId,
        plannedvisittime: currentTime,
      };
  
      // Submit the form data
      await axios.post(visitationRequest, defaultFormData);
      console.log("Form data submitted successfully");
  
      // Reset form data and errors after successful submission
      setFormData({
        visitorname: "",
        visitorphone: "",
        visitoremail: "",
        hostphoneno: "",
        hostname: "",
        hostemailaddress: "",
      });
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
    <div className="formContainer">
      <div className="textContainer">
        <h2 className="visitationForm">Visitation Form</h2>
        <p className="visitationFormText">
          Fill the details below to log your appointment
        </p>
      </div>
      <div className="form">
        <Form onSubmit={handleSubmit}>
          <FloatingLabel controlId="visitorname" label="Visitor's Full Name" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Visitor's Full Name"
              className="mt-2"
              value={formData.visitorname}
              onChange={handleChange}
            />
            {validationErrors.visitorname && <div className="error">{validationErrors.visitorname}</div>}
          </FloatingLabel>
          <FloatingLabel controlId="visitorphone" label="Phone Number" className="mb-3">
            <Form.Control
              type="tel"
              ref={phoneNumberRef}
              placeholder="Phone Number"
              value={formData.visitorphone}
              onChange={handleChange}
            />
            {validationErrors.visitorphone && <div className="error">{validationErrors.visitorphone}</div>}
          </FloatingLabel>
          <FloatingLabel controlId="visitoremail" label="Email Address" className="mb-3">
            <Form.Control
              type="email"
              placeholder="Email Address"
              value={formData.visitoremail}
              onChange={handleChange}
            />
            {validationErrors.visitoremail && <div className="error">{validationErrors.visitoremail}</div>}
          </FloatingLabel>
          <FloatingLabel controlId="hostphoneno" label="Who to see (Phone No)" className="mb-3">
            <Form.Control
              type="tel"
              // ref={whoToSeePhoneNumberRef}
              placeholder="Phone Number"
              value={formData.hostphoneno}
              onChange={handleChange}
            />
            {validationErrors.hostphoneno && <div className="error">{validationErrors.hostphoneno}</div>}
          </FloatingLabel>
          <FloatingLabel controlId="hostname" label="Who to see (Name)" className="mb-3">
            <Form.Control
              type="text"
              placeholder="Name"
              value={formData.hostname}
              onChange={handleChange}
            />
            {validationErrors.hostname && <div className="error">{validationErrors.hostname}</div>}
          </FloatingLabel>
          <FloatingLabel controlId="hostemailaddress" label="Notes">
            <Form.Control
              as="textarea"
              placeholder="Leave a note here"
              style={{ height: "100px" }}
              value={formData.hostemailaddress}
              onChange={handleChange}
            />
            {validationErrors.hostemailaddress && <div className="error">{validationErrors.hostemailaddress}</div>}
          </FloatingLabel>
          {error && <div className="error">{error}</div>}
          <button type="submit" id="btn">Submit Request</button>
        </Form>
      </div>
    </div>
  );
}

export default FormFloatingBasicExample;
