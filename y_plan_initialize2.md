# Plan d'Initialisation Amélioré pour AlyraSign

## Vue d'ensemble

Ce document décrit un processus d'initialisation étape par étape pour le programme Solana AlyraSign, conçu pour être implémenté dans la page "initialize" de l'application. Chaque étape inclut des vérifications pour s'assurer que l'initialisation est correcte et que les comptes sont prêts à être utilisés.

## 1. Vérification de l'Environnement

### 1.1 Vérification de la Connexion au Réseau
- **Action** : Vérifier la connexion au réseau Solana (devnet)
- **Vérification** : `solana config get`
- **Affichage** : Afficher le réseau actuel et l'URL RPC
- **Validation** : S'assurer que le réseau est configuré sur devnet

### 1.2 Vérification du Wallet
- **Action** : Vérifier que le wallet est connecté
- **Vérification** : `wallet.connected` et `wallet.publicKey`
- **Affichage** : Afficher l'adresse du wallet connecté
- **Validation** : S'assurer que le wallet est connecté et a une adresse valide

### 1.3 Vérification du Solde
- **Action** : Vérifier le solde du wallet
- **Vérification** : `connection.getBalance(wallet.publicKey)`
- **Affichage** : Afficher le solde en SOL
- **Validation** : S'assurer que le wallet a au moins 1 SOL pour les transactions

## 2. Vérification du Programme

### 2.1 Vérification du PROGRAM_ID
- **Action** : Vérifier que le PROGRAM_ID est correctement configuré
- **Vérification** : Comparer le PROGRAM_ID dans le code avec celui dans `.env.local`
- **Affichage** : Afficher le PROGRAM_ID actuel
- **Validation** : S'assurer que le PROGRAM_ID est cohérent dans tous les fichiers

### 2.2 Vérification du Déploiement du Programme
- **Action** : Vérifier que le programme est déployé sur devnet
- **Vérification** : `solana program show <PROGRAM_ID> --url devnet`
- **Affichage** : Afficher les détails du programme (ID, propriétaire, solde, etc.)
- **Validation** : S'assurer que le programme est déployé et a un solde suffisant

### 2.3 Vérification des Keypairs
- **Action** : Vérifier que les keypairs du programme sont en place
- **Vérification** : `solana-keygen pubkey target/deploy/alyrasign-keypair.json`
- **Affichage** : Afficher la clé publique du keypair
- **Validation** : S'assurer que la clé publique correspond au PROGRAM_ID

## 3. Initialisation du Compte de Stockage Principal

### 3.1 Vérification de l'Existence du Compte de Stockage
- **Action** : Vérifier si le compte de stockage principal existe déjà
- **Vérification** : `checkStorageAccount(connection)`
- **Affichage** : Afficher si le compte existe ou non
- **Validation** : Si le compte existe, passer à l'étape suivante

### 3.2 Calcul du PDA du Compte de Stockage
- **Action** : Calculer l'adresse PDA du compte de stockage
- **Vérification** : `PublicKey.findProgramAddressSync([Buffer.from('storage')], PROGRAM_ID)`
- **Affichage** : Afficher l'adresse PDA calculée
- **Validation** : S'assurer que l'adresse PDA est correcte

### 3.3 Initialisation du Compte de Stockage
- **Action** : Initialiser le compte de stockage principal
- **Vérification** : `initializeProgramStorage(wallet, connection)`
- **Affichage** : Afficher le statut de l'initialisation
- **Validation** : S'assurer que l'initialisation a réussi

### 3.4 Vérification de l'Initialisation
- **Action** : Vérifier que le compte de stockage a été correctement initialisé
- **Vérification** : `solana account <STORAGE_PDA> --url devnet`
- **Affichage** : Afficher les détails du compte de stockage
- **Validation** : S'assurer que le compte a été initialisé avec les bonnes données

## 4. Initialisation des Comptes de Stockage Spécifiques

### 4.1 Initialisation du Stockage des Demandes d'Accès
- **Action** : Initialiser le stockage des demandes d'accès
- **Vérification** : `initializeAccessStorage(wallet, connection)`
- **Affichage** : Afficher le statut de l'initialisation
- **Validation** : S'assurer que l'initialisation a réussi

### 4.2 Initialisation du Stockage des Formations
- **Action** : Initialiser le stockage des formations
- **Vérification** : `initializeFormationStorage(wallet, connection)`
- **Affichage** : Afficher le statut de l'initialisation
- **Validation** : S'assurer que l'initialisation a réussi

### 4.3 Initialisation du Stockage des Sessions
- **Action** : Initialiser le stockage des sessions
- **Vérification** : `initializeSessionStorage(wallet, connection)`
- **Affichage** : Afficher le statut de l'initialisation
- **Validation** : S'assurer que l'initialisation a réussi

### 4.4 Initialisation du Stockage des Présences
- **Action** : Initialiser le stockage des présences
- **Vérification** : `initializeAttendanceStorage(wallet, connection)`
- **Affichage** : Afficher le statut de l'initialisation
- **Validation** : S'assurer que l'initialisation a réussi

## 5. Configuration de l'Admin

### 5.1 Vérification de l'Admin Actuel
- **Action** : Vérifier qui est l'admin actuel
- **Vérification** : Lire les données du compte de stockage principal
- **Affichage** : Afficher l'adresse de l'admin actuel
- **Validation** : S'assurer que l'admin est correctement défini

### 5.2 Mise à Jour de l'Admin
- **Action** : Mettre à jour l'admin si nécessaire
- **Vérification** : `updateAdminAddress(connection, wallet, newAdminAddress)`
- **Affichage** : Afficher le statut de la mise à jour
- **Validation** : S'assurer que la mise à jour a réussi

### 5.3 Vérification des Permissions
- **Action** : Vérifier que l'admin a les permissions nécessaires
- **Vérification** : Tester une action administrative
- **Affichage** : Afficher le résultat du test
- **Validation** : S'assurer que l'admin peut effectuer des actions administratives

## 6. Vérification Finale

### 6.1 Vérification de l'État du Programme
- **Action** : Vérifier l'état global du programme
- **Vérification** : `checkProgramState(connection)`
- **Affichage** : Afficher l'état du programme
- **Validation** : S'assurer que tout est correctement initialisé

### 6.2 Test des Fonctionnalités de Base
- **Action** : Tester les fonctionnalités de base du programme
- **Vérification** : Créer une demande d'accès, une formation, etc.
- **Affichage** : Afficher le résultat des tests
- **Validation** : S'assurer que les fonctionnalités de base fonctionnent correctement

## 7. Interface Utilisateur pour la Page "Initialize"

### 7.1 Structure de la Page
- **Section 1** : Vérification de l'environnement
  - Affichage du réseau, du wallet et du solde
  - Bouton pour vérifier l'environnement
- **Section 2** : Vérification du programme
  - Affichage du PROGRAM_ID et des détails du programme
  - Bouton pour vérifier le programme
- **Section 3** : Initialisation du compte de stockage principal
  - Affichage de l'état du compte de stockage
  - Bouton pour initialiser le compte de stockage
  - Utilisation du wallet admin connecté pour payer la transaction
- **Section 4** : Initialisation des comptes de stockage spécifiques
  - Affichage de l'état de chaque compte de stockage
  - Boutons pour initialiser chaque compte de stockage
  - Utilisation du wallet admin connecté pour payer les transactions
- **Section 5** : Configuration de l'admin
  - Affichage de l'admin actuel
  - Formulaire pour mettre à jour l'admin
  - Option pour utiliser l'adresse du wallet connecté comme admin
- **Section 6** : Vérification finale
  - Affichage de l'état global du programme
  - Bouton pour tester les fonctionnalités de base

### 7.2 Flux d'Initialisation
1. L'utilisateur arrive sur la page "initialize"
2. La page vérifie automatiquement l'environnement et affiche les résultats
3. L'utilisateur clique sur "Vérifier le programme" pour vérifier le déploiement du programme
4. Si le programme est déployé, l'utilisateur peut initialiser le compte de stockage principal
5. Une fois le compte de stockage principal initialisé, l'utilisateur peut initialiser les comptes de stockage spécifiques
6. L'utilisateur peut configurer l'admin si nécessaire
7. Enfin, l'utilisateur peut vérifier l'état global du programme et tester les fonctionnalités de base

### 7.3 Gestion des Erreurs
- **Affichage des erreurs** : Afficher les erreurs de manière claire et concise
- **Suggestions de résolution** : Proposer des solutions pour résoudre les erreurs
- **Logs détaillés** : Afficher des logs détaillés pour faciliter le débogage

## 8. Scripts d'Initialisation

### 8.1 Script d'Initialisation Complet
```typescript
// scripts/initialize-complete.ts
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { 
  initializeProgramStorage, 
  initializeAccessStorage, 
  initializeFormationStorage, 
  initializeSessionStorage, 
  initializeAttendanceStorage,
  checkProgramState,
  updateAdminAddress
} from '../src/lib/solana';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  try {
    console.log('Début de l\'initialisation complète...');
    
    // Charger la clé privée du wallet
    const walletKeypair = Keypair.fromSecretKey(
      Buffer.from(JSON.parse(fs.readFileSync(path.resolve(__dirname, '../target/deploy/alyrasign-keypair.json'), 'utf-8')))
    );
    
    // Créer une connexion à devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    
    // Vérifier l'état du programme
    console.log('Vérification de l\'état du programme...');
    const state = await checkProgramState(connection);
    console.log('État du programme:', state);
    
    if (!state.programExists) {
      console.error('Le programme n\'est pas déployé. Veuillez déployer le programme avant de continuer.');
      return;
    }
    
    // Initialiser le compte de stockage principal
    console.log('Initialisation du compte de stockage principal...');
    await initializeProgramStorage({ publicKey: walletKeypair.publicKey } as any, connection);
    
    // Initialiser les comptes de stockage spécifiques
    console.log('Initialisation des comptes de stockage spécifiques...');
    await initializeAccessStorage({ publicKey: walletKeypair.publicKey } as any, connection);
    await initializeFormationStorage({ publicKey: walletKeypair.publicKey } as any, connection);
    await initializeSessionStorage({ publicKey: walletKeypair.publicKey } as any, connection);
    await initializeAttendanceStorage({ publicKey: walletKeypair.publicKey } as any, connection);
    
    // Mettre à jour l'admin si nécessaire
    const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET;
    if (adminAddress) {
      console.log('Mise à jour de l\'admin...');
      await updateAdminAddress(connection, { publicKey: walletKeypair.publicKey } as any, adminAddress);
    }
    
    // Vérifier l'état final du programme
    console.log('Vérification de l\'état final du programme...');
    const finalState = await checkProgramState(connection);
    console.log('État final du programme:', finalState);
    
    if (finalState.programExists && finalState.storageExists) {
      console.log('Initialisation terminée avec succès');
    } else {
      console.error('Erreur lors de l\'initialisation:', finalState.error);
    }
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
  }
}

main().catch(console.error);
```

### 8.2 Script de Vérification
```typescript
// scripts/verify-complete.ts
import { Connection, PublicKey } from '@solana/web3.js';
import { 
  checkProgramState,
  checkStorageAccount,
  findAccessStoragePDA,
  findFormationStoragePDA,
  findSessionStoragePDA,
  findAttendanceStoragePDA
} from '../src/lib/solana';

async function main() {
  try {
    console.log('Début de la vérification...');
    
    // Créer une connexion à devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID || '');
    
    // Vérifier l'état du programme
    console.log('Vérification de l\'état du programme...');
    const state = await checkProgramState(connection);
    console.log('État du programme:', state);
    
    if (!state.programExists) {
      console.error('Le programme n\'est pas déployé.');
      return;
    }
    
    // Vérifier le compte de stockage principal
    console.log('Vérification du compte de stockage principal...');
    const storageExists = await checkStorageAccount(connection);
    console.log('Le compte de stockage principal existe:', storageExists);
    
    // Vérifier les comptes de stockage spécifiques
    console.log('Vérification des comptes de stockage spécifiques...');
    
    // Vérifier le stockage des demandes d'accès
    const [accessStoragePda] = await findAccessStoragePDA();
    const accessStorageAccount = await connection.getAccountInfo(accessStoragePda);
    console.log('Le stockage des demandes d\'accès existe:', !!accessStorageAccount);
    
    // Vérifier le stockage des formations
    const [formationStoragePda] = await findFormationStoragePDA();
    const formationStorageAccount = await connection.getAccountInfo(formationStoragePda);
    console.log('Le stockage des formations existe:', !!formationStorageAccount);
    
    // Vérifier le stockage des sessions
    const [sessionStoragePda] = await findSessionStoragePDA();
    const sessionStorageAccount = await connection.getAccountInfo(sessionStoragePda);
    console.log('Le stockage des sessions existe:', !!sessionStorageAccount);
    
    // Vérifier le stockage des présences
    const [attendanceStoragePda] = await findAttendanceStoragePDA();
    const attendanceStorageAccount = await connection.getAccountInfo(attendanceStoragePda);
    console.log('Le stockage des présences existe:', !!attendanceStorageAccount);
    
    // Résumé
    console.log('Résumé de la vérification:');
    console.log('- Programme déployé:', state.programExists);
    console.log('- Compte de stockage principal initialisé:', state.storageExists);
    console.log('- Stockage des demandes d\'accès initialisé:', !!accessStorageAccount);
    console.log('- Stockage des formations initialisé:', !!formationStorageAccount);
    console.log('- Stockage des sessions initialisé:', !!sessionStorageAccount);
    console.log('- Stockage des présences initialisé:', !!attendanceStorageAccount);
    
    if (state.programExists && state.storageExists && 
        accessStorageAccount && formationStorageAccount && 
        sessionStorageAccount && attendanceStorageAccount) {
      console.log('Tout est correctement initialisé');
    } else {
      console.log('Certains éléments ne sont pas initialisés');
    }
  } catch (error) {
    console.error('Erreur lors de la vérification:', error);
  }
}

main().catch(console.error);
```

## 9. Dépannage

### 9.1 Problèmes Courants et Solutions
- **Erreur "Account not found"** : Le compte n'a pas été initialisé correctement
  - **Solution** : Vérifier que l'initialisation a réussi et réessayer
- **Erreur "Invalid instruction"** : L'instruction n'est pas reconnue par le programme
  - **Solution** : Vérifier que le programme est à jour et que l'instruction est correcte
- **Erreur "Insufficient funds"** : Le wallet n'a pas assez de SOL
  - **Solution** : Obtenir plus de SOL via `solana airdrop`
- **Erreur "Unauthorized"** : L'utilisateur n'a pas les permissions nécessaires
  - **Solution** : Vérifier que l'utilisateur est l'admin ou a les permissions nécessaires

### 9.2 Logs et Débogage
- **Affichage des logs** : Afficher les logs détaillés pour faciliter le débogage
- **Traçage des transactions** : Tracer les transactions pour identifier les problèmes
- **Vérification des comptes** : Vérifier l'état des comptes pour identifier les problèmes

## 10. Maintenance

### 10.1 Mise à Jour du Programme
- **Action** : Mettre à jour le programme
- **Vérification** : `anchor deploy --provider.cluster devnet`
- **Affichage** : Afficher le statut du déploiement
- **Validation** : S'assurer que le déploiement a réussi

### 10.2 Mise à Jour des Comptes
- **Action** : Mettre à jour les comptes si nécessaire
- **Vérification** : Vérifier l'état des comptes
- **Affichage** : Afficher l'état des comptes
- **Validation** : S'assurer que les comptes sont à jour 

## 11. Améliorations Possibles

### 11.1 Tests Automatisés
- **Tests unitaires** : Créer des tests unitaires pour chaque fonction d'initialisation
- **Tests d'intégration** : Créer des tests d'intégration pour vérifier l'ensemble du processus d'initialisation
- **Tests de bout en bout** : Créer des tests de bout en bout pour simuler l'initialisation complète
- **Tests de régression** : Mettre en place des tests de régression pour s'assurer que les modifications n'introduisent pas de régressions
- **Tests de performance** : Ajouter des tests de performance pour s'assurer que l'initialisation est rapide et efficace

### 11.2 Récupération en Cas d'Échec
- **Points de contrôle** : Ajouter des points de contrôle à chaque étape pour permettre la reprise après un échec
- **Transactions atomiques** : Utiliser des transactions atomiques pour garantir que toutes les opérations sont effectuées ou aucune
- **Mécanismes de rollback** : Implémenter des mécanismes de rollback pour annuler les modifications en cas d'échec
- **Journalisation des erreurs** : Améliorer la journalisation des erreurs pour faciliter le diagnostic et la récupération
- **Reprise automatique** : Implémenter une reprise automatique après un échec temporaire (comme une erreur de réseau)

### 11.3 Journalisation des Transactions
- **Logs détaillés** : Ajouter des logs détaillés pour chaque transaction
- **Traçage des transactions** : Implémenter un système de traçage des transactions pour suivre leur progression
- **Alertes** : Configurer des alertes pour les transactions échouées
- **Tableau de bord** : Créer un tableau de bord pour visualiser l'état des transactions
- **Historique des transactions** : Maintenir un historique des transactions pour faciliter l'audit et le débogage

### 11.4 Interface Utilisateur Améliorée
- **Indicateurs de progression** : Ajouter des indicateurs de progression pour montrer l'avancement de l'initialisation
- **Animations** : Utiliser des animations pour rendre l'interface plus interactive
- **Mode sombre** : Ajouter un mode sombre pour améliorer l'expérience utilisateur
- **Accessibilité** : Améliorer l'accessibilité de l'interface pour les utilisateurs ayant des besoins spécifiques
- **Responsive design** : Optimiser l'interface pour les appareils mobiles et les différentes tailles d'écran
- **Tutoriels interactifs** : Ajouter des tutoriels interactifs pour guider les nouveaux utilisateurs

### 11.5 Sécurité Renforcée
- **Authentification à deux facteurs** : Ajouter une authentification à deux facteurs pour les opérations sensibles
- **Audit de sécurité** : Effectuer un audit de sécurité régulier du code et des processus
- **Chiffrement des données sensibles** : Chiffrer les données sensibles stockées dans les comptes
- **Limitation des permissions** : Limiter les permissions des comptes au minimum nécessaire
- **Détection des anomalies** : Implémenter un système de détection des anomalies pour identifier les comportements suspects
- **Journalisation des accès** : Maintenir un journal des accès pour faciliter l'audit de sécurité

### 11.6 Documentation Améliorée
- **Guide d'utilisation** : Créer un guide d'utilisation détaillé pour les utilisateurs
- **Documentation technique** : Améliorer la documentation technique pour les développeurs
- **Exemples de code** : Fournir des exemples de code pour les cas d'utilisation courants
- **FAQ** : Créer une FAQ pour répondre aux questions fréquentes
- **Vidéos tutorielles** : Créer des vidéos tutorielles pour expliquer le processus d'initialisation
- **Base de connaissances** : Développer une base de connaissances pour les problèmes courants et leurs solutions

### 11.7 Intégration Continue
- **Pipeline CI/CD** : Mettre en place un pipeline CI/CD pour automatiser les tests et le déploiement
- **Vérification automatique** : Ajouter des vérifications automatiques pour s'assurer que le code respecte les standards
- **Déploiement automatique** : Automatiser le déploiement du programme sur devnet
- **Tests de compatibilité** : Ajouter des tests de compatibilité pour s'assurer que le programme fonctionne avec les différentes versions de Solana
- **Analyse de code statique** : Utiliser des outils d'analyse de code statique pour détecter les problèmes potentiels

### 11.8 Monitoring et Alertes
- **Surveillance des performances** : Mettre en place un système de surveillance des performances
- **Alertes en temps réel** : Configurer des alertes en temps réel pour les problèmes critiques
- **Tableau de bord de monitoring** : Créer un tableau de bord pour visualiser l'état du programme et des comptes
- **Rapports périodiques** : Générer des rapports périodiques sur l'état du programme et des comptes
- **Intégration avec des outils de monitoring** : Intégrer le système avec des outils de monitoring existants 

## 12. Utilisation de l'Adresse Admin pour les Transactions

### 12.1 Avantages de l'Utilisation de l'Adresse Admin
- **Sécurité améliorée** : Évite d'exposer le wallet de déploiement (SOLANA_ADDRESS) pour les opérations d'initialisation
- **Flexibilité** : Permet d'utiliser différents wallets pour différentes opérations
- **Simplicité** : L'initialisation peut être gérée entièrement depuis l'interface utilisateur
- **Contrôle** : L'administrateur a un contrôle direct sur le processus d'initialisation
- **Séparation des rôles** : Maintient une séparation claire entre le déploiement du programme et son initialisation

### 12.2 Processus d'Initialisation avec l'Adresse Admin
1. **Connexion avec Phantom** : L'utilisateur se connecte avec son wallet Phantom contenant l'adresse admin
2. **Paiement des transactions** : Toutes les transactions d'initialisation sont payées par le wallet admin connecté
3. **Configuration de l'admin** : L'adresse admin peut être configurée pour être la même que le wallet connecté ou une autre adresse
4. **Vérification des permissions** : Le programme vérifie que l'adresse admin a les permissions nécessaires pour effectuer les opérations

### 12.3 Implémentation dans la Page "Initialize"
- **Connexion du wallet** : Utiliser l'API Phantom pour connecter le wallet
- **Utilisation du wallet connecté** : Utiliser le wallet connecté pour toutes les transactions
- **Affichage des informations** : Afficher l'adresse du wallet connecté et son solde
- **Gestion des erreurs** : Gérer les erreurs liées au solde insuffisant ou au refus de transaction
- **Indicateurs de progression** : Afficher des indicateurs de progression pour chaque étape d'initialisation

### 12.4 Considérations Importantes
- **Solde suffisant** : S'assurer que le wallet admin a suffisamment de SOL pour payer les transactions
- **Permissions** : Vérifier que le wallet admin a les permissions nécessaires pour effectuer les opérations
- **Sécurité** : Sécuriser le wallet admin car il a des permissions importantes
- **Sauvegarde** : Sauvegarder les clés privées du wallet admin de manière sécurisée
- **Distinction des rôles** : Comprendre la distinction entre l'adresse de déploiement (SOLANA_ADDRESS) et l'adresse admin (ADMIN_WALLET)

### 12.5 Exemple de Code pour l'Utilisation du Wallet Admin
```typescript
// Exemple d'utilisation du wallet admin pour les transactions
async function initializeWithAdminWallet(wallet, connection) {
  try {
    // Vérifier que le wallet est connecté
    if (!wallet.connected) {
      console.error('Le wallet n\'est pas connecté');
      throw new Error('Le wallet n\'est pas connecté');
    }
    
    // Vérifier le solde du wallet
    const balance = await connection.getBalance(wallet.publicKey);
    if (balance < 1000000000) { // 1 SOL en lamports
      console.warn('Solde insuffisant pour payer les transactions');
      throw new Error('Solde insuffisant pour payer les transactions');
    }
    
    // Initialiser le compte de stockage principal avec le wallet admin
    console.log('Initialisation du compte de stockage principal...');
    await initializeProgramStorage(wallet, connection);
    
    // Initialiser les comptes de stockage spécifiques avec le wallet admin
    console.log('Initialisation des comptes de stockage spécifiques...');
    await initializeAccessStorage(wallet, connection);
    await initializeFormationStorage(wallet, connection);
    await initializeSessionStorage(wallet, connection);
    await initializeAttendanceStorage(wallet, connection);
    
    // Configurer l'admin avec l'adresse du wallet connecté
    console.log('Configuration de l\'admin...');
    await updateAdminAddress(connection, wallet, wallet.publicKey.toString());
    
    console.log('Initialisation terminée avec succès');
    return { success: true, message: 'Initialisation terminée avec succès' };
  } catch (error) {
    console.error(`Erreur lors de l'initialisation: ${error.message}`);
    return { success: false, message: `Erreur lors de l'initialisation: ${error.message}` };
  }
}
```

## 13. Interface Utilisateur Intuitive

### 13.1 Indicateurs Visuels
- **Icônes de Succès/Échec** : Utiliser des icônes pour indiquer l'état de chaque étape d'initialisation (par exemple, une coche verte pour le succès, une croix rouge pour l'échec).
- **Barres de Progression** : Ajouter des barres de progression pour montrer l'avancement de l'initialisation.

### 13.2 Messages d'Aide Contextuels
- **Infobulles** : Ajouter des infobulles qui expliquent chaque étape lorsque l'utilisateur survole un élément.
- **Messages d'Aide** : Afficher des messages d'aide sous chaque section pour guider l'utilisateur à travers le processus d'initialisation.

## 14. Gestion des Erreurs Améliorée

### 14.1 Système de Journalisation des Erreurs
- **Utilisation de `console.error`** : Enregistrer les erreurs critiques dans la console pour faciliter le débogage.
- **Utilisation de `console.warn`** : Enregistrer les avertissements qui ne sont pas critiques mais qui méritent l'attention de l'utilisateur.
- **Utilisation de `console.log`** : Enregistrer les informations générales sur le processus d'initialisation.

### 14.2 Exemple de Code pour la Journalisation
```typescript
async function initializeWithAdminWallet(wallet, connection) {
  try {
    // Vérifier que le wallet est connecté
    if (!wallet.connected) {
      console.error('Le wallet n\'est pas connecté');
      throw new Error('Le wallet n\'est pas connecté');
    }
    
    // Vérifier le solde du wallet
    const balance = await connection.getBalance(wallet.publicKey);
    if (balance < 1000000000) { // 1 SOL en lamports
      console.warn('Solde insuffisant pour payer les transactions');
      throw new Error('Solde insuffisant pour payer les transactions');
    }
    
    // Initialiser le compte de stockage principal avec le wallet admin
    console.log('Initialisation du compte de stockage principal...');
    await initializeProgramStorage(wallet, connection);
    
    // Initialiser les comptes de stockage spécifiques avec le wallet admin
    console.log('Initialisation des comptes de stockage spécifiques...');
    await initializeAccessStorage(wallet, connection);
    await initializeFormationStorage(wallet, connection);
    await initializeSessionStorage(wallet, connection);
    await initializeAttendanceStorage(wallet, connection);
    
    // Configurer l'admin avec l'adresse du wallet connecté
    console.log('Configuration de l\'admin...');
    await updateAdminAddress(connection, wallet, wallet.publicKey.toString());
    
    console.log('Initialisation terminée avec succès');
    return { success: true, message: 'Initialisation terminée avec succès' };
  } catch (error) {
    console.error(`Erreur lors de l'initialisation: ${error.message}`);
    return { success: false, message: `Erreur lors de l'initialisation: ${error.message}` };
  }
}
``` 

## 15. Variables Importantes

### 15.1 Adresses et Identifiants
- **SOLANA_ADDRESS_AUTHORITY** : `3fKMHK4qbCCavdQvJ8Vk223RXUnKT4m4Pq9Bii7a6WsN` - Adresse de l'autorité qui a déployé le programme.
- **NEXT_PUBLIC_SOLANA_PROGRAM_ID** : `ATYrhRcGeQGKo43urjfgcWHkqMpDLYaCB9wmXodTC3Vu` - Identifiant du programme Solana.
- **NEXT_PUBLIC_ADMIN_WALLET** : `79ziyYSUHVNENrJVinuotWZQ2TX7n44vSeo1cgxFPzSy` - Adresse du wallet administrateur. 

## 16. Vérification et Initialisation Visuelle via la Page "Initialize"

### 16.1 Vue d'ensemble
La page "Initialize" sert de tableau de bord complet pour vérifier et initialiser visuellement toutes les étapes du programme, y compris le PROGRAM_ID, les comptes de stockage, et d'autres configurations importantes. Cette page centralise toutes les opérations d'initialisation et de vérification dans une interface utilisateur intuitive.

### 16.2 Fonctionnalités
- **Vérification de l'environnement** : Affiche le réseau, le wallet connecté, le solde et les informations de connexion
- **Vérification du PROGRAM_ID** : Affiche le PROGRAM_ID actuel et permet de vérifier sa validité
- **Vérification du Programme** : Permet de vérifier si le programme est déployé et fonctionne correctement
- **Vérification des Comptes de Stockage** : Affiche l'état de tous les comptes de stockage (principal, accès, formations, sessions, présences)
- **Initialisation des Comptes** : Permet d'initialiser individuellement chaque compte de stockage ou tous les comptes en une seule fois
- **Configuration de l'Admin** : Affiche l'admin actuel et permet de mettre à jour l'adresse admin
- **Messages d'Aide Contextuels** : Fournit des messages d'aide pour guider l'utilisateur à travers le processus d'initialisation

### 16.3 Implémentation
- **Interface Utilisateur** : Utilise des composants React pour afficher les informations et les boutons d'action
- **Gestion des États** : Utilise des états React pour suivre l'état de chaque compte et du programme
- **Gestion des Erreurs** : Affiche des messages d'erreur détaillés et des suggestions pour résoudre les problèmes
- **Notifications Toast** : Utilise `react-hot-toast` pour des notifications visuelles sur les actions réussies ou échouées
- **Vérification Automatique** : Vérifie automatiquement l'état du programme et des comptes au chargement de la page

### 16.4 Structure de la Page
- **Section Informations Générales** : Affiche les informations sur le wallet, le réseau et l'état général
- **Section État du Programme** : Affiche l'état du programme et permet de l'initialiser
- **Section État des Comptes de Stockage** : Affiche l'état de chaque compte de stockage et permet de les initialiser
- **Section Configuration de l'Admin** : Affiche l'admin actuel et permet de le mettre à jour

### 16.5 Exemple de Code
```typescript
// Exemple de code pour la page "Initialize"
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { 
  initializeProgramStorage, 
  checkStorageAccount, 
  checkProgramState,
  initializeAccessStorage,
  initializeFormationStorage,
  initializeSessionStorage,
  initializeAttendanceStorage,
  initializeAllStorage,
  findAccessStoragePDA,
  findFormationStoragePDA,
  findSessionStoragePDA,
  findAttendanceStoragePDA,
  updateAdminAddress
} from '../../lib/solana';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { toast } from 'react-hot-toast';
import { PublicKey } from '@solana/web3.js';

// Types pour les états des comptes
interface AccountState {
  exists: boolean;
  address: string;
  loading: boolean;
  error?: string;
}

export default function InitializePage() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const router = useRouter();
  
  // États généraux
  const [status, setStatus] = useState<string>('');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [helpMessage, setHelpMessage] = useState<string>('');
  const [networkInfo, setNetworkInfo] = useState<string>('');
  const [walletBalance, setWalletBalance] = useState<number>(0);
  
  // États des comptes spécifiques
  const [programState, setProgramState] = useState<{
    programExists: boolean;
    storageExists: boolean;
    error?: string;
  }>({
    programExists: false,
    storageExists: false
  });
  
  const [storageAccount, setStorageAccount] = useState<AccountState>({
    exists: false,
    address: '',
    loading: false
  });
  
  const [accessStorageAccount, setAccessStorageAccount] = useState<AccountState>({
    exists: false,
    address: '',
    loading: false
  });
  
  const [formationStorageAccount, setFormationStorageAccount] = useState<AccountState>({
    exists: false,
    address: '',
    loading: false
  });
  
  const [sessionStorageAccount, setSessionStorageAccount] = useState<AccountState>({
    exists: false,
    address: '',
    loading: false
  });
  
  const [attendanceStorageAccount, setAttendanceStorageAccount] = useState<AccountState>({
    exists: false,
    address: '',
    loading: false
  });

  // Vérifier le wallet et l'environnement au chargement
  useEffect(() => {
    const checkWallet = async () => {
      try {
        if (wallet?.publicKey) {
          console.log('Wallet connecté avec la clé publique:', wallet.publicKey.toString());
          setStatus(`Wallet connecté: ${wallet.publicKey.toString()}`);
          
          // Vérifier si l'utilisateur est admin
          const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET || '';
          const isAdminAddress = wallet.publicKey.toString() === adminAddress;
          setIsAdmin(isAdminAddress);
          
          if (isAdminAddress) {
            setHelpMessage('Vous êtes connecté en tant qu\'administrateur. Vous pouvez initialiser le programme.');
          } else {
            setHelpMessage('Vous n\'avez pas les droits d\'administrateur nécessaires pour initialiser le programme.');
          }
          
          // Vérifier le solde du wallet
          try {
            const balance = await connection.getBalance(wallet.publicKey);
            setWalletBalance(balance / 1e9); // Convertir en SOL
          } catch (error) {
            console.error('Erreur lors de la vérification du solde:', error);
          }
          
          // Vérifier la connexion au réseau
          try {
            const version = await connection.getVersion();
            setNetworkInfo(`Réseau: ${connection.rpcEndpoint} (Version: ${version['solana-core']})`);
          } catch (error) {
            console.error('Erreur lors de la vérification de la connexion:', error);
            setNetworkInfo(`Réseau: ${connection.rpcEndpoint} (Erreur de connexion)`);
          }
          
          // Vérifier l'état initial
          await checkInitializationStatus();
        } else {
          console.log('Wallet non connecté');
          setStatus('Veuillez connecter votre wallet');
          setIsAdmin(false);
          setHelpMessage('Connectez votre wallet pour accéder aux fonctionnalités d\'initialisation.');
        }
      } catch (error) {
        console.error('Erreur lors de la vérification du wallet:', error);
        setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
        setIsAdmin(false);
        setHelpMessage('Une erreur est survenue lors de la vérification du wallet. Veuillez réessayer.');
      }
    };

    checkWallet();
  }, [wallet, connection]);

  // Vérifier l'état d'initialisation
  const checkInitializationStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Vérification du compte de storage...');
      
      // Vérifier l'état du programme et du storage
      const state = await checkProgramState(connection);
      console.log('État du programme:', state);
      setProgramState(state);
      
      const isInitialized = state.programExists && state.storageExists;
      setIsInitialized(isInitialized);
      setStatus(isInitialized ? 'Le compte est initialisé' : 'Le compte n\'est pas initialisé');
      
      if (isInitialized) {
        setHelpMessage('Le programme est déjà initialisé. Vous pouvez accéder à l\'administration blockchain.');
      } else {
        setHelpMessage('Le programme n\'est pas encore initialisé. Utilisez le bouton "Initialiser le compte" pour procéder à l\'initialisation.');
      }
      
      // Vérifier les comptes de stockage spécifiques
      await checkStorageAccounts();
      
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setHelpMessage('Une erreur est survenue lors de la vérification de l\'état du programme. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Vérifier les comptes de stockage spécifiques
  const checkStorageAccounts = async () => {
    try {
      // Vérifier le compte de stockage principal
      setStorageAccount(prev => ({ ...prev, loading: true }));
      const [storagePda] = PublicKey.findProgramAddressSync(
        [Buffer.from('storage')],
        new PublicKey(process.env.NEXT_PUBLIC_SOLANA_PROGRAM_ID || '')
      );
      const storageInfo = await connection.getAccountInfo(storagePda);
      setStorageAccount({
        exists: !!storageInfo,
        address: storagePda.toString(),
        loading: false
      });
      
      // Vérifier le compte de stockage des demandes d'accès
      setAccessStorageAccount(prev => ({ ...prev, loading: true }));
      const [accessStoragePda] = await findAccessStoragePDA();
      const accessStorageInfo = await connection.getAccountInfo(accessStoragePda);
      setAccessStorageAccount({
        exists: !!accessStorageInfo,
        address: accessStoragePda.toString(),
        loading: false
      });
      
      // Vérifier le compte de stockage des formations
      setFormationStorageAccount(prev => ({ ...prev, loading: true }));
      const [formationStoragePda] = await findFormationStoragePDA();
      const formationStorageInfo = await connection.getAccountInfo(formationStoragePda);
      setFormationStorageAccount({
        exists: !!formationStorageInfo,
        address: formationStoragePda.toString(),
        loading: false
      });
      
      // Vérifier le compte de stockage des sessions
      setSessionStorageAccount(prev => ({ ...prev, loading: true }));
      const [sessionStoragePda] = await findSessionStoragePDA();
      const sessionStorageInfo = await connection.getAccountInfo(sessionStoragePda);
      setSessionStorageAccount({
        exists: !!sessionStorageInfo,
        address: sessionStoragePda.toString(),
        loading: false
      });
      
      // Vérifier le compte de stockage des présences
      setAttendanceStorageAccount(prev => ({ ...prev, loading: true }));
      const [attendanceStoragePda] = await findAttendanceStoragePDA();
      const attendanceStorageInfo = await connection.getAccountInfo(attendanceStoragePda);
      setAttendanceStorageAccount({
        exists: !!attendanceStorageInfo,
        address: attendanceStoragePda.toString(),
        loading: false
      });
      
    } catch (error) {
      console.error('Erreur lors de la vérification des comptes de stockage:', error);
      setError(`Erreur lors de la vérification des comptes: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Initialiser le compte de stockage principal
  const handleInitialize = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStatus('Initialisation en cours...');
      
      if (!wallet || !connection || !wallet.publicKey) {
        throw new Error('Wallet, connexion ou clé publique non disponible');
      }

      // Vérifier si l'utilisateur est admin
      const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET || '';
      if (wallet.publicKey.toString() !== adminAddress) {
        throw new Error('Vous n\'avez pas les droits d\'administrateur nécessaires pour initialiser le programme');
      }

      try {
        const success = await initializeProgramStorage(wallet, connection);
        if (success) {
          setStatus('Compte initialisé avec succès');
          setIsInitialized(true);
          setHelpMessage('Le programme a été initialisé avec succès. Vous pouvez maintenant accéder à l\'administration blockchain.');
          toast.success('Programme initialisé avec succès');
          
          // Vérifier l'état après l'initialisation
          await checkInitializationStatus();
        } else {
          setStatus('Échec de l\'initialisation');
          setError('L\'initialisation a échoué sans erreur spécifique');
          setHelpMessage('L\'initialisation a échoué. Veuillez vérifier les logs pour plus de détails.');
          toast.error('Échec de l\'initialisation');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation:', error);
        
        // Afficher des messages d'erreur plus détaillés
        if (error instanceof Error) {
          if (error.message.includes('User rejected')) {
            setError('Transaction rejetée par l\'utilisateur. Veuillez accepter la transaction dans votre wallet.');
            setHelpMessage('Vous avez rejeté la transaction. Veuillez accepter la transaction dans votre wallet pour initialiser le programme.');
          } else if (error.message.includes('insufficient funds')) {
            setError('Solde insuffisant pour payer les frais de transaction. Veuillez avoir au moins 0.1 SOL dans votre wallet.');
            setHelpMessage('Votre wallet n\'a pas assez de SOL pour payer les frais de transaction. Veuillez ajouter des SOL à votre wallet.');
          } else if (error.message.includes('network')) {
            setError('Erreur de réseau. Veuillez vérifier votre connexion et réessayer.');
            setHelpMessage('Une erreur de réseau est survenue. Veuillez vérifier votre connexion et réessayer.');
          } else if (error.message.includes('Unexpected error')) {
            setError('Erreur inattendue lors de l\'envoi de la transaction. Essayez de déconnecter et reconnecter votre wallet, puis réessayez.');
            setHelpMessage('Une erreur inattendue est survenue. Essayez de déconnecter et reconnecter votre wallet, puis réessayez.');
          } else {
            setError(`Erreur lors de l'initialisation: ${error.message}`);
            setHelpMessage(`Une erreur est survenue: ${error.message}. Veuillez vérifier les logs pour plus de détails.`);
          }
        } else {
          setError('Erreur inconnue lors de l\'initialisation');
          setHelpMessage('Une erreur inconnue est survenue. Veuillez vérifier les logs pour plus de détails.');
        }
        
        setStatus('Échec de l\'initialisation');
        toast.error('Échec de l\'initialisation');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation:', error);
      setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setHelpMessage('Une erreur est survenue lors de l\'initialisation. Veuillez vérifier les logs pour plus de détails.');
      toast.error('Erreur lors de l\'initialisation');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialiser tous les comptes de stockage
  const handleInitializeAll = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStatus('Initialisation de tous les comptes en cours...');
      
      if (!wallet || !connection || !wallet.publicKey) {
        throw new Error('Wallet, connexion ou clé publique non disponible');
      }
      
      // Vérifier si l'utilisateur est admin
      const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET || '';
      if (wallet.publicKey.toString() !== adminAddress) {
        throw new Error('Vous n\'avez pas les droits d\'administrateur nécessaires pour initialiser le programme');
      }
      
      try {
        const success = await initializeAllStorage(wallet, connection);
        if (success) {
          setStatus('Tous les comptes ont été initialisés avec succès');
          setIsInitialized(true);
          setHelpMessage('Tous les comptes ont été initialisés avec succès. Vous pouvez maintenant accéder à l\'administration blockchain.');
          toast.success('Tous les comptes initialisés avec succès');
          
          // Vérifier l'état après l'initialisation
          await checkInitializationStatus();
        } else {
          setStatus('Échec de l\'initialisation de tous les comptes');
          setError('L\'initialisation a échoué sans erreur spécifique');
          setHelpMessage('L\'initialisation a échoué. Veuillez vérifier les logs pour plus de détails.');
          toast.error('Échec de l\'initialisation de tous les comptes');
        }
      } catch (error) {
        console.error('Erreur lors de l\'initialisation de tous les comptes:', error);
        setError(`Erreur lors de l'initialisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        setHelpMessage(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Veuillez vérifier les logs pour plus de détails.`);
        setStatus('Échec de l\'initialisation de tous les comptes');
        toast.error('Échec de l\'initialisation de tous les comptes');
      }
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de tous les comptes:', error);
      setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setHelpMessage('Une erreur est survenue lors de l\'initialisation. Veuillez vérifier les logs pour plus de détails.');
      toast.error('Erreur lors de l\'initialisation');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Initialiser un compte de stockage spécifique
  const handleInitializeSpecific = async (type: string) => {
    try {
      setIsLoading(true);
      setError(null);
      setStatus(`Initialisation du compte ${type} en cours...`);
      
      if (!wallet || !connection || !wallet.publicKey) {
        throw new Error('Wallet, connexion ou clé publique non disponible');
      }
      
      // Vérifier si l'utilisateur est admin
      const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET || '';
      if (wallet.publicKey.toString() !== adminAddress) {
        throw new Error('Vous n\'avez pas les droits d\'administrateur nécessaires pour initialiser le programme');
      }
      
      let success = false;
      
      try {
        switch (type) {
          case 'access':
            success = await initializeAccessStorage(wallet, connection);
            break;
          case 'formation':
            success = await initializeFormationStorage(wallet, connection);
            break;
          case 'session':
            success = await initializeSessionStorage(wallet, connection);
            break;
          case 'attendance':
            success = await initializeAttendanceStorage(wallet, connection);
            break;
          default:
            throw new Error(`Type de compte inconnu: ${type}`);
        }
        
        if (success) {
          setStatus(`Compte ${type} initialisé avec succès`);
          setHelpMessage(`Le compte ${type} a été initialisé avec succès.`);
          toast.success(`Compte ${type} initialisé avec succès`);
          
          // Vérifier l'état après l'initialisation
          await checkInitializationStatus();
        } else {
          setStatus(`Échec de l'initialisation du compte ${type}`);
          setError('L\'initialisation a échoué sans erreur spécifique');
          setHelpMessage(`L'initialisation du compte ${type} a échoué. Veuillez vérifier les logs pour plus de détails.`);
          toast.error(`Échec de l'initialisation du compte ${type}`);
        }
      } catch (error) {
        console.error(`Erreur lors de l'initialisation du compte ${type}:`, error);
        setError(`Erreur lors de l'initialisation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        setHelpMessage(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Veuillez vérifier les logs pour plus de détails.`);
        setStatus(`Échec de l'initialisation du compte ${type}`);
        toast.error(`Échec de l'initialisation du compte ${type}`);
      }
    } catch (error) {
      console.error(`Erreur lors de l'initialisation du compte ${type}:`, error);
      setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setHelpMessage('Une erreur est survenue lors de l\'initialisation. Veuillez vérifier les logs pour plus de détails.');
      toast.error('Erreur lors de l\'initialisation');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Mettre à jour l'adresse admin
  const handleUpdateAdmin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setStatus('Mise à jour de l\'adresse admin en cours...');
      
      if (!wallet || !connection || !wallet.publicKey) {
        throw new Error('Wallet, connexion ou clé publique non disponible');
      }
      
      // Vérifier si l'utilisateur est admin
      const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET || '';
      if (wallet.publicKey.toString() !== adminAddress) {
        throw new Error('Vous n\'avez pas les droits d\'administrateur nécessaires pour mettre à jour l\'adresse admin');
      }
      
      try {
        const result = await updateAdminAddress(connection, wallet, wallet.publicKey.toString());
        if (result.success) {
          setStatus('Adresse admin mise à jour avec succès');
          setHelpMessage('L\'adresse admin a été mise à jour avec succès.');
          toast.success('Adresse admin mise à jour avec succès');
        } else {
          setStatus('Échec de la mise à jour de l\'adresse admin');
          setError(result.error || 'Erreur inconnue');
          setHelpMessage(`L'erreur est: ${result.error || 'Erreur inconnue'}. Veuillez vérifier les logs pour plus de détails.`);
          toast.error('Échec de la mise à jour de l\'adresse admin');
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'adresse admin:', error);
        setError(`Erreur lors de la mise à jour: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
        setHelpMessage(`Une erreur est survenue: ${error instanceof Error ? error.message : 'Erreur inconnue'}. Veuillez vérifier les logs pour plus de détails.`);
        setStatus('Échec de la mise à jour de l\'adresse admin');
        toast.error('Échec de la mise à jour de l\'adresse admin');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'adresse admin:', error);
      setStatus(`Erreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
      setError(error instanceof Error ? error.message : 'Erreur inconnue');
      setHelpMessage('Une erreur est survenue lors de la mise à jour. Veuillez vérifier les logs pour plus de détails.');
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-center">Tableau de Bord d'Initialisation</h1>
          
          {/* Informations générales */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Informations Générales</h2>
            <div className="mb-4">
              <p><span className="font-bold">État du wallet:</span> {wallet ? 'Connecté' : 'Déconnecté'}</p>
              <p><span className="font-bold">Adresse:</span> {wallet?.publicKey?.toString() || 'Non connecté'}</p>
              <p><span className="font-bold">Rôle:</span> {isAdmin ? 'Administrateur' : 'Utilisateur standard'}</p>
              <p><span className="font-bold">Solde:</span> {walletBalance.toFixed(4)} SOL</p>
              <p><span className="font-bold">Réseau:</span> {networkInfo}</p>
              <p><span className="font-bold">État:</span> {status}</p>
              <p><span className="font-bold">Compte initialisé:</span> {isInitialized ? 'Oui' : 'Non'}</p>
              {error && (
                <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                  <p className="font-bold">Erreur:</p>
                  <p>{error}</p>
                </div>
              )}
              {helpMessage && (
                <div className="mt-2 p-2 bg-blue-100 text-blue-700 rounded">
                  <p className="font-bold">Aide:</p>
                  <p>{helpMessage}</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={checkInitializationStatus}
                className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
                disabled={!wallet || !wallet.publicKey || isLoading}
              >
                {isLoading ? 'Vérification en cours...' : 'Vérifier l\'état'}
              </Button>
              
              {isInitialized && (
                <Button
                  onClick={() => router.push('/admin/blockchain')}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Accéder à l'administration blockchain
                </Button>
              )}
            </div>
          </div>
          
          {/* État du programme */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">État du Programme</h2>
            <div className="mb-4">
              <p><span className="font-bold">Programme déployé:</span> {programState.programExists ? 'Oui' : 'Non'}</p>
              <p><span className="font-bold">Storage initialisé:</span> {programState.storageExists ? 'Oui' : 'Non'}</p>
              {programState.error && (
                <div className="mt-2 p-2 bg-red-100 text-red-700 rounded">
                  <p className="font-bold">Erreur:</p>
                  <p>{programState.error}</p>
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4">
              {isAdmin && !programState.storageExists && (
                <Button
                  onClick={handleInitialize}
                  className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || programState.storageExists}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser le compte principal'}
                </Button>
              )}
            </div>
          </div>
          
          {/* État des comptes de stockage */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">État des Comptes de Stockage</h2>
            
            {/* Compte de stockage principal */}
            <div className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Compte de Stockage Principal</h3>
              <p><span className="font-bold">État:</span> {storageAccount.exists ? 'Initialisé' : 'Non initialisé'}</p>
              <p><span className="font-bold">Adresse:</span> {storageAccount.address}</p>
              {isAdmin && !storageAccount.exists && (
                <Button
                  onClick={() => handleInitializeSpecific('storage')}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || storageAccount.exists}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser le compte principal'}
                </Button>
              )}
            </div>
            
            {/* Compte de stockage des demandes d'accès */}
            <div className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Compte de Stockage des Demandes d'Accès</h3>
              <p><span className="font-bold">État:</span> {accessStorageAccount.exists ? 'Initialisé' : 'Non initialisé'}</p>
              <p><span className="font-bold">Adresse:</span> {accessStorageAccount.address}</p>
              {isAdmin && !accessStorageAccount.exists && (
                <Button
                  onClick={() => handleInitializeSpecific('access')}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || accessStorageAccount.exists}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser le compte des demandes d\'accès'}
                </Button>
              )}
            </div>
            
            {/* Compte de stockage des formations */}
            <div className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Compte de Stockage des Formations</h3>
              <p><span className="font-bold">État:</span> {formationStorageAccount.exists ? 'Initialisé' : 'Non initialisé'}</p>
              <p><span className="font-bold">Adresse:</span> {formationStorageAccount.address}</p>
              {isAdmin && !formationStorageAccount.exists && (
                <Button
                  onClick={() => handleInitializeSpecific('formation')}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || formationStorageAccount.exists}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser le compte des formations'}
                </Button>
              )}
            </div>
            
            {/* Compte de stockage des sessions */}
            <div className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Compte de Stockage des Sessions</h3>
              <p><span className="font-bold">État:</span> {sessionStorageAccount.exists ? 'Initialisé' : 'Non initialisé'}</p>
              <p><span className="font-bold">Adresse:</span> {sessionStorageAccount.address}</p>
              {isAdmin && !sessionStorageAccount.exists && (
                <Button
                  onClick={() => handleInitializeSpecific('session')}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || sessionStorageAccount.exists}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser le compte des sessions'}
                </Button>
              )}
            </div>
            
            {/* Compte de stockage des présences */}
            <div className="mb-4 p-4 border rounded">
              <h3 className="text-lg font-semibold mb-2">Compte de Stockage des Présences</h3>
              <p><span className="font-bold">État:</span> {attendanceStorageAccount.exists ? 'Initialisé' : 'Non initialisé'}</p>
              <p><span className="font-bold">Adresse:</span> {attendanceStorageAccount.address}</p>
              {isAdmin && !attendanceStorageAccount.exists && (
                <Button
                  onClick={() => handleInitializeSpecific('attendance')}
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || attendanceStorageAccount.exists}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser le compte des présences'}
                </Button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-4 mt-4">
              {isAdmin && (
                <Button
                  onClick={handleInitializeAll}
                  className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading}
                >
                  {isLoading ? 'Initialisation en cours...' : 'Initialiser tous les comptes'}
                </Button>
              )}
            </div>
          </div>
          
          {/* Configuration de l'admin */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Configuration de l'Admin</h2>
            <div className="mb-4">
              <p><span className="font-bold">Adresse admin actuelle:</span> {process.env.NEXT_PUBLIC_ADMIN_WALLET || 'Non définie'}</p>
              <p><span className="font-bold">Adresse du wallet connecté:</span> {wallet?.publicKey?.toString() || 'Non connecté'}</p>
              <p><span className="font-bold">Correspondance:</span> {wallet?.publicKey?.toString() === process.env.NEXT_PUBLIC_ADMIN_WALLET ? 'Oui' : 'Non'}</p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {isAdmin && (
                <Button
                  onClick={handleUpdateAdmin}
                  className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
                  disabled={!wallet || !wallet.publicKey || isLoading || wallet?.publicKey?.toString() === process.env.NEXT_PUBLIC_ADMIN_WALLET}
                >
                  {isLoading ? 'Mise à jour en cours...' : 'Mettre à jour l\'adresse admin'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
```

### 16.6 Conclusion
La page "Initialize" est un outil puissant pour gérer l'état du projet et faciliter l'initialisation des comptes et des configurations nécessaires. Elle permet aux utilisateurs de vérifier et d'initialiser visuellement toutes les étapes du programme, offrant ainsi une expérience utilisateur améliorée et une gestion efficace du projet. 