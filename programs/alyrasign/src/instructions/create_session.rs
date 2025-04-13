use anchor_lang::prelude::*;
use crate::state::{Session, Formation};
use crate::error::AlyraError;
use crate::config::{MAX_TITLE_LENGTH, MAX_DESCRIPTION_LENGTH, MIN_SESSION_DURATION, MAX_SESSION_DURATION};

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

pub fn create_session(
    ctx: Context<CreateSession>,
    title: String,
    description: String,
    start_time: i64,
    end_time: i64,
) -> Result<()> {
    require!(
        title.len() <= MAX_TITLE_LENGTH,
        AlyraError::TitleTooLong
    );
    require!(
        description.len() <= MAX_DESCRIPTION_LENGTH,
        AlyraError::DescriptionTooLong
    );
    
    let duration = end_time - start_time;
    require!(
        duration >= MIN_SESSION_DURATION && duration <= MAX_SESSION_DURATION,
        AlyraError::InvalidSessionDuration
    );
    require!(
        ctx.accounts.formation.trainer == ctx.accounts.trainer.key(),
        AlyraError::UnauthorizedAccess
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