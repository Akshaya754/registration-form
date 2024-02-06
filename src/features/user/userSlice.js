import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: "",
  username: "",
  email: "",
  phone: "",
  password: "",
  profileImage: "",
};

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    createUser: (state, action) => {
      state.userId = action.payload.userId;
      state.email = action.payload.email;
      state.phone = action.payload.phone;
      state.username = action.payload.username;
      state.profileImage = action.payload.profileImage;
    },
    updateUserProfileImage: (state, action) => {
      state.profileImage = action.payload.profileImage;
    },
    updateUserDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
    clearUser: (state) => {
      return null;
    }
  },
});

export const { createUser, updateUserDetails,updateUserProfileImage, clearUser } = userSlice.actions;

export default userSlice.reducer;
