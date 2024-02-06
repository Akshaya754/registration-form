// import { configureStore } from "@reduxjs/toolkit";
// import userReducer from "../features/user/userSlice";

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//   },
// });

// export default store;

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import userReducer from "../features/user/userSlice";

const persistConfig = {
  key: 'root',
  storage,
};


const persistedReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
});

const persist = persistStore(store);

export { store, persist };
