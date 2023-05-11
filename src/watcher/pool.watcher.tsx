import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { web3 } from '@project-serum/anchor'

import Watcher from './watcher'

import { initPools, upsetPool } from 'store/pools.controller'
import { AppDispatch } from 'store'
import { useProgram } from 'hooks/useProgram'
import { createGlobalState } from 'react-use'
import { asyncWait } from 'utils'
// TODO: Config
const NAME = 'pool'
const FILTER: web3.GetProgramAccountsFilter[] = []

export const useLoadingContracts = createGlobalState<boolean>(true)

const PoolWatcher = () => {
  const dispatch = useDispatch<AppDispatch>()
  const program = useProgram()
  const [, setLoading] = useLoadingContracts()

  // TODO: init all account data
  const init = useCallback(
    async (data: any) => {
      dispatch(initPools(data))
      await asyncWait(500)
      setLoading(false)
    },
    [dispatch, setLoading],
  )
  // TODO: upset account data
  const upset = useCallback(
    (key: string, value: any) =>
      dispatch(upsetPool({ address: key, data: value })),
    [dispatch],
  )

  if (!program) return null
  return (
    <Watcher
      program={program}
      name={NAME}
      filter={FILTER}
      init={init}
      upset={upset}
    />
  )
}
export default PoolWatcher
