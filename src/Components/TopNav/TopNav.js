// NavBar.js

import React, { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import db, { storage } from "../../firebase";
import { updateUserProfileImage } from "../../features/user/userSlice";
import { getDownloadURL, ref, deleteObject } from "firebase/storage";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteDoc } from "firebase/firestore";
import { deleteUser, getAuth, EmailAuthProvider, reauthenticateWithCredential  } from "firebase/auth";
import { clearUser } from "../../features/user/userSlice";
import "./TopNav.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaUserAlt } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { IoLogOutSharp } from "react-icons/io5";
import { IoTrashBinSharp } from "react-icons/io5";


const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user);
  const user = useSelector((store) => store.user);

  const handleMenuClick = () => {
    setIsMenuOpen((prevMenuOpen) => !prevMenuOpen);
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

//   const handleRemoveImageOption = async () => {

//     const isConfirmed = window.confirm("Are you sure you want to remove your profile picture?");
//     if (isConfirmed) {

//     try {
//       await handleRemoveImage();
//       setIsMenuOpen(false);
//       navigate("/details");
//     } catch (error) {
//       console.error("Error handling remove image option: ", error.message);
//     }
// }
//   };

  const navigateToForm = () => {
    navigate("/login");
  };

  const handleLogout = async () => {

    const isConfirmed = window.confirm("Are you sure you want to log out?");
    if (isConfirmed) {

    try {
      const auth = getAuth();
      await auth.signOut();

      dispatch(clearUser());
      dispatch(updateUserProfileImage({ profileImage: null }));
      navigateToForm();

      toast.success("Logout successful");
    } catch (error) {
      console.error("Error logging out: ", error.message);
      toast.error(`Error logging out: ${error.message}`);
    }
}
  };

//   const handleDelete = async () => {
//     const isConfirmed = window.confirm("Are you sure you want to delete your account?");
//     if (isConfirmed) {
//     try {
//       const userDocRef = doc(db, "users", user.userId);
//       await deleteDoc(userDocRef);

//       const auth = getAuth();
//       const currentUser = auth.currentUser;

//       await deleteUser(currentUser);

//       dispatch(clearUser());
//       dispatch(updateUserProfileImage({ profileImage: null }));
//       navigateToForm();

//       toast.success("User deleted successfully");
//       console.log("User data deleted successfully");
//     } catch (error) {
//       console.error("Error deleting user data: ", error.message);
//       toast.error(`Error deleting user: ${error.message}`);
//     }
// }
//   };

const handleDelete = async () => {
  const isConfirmed = window.confirm("Are you sure you want to delete your account?");
  if (isConfirmed) {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      const password = prompt("Please enter your password for confirmation:");
      const credential = EmailAuthProvider.credential(currentUser.email, password);
      await reauthenticateWithCredential(currentUser, credential);

      const userDocRef = doc(db, "users", user.userId);
      await deleteDoc(userDocRef);
      await deleteUser(currentUser);

      dispatch(clearUser());
      dispatch(updateUserProfileImage({ profileImage: null }));
      navigateToForm();

      toast.success("User deleted successfully");
      console.log("User data deleted successfully");
    } catch (error) {
      console.error("Error deleting user data: ", error.message);
      toast.error(`Error deleting user: ${error.message}`);
    }
  }
};


  return (
    <div className="navbar">
  <div className="app-name" onClick={() => navigate("/list")}>MyApp</div>
      <div className="menu-drop" onClick={handleMenuClick}>
        <div className="menu-icon">&#8942;</div>
        {isMenuOpen && (
          <div className="dropdown-menu">
             <button className="profile-button btnFlex"  onClick={() => navigate("/details")}>
             <FaUserAlt className="react-icon" /> My Profile
            </button>
            {/* <button className="remove-button btnFlex" onClick={handleRemoveImageOption}>
            <MdPersonRemove className="react-icon"/>Remove Dp
            </button> */}
            <button className="list-button btnFlex" onClick={() => navigate("/list")}>
            <FaClipboardList className="react-icon"/>Users List
            </button>

            <button className="delete-btn btnFlex" onClick={handleDelete}>
            <IoTrashBinSharp className="react-icon"
             />Delete Account 
            </button>
            <button className="logout-btn btnFlex" onClick={handleLogout}>
            <IoLogOutSharp className="react-icon" /> Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
