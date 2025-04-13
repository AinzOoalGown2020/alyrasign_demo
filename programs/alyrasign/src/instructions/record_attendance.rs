use anchor_lang::prelude::*;
use crate::state::{Session, Enrollment, Attendance};
use crate::types::AttendanceStatus;
use crate::error::AlyraError;

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
        space = 8 + std::mem::size_of::<Attendance>(),
        seeds = [b"attendance", session.key().as_ref(), student.key().as_ref()],
        bump
    )]
    pub attendance: Account<'info, Attendance>,
    
    pub system_program: Program<'info, System>,
}

pub fn record_attendance(
    ctx: Context<RecordAttendance>,
    status: AttendanceStatus,
) -> Result<()> {
    require!(
        ctx.accounts.enrollment.student == ctx.accounts.student.key(),
        AlyraError::NotEnrolled
    );

    let attendance = &mut ctx.accounts.attendance;
    attendance.session = ctx.accounts.session.key();
    attendance.student = ctx.accounts.student.key();
    attendance.status = status;
    attendance.check_in_time = Clock::get()?.unix_timestamp;
    attendance.created_at = Clock::get()?.unix_timestamp;
    attendance.updated_at = Clock::get()?.unix_timestamp;
    Ok(())
} 