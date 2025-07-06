
const LostnFound = require('../models/lostnfound.model');

const getalllostnfound = async (req, res) => {
  try {
    const lostnfound = await LostnFound.find().populate('user', '_id username email');
    return res.status(200).json(lostnfound);
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const postlostnfound = async (req, res) => {
  try {
    const user = req.user;
    const { itemName, itemDescription, itemStatus } = req.body;
    const choosefile = req.file?.path;

    if (!itemName || !itemDescription || !itemStatus || !choosefile) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const _lostnfound = await LostnFound.create({
      itemName,
      itemDescription,
      itemStatus,
      choosefile,
      user: user._id,
    });

    user.lostnfound.push(_lostnfound._id);
    await user.save();
    await _lostnfound.populate('user', '_id username email');

    return res.status(201).json(_lostnfound);
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getalllostnfound,
  postlostnfound,
};
