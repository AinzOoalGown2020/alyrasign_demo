# Documentation Technique - AlyraSign

## Table des matières
1. [Architecture](#architecture)
2. [Programme Solana](#programme-solana)
3. [Frontend](#frontend)
4. [Workflows de transaction](#workflows-de-transaction)
5. [Déploiement](#déploiement)
6. [Tests](#tests)

## Architecture

AlyraSign est une application décentralisée (dApp) construite sur la blockchain Solana. L'architecture est divisée en deux parties principales :

### Backend (Programme Solana)
- Contrats intelligents écrits en Rust avec le framework Anchor
- Gestion des données on-chain (formations, inscriptions, listes d'attente)
- Logique métier et règles d'entreprise

### Frontend (Next.js)
- Interface utilisateur construite avec React et Next.js
- Interaction avec la blockchain via Web3.js
- Gestion de l'état local et des notifications

## Programme Solana

### Structure du programme

Le programme Solana est organisé en plusieurs modules :

- `lib.rs` : Point d'entrée du programme
- `state.rs` : Définition des structures de données et des comptes
- `instructions.rs` : Instructions du programme
- `errors.rs` : Gestion des erreurs
- `types.rs` : Types et énumérations

### Comptes principaux

#### Formation
```rust
pub struct Formation {
    pub trainer: Pubkey,
    pub title: String,
    pub description: String,
    pub formation_type: FormationType,
    pub max_students: u64,
    pub waitlist_size: u64,
    pub current_students: u64,
    pub created_at: i64,
    pub updated_at: i64,
}
```

#### WaitlistEntry
```rust
pub struct WaitlistEntry {
    pub formation: Pubkey,
    pub student: Pubkey,
    pub position: u8,
    pub status: WaitlistStatus,
    pub timestamp: i64,
    pub notification_sent: bool,
}
```

### Instructions principales

#### Création d'une formation
```rust
pub fn create_formation(ctx: Context<CreateFormation>, title: String, description: String, formation_type: FormationType, max_students: u64, waitlist_size: u64) -> Result<()>
```

#### Inscription à une formation
```rust
pub fn enroll_in_formation(ctx: Context<EnrollInFormation>) -> Result<()>
```

#### Rejoindre une liste d'attente
```rust
pub fn join_waitlist(ctx: Context<JoinWaitlist>) -> Result<()>
```

#### Gestion des désistements
```rust
pub fn drop_from_waitlist(ctx: Context<DropFromWaitlist>) -> Result<()>
```

## Frontend

### Structure du projet

Le frontend est organisé selon une architecture par domaine fonctionnel :

- `src/features/` : Fonctionnalités principales de l'application
- `src/ui/` : Composants d'interface utilisateur réutilisables
- `src/hooks/` : Hooks personnalisés pour la logique métier
- `src/contexts/` : Contextes React pour la gestion d'état
- `src/types/` : Types TypeScript partagés

### Composants principaux

- `FormationCard` : Affichage d'une formation
- `WaitlistManager` : Gestion des listes d'attente
- `NotificationSystem` : Système de notifications
- `WalletConnection` : Connexion au wallet Solana

### Hooks personnalisés

- `useFormation` : Gestion des formations
- `useWaitlist` : Gestion des listes d'attente
- `useWallet` : Interaction avec le wallet
- `useNotifications` : Gestion des notifications

## Workflows de transaction

### Création d'une formation

1. L'utilisateur remplit le formulaire de création
2. Le frontend appelle l'instruction `create_formation`
3. Le programme Solana crée un nouveau compte `Formation`
4. La transaction est confirmée et l'interface est mise à jour

### Inscription à une formation

1. L'utilisateur clique sur "S'inscrire"
2. Le frontend vérifie si la formation a des places disponibles
3. Si oui, il appelle l'instruction `enroll_in_formation`
4. Si non, il propose de rejoindre la liste d'attente
5. Le programme Solana met à jour les compteurs et crée un compte `Enrollment`
6. La transaction est confirmée et l'interface est mise à jour

### Gestion des désistements

1. L'utilisateur clique sur "Se désister"
2. Le frontend appelle l'instruction `drop_from_waitlist`
3. Le programme Solana met à jour le statut et émet un événement
4. La transaction est confirmée et l'interface est mise à jour
5. Les autres utilisateurs sont notifiés du changement

## Déploiement

### Environnement de développement

```bash
# Cloner le dépôt
git clone https://github.com/your-org/alyrasign.git
cd alyrasign

# Installer les dépendances
yarn install

# Configurer l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos paramètres

# Lancer le programme Solana localement
anchor build
anchor deploy

# Lancer le frontend
yarn dev
```

### Déploiement en production

```bash
# Construire le programme
anchor build

# Déployer sur devnet
anchor deploy --provider.cluster devnet

# Déployer sur mainnet
anchor deploy --provider.cluster mainnet

# Déployer le frontend
yarn build
# Déployer le dossier .next sur votre hébergeur
```

## Tests

### Tests du programme Solana

```bash
# Exécuter les tests
anchor test
```

### Tests du frontend

```bash
# Exécuter les tests
yarn test
```

### Tests d'intégration

```bash
# Exécuter les tests d'intégration
yarn test:integration
``` 