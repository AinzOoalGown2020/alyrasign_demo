use anchor_lang::prelude::*;
use crate::state::Formation;
use crate::types::FormationType;
use crate::error::AlyraError;
use crate::config::{MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MAX_FORMATION_CAPACITY, MAX_WAITLIST_SIZE};

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
        AlyraError::TitleTooLong
    );
    require!(
        description.len() <= MAX_DESCRIPTION_LENGTH,
        AlyraError::DescriptionTooLong
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