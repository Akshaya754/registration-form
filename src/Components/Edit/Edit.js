// EditModal.js
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateUserDetails } from "../../features/user/userSlice";
import "./Edit.css";
import { doc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import db, { storage } from "../../firebase";
import {  deleteObject } from "firebase/storage";

import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import defaultAvatar from "../../assets/avatar.jpeg";
import NavBar from "../TopNav/TopNav";
import { FaPlus , FaMinus} from 'react-icons/fa';
import { updateUserProfileImage } from "../../features/user/userSlice";

const EditModal = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((store) => store.user);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const fileInputRef = React.createRef();
  const [isImageEnlarged, setIsImageEnlarged] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const [editedData, setEditedData] = useState({
    username: currentUser.username,
    phone: currentUser.phone,
    profileImage: currentUser.profileImage,
    email: currentUser.email,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  
  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  const handleInputChange = (e) => {
    if (e.target.name === "phone") {
      const inputValue = e.target.value.replace(/\D/g, ''); 
      if (inputValue.length > 12) {
        toast.error("Phone number should not exceed 12 digits");
        return;
      }
      setEditedData({
        ...editedData,
        [e.target.name]: inputValue,
      });
    } else {
      if (e.target.name === "username" && /[^A-Za-z\s]/.test(e.target.value)) {
        toast.error("Name should only contain spaces and alphabets");
        return;
      }

    
    setEditedData({
      ...editedData,
      [e.target.name]: e.target.value,
    });
    setHasUnsavedChanges(true);
  }
    
  };

  const handleImageClick = () => {
   
    fileInputRef.current.click();
    
   
  };


  const handleImageClose = () => {
    setIsImageEnlarged(false);
  };


  const handleImageChange = (e) => {
    const imageFile = e.target.files[0];
    setEditedData({
      ...editedData,
      profileImage: imageFile,
    });

    setHasUnsavedChanges(true);
  };
  const handleCancel = () => {
    navigate("/details");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      if (typeof editedData.profileImage !== "string") {
        const imageRef = ref(storage, `profile_images/${currentUser.userId}`);
        await uploadBytes(imageRef, editedData.profileImage);
        const imageUrl = await getDownloadURL(imageRef);
        editedData.profileImage = imageUrl;
      }

      const userDocRef = doc(db, "users", currentUser.userId);
      await updateDoc(userDocRef, {
        username: editedData.username,
        phone: editedData.phone,
        profileImage: editedData.profileImage,
      });

      dispatch(updateUserDetails(editedData));
      navigate("/details");
      setIsLoading(false);

      toast.success("Data updated successfully!");
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error updating data in the database:", error.message);
    }

    setEditedData({
      username: "",
      phone: "",
      profileImage: null,
    });
  };

  const handleRemoveImage = async () => {
    try {
      const userDocRef = doc(db, "users", user.userId);
      const imageRef = ref(storage, `profile_images/${user.userId}`);

      const downloadURL = await getDownloadURL(imageRef);

      if (downloadURL) {
        await deleteObject(imageRef);
      }

      await updateDoc(userDocRef, { profileImage: null });

      dispatch(updateUserProfileImage({ profileImage: null }));

      console.log("Profile image removed successfully");
    } catch (error) {
      console.error("Error removing profile image: ", error.message);
    }
  };

  const handleRemoveImageOption = async () => {

    const isConfirmed = window.confirm("Are you sure you want to remove your profile picture?");
    if (isConfirmed) {

    try {
      await handleRemoveImage();
      setIsMenuOpen(false);
      navigate("/details");
    } catch (error) {
      console.error("Error handling remove image option: ", error.message);
    }
}
  };


  return (
    <div>
      <NavBar />

      <div className="container-home">
        <div className="edit-container">
          {isLoading ? (
            <div className="loading-container">
            <ClipLoader color="#36d7b7" />
            </div>
          ) : (
            <form className="edit-form" onSubmit={handleSubmit}>
              <div className="edit-heading">
                <h1>Edit Profile</h1>
              </div>
              {user.profileImage ? (
                <div className="user-profile">
                  <img
                    className="profile-img"
                    src={user.profileImage}
                    alt=""
                    onClick={handleImageClick}
                  />
                  <div className="edit-icon" onClick={handleImageClick}>
                    <FaPlus />
                  </div>
                </div>
              ) : (
                <div className="profile-img-container">
                <img
                  className="avatar"
                  src={editedData.profileImage || defaultAvatar}
                  alt="Default Avatar"
                  onClick={handleImageClick}
                />
                   <div className="edit-icon" onClick={handleImageClick}>
                    <FaPlus />
                  </div>
                </div>
              )}
                <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
              <label>Name:</label>
              <input
                type="text"
                name="username"
                value={editedData.username}
                onChange={handleInputChange}
                
              />

              <label>Phone:</label>
              <input
                type="tel"
                name="phone"
                value={editedData.phone}
                onChange={handleInputChange}
              />

              {user.profileImage && (
                <div className="remove-image" onClick={handleRemoveImageOption}>
                  <FaMinus />
                </div>
              )}


              <div className="btn-group">
                <button
                  className="cancel-btn"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="submit-btn"
                  type="submit"
                  disabled={!hasUnsavedChanges}
                >
                  Save
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
      {/* {isImageEnlarged && (
        <div className="enlarged-image-modal" onClick={handleImageClose}>
          <img className="enlarged-image" src={user.profileImage} alt="Enlarged Avatar" />
        </div>
      )} */}
    </div>
  );
};

export default EditModal;
