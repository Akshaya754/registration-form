import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../../firebase";
import defaultAvatar from "../../assets/avatar.jpeg";
import "./list.css";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import NavBar from "../TopNav/TopNav";

const UsersList = () => {
  const user = useSelector((store) => store.user);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [enlargedImg, setEnlargedImg] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleImageClick = (imageSrc) => {
    setEnlargedImg(imageSrc);
  };

  const closeEnlargedImg = () => {
    setEnlargedImg(null);
  };

  return (
    <div>
      <NavBar />

      <div className="list-container">
        {isLoading ? (
          <div className="loading-container">
            <ClipLoader color="#36d7b7" />
          </div>
        ) : (
          <>
            <h1>Users List</h1>
            <table>
              <thead>
                <tr>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Image</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td>
                      <img
                        src={user.profileImage || defaultAvatar}
                        alt="User Avatar"
                        className="user-image"
                        onClick={() => handleImageClick(user.profileImage)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {enlargedImg && (
          <div className="enlarged-img-overlay" onClick={closeEnlargedImg}>
            <div className="enlarged-img">
              <img
                className="enlarged-image"
                src={enlargedImg}
                alt="Enlarged Profile"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
