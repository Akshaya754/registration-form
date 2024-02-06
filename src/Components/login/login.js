import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createUser,  updateUserDetails } from "../../features/user/userSlice";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import db from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './login.css';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const fetchUserData = async (userId) => {
    try{
    const user = await getDoc(doc(db, "users", userId));

    if (user.exists()) {
      return user.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return null;
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(loginData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true); 
      const auth = getAuth();
      const { user } = await signInWithEmailAndPassword(
        auth,
        loginData.email,
        loginData.password
      );

      const data = await fetchUserData(user.uid);

      if (data) {
      dispatch(
        createUser({
          userId: user.uid,
          email: user.email,
          username: data ? data.username : "",
          phone: data ? data.phone : "",
          profileImage: data ? data.profileImage : ""
        })
      );
      navigate("/list");

      }else {
        console.error("User data not found.");
        toast.error("User not found. Please check your credentials.");

      }
      toast.success("User logged in successfully!");

    } catch (error) {
      console.error("Error signing in: ", error.message);
      toast.error("Invalid credentials. Please check your email and password.");

    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      {isLoading ? (
        <ClipLoader color="#36d7b7" />
      ) : (
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-heading">
          <h1>Login</h1>
        </div>

        <label>Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={loginData.email}
          onChange={handleChange}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          value={loginData.password}
          onChange={handleChange}
        />
        <button className="login-btn" type="submit">
          Login
        </button>
      </form>
      )}
    </div>
  );
};

export default LoginForm;
