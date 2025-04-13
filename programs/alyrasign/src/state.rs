use anchor_lang::prelude::*;
use crate::types::{Role, FormationType, RequestStatus, FormationStatus, EnrollmentStatus, AttendanceStatus, WaitlistStatus};
use crate::error::AlyraError;

// Seeds
pub const REQUEST_SEED: &[u8] = b"request";
pub const FORMATION_SEED: &[u8] = b"formation";
pub const SESSION_SEED: &[u8] = b"session";
pub const ENROLLMENT_SEED: &[u8] = b"enrollment";
pub const ATTENDANCE_SEED: &[u8] = b"attendance";
pub const WAITLIST_SEED: &[u8] = b"waitlist";

// Account spaces
pub const ACCESS_REQUEST_SPACE: usize = 8 + // discriminator
    32 + // user pubkey
    100 + // name
    100 + // email
    1 + // role
    1 + // status
    200 + // message
    8 + // created_at
    8; // updated_at

pub const FORMATION_SPACE: usize = 8 + // discriminator
    32 + // trainer pubkey
    100 + // title
    500 + // description
    1 + // formation_type
    8 + // max_students
    8 + // waitlist_size
    8 + // current_students
    8 + // current_waitlisted
    1 + // status
    8 + // created_at
    8; // updated_at

pub const SESSION_SPACE: usize = 8 + // discriminator
    32 + // formation pubkey
    32 + // trainer pubkey
    100 + // title
    500 + // description
    8 + // start_time
    8 + // end_time
    8 + // created_at
    8; // updated_at

pub const ENROLLMENT_SPACE: usize = 8 + // discriminator
    32 + // formation pubkey
    32 + // student pubkey
    1 + // status
    1 + // position
    8 + // created_at
    8; // updated_at

pub const ATTENDANCE_SPACE: usize = 8 + // discriminator
    32 + // session pubkey
    32 + // student pubkey
    1 + // status
    8 + // check_in_time
    8 + // created_at
    8; // updated_at

pub const WAITLIST_SPACE: usize = 8 + // discriminator
    32 + // student pubkey
    32 + // formation pubkey
    1 + // position
    1 + // status
    8 + // timestamp
    8 + // created_at
    8; // updated_at

#[account]
pub struct AccessRequest {
    pub user: Pubkey,
    pub name: String,
    pub email: String,
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
    pub max_students: u8,
    pub waitlist_size: u8,
    pub current_students: u8,
    pub current_waitlisted: u8,
    pub status: FormationStatus,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Session {
    pub formation: Pubkey,
    pub trainer: Pubkey,
    pub title: String,
    pub description: String,
    pub start_time: i64,
    pub end_time: i64,
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
pub struct Attendance {
    pub session: Pubkey,
    pub student: Pubkey,
    pub status: AttendanceStatus,
    pub check_in_time: i64,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct WaitlistEntry {
    pub formation: Pubkey,
    pub student: Pubkey,
    pub position: u8,
    pub status: WaitlistStatus,
    pub timestamp: i64,
    pub created_at: i64,
    pub updated_at: i64,
}

impl Formation {
    pub fn can_enroll(&self) -> bool {
        self.current_students < self.max_students && self.status == FormationStatus::Active
    }

    pub fn can_join_waitlist(&self) -> bool {
        self.current_waitlisted < self.waitlist_size && 
        self.status == FormationStatus::Active &&
        self.current_students >= self.max_students
    }

    pub fn has_available_slots(&self) -> bool {
        self.current_students < self.max_students
    }

    pub fn promote_from_waitlist(&mut self) -> Result<()> {
        if !self.has_available_slots() {
            return Err(error!(AlyraError::FormationFull));
        }
        
        self.current_students = self.current_students.checked_add(1)
            .ok_or(AlyraError::Overflow)?;
            
        self.current_waitlisted = self.current_waitlisted.checked_sub(1)
            .ok_or(AlyraError::Underflow)?;
            
        Ok(())
    }

    pub fn add_to_waitlist(&mut self) -> Result<()> {
        if !self.can_join_waitlist() {
            return Err(error!(AlyraError::WaitlistFull));
        }
        
        self.current_waitlisted = self.current_waitlisted.checked_add(1)
            .ok_or(AlyraError::Overflow)?;
            
        Ok(())
    }
}

impl WaitlistEntry {
    pub fn is_promotable(&self) -> bool {
        self.status == WaitlistStatus::Waiting
    }

    pub fn promote(&mut self) {
        self.status = WaitlistStatus::PendingPromotion;
    }

    pub fn accept_promotion(&mut self) {
        self.status = WaitlistStatus::Promoted;
    }

    pub fn decline_promotion(&mut self) {
        self.status = WaitlistStatus::Declined;
    }

    pub fn is_expired(&self, current_time: i64, promotion_timeout: i64) -> bool {
        self.status == WaitlistStatus::PendingPromotion && 
        current_time > self.timestamp + promotion_timeout
    }
}

#[derive(Accounts)]
pub struct RequestAccess<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        init,
        payer = user,
        space = ACCESS_REQUEST_SPACE
    )]
    pub access_request: Account<'info, AccessRequest>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateFormation<'info> {
    #[account(mut)]
    pub trainer: Signer<'info>,
    
    #[account(
        init,
        payer = trainer,
        space = 8 + 32 + 200 + 1000 + 1 + 8 + 8 + 8 + 8 + 8 + 8
    )]
    pub formation: Account<'info, Formation>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateSession<'info> {
    #[account(mut)]
    pub trainer: Signer<'info>,
    
    #[account(mut)]
    pub formation: Account<'info, Formation>,
    
    #[account(
        init,
        payer = trainer,
        space = 8 + 32 + 32 + 200 + 1000 + 8 + 8 + 8 + 8
    )]
    pub session: Account<'info, Session>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EnrollInFormation<'info> {
    #[account(mut)]
    pub student: Signer<'info>,
    
    #[account(mut)]
    pub formation: Account<'info, Formation>,
    
    #[account(
        init,
        payer = student,
        space = 8 + 32 + 32 + 1 + 8 + 8 + 8
    )]
    pub enrollment: Account<'info, Enrollment>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RecordAttendance<'info> {
    #[account(mut)]
    pub student: Signer<'info>,
    
    #[account(mut)]
    pub session: Account<'info, Session>,
    
    #[account(mut)]
    pub enrollment: Account<'info, Enrollment>,
    
    #[account(
        init,
        payer = student,
        space = 8 + 32 + 32 + 1 + 8 + 8
    )]
    pub attendance: Account<'info, Attendance>,
    
    pub system_program: Program<'info, System>,
} 