import { Program, web3 } from '@project-serum/anchor'
import { useMemo } from 'react'
import { useAnchorProvider } from './useAnchor'
import { isAddress } from 'utils'

const PROGRAM_ID = new web3.PublicKey(
  '4xKxo3gkzdmA4VnzsTbcVazwonAFndercdizR58fqagn',
)
export const useProgram = () => {
  const provider = useAnchorProvider()

  const program = useMemo(() => {
    if (!provider) return null
    return new Program(IDL, PROGRAM_ID, provider)
  }, [provider])
  return program
}

export const PROGRAMS = {
  rent: web3.SYSVAR_RENT_PUBKEY,
  systemProgram: web3.SystemProgram.programId,
}

export const deriveContractAddress = async (hash: number[]) => {
  const [contract] = await web3.PublicKey.findProgramAddressSync(
    [Buffer.from('contract'), Buffer.from(hash)],
    PROGRAM_ID,
  )
  return contract
}

export const deriveTreasurerAddress = async (poolAddress: string) => {
  if (!isAddress(poolAddress)) throw new Error('Invalid pool address')
  const [treasurerPublicKey] = await web3.PublicKey.findProgramAddress(
    [Buffer.from('treasurer'), new web3.PublicKey(poolAddress).toBuffer()],
    PROGRAM_ID,
  )
  return treasurerPublicKey.toBase58()
}

export const deriveSignerAddress = async (
  contract: web3.PublicKey,
  owner: web3.PublicKey,
) => {
  const [signer] = await web3.PublicKey.findProgramAddressSync(
    [Buffer.from('signer'), contract.toBuffer(), owner.toBuffer()],
    PROGRAM_ID,
  )
  return signer
}

export type RemiSwap = {
  "version": "0.1.0",
  "name": "remi_swap",
  "instructions": [
    {
      "name": "createPool",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "yToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "srcXAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "srcYAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "xTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "yTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "x",
          "type": "u64"
        },
        {
          "name": "y",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "srcXAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dstYAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "xTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "yTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "xToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "yToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "a",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "x",
            "type": "u64"
          },
          {
            "name": "xToken",
            "type": "publicKey"
          },
          {
            "name": "y",
            "type": "u64"
          },
          {
            "name": "yToken",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CreatePoolEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "x",
          "type": "u64",
          "index": false
        },
        {
          "name": "xToken",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "y",
          "type": "u64",
          "index": false
        },
        {
          "name": "yToken",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "SwapEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "a",
          "type": "u64",
          "index": false
        },
        {
          "name": "b",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Overflow",
      "msg": "Operation overflowed"
    },
    {
      "code": 6001,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6002,
      "name": "NoBump",
      "msg": "Cannot find treasurer account"
    }
  ]
};

export const IDL: RemiSwap = {
  "version": "0.1.0",
  "name": "remi_swap",
  "instructions": [
    {
      "name": "createPool",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "xToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "yToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "srcXAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "srcYAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "xTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "yTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "x",
          "type": "u64"
        },
        {
          "name": "y",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swap",
      "accounts": [
        {
          "name": "authority",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pool",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "srcXAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dstYAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "treasurer",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "xTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "yTreasury",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "xToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "yToken",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "a",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "pool",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "x",
            "type": "u64"
          },
          {
            "name": "xToken",
            "type": "publicKey"
          },
          {
            "name": "y",
            "type": "u64"
          },
          {
            "name": "yToken",
            "type": "publicKey"
          }
        ]
      }
    }
  ],
  "events": [
    {
      "name": "CreatePoolEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "x",
          "type": "u64",
          "index": false
        },
        {
          "name": "xToken",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "y",
          "type": "u64",
          "index": false
        },
        {
          "name": "yToken",
          "type": "publicKey",
          "index": false
        }
      ]
    },
    {
      "name": "SwapEvent",
      "fields": [
        {
          "name": "authority",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "pool",
          "type": "publicKey",
          "index": false
        },
        {
          "name": "a",
          "type": "u64",
          "index": false
        },
        {
          "name": "b",
          "type": "u64",
          "index": false
        }
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Overflow",
      "msg": "Operation overflowed"
    },
    {
      "code": 6001,
      "name": "InvalidAmount",
      "msg": "Invalid amount"
    },
    {
      "code": 6002,
      "name": "NoBump",
      "msg": "Cannot find treasurer account"
    }
  ]
};
