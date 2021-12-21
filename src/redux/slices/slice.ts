import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CounterState {
  // value: string
  name: string
}

const initialState: CounterState = {
  // value: 0,
  name: "",
//   students: ""
}

export const counterSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent: (state, action: PayloadAction<number>) => {
      state.name += action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { addStudent } = counterSlice.actions

export default counterSlice.reducer