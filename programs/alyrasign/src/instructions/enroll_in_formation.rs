use anchor_lang::prelude::*;
use crate::state::{Formation, Enrollment};
use crate::types::EnrollmentStatus;
use crate::error::AlyraError;

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