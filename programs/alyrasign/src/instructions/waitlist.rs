use anchor_lang::prelude::*;
use crate::state::{Formation, WaitlistEntry};
use crate::types::WaitlistStatus;
use crate::error::AlyraError;

#[derive(Accounts)]
#[instruction()]
pub struct JoinWaitlist<'info> {
    #[account(mut)]
    pub formation: Account<'info, Formation>,
    
    #[account(
        init,
        payer = student,
        space = 8 + std::mem::size_of::<WaitlistEntry>(),
        seeds = [
            b"waitlist",
            formation.key().as_ref(),
            student.key().as_ref()
        ],
        bump
    )]
    pub waitlist_entry: Account<'info, WaitlistEntry>,
    
    #[account(mut)]
    pub student: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessPromotion<'info> {
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
    
    #[account(mut)]
    pub student: Signer<'info>,
}

pub fn join_waitlist(ctx: Context<JoinWaitlist>) -> Result<()> {
    let waitlist_entry = &mut ctx.accounts.waitlist_entry;
    let formation = &mut ctx.accounts.formation;

    require!(
        formation.current_waitlisted < formation.waitlist_size,
        AlyraError::WaitlistFull
    );

    waitlist_entry.formation = formation.key();
    waitlist_entry.student = ctx.accounts.student.key();
    waitlist_entry.position = formation.current_waitlisted;
    waitlist_entry.status = WaitlistStatus::Waiting;
    waitlist_entry.timestamp = Clock::get()?.unix_timestamp;
    waitlist_entry.created_at = Clock::get()?.unix_timestamp;
    waitlist_entry.updated_at = Clock::get()?.unix_timestamp;

    formation.current_waitlisted = formation.current_waitlisted.checked_add(1).unwrap();
    formation.updated_at = Clock::get()?.unix_timestamp;
    Ok(())
}

pub fn process_promotion(ctx: Context<ProcessPromotion>) -> Result<()> {
    let formation = &mut ctx.accounts.formation;
    let waitlist_entry = &mut ctx.accounts.waitlist_entry;

    require!(
        formation.current_students < formation.max_students,
        AlyraError::FormationFull
    );
    require!(
        waitlist_entry.status == WaitlistStatus::Waiting,
        AlyraError::InvalidWaitlistStatus
    );

    waitlist_entry.status = WaitlistStatus::Promoted;
    waitlist_entry.updated_at = Clock::get()?.unix_timestamp;
    Ok(())
}

pub fn decline_promotion(ctx: Context<ProcessPromotion>) -> Result<()> {
    let waitlist_entry = &mut ctx.accounts.waitlist_entry;
    require!(
        waitlist_entry.status == WaitlistStatus::Promoted,
        AlyraError::InvalidWaitlistStatus
    );

    waitlist_entry.status = WaitlistStatus::Declined;
    waitlist_entry.updated_at = Clock::get()?.unix_timestamp;
    Ok(())
}

#[derive(Accounts)]
pub struct DropFromWaitlist<'info> {
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
    
    #[account(mut)]
    pub student: Signer<'info>,
}

pub fn drop_from_waitlist(ctx: Context<DropFromWaitlist>) -> Result<()> {
    let formation = &mut ctx.accounts.formation;
    let waitlist_entry = &mut ctx.accounts.waitlist_entry;

    require!(
        waitlist_entry.student == ctx.accounts.student.key(),
        AlyraError::UnauthorizedAccess
    );

    match waitlist_entry.status {
        WaitlistStatus::Waiting | WaitlistStatus::Promoted => {
            formation.current_waitlisted = formation.current_waitlisted.checked_sub(1).unwrap();
            waitlist_entry.status = WaitlistStatus::Expired;
            waitlist_entry.updated_at = Clock::get()?.unix_timestamp;
            formation.updated_at = Clock::get()?.unix_timestamp;
            Ok(())
        }
        _ => Err(AlyraError::InvalidWaitlistStatus.into())
    }
}

#[derive(Accounts)]
pub struct ReorganizeWaitlist<'info> {
    #[account(mut)]
    pub formation: Account<'info, Formation>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
}

pub fn reorganize_waitlist(ctx: Context<ReorganizeWaitlist>) -> Result<()> {
    let formation = &mut ctx.accounts.formation;
    require!(
        formation.trainer == ctx.accounts.authority.key(),
        AlyraError::UnauthorizedAccess
    );

    // Logique de réorganisation de la liste d'attente
    formation.updated_at = Clock::get()?.unix_timestamp;
    Ok(())
}

#[event]
pub struct WaitlistDropEvent {
    pub formation: Pubkey,
    pub student: Pubkey,
    pub position: u8,
}

#[event]
pub struct WaitlistReorganizedEvent {
    pub formation: Pubkey,
    pub drop_position: u8,
} 