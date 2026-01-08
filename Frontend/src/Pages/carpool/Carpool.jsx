import React, { useState } from 'react';
import Sidebar from '../../Components/Sidebar/Sidebar';
import './Carpool.css';

import { FaUsers, FaSearch, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { MdLocationOn, MdAirlineSeatReclineNormal } from 'react-icons/md';
import { motion } from 'framer-motion'; //
import { useCarpool } from '../../hooks/carpoolhooks/useCarpool';
import { useAddCarpool } from '../../hooks/carpoolhooks/useaddcarpool';
import { useUserResources } from '../../hooks/user/useUserresources';
import { useGetUser } from '../../hooks/user/usegetuser';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // ✅ Added
import 'react-toastify/dist/ReactToastify.css'; // ✅ Added

const Carpool = () => {
  const { carpools, setCarpools, loading, getAllCarpools } = useCarpool();
  const { addCarpool, carpoolData } = useAddCarpool();
  const { refetchResources } = useUserResources();
  const { user } = useGetUser();
  const navigate = useNavigate();

  const [searchquery, setsearchquery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newRide, setNewRide] = useState({
    from: "",
    to: "",
    time: "",
    seatsAvailable: "",
    pricePerSeat: ""
  });

  const handleContactOwner = (owner) => {
    navigate(`/inbox`, {
      state: {
        receiverId: owner?._id,
        receiverUsername: owner?.username,
      },
    });
  };

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setNewRide(prev => ({ ...prev, [name]: value }));
  };

  const Submithandler = async (e) => {
    e.preventDefault();
    try {
      await addCarpool(newRide);
      await getAllCarpools();
      refetchResources();

      setNewRide({
        from: "",
        to: "",
        time: "",
        seatsAvailable: "",
        pricePerSeat: ""
      });

      setShowForm(false);
      toast.success("Carpool ride added successfully!"); // ✅ Toast
    } catch (error) {
      console.error("Error adding carpool:", error);
      toast.error("Failed to post carpool ride."); // ✅ Error Toast
    }
  };

  const filteredCarpools = carpools?.filter(carpool => {
    if (!carpool) return false;

    const query = searchquery?.toLowerCase?.() || '';

    return (
      (carpool.from && carpool.from.toLowerCase().includes(query)) ||
      (carpool.to && carpool.to.toLowerCase().includes(query)) ||
      (carpool.time && carpool.time.toLowerCase().includes(query))
    );
  }) || [];

  if (!carpools) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
        <p>Loading carpool rides...</p>
      </div>
    );
  }

  return (
    <>
      <div className='component-container'>
        <Sidebar />
        <motion.div
          id="carpool"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="carpool-heading">
            <h1>Carpool</h1>
            <p>Find rides or offer seats in your car</p>
          </div>

          <button className='add-ride' onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : <><FaUsers /> Offer a Ride</>}
          </button>

          {showForm && (
            <form className="add-ride-form" onSubmit={Submithandler}>
              <input
                type="text"
                name="from"
                value={newRide.from}
                onChange={changeHandler}
                placeholder="From"
                required
              />
              <input
                type="text"
                name="to"
                value={newRide.to}
                onChange={changeHandler}
                placeholder="To"
                required
              />
              <input
                type="text"
                name="time"
                value={newRide.time}
                onChange={changeHandler}
                placeholder="Time (e.g., Tomorrow, 8 AM)"
                required
              />
              <input
                type="number"
                name="seatsAvailable"
                value={newRide.seatsAvailable}
                onChange={changeHandler}
                placeholder="Seats Available"
                required
              />
              <input
                type="number"
                name="pricePerSeat"
                value={newRide.pricePerSeat}
                onChange={changeHandler}
                placeholder="Price per seat"
                required
              />
              <button type="submit" className='submit-ride'>Submit Ride</button>
            </form>
          )}

          <h2 className='available-ride'>Available rides</h2>
          <div className="search-bar">
            <FaSearch className='Search-icon' />
            <input
              type="text"
              placeholder="Search by location or time..."
              value={searchquery}
              onChange={(e) => setsearchquery(e.target.value)}
            />
          </div>

          <div className="car-pool-cards">
            {filteredCarpools.map((CP, index) => (
              <div className="CP-card" key={index}>
                <div className="location">
                  <h2>{CP.from} to {CP.to}</h2>
                </div>
                <div className="CP-details">
                  <p><FaClock /> {CP.time}</p>
                  <p><MdAirlineSeatReclineNormal /> {CP.seatsAvailable} seats available</p>
                  <p><FaMapMarkerAlt /> From: {CP.from}</p>
                  <p><MdLocationOn /> To: {CP.to}</p>
                </div>
                <div className="CP-bookings">
                  <h3>₹{CP.pricePerSeat} per seat</h3>
                  {CP?.user && user && CP.user._id !== user._id && (
                    <button onClick={() => handleContactOwner(CP.user)}>Contact</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Carpool;