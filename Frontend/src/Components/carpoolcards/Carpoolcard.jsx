import React from 'react';
import { FaTrash, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { MdLocationOn, MdAirlineSeatReclineNormal } from 'react-icons/md';
import './Carpoolcard.css';

const Carpoolcard = ({ id, from, to, time, seatsAvailable, pricePerSeat, onDeleteLocal }) => {
  return (
    <div className="carpoolcontainer">
      <div className="carpoolcard">
        <div className="location">
          <h2>{from ?? 'From'} to {to ?? 'To'}</h2>
        </div>
        <div className="CP-details">
          <p><FaClock /> {time ?? 'N/A'}</p>
          <p><MdAirlineSeatReclineNormal /> {seatsAvailable ?? 0} seats available</p>
          <p><FaMapMarkerAlt /> {from ?? 'From'}</p>
          <p><MdLocationOn /> {to ?? 'To'}</p>
        </div>
        <div className="CP-bookings">
          <h3>₹{pricePerSeat ?? 0} per seat</h3>
          
        </div>
      </div>
    </div>
  );
};

export default Carpoolcard;