import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserContext } from '../Home/Home';
import './Places.css'

const Places = () => {
    const [places, handleSelectPlace, detail, user, setUser] = useContext(UserContext)
    const {name, details} = detail;
    const history = useHistory();
    const handleBooking = () => {
        history.push('/book')
    }
    return (
        <div className='d-flex justify-content-center align-items-center mt-5 px-5'>
            <div className='col-md-4 '>
                <h1>{name}</h1>
                <p>{details}</p>
                <button onClick={handleBooking} className='btn btn-warning'>Booking</button>
            </div>
            <div className='col-md-8 d-flex juctify-content-between'>
                {
                    places.map(place => <img  onClick={() => handleSelectPlace(place.image)} className='w-25 m-3 destination-img' src={place.image} alt=""/>)
                }

            </div>
        </div>
    );
};

export default Places;