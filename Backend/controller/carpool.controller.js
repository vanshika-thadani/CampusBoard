const Carpool = require('../models/carpool.model');
const mongoose = require("mongoose");
const User = require("../models/user.model")


const getAllCarpools = async (req, res) => {
    try {
        const carpools = await Carpool.find().populate('user','_id username email');
        return res.status(200).json(carpools);
    } catch (err) {
        return res.status(500).json({ message: 'internal Server Error' });
    }
}

const postcarpool = async(req,res) =>{
    try {
        const user = req.user;

        const {from,to,time,seatsAvailable,pricePerSeat} = req.body;

        if (!from|| !to || !time || !seatsAvailable || !pricePerSeat ){
            return res.status(400).json({message: "all fields are required"})
        }
        const carpool = await Carpool.create({
            from,
            to,
            time,
            seatsAvailable,
            pricePerSeat,
            user: user._id
        });
        user.carpools.push(carpool._id);
        await user.save();
        return res.status(201).json(carpool);

    } catch (error) {
        console.error("Post Carpool Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}
module.exports = { getAllCarpools,postcarpool }