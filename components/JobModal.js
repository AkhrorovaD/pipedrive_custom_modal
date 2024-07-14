import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAppContext } from '../shared/context';

const JobModal = (props) => {
  const { setCallerState } = useAppContext();

  
 
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    jobType: '',
    jobSource: '',
    jobDescription: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    area: '',
    startDate: '',
    startTime: '',
    endTime: '',
    technician: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setCallerState('connected');
    try {
      const response = await fetch('/api/add-deal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to add deal');
      }

      const result = await response.json();
      console.log('Deal added successfully:', result);
      
    } catch (error) {
      console.error('Error adding deal:', error);
    }
  };



  return (
    <div className="modal" id="jobModal">
      <div className="modal-content">
        <form id="jobForm" onSubmit={handleSubmit}>
          <div className="grid-container">
            <div className="container">
              <h3 className="h3">Client details</h3>
              <div className="grid2">
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <input
                type="text"
                id="phone"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="container">
              <h3 className="h3">Job details</h3>
              <div className="grid2">
                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Job type</option>
                  <option value="Recall job">Recall job</option>
                  <option value="Warranty job">Warranty job</option>
                  <option value="Lead job">Lead job</option>
                </select>
                <select
                  id="jobSource"
                  name="jobSource"
                  value={formData.jobSource}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Job source</option>
                  <option value="SL Kyndryl">SL Kyndryl</option>
                  <option value="GL Mark Inc">GL Mark Inc</option>
                  <option value="SL Micron">SL Micron</option>
                </select>
              </div>
              <textarea
                id="jobDescription"
                name="jobDescription"
                placeholder="Job description"
                value={formData.jobDescription}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="container">
              <h3 className="h3">Service location</h3>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                id="city"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                id="state"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />
              <div className="grid2">
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  placeholder="Zip code"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                />
                <select
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Area</option>
                  <option value="Fort Myers">Fort Myers</option>
                  <option value="Sarasota">Sarasota</option>
                  <option value="Springfield">Springfield</option>
                  <option value="Annapolis">Annapolis</option>
                </select>
              </div>
            </div>
            <div className="container">
              <h3 className="h3">Scheduled</h3>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
              <div className="grid2">
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  required
                />
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                />
              </div>
              <select
                id="technician"
                name="technician"
                value={formData.technician}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select technician</option>
                <option value="Kim Natalya">Kim Natalya</option>
                <option value="Louisa Johns">Louisa Johns</option>
                <option value="Adam Jarvis">Adam Jarvis</option>
                <option value="Abdulraheem Naseer">Abdulraheem Naseer</option>
                <option value="Charles Barber">Charles Barber</option>
              </select>
            </div>
          </div>
          <div className="btns">
            <button type="submit" className="btn" id="request" >Create Job</button>
            <button type="button" className="btn2">Save info</button>
            <p id="successMessage"></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobModal;
