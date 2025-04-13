import { Idl, Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

export type Alyrasign = Idl & {
  version: '0.1.0';
  name: 'alyrasign';
  instructions: [
    {
      name: 'createAccessRequest';
      accounts: [
        {
          name: 'requester';
          isMut: true;
          isSigner: true;
        },
        {
          name: 'accessRequest';
          isMut: true;
          isSigner: false;
        },
        {
          name: 'systemProgram';
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: 'role';
          type: 'string';
        },
        {
          name: 'message';
          type: 'string';
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'accessRequest';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'user';
            type: 'publicKey';
          },
          {
            name: 'role';
            type: 'string';
          },
          {
            name: 'name';
            type: 'string';
          },
          {
            name: 'email';
            type: 'string';
          },
          {
            name: 'message';
            type: 'string';
          },
          {
            name: 'status';
            type: 'string';
          },
          {
            name: 'createdAt';
            type: 'i64';
          },
          {
            name: 'updatedAt';
            type: 'i64';
          }
        ];
      };
    }
  ];
}; 