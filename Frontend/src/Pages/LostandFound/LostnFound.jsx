import React, { useState } from "react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import "./LostnFound.css";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useGetUser } from "../../hooks/user/usegetuser";
import { motion } from "framer-motion";
import { uselostnfound } from "../../hooks/lostnfound/uselnfhooks";
import { useAddlostnfound } from "../../hooks/lostnfound/useaddlnfhooks";
import { useUserResources } from "../../hooks/user/useUserresources";
import { toast } from "react-toastify"; // ✅ Toastify import
import "react-toastify/dist/ReactToastify.css"; // ✅ Toastify CSS

const LostnFound = () => {
  const { lostAndFound, loading: lnfLoading, getallLostnfound } = uselostnfound();
  const { createlostnfound } = useAddlostnfound();
  const { refetchResources } = useUserResources();
  const { user, loading } = useGetUser();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [searchquery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [imagefile, setImagefile] = useState(null);
  const [newlnf, setNewlnf] = useState({
    itemName: "",
    itemDescription: "",
    itemStatus: "Lost",
    choosefile: "",
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
    setNewlnf((prev) => ({ ...prev, [name]: value }));
  };

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagefile(file);
      const previewUrl = URL.createObjectURL(file);
      setNewlnf((prev) => ({ ...prev, choosefile: previewUrl }));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createlostnfound(newlnf, imagefile);
      setNewlnf({
        itemName: "",
        itemDescription: "",
        itemStatus: "Lost",
        choosefile: "",
      });
      setImagefile(null);
      getallLostnfound();
      refetchResources();
      setShowForm(false);
      toast.success("Lost/Found item posted successfully!"); // ✅ Success toast
    } catch (err) {
      console.error("Submission failed", err);
      toast.error("Failed to submit item. Please try again."); // ✅ Error toast
    }
  };

  if (lnfLoading || !user) {
    return (
      <div className="loader-container">
        <motion.div
          className="loader"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        <p>Loading Lost & Found...</p>
      </div>
    );
  }

  const filteredItems = lostAndFound.filter((item) => {
    const query = searchquery.toLowerCase();
    const matchesQuery =
      item.itemName?.toLowerCase().includes(query) ||
      item.itemDescription?.toLowerCase().includes(query);
    const matchesStatus =
      statusFilter === "All" || statusFilter === "" || item.itemStatus === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="component-container">
      <Sidebar />
      <motion.div
        id="lostnfound"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="lnf-heading">
          <h2>Lost & Found</h2>
          <p>Find all reported lost/found items or report an item</p>
        </div>

        <button className="report-item" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : <><FaSearch /> Report an Item</>}
        </button>

        {showForm && (
          <form onSubmit={submitHandler}>
            <input
              className="inputt"
              type="text"
              name="itemName"
              placeholder="Item Name"
              value={newlnf.itemName}
              onChange={changeHandler}
              required
            />
            <textarea
              className="inputt"
              name="itemDescription"
              placeholder="Item Description"
              value={newlnf.itemDescription}
              onChange={changeHandler}
              required
            />
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="itemStatus"
                  value="Lost"
                  checked={newlnf.itemStatus === "Lost"}
                  onChange={changeHandler}
                />
                Lost
              </label>
              <label>
                <input
                  type="radio"
                  name="itemStatus"
                  value="Found"
                  checked={newlnf.itemStatus === "Found"}
                  onChange={changeHandler}
                />
                Found
              </label>
            </div>
            <input type="file" accept="image/*" onChange={imageHandler} />
            {newlnf.choosefile && (
              <img src={newlnf.choosefile} alt="Preview" className="upload-image" />
            )}
            <button type="submit" className="submit-lnf">Submit</button>
          </form>
        )}

        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-box"
            placeholder="Search for lost items..."
            value={searchquery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="tab-buttons">
          {["All", "Lost", "Found"].map((status) => (
            <button
              key={status}
              className={statusFilter === status ? "tab active" : "tab"}
              onClick={() => setStatusFilter(status)}
            >
              {status} Items
            </button>
          ))}
        </div>

        <div className="lnf-cards">
          {filteredItems.map((item, index) => (
            <div className="lnf-card" key={index}>
              <div className="lnf-img">
                <img src={item.choosefile} alt={item.itemName} />
              </div>
              <div className="lnf-details">
                <h3>{item.itemName}</h3>
                <p>{item.itemDescription}</p>
                <p className={`lnf-status ${item.itemStatus.toLowerCase()}`}>{item.itemStatus}</p>
              </div>
              {item.user?._id !== user._id && (
                <button className="contact" onClick={() => handleContactOwner(item.user)}>
                  Contact
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LostnFound;