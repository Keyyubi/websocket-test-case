import { configureStore } from "@reduxjs/toolkit";
import orderbookSlice from "./components/Orderbook/orderbookSlice";

export const store = configureStore({
  reducer: {
    orderbook: orderbookSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch