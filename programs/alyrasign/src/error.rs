use anchor_lang::prelude::*;

#[error_code]
pub enum AlyraError {
    #[msg("La capacité de la formation doit être supérieure à 0")]
    InvalidCapacity,
    #[msg("La taille de la liste d'attente doit être supérieure à 0")]
    InvalidWaitlistSize,
    #[msg("La formation est complète")]
    FormationFull,
    #[msg("La liste d'attente est complète")]
    WaitlistFull,
    #[msg("Statut d'inscription invalide")]
    InvalidEnrollmentStatus,
    #[msg("Statut de liste d'attente invalide")]
    InvalidWaitlistStatus,
    #[msg("L'étudiant n'est pas inscrit à cette formation")]
    NotEnrolled,
    #[msg("Dépassement de capacité")]
    Overflow,
    #[msg("Sous-dépassement de capacité")]
    Underflow,
    #[msg("Plage de temps invalide")]
    InvalidTimeRange,
    #[msg("Champ trop long")]
    FieldTooLong,
    #[msg("Accès non autorisé")]
    UnauthorizedAccess,
    #[msg("Capacité de la formation dépassée")]
    FormationCapacityExceeded,
    #[msg("Statut de requête invalide")]
    InvalidRequestStatus,
    #[msg("Titre trop long")]
    TitleTooLong,
    #[msg("Description trop longue")]
    DescriptionTooLong,
    #[msg("Message trop long")]
    MessageTooLong,
    #[msg("Durée de session invalide")]
    InvalidSessionDuration,
} 