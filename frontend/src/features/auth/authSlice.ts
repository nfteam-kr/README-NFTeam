import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
// import Axios from "../../api/Axios";
import { RootState } from "../../app/store";
import moment from "moment";

export interface AuthState {
  userAddress: string;
  userName: string;
  userAvatar: string;
  status: "idle" | "loading" | "success" | "failed";
}

const initialState: AuthState = {
  userAddress: `testAddress-${Math.floor(Math.random() * 123456)}`,
  userName: `익명의 ${Math.floor(Math.random() * 100)}번째 개발자`,
  userAvatar: "",
  status: "idle",
};

// Smart-contract에 요청할 이름
export const loginUser = createAsyncThunk(
  "auth/getUserAddress",
  // string type으로 들어오지만, axios에 대입할 때 AxiosRequestConfig에 들어갈 값이 any..
  async (loginUserAddress: any, { rejectWithValue }) => {
    try {
      // const response = await Axios.get('/', loginUserAddress);
      const response = { data: loginUserAddress };
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.userAddress = "";
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.status = "success";
        state.userAddress = payload;
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = "failed";
      });
  },
});

// actions
export const { logoutUser } = authSlice.actions;

// selector
export const selectUserAddress = (state: RootState) => state.auth.userAddress;
export const selectUserName = (state: RootState) => state.auth.userName;
export default authSlice.reducer;

// util

export const truncatedAddress = (longAddress: String) => {
  if (!longAddress) return "정답자가 없습니다.";
  if (longAddress.length < 8) return longAddress;
  return `${longAddress.slice(0, 4) + "...." + longAddress.slice(-4)}`;
};

export const change_date = (date: Date) => {
  const transDate = moment(date).format("YYYY년 MM월 DD일"); // 날짜 형식 변환
  return transDate;
};
