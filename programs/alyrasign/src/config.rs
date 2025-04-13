// Seeds pour les PDAs
pub const STORAGE_SEED: &[u8] = b"storage";
pub const REQUEST_SEED: &[u8] = b"request";
pub const FORMATION_SEED: &[u8] = b"formation";
pub const SESSION_SEED: &[u8] = b"session";
pub const ATTENDANCE_SEED: &[u8] = b"attendance";
pub const ENROLLMENT_SEED: &[u8] = b"enrollment";
pub const WAITLIST_SEED: &[u8] = b"waitlist";

// Tailles maximales des champs
pub const MAX_TITLE_LENGTH: usize = 200;
pub const MAX_DESCRIPTION_LENGTH: usize = 1000;
pub const MAX_MESSAGE_LENGTH: usize = 200;
pub const MAX_LOCATION_LENGTH: usize = 50;
pub const MAX_ROLE_LENGTH: usize = 10;

// Espaces des comptes
pub const FORMATION_SPACE: usize = 8 + // Discriminator
    200 + // title: String
    1000 + // description: String
    1 + // formation_type: FormationType (enum)
    32 + // trainer: Pubkey
    1 + // max_students: u8
    1 + // current_students: u8
    1 + // waitlist_size: u8
    1 + // current_waitlist: u8
    8 + // created_at: i64
    8;  // updated_at: i64

pub const SESSION_SPACE: usize = 8 + // Discriminator
    32 + // formation: Pubkey
    200 + // title: String
    1000 + // description: String
    8 + // start_time: i64
    8 + // end_time: i64
    8 + // created_at: i64
    8;  // updated_at: i64

pub const ATTENDANCE_SPACE: usize = 8 + // Discriminator
    32 + // session: Pubkey
    32 + // student: Pubkey
    1 +  // status: AttendanceStatus (enum)
    8 + // created_at: i64
    8;  // updated_at: i64

pub const ENROLLMENT_SPACE: usize = 8 + // Discriminator
    32 + // formation: Pubkey
    32 + // student: Pubkey
    1 +  // status: EnrollmentStatus (enum)
    1 +  // position: u8
    8 + // created_at: i64
    8;  // updated_at: i64

// Contraintes temporelles
pub const MIN_SESSION_DURATION: i64 = 1800; // 30 minutes en secondes
pub const MAX_SESSION_DURATION: i64 = 28800; // 8 heures en secondes
pub const MIN_FORMATION_DURATION: i64 = 24 * 60 * 60; // 1 jour en secondes
pub const MAX_FORMATION_DURATION: i64 = 365 * 24 * 60 * 60; // 1 an en secondes

// Contraintes de capacité
pub const DEFAULT_WAITLIST_SIZE: u8 = 10;
pub const MAX_WAITLIST_SIZE: u8 = 50;
pub const MAX_FORMATION_CAPACITY: u8 = 100;

// Constantes pour les rôles
pub const ROLE_STUDENT: &str = "student";
pub const ROLE_TRAINER: &str = "trainer";

// Constantes pour les statuts
pub const STATUS_PENDING: &str = "pending";
pub const STATUS_APPROVED: &str = "approved";
pub const STATUS_REJECTED: &str = "rejected";

// Constantes pour les types de formations
pub const TYPE_ONLINE: &str = "online";
pub const TYPE_IN_PERSON: &str = "in_person";
pub const TYPE_HYBRID: &str = "hybrid";

// Constantes pour les statuts de présence
pub const ATTENDANCE_PRESENT: &str = "present";
pub const ATTENDANCE_ABSENT: &str = "absent";
pub const ATTENDANCE_LATE: &str = "late";

// Constantes pour les permissions
pub const PERMISSION_ADMIN: &str = "admin";
pub const PERMISSION_TRAINER: &str = "trainer";
pub const PERMISSION_STUDENT: &str = "student";

// Constantes pour les limites
pub const MAX_FORMATIONS_PER_TRAINER: u64 = 10;
pub const MAX_SESSIONS_PER_FORMATION: u64 = 20;
pub const MAX_STUDENTS_PER_SESSION: u64 = 50;

// Constantes pour les timeouts
pub const REQUEST_TIMEOUT: i64 = 7 * 24 * 60 * 60; // 7 jours
pub const SESSION_TIMEOUT: i64 = 24 * 60 * 60; // 24 heures

// Constantes pour les frais
pub const LAMPORTS_PER_SOL: u64 = 1_000_000_000;
pub const MIN_RENT_EXEMPT: u64 = 2_039_280;
pub const PROGRAM_FEE: u64 = 100_000; // 0.1 SOL

// Constantes pour les erreurs
pub const ERROR_INVALID_ROLE: &str = "Invalid role";
pub const ERROR_INVALID_STATUS: &str = "Invalid status";
pub const ERROR_INVALID_TYPE: &str = "Invalid type";
pub const ERROR_INVALID_PERMISSION: &str = "Invalid permission";
pub const ERROR_REQUEST_EXPIRED: &str = "Request expired";
pub const ERROR_SESSION_EXPIRED: &str = "Session expired";
pub const ERROR_INSUFFICIENT_FUNDS: &str = "Insufficient funds";
pub const ERROR_MAX_FORMATIONS_REACHED: &str = "Max formations reached";
pub const ERROR_MAX_SESSIONS_REACHED: &str = "Max sessions reached";
pub const ERROR_MAX_STUDENTS_REACHED: &str = "Max students reached"; 