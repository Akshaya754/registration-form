import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Form.css";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import db from "../../firebase";
import { ClipLoader } from "react-spinners";

const Form = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    profileImage: null,
  });

  const handleChange = (e) => {
    let value = e.target.value;

    // if (e.target.name === "username") {
    //   value = value.replace(/[^a-zA-Z\s]/g, "");
    // }
    if (e.target.name === "username" && /[^A-Za-z\s]/.test(e.target.value)) {
      return;
    }
    if (e.target.name === "phone" && value.length > 12) {
      return;
    }
    if (e.target.name === "phone" && !/^\d*$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, profileImage: file });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);
      const auth = getAuth();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const storage = getStorage();
      const imageRef = ref(storage, `profile_images/${user.uid}`);

      if (formData.profileImage) {
        await uploadBytes(imageRef, formData.profileImage);
        const imageUrl = await getDownloadURL(imageRef);

        await setDoc(doc(db, "users", user.uid), {
          email: formData.email,
          phone: formData.phone,
          username: formData.username,
          profileImage: imageUrl,
        });
      } else {
        await setDoc(doc(db, "users", user.uid), {
          email: formData.email,
          phone: formData.phone,
          username: formData.username,
          profileImage: null,
        });
      }
      navigate("/login");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      alert(error.message);
    }
  };

  return (
    <div className="registration-container">
      {isLoading ? (
        <ClipLoader color="#36d7b7" />
      ) : (
        <form className="registration-form" onSubmit={handleSubmit}>
          <div className="registration-heading">
            <h1>Registration Form</h1>
          </div>

          <label>Full Name:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            placeholder="Enter full name"
            
            onChange={handleChange}
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
          />

          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone"
            value={formData.phone}
            onChange={handleChange}
          />
     
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
          />
          <button className="submit-butn" type="submit ">
            Register
          </button>
        </form>
      )}
    </div>
  );
};

export default Form;
