import React, { useEffect, useState } from 'react';
import './Carental.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import { FaCar } from "react-icons/fa";
import { motion } from 'framer-motion';
import { useCarRental } from '../../hooks/carrentalhooks/usecarrentalhook';
import { useUserResources } from '../../hooks/user/useUserresources';
import { useNavigate } from 'react-router-dom';
import { useGetUser } from '../../hooks/user/usegetuser';
import { useAddcarrental } from '../../hooks/carrentalhooks/useaddcarrental';
import { toast } from 'react-toastify'; // ✅ Toastify import
import 'react-toastify/dist/ReactToastify.css'; // ✅ Toastify CSS

const Carental = () => {
  const { carrental, getallcarrentals } = useCarRental();
  const { createcarrental } = useAddcarrental();
  const { refetchResources } = useUserResources();
  const { user } = useGetUser();
  const navigate = useNavigate();

  const handleContactOwner = (owner) => {
    navigate(`/inbox`, {
      state: {
        receiverId: owner?._id,
        receiverUsername: owner?.username
      }
    });
  };

  const [showForm, setShowForm] = useState(false);
  const [newCar, setNewCar] = useState({
    VechicleModel: '',
    RentalAmount: '',
    RentalPeriod: '',
    VechileMileage: '',
    VechicleDescription: '',
    Choosefile: '',
    Available: true
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCar(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createcarrental(newCar, imageFile);
      await getallcarrentals();
      refetchResources();

      setShowForm(false);
      setNewCar({
        VechicleModel: '',
        RentalAmount: '',
        RentalPeriod: '',
        VechileMileage: '',
        VechicleDescription: '',
        Choosefile: '',
        Available: true
      });

      setImageFile(null);
      setImagePreview(null);

      toast.success("Car rental posted successfully!"); // ✅ Success Toast
    } catch (error) {
      console.error("carrental  submition failed !!");
      toast.error("Failed to post car rental."); // ✅ Error Toast
    }
  };

  if (!carrental) {
    return (
      <div className="loader-container">
        <motion.div
          className="loader"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p>Loading Car Rentals...</p>
      </div>
    );
  }

  return (
    <div className='component-container'>
      <Sidebar />
      <motion.div
        id='car-rental'
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="car-header">
          <h1>Car Rental</h1>
          <p>Rent Cars From other Students or list your own</p>
        </div>

        <button className='add-car' onClick={() => setShowForm(!showForm)}>
          <FaCar /> {showForm ? 'Cancel' : 'Add Car'}
        </button>

        {showForm && (
          <form className='add-car-form' onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <input type="text" name="VechicleModel" placeholder="Vehicle Model" value={newCar.VechicleModel} onChange={handleChange} required />
              <input type="text" name="RentalAmount" placeholder="Rental Amount" value={newCar.RentalAmount} onChange={handleChange} required />
              <input type="text" name="RentalPeriod" placeholder="Rental Period" value={newCar.RentalPeriod} onChange={handleChange} required />
              <input type="text" name="VechileMileage" placeholder="Vehicle Mileage" value={newCar.VechileMileage} onChange={handleChange} required />
              <textarea name="VechicleDescription" placeholder="Vehicle Description" value={newCar.VechicleDescription} onChange={handleChange} required></textarea>
              <label>
                <input type="checkbox" className='form-available' name="Available" checked={newCar.Available} onChange={handleChange} />
                Available
              </label>
            </div>

            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Car Preview"
                style={{ width: '120px', marginTop: '10px', borderRadius: '8px' }}
              />
            )}

            <button type="submit" className="submit-ride">Submit</button>
          </form>
        )}

        <div className="car-rental-cards">
          {carrental.map(car => {
            return (
              <div className={`car-card ${!car.available ? 'disabled-card' : ''}`} key={car._id}>
                <div className="card-img">
                  <img
                    src={car.Choosefile}
                    alt={car.VechicleModel}
                  />
                </div>
                <div className="car-rental-details">
                  <div className="name">
                    <h2>{car.VechicleModel}</h2>
                    <span className="amount">{car.RentalAmount}</span>
                  </div>
                  <p className="car-description">{car.VechicleDescription}</p>
                  <div className="available">
                    <p>Amount:<span> {car.RentalPeriod}</span></p>
                    <p>Milage:<span>{car.VechileMileage}</span></p>
                  </div>
                </div>
                {car?.user && user && car.user._id !== user._id && (
                  <button
                    className="contact-owner"
                    onClick={() => handleContactOwner(car.user)}
                  >
                    Contact Owner
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default Carental;