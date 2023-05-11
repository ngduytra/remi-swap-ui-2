import { Address } from '@project-serum/anchor'
import { useSelector } from 'react-redux'
import { AppState } from 'store'

export const usePools = () => {
  const pools = useSelector((state: AppState) => state.pools)
  return pools
}

export const usePool = (address: Address) => {
  const poolData = useSelector(
    (state: AppState) => state.pools[address.toString()],
  )
  return poolData
}

