use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct RequestAccess<'info> {
    #[account(
        init,
        payer = user,
        space = ACCESS_REQUEST_SPACE,
        seeds = [REQUEST_SEED, user.key().as_ref()],
        bump
    )]
    pub request: Account<'info, AccessRequest>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateFormation<'info> {
    #[account(
        init,
        payer = trainer,
        space = FORMATION_SPACE,
        seeds = [FORMATION_SEED, trainer.key().as_ref()],
        bump
    )]
    pub formation: Account<'info, Formation>,
    
    #[account(mut)]
    pub trainer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateSession<'info> {
    #[account(
        init,
        payer = trainer,
        space = SESSION_SPACE,
        seeds = [SESSION_SEED, formation.key().as_ref()],
        bump
    )]
    pub session: Account<'info, Session>,
    
    #[account(mut)]
    pub formation: Account<'info, Formation>,
    
    #[account(mut)]
    pub trainer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EnrollInFormation<'info> {
    #[account(mut)]
    pub formation: Account<'info, Formation>,
    
    #[account(
        init,
        payer = student,
        space = ENROLLMENT_SPACE,
        seeds = [ENROLLMENT_SEED, formation.key().as_ref(), student.key().as_ref()],
        bump
    )]
    pub enrollment: Account<'info, Enrollment>,
    
    #[account(mut)]
    pub student: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RecordAttendance<'info> {
    #[account(
        init,
        payer = student,
        space = ATTENDANCE_SPACE,
        seeds = [ATTENDANCE_SEED, session.key().as_ref(), student.key().as_ref()],
        bump
    )]
    pub attendance: Account<'info, Attendance>,
    
    pub session: Account<'info, Session>,
    
    #[account(mut)]
    pub student: Signer<'info>,
    
    pub system_program: Program<'info, System>,
} 