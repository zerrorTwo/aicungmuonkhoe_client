import { createSlice } from "@reduxjs/toolkit"

interface SelfManagedAccount {
  id: string
  fullName: string
  gender: string
  age: number
  dob: string
  avatar?: string
  isMyself: boolean
}

interface SelfManagedAccountState {
  currentAccount: SelfManagedAccount | null
  accounts: SelfManagedAccount[]
  loading: boolean
}

const initialState: SelfManagedAccountState = {
  currentAccount: {
    id: "1",
    fullName: "User",
    gender: "nam",
    age: 25,
    dob: new Date().toISOString(),
    isMyself: true,
  },
  accounts: [],
  loading: false,
}

const selfManagedAccountSlice = createSlice({
  name: "selfManagedAccount",
  initialState,
  reducers: {
    setCurrentAccount: (state, action) => {
      state.currentAccount = action.payload
    },
  },
})

export const { setCurrentAccount } = selfManagedAccountSlice.actions

// Selectors
export const watchGetSelfAccountState = (state: any) =>
  state.selfManagedAccount?.currentAccount

export const watchGetDetailSelfAccountState = (state: any) =>
  state.selfManagedAccount?.currentAccount

export default selfManagedAccountSlice.reducer
