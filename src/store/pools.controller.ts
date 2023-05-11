import { IdlAccounts } from '@project-serum/anchor'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RemiSwap } from 'hooks/useProgram'

/**
 * Store constructor
 */
export type PoolData = IdlAccounts<RemiSwap>['pool']

export type PoolState = Record<string, PoolData>

const NAME = 'pools'
const initialState: PoolState = {}

/**
 * Actions
 */

export const initPools = createAsyncThunk(
  `${NAME}/initPools
  `,
  async (bulk: PoolState) => {
    console.log('thong tin  pool ban dau =>',bulk)
    return bulk
  },
)

export const upsetPool = createAsyncThunk<
  PoolState,
  { address: string; data: PoolData },
  { state: any }
>(`${NAME}/upsetPool`, async ({ address, data }) => {
  return { [address]: data }
})

const slice = createSlice({
  name: NAME,
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    void builder
      .addCase(initPools.fulfilled, (state, { payload }) => payload)
      .addCase(
        upsetPool.fulfilled,
        (state, { payload }) => void Object.assign(state, payload),
      ),
})

export default slice.reducer
