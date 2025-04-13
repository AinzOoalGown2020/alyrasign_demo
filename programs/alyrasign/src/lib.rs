use anchor_lang::prelude::*;
use crate::state::{AccessRequest, Formation, Session, Enrollment};
use crate::types::{Role, FormationType, RequestStatus, EnrollmentStatus};
use crate::error::AlyraError;
use crate::config::*;

declare_id!("ATYrhRcGeQGKo43urjfgcWHkqMpDLYaCB9wmXodTC3Vu");

pub mod error;
pub mod instructions;
pub mod state;
pub mod types;
pub mod config;

#[program]
pub mod alyrasign {
    use super::*;

    pub fn initialize(ctx: Context<InitializeStorage>) -> Result<()> {
        let storage = &mut ctx.accounts.storage;
        storage.admin = ctx.accounts.admin.key();
        storage.request_count = 0;
        storage.formation_count = 0;
        storage.session_count = 0;
        storage.attendance_count = 0;
        storage.bump = ctx.bumps.storage;
        Ok(())
    }

    pub fn requestAccess(
        ctx: Context<RequestAccess>,
        role: Role,
        name: String,
        email: String,
        message: String,
    ) -> Result<()> {
        let access_request = &mut ctx.accounts.access_request;
        access_request.user = ctx.accounts.user.key();
        access_request.role = role;
        access_request.name = name;
        access_request.email = email;
        access_request.message = message;
        access_request.status = RequestStatus::Pending;
        access_request.created_at = Clock::get()?.unix_timestamp;
        access_request.updated_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn create_formation(
        ctx: Context<CreateFormation>,
        title: String,
        description: String,
        formation_type: FormationType,
        max_students: u8,
        waitlist_size: u8,
    ) -> Result<()> {
        require!(
            title.len() <= MAX_TITLE_LENGTH,
            AlyraError::FieldTooLong
        );
        require!(
            description.len() <= MAX_DESCRIPTION_LENGTH,
            AlyraError::FieldTooLong
        );
        require!(
            max_students <= MAX_FORMATION_CAPACITY,
            AlyraError::FormationCapacityExceeded
        );
        require!(
            waitlist_size <= MAX_WAITLIST_SIZE,
            AlyraError::WaitlistFull
        );

        let formation = &mut ctx.accounts.formation;
        formation.trainer = ctx.accounts.trainer.key();
        formation.title = title;
        formation.description = description;
        formation.formation_type = formation_type;
        formation.max_students = max_students;
        formation.waitlist_size = waitlist_size;
        formation.current_students = 0;
        formation.current_waitlisted = 0;
        formation.created_at = Clock::get()?.unix_timestamp;
        formation.updated_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn create_session(
        ctx: Context<CreateSession>,
        title: String,
        description: String,
        start_time: i64,
        end_time: i64,
    ) -> Result<()> {
        require!(
            title.len() <= MAX_TITLE_LENGTH,
            AlyraError::FieldTooLong
        );
        require!(
            description.len() <= MAX_DESCRIPTION_LENGTH,
            AlyraError::FieldTooLong
        );
        
        let duration = end_time - start_time;
        require!(
            duration >= MIN_SESSION_DURATION && duration <= MAX_SESSION_DURATION,
            AlyraError::InvalidTimeRange
        );

        let session = &mut ctx.accounts.session;
        session.formation = ctx.accounts.formation.key();
        session.trainer = ctx.accounts.trainer.key();
        session.title = title;
        session.description = description;
        session.start_time = start_time;
        session.end_time = end_time;
        session.created_at = Clock::get()?.unix_timestamp;
        session.updated_at = Clock::get()?.unix_timestamp;
        Ok(())
    }

    pub fn enroll_in_formation(ctx: Context<EnrollInFormation>) -> Result<()> {
        let enrollment = &mut ctx.accounts.enrollment;
        let formation = &mut ctx.accounts.formation;

        require!(
            formation.current_students < formation.max_students,
            AlyraError::FormationFull
        );

        enrollment.formation = formation.key();
        enrollment.student = ctx.accounts.student.key();
        enrollment.status = EnrollmentStatus::Enrolled;
        enrollment.position = formation.current_students;
        enrollment.created_at = Clock::get()?.unix_timestamp;
        enrollment.updated_at = Clock::get()?.unix_timestamp;

        formation.current_students = formation.current_students.checked_add(1).unwrap();
        formation.updated_at = Clock::get()?.unix_timestamp;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct RequestAccess<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(
        init,
        payer = user,
        space = 8 + std::mem::size_of::<AccessRequest>(),
        seeds = [b"request", user.key().as_ref()],
        bump
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
        space = 8 + std::mem::size_of::<Formation>(),
        seeds = [b"formation", trainer.key().as_ref()],
        bump
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
        space = 8 + std::mem::size_of::<Session>(),
        seeds = [b"session", formation.key().as_ref()],
        bump
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
        space = 8 + std::mem::size_of::<Enrollment>(),
        seeds = [b"enrollment", formation.key().as_ref(), student.key().as_ref()],
        bump
    )]
    pub enrollment: Account<'info, Enrollment>,
    
    pub system_program: Program<'info, System>,
}

#[error_code]
pub enum AccessRequestError {
    #[msg("Invalid request status")]
    InvalidRequestStatus,
    #[msg("Field length exceeds maximum allowed")]
    FieldTooLong,
    #[msg("Unauthorized access")]
    Unauthorized,
}

#[account]
pub struct ProgramStorage {
    pub admin: Pubkey,
    pub request_count: u64,
    pub formation_count: u64,
    pub session_count: u64,
    pub attendance_count: u64,
    pub bump: u8,
}

#[derive(Accounts)]
pub struct InitializeStorage<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    
    #[account(
        init,
        payer = admin,
        space = 8 + 32 + 32 + 1, // discriminator + pubkey + counters + bump
        seeds = [STORAGE_SEED],
        bump
    )]
    pub storage: Account<'info, ProgramStorage>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateAccessRequest<'info> {
    #[account(mut)]
    pub requester: Signer<'info>,
    
    #[account(
        seeds = [STORAGE_SEED],
        bump
    )]
    pub storage: Account<'info, ProgramStorage>,
    
    #[account(
        init,
        payer = requester,
        space = 8 + 8 + 32 + (4 + MAX_ROLE_LENGTH) + (4 + MAX_MESSAGE_LENGTH) + 1 + 8 + 8 + 1,
        seeds = [REQUEST_SEED, requester.key().as_ref()],
        bump
    )]
    pub request: Account<'info, AccessRequest>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessAccessRequest<'info> {
    #[account(
        seeds = [STORAGE_SEED],
        bump,
        constraint = storage.admin == admin.key() @ AccessRequestError::Unauthorized
    )]
    pub storage: Account<'info, ProgramStorage>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    #[account(
        mut,
        seeds = [REQUEST_SEED, request.user.as_ref()],
        bump
    )]
    pub request: Account<'info, AccessRequest>,
}

#[derive(Accounts)]
pub struct UpsertFormation<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,
    
    #[account(
        seeds = [STORAGE_SEED],
        bump
    )]
    pub storage: Account<'info, ProgramStorage>,
    
    #[account(
        init_if_needed,
        payer = admin,
        space = 8 + 8 + (4 + MAX_TITLE_LENGTH) + (4 + MAX_DESCRIPTION_LENGTH) + 32 + 8 + 8 + 1 + 8 + 8 + 1,
        seeds = [FORMATION_SEED, formation.key().as_ref()],
        bump
    )]
    pub formation: Account<'info, Formation>,
    
    pub system_program: Program<'info, System>,
} 