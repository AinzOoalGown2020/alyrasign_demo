use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum Role {
    Student,
    Trainer,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum FormationType {
    Online,
    InPerson,
    Hybrid,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum AttendanceStatus {
    Present,
    Absent,
    Late,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum RequestStatus {
    Pending,
    Approved,
    Rejected,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum WaitlistStatus {
    Waiting,
    PendingPromotion,
    Promoted,
    Declined,
    Expired,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum EnrollmentStatus {
    Enrolled,
    Waitlisted,
    Dropped,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum FormationStatus {
    Active,
    Full,
    Cancelled,
    Completed,
}

impl Default for FormationStatus {
    fn default() -> Self {
        FormationStatus::Active
    }
}

impl Default for WaitlistStatus {
    fn default() -> Self {
        WaitlistStatus::Waiting
    }
}

impl Space for Role {
    const INIT_SPACE: usize = 1;
}

impl Space for FormationType {
    const INIT_SPACE: usize = 1;
}

impl Space for AttendanceStatus {
    const INIT_SPACE: usize = 1;
}

impl Space for RequestStatus {
    const INIT_SPACE: usize = 1;
}

impl Space for WaitlistStatus {
    const INIT_SPACE: usize = 1;
}

impl Space for EnrollmentStatus {
    const INIT_SPACE: usize = 1;
}

impl Space for FormationStatus {
    const INIT_SPACE: usize = 1;
}

#[account]
pub struct AccessRequest {
    pub user: Pubkey,
    pub role: Role,
    pub status: RequestStatus,
    pub message: String,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Formation {
    pub trainer: Pubkey,
    pub title: String,
    pub description: String,
    pub formation_type: FormationType,
    pub max_students: u64,
    pub waitlist_size: u64,
    pub current_students: u64,
    pub current_waitlisted: u64,
    pub status: FormationStatus,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Session {
    pub trainer: Pubkey,
    pub formation: Pubkey,
    pub title: String,
    pub description: String,
    pub start_time: i64,
    pub end_time: i64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Attendance {
    pub student: Pubkey,
    pub session: Pubkey,
    pub status: AttendanceStatus,
    pub created_at: i64,
}

#[account]
pub struct WaitlistEntry {
    pub student: Pubkey,
    pub formation: Pubkey,
    pub position: u8,
    pub status: WaitlistStatus,
    pub timestamp: i64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Enrollment {
    pub formation: Pubkey,
    pub student: Pubkey,
    pub status: EnrollmentStatus,
    pub position: u8,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Waitlist {
    pub student: Pubkey,
    pub formation: Pubkey,
    pub status: WaitlistStatus,
    pub created_at: i64,
    pub updated_at: i64,
} 