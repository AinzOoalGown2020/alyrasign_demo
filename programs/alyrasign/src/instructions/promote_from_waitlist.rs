use anchor_lang::prelude::*;
use crate::state::{Formation, WaitlistEntry, Enrollment};
use crate::types::{WaitlistStatus, EnrollmentStatus};
use crate::error::AlyraError;

#[derive(Accounts)]
pub struct PromoteFromWaitlist<'info> {
    #[account(mut)]
    pub formation: Account<'info, Formation>,
    
    #[account(
        mut,
        seeds = [
            b"waitlist",
            formation.key().as_ref(),
            student.key().as_ref()
        ],
        bump
    )]
    pub waitlist_entry: Account<'info, WaitlistEntry>,
    
    #[account(
        init,
        payer = student,
        space = 8 + std::mem::size_of::<Enrollment>(),
        seeds = [b"enrollment", formation.key().as_ref(), student.key().as_ref()],
        bump
    )]
    pub enrollment: Account<'info, Enrollment>,
    
    #[account(mut)]
    pub student: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn promote_from_waitlist(ctx: Context<PromoteFromWaitlist>) -> Result<()> {
    let enrollment = &mut ctx.accounts.enrollment;
    let formation = &mut ctx.accounts.formation;
    let waitlist_entry = &mut ctx.accounts.waitlist_entry;

    require!(
        formation.current_students < formation.max_students,
        AlyraError::FormationFull
    );
    require!(
        waitlist_entry.status == WaitlistStatus::Promoted,
        AlyraError::InvalidWaitlistStatus
    );

    // Mettre à jour l'inscription
    enrollment.formation = formation.key();
    enrollment.student = ctx.accounts.student.key();
    enrollment.status = EnrollmentStatus::Enrolled;
    enrollment.position = formation.current_students;
    enrollment.created_at = Clock::get()?.unix_timestamp;
    enrollment.updated_at = Clock::get()?.unix_timestamp;

    // Mettre à jour la liste d'attente
    waitlist_entry.status = WaitlistStatus::Promoted;
    waitlist_entry.updated_at = Clock::get()?.unix_timestamp;

    // Mettre à jour la formation
    formation.current_students = formation.current_students.checked_add(1).unwrap();
    formation.current_waitlisted = formation.current_waitlisted.checked_sub(1).unwrap();
    formation.updated_at = Clock::get()?.unix_timestamp;
    Ok(())
} 