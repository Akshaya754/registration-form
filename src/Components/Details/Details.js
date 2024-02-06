//"Details.js"

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link} from "react-router-dom";
import EditModal from "../Edit/Edit";
import defaultAvatar from "../../assets/avatar.jpeg";
import "./Details.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavBar from "../TopNav/TopNav";


const Details = ({ history }) => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
 
  const handleEditClick = () => {
    setIsEditModalOpen(true);
    navigate("/edit");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  console.log(user);

  const handleImageClick = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  console.log(user);

  return (
    <div className=" detail-container">
      <NavBar/>
      <div className="container">
      <ToastContainer />
      
        <h1 className="header">User Profile</h1>
        <div className="details-container">
          {user.profileImage ? (
            <div className="profile-image-container">
              <img
                className="profile-image"
                src={user.profileImage}
                onClick={handleImageClick}
              />
              
            </div>
          ) : (
            <img
              className="default-avatar"
              src={defaultAvatar}
              alt="Default Avatar"
              onClick={handleImageClick}
            />
          )}
          
          <table className="user-details-table">
            <tbody>
              <tr>
                <td className="detail-item-label">Username:</td>
                <td className="detail-item">{user.username}</td>
              </tr>
              <tr>
                <td className="detail-item-label">Email:</td>
                <td className="detail-item">{user.email}</td>
              </tr>
              <tr>
                <td className="detail-item-label">Phone:</td>
                <td className="detail-item">{user.phone}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="buttons-container">
          <button className="edit-btn" onClick={handleEditClick}>
            Edit profile
          </button>
        </div>
        {isEditModalOpen && (
          <EditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
          />
        )}
        {isImageModalOpen && (
          <div className="image-modal-overlay" onClick={closeImageModal}>
            <div className="image-modal">
              <img
                className="enlarged-image"
                src={user.profileImage || defaultAvatar}
                alt="Enlarged Profile"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
