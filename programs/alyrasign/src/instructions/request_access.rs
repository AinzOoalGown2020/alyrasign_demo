use anchor_lang::prelude::*;
use crate::state::{AccessRequest, ACCESS_REQUEST_SPACE};
use crate::types::{RequestStatus, Role};

#[derive(Accounts)]
pub struct RequestAccess<'info> {
    #[account(
        init,
        payer = user,
        space = ACCESS_REQUEST_SPACE,
        seeds = [b"request", user.key().as_ref()],
        bump
    )]
    pub access_request: Account<'info, AccessRequest>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

impl<'info> RequestAccess<'info> {
    pub fn process(
        &mut self,
        role: Role,
        name: String,
        email: String,
        message: String,
    ) -> Result<()> {
        self.access_request.user = self.user.key();
        self.access_request.role = role;
        self.access_request.name = name;
        self.access_request.email = email;
        self.access_request.message = message;
        self.access_request.status = RequestStatus::Pending;
        self.access_request.created_at = Clock::get()?.unix_timestamp;
        self.access_request.updated_at = Clock::get()?.unix_timestamp;
        Ok(())
    }
} 