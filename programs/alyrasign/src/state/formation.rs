#[account]
pub struct Formation {
    pub last_drop_position: Option<u8>,
}

impl Formation {
    pub fn update_waitlist_positions(&mut self, drop_position: u8) -> Result<()> {
        // Cette méthode sera appelée par l'instruction reorganize_waitlist
        // pour mettre à jour les positions des étudiants après un désistement
        
        // Note: La logique de mise à jour des positions sera implémentée
        // dans le client pour optimiser les coûts de transaction
        
        Ok(())
    }

    pub fn is_trainer(&self, pubkey: &Pubkey) -> bool {
        self.trainer == *pubkey
    }
} 