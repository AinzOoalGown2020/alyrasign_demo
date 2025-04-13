import { Program, AnchorProvider, web3 } from '@project-serum/anchor';
import { PublicKey } from '@solana/web3.js';
import { Alyrasign } from '../../target/types/alyrasign';
import * as fs from 'fs';
import * as path from 'path';

const MIGRATION_DATA_PATH = path.join(__dirname, '../data/formations.json');

async function migrateFormations() {
  try {
    // Charger les données de formation
    const formationsData = JSON.parse(fs.readFileSync(MIGRATION_DATA_PATH, 'utf-8'));

    // Configurer le provider
    const provider = AnchorProvider.env();
    const program = new Program<Alyrasign>(
      require('../../target/idl/alyrasign.json'),
      new PublicKey('9G6Skb8Enu9MhTAkJyqHBDmq6AP3jPD2RVn5svRZxDiM'),
      provider
    );

    console.log('Début de la migration des formations...');

    // Migrer chaque formation
    for (const formation of formationsData) {
      try {
        // Créer la formation sur devnet
        const [formationPda] = await PublicKey.findProgramAddress(
          [
            Buffer.from('formation'),
            Buffer.from(formation.title),
            new PublicKey(formation.trainer).toBuffer(),
          ],
          program.programId
        );

        await program.methods
          .createFormation(
            formation.title,
            formation.description,
            formation.formationType,
            formation.maxStudents,
            formation.waitlistSize
          )
          .accounts({
            formation: formationPda,
            trainer: new PublicKey(formation.trainer),
            systemProgram: web3.SystemProgram.programId,
          })
          .rpc();

        console.log(`Formation migrée avec succès: ${formation.title}`);
      } catch (error) {
        console.error(`Erreur lors de la migration de la formation ${formation.title}:`, error);
      }
    }

    console.log('Migration des formations terminée');
  } catch (error) {
    console.error('Erreur lors de la migration:', error);
  }
}

// Exécuter la migration
migrateFormations().then(() => {
  console.log('Script de migration terminé');
}).catch((error) => {
  console.error('Erreur lors de l\'exécution du script:', error);
}); 