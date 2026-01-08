import React from 'react';
import "./Carrentalcard.css";



const Carrentalcard = ({Choosefile,VechicleModel,VechicleDescription,RentalAmount,RentalPeriod,VechileMileage}) => {
  return (
    <div id='carrentalcontainer'>
      <div className="carrentalcard">
        <div className="cardimg">
          <img src={Choosefile} alt={VechicleModel} />
        </div>
        <div className="carrentaldetailscard">
          <div className="namecard">
            <h2>{VechicleModel}</h2>
          </div>
          <p className="cardescriptioncard">{VechicleDescription}</p>
          <div className="availablecard">
            <p>Period: <span>{RentalPeriod}</span></p>
            <p>Mileage: <span>{VechileMileage}</span></p>
          </div>
          <span className="amountcard">₹{RentalAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default Carrentalcard;