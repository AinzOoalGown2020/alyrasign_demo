import { PublicKey } from '@solana/web3.js';

// Définition du type pour les comptes de l'IDL
interface IdlAccountItem {
  name: string;
  isMut: boolean;
  isSigner: boolean;
}

// Types pour le programme
export interface AlyraSignAccountData {
  requester: PublicKey;
  role: string;
  message: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: number;
}

export interface AlyraSignAccounts {
  AccessRequest: AlyraSignAccountData;
  Formation: FormationData;
  Session: SessionData;
  Attendance: AttendanceData;
  WaitlistEntry: WaitlistEntryData;
}

export interface FormationData {
  id: string;
  name: string;
  description: string;
  trainer: PublicKey;
  createdAt: number;
  updatedAt: number;
}

export interface SessionData {
  id: string;
  formationId: string;
  date: number;
  startTime: number;
  endTime: number;
  location: string;
  createdAt: number;
  updatedAt: number;
}

export interface AttendanceData {
  id: string;
  sessionId: string;
  student: PublicKey;
  isPresent: boolean;
  checkInTime: number;
  checkOutTime: number | null;
  note: string;
  createdAt: number;
  updatedAt: number;
}

export interface WaitlistEntryData {
  id: string;
  formationId: string;
  student: PublicKey;
  status: string;
  position: number;
  createdAt: number;
  updatedAt: number;
}

// Programme ID - Utiliser directement la valeur
const PROGRAM_ID = new PublicKey("ATYrhRcGeQGKo43urjfgcWHkqMpDLYaCB9wmXodTC3Vu");

export { PROGRAM_ID };

// Note: Nous utilisons isMut au lieu de isWritable car c'est la propriété standard d'Anchor
// pour indiquer si un compte peut être modifié ou non.

// Note: Nous définissons notre propre type pour l'IDL car le type exact peut varier selon la version d'Anchor
export type AlyraSignIDL = {
  version: string;
  name: string;
  instructions: {
    name: string;
    accounts: {
      name: string;
      isMut: boolean;
      isSigner: boolean;
    }[];
    args: {
      name: string;
      type: string;
    }[];
  }[];
  accounts: {
    name: string;
    type: {
      kind: string;
      fields: {
        name: string;
        type: string | { defined: string } | { option: string };
      }[];
    };
  }[];
  types: {
    name: string;
    type: {
      kind: string;
      variants: {
        name: string;
      }[];
    };
  }[];
  errors: {
    code: number;
    name: string;
    msg: string;
  }[];
  metadata: {
    address: string;
  };
};

// Note: Nous utilisons any temporairement car le type exact d'Anchor n'est pas accessible
// TODO: Remplacer par le type correct une fois qu'il sera disponible
export const IDL: any = {
  version: "0.1.0",
  name: "alyrasign",
  instructions: [
    {
      name: "createAccessRequest",
      accounts: [
        {
          name: "requester",
          isMut: false,
          isSigner: true
        },
        {
          name: "accessRequest",
          isMut: true,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "role",
          type: "string"
        },
        {
          name: "message",
          type: "string"
        }
      ]
    },
    {
      name: "createFormation",
      accounts: [
        {
          name: "trainer",
          isMut: false,
          isSigner: true
        },
        {
          name: "formation",
          isMut: true,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "id",
          type: "string"
        },
        {
          name: "name",
          type: "string"
        },
        {
          name: "description",
          type: "string"
        }
      ]
    },
    {
      name: "createSession",
      accounts: [
        {
          name: "trainer",
          isMut: false,
          isSigner: true
        },
        {
          name: "formation",
          isMut: false,
          isSigner: false
        },
        {
          name: "session",
          isMut: true,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "id",
          type: "string"
        },
        {
          name: "formationId",
          type: "string"
        },
        {
          name: "date",
          type: "i64"
        },
        {
          name: "startTime",
          type: "i64"
        },
        {
          name: "endTime",
          type: "i64"
        },
        {
          name: "location",
          type: "string"
        }
      ]
    },
    {
      name: "recordAttendance",
      accounts: [
        {
          name: "student",
          isMut: false,
          isSigner: true
        },
        {
          name: "session",
          isMut: false,
          isSigner: false
        },
        {
          name: "attendance",
          isMut: true,
          isSigner: false
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false
        }
      ],
      args: [
        {
          name: "id",
          type: "string"
        },
        {
          name: "sessionId",
          type: "string"
        },
        {
          name: "isPresent",
          type: "bool"
        },
        {
          name: "note",
          type: "string"
        }
      ]
    }
  ],
  accounts: [
    {
      name: "AccessRequest",
      type: {
        kind: "struct",
        fields: [
          {
            name: "user",
            type: "publicKey"
          },
          {
            name: "name",
            type: "string"
          },
          {
            name: "email",
            type: "string"
          },
          {
            name: "role",
            type: "string"
          },
          {
            name: "message",
            type: "string"
          },
          {
            name: "status",
            type: {
              defined: "RequestStatus"
            }
          },
          {
            name: "createdAt",
            type: "i64"
          },
          {
            name: "updatedAt",
            type: "i64"
          }
        ]
      }
    },
    {
      name: "Formation",
      type: {
        kind: "struct",
        fields: [
          {
            name: "id",
            type: "string"
          },
          {
            name: "name",
            type: "string"
          },
          {
            name: "description",
            type: "string"
          },
          {
            name: "trainer",
            type: "publicKey"
          },
          {
            name: "createdAt",
            type: "i64"
          },
          {
            name: "updatedAt",
            type: "i64"
          }
        ]
      }
    },
    {
      name: "Session",
      type: {
        kind: "struct",
        fields: [
          {
            name: "id",
            type: "string"
          },
          {
            name: "formationId",
            type: "string"
          },
          {
            name: "date",
            type: "i64"
          },
          {
            name: "startTime",
            type: "i64"
          },
          {
            name: "endTime",
            type: "i64"
          },
          {
            name: "location",
            type: "string"
          },
          {
            name: "createdAt",
            type: "i64"
          },
          {
            name: "updatedAt",
            type: "i64"
          }
        ]
      }
    },
    {
      name: "Attendance",
      type: {
        kind: "struct",
        fields: [
          {
            name: "id",
            type: "string"
          },
          {
            name: "sessionId",
            type: "string"
          },
          {
            name: "student",
            type: "publicKey"
          },
          {
            name: "isPresent",
            type: "bool"
          },
          {
            name: "checkInTime",
            type: "i64"
          },
          {
            name: "checkOutTime",
            type: { option: "i64" }
          },
          {
            name: "note",
            type: "string"
          },
          {
            name: "createdAt",
            type: "i64"
          },
          {
            name: "updatedAt",
            type: "i64"
          }
        ]
      }
    }
  ],
  types: [
    {
      name: "RequestStatus",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Pending"
          },
          {
            name: "Approved"
          },
          {
            name: "Rejected"
          }
        ]
      }
    }
  ],
  errors: [
    {
      code: 6000,
      name: "InvalidRole",
      msg: "Invalid role specified"
    },
    {
      code: 6001,
      name: "RequestAlreadyExists",
      msg: "Access request already exists for this user"
    },
    {
      code: 6002,
      name: "InvalidFormation",
      msg: "Invalid formation data"
    },
    {
      code: 6003,
      name: "InvalidSession",
      msg: "Invalid session data"
    },
    {
      code: 6004,
      name: "InvalidAttendance",
      msg: "Invalid attendance data"
    }
  ],
  metadata: {
    address: PROGRAM_ID.toString()
  }
};

// Log de l'IDL après sa création
console.log('Création de l\'IDL:', {
  version: IDL.version,
  name: IDL.name,
  instructions: IDL.instructions?.length,
  accounts: IDL.accounts?.length,
  types: IDL.types?.length,
  errors: IDL.errors?.length,
  metadata: IDL.metadata
}); 