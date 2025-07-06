const CarRental = require("../models/carrental.model");
const User = require("../models/user.model");


const getallcars = async (req, res) => {
    try {
        const carrentals = await CarRental.find().populate("user","_id username ") // Added await
        return res.status(200).json(carrentals);
    } catch (error) {
        console.error("Internal server error:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

const postcarrental = async (req, res) => {

    try {
        const user = req.user;

        if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized. User not found." });
    }


        const {
            VechicleModel,
            RentalAmount,
            RentalPeriod,
            VechileMileage,
            VechicleDescription,
            Available,
        } = req.body;

        const Choosefile = req.file?.path ;
            if (!req.file || !req.file.path) {
                return res.status(400).json({ message: "Image upload failed" });
            }


        if (
            !VechicleModel ||
            !RentalAmount ||
            !RentalPeriod ||
            !VechileMileage ||
            !VechicleDescription ||
            Available === undefined || // This allows boolean false to pass
            !Choosefile
        ) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const carrental = await CarRental.create({
            VechicleModel,
            RentalAmount,
            RentalPeriod,
            VechileMileage,
            VechicleDescription,
            Available,
            Choosefile,
            user: req.user._id
        });
        user.carrentals.push(carrental._id);
        await user.save();
        return res.status(201).json(carrental);
    } catch (error) {
        console.error("Internal server error:", error.message);
         console.error(error)
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports = {
    getallcars,
    postcarrental,
   
};