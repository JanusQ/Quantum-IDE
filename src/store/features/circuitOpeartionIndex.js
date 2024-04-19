import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    opeartionValue:0
};
export const circuitOpeartionIndex = createSlice({
  name: "circuitOpeartionIndex",
  initialState,
  reducers: {
    changeIndex: (state, { payload }) => {
      state.opeartionValue = payload;
    },
  },
});
export const {changeIndex}=circuitOpeartionIndex.actions
export default circuitOpeartionIndex.reducer