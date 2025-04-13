# Référence API - AlyraSign

## Table des matières
1. [Introduction](#introduction)
2. [Authentification](#authentification)
3. [Endpoints](#endpoints)
4. [Types de données](#types-de-données)
5. [Exemples d'utilisation](#exemples-dutilisation)

## Introduction

L'API AlyraSign permet aux développeurs d'intégrer les fonctionnalités de la plateforme dans leurs applications. Cette API est basée sur REST et utilise JSON pour le format des données.

### URL de base

```
https://api.alyrasign.com/v1
```

## Authentification

Toutes les requêtes à l'API doivent être authentifiées avec un token JWT. Le token doit être inclus dans l'en-tête `Authorization` :

```
Authorization: Bearer <votre_token>
```

### Obtention d'un token

```http
POST /auth/token
Content-Type: application/json

{
  "wallet_address": "votre_adresse_solana",
  "signature": "signature_de_la_message"
}
```

## Endpoints

### Formations

#### Lister les formations

```http
GET /formations
```

Paramètres de requête :
- `page` (optionnel) : Numéro de page (défaut: 1)
- `limit` (optionnel) : Nombre d'éléments par page (défaut: 10)
- `type` (optionnel) : Filtrer par type de formation
- `trainer` (optionnel) : Filtrer par formateur

Réponse :
```json
{
  "data": [
    {
      "id": "string",
      "trainer": "string",
      "title": "string",
      "description": "string",
      "formation_type": "string",
      "max_students": "number",
      "waitlist_size": "number",
      "current_students": "number",
      "created_at": "string",
      "updated_at": "string"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number",
    "pages": "number"
  }
}
```

#### Obtenir une formation

```http
GET /formations/{id}
```

Réponse :
```json
{
  "id": "string",
  "trainer": "string",
  "title": "string",
  "description": "string",
  "formation_type": "string",
  "max_students": "number",
  "waitlist_size": "number",
  "current_students": "number",
  "created_at": "string",
  "updated_at": "string"
}
```

#### Créer une formation

```http
POST /formations
Content-Type: application/json

{
  "title": "string",
  "description": "string",
  "formation_type": "string",
  "max_students": "number",
  "waitlist_size": "number"
}
```

### Inscriptions

#### S'inscrire à une formation

```http
POST /formations/{id}/enroll
```

Réponse :
```json
{
  "enrollment_id": "string",
  "formation_id": "string",
  "student": "string",
  "status": "string",
  "created_at": "string"
}
```

#### Rejoindre une liste d'attente

```http
POST /formations/{id}/waitlist
```

Réponse :
```json
{
  "waitlist_id": "string",
  "formation_id": "string",
  "student": "string",
  "position": "number",
  "status": "string",
  "created_at": "string"
}
```

### Listes d'attente

#### Obtenir la liste d'attente d'une formation

```http
GET /formations/{id}/waitlist
```

Réponse :
```json
{
  "data": [
    {
      "id": "string",
      "formation": "string",
      "student": "string",
      "position": "number",
      "status": "string",
      "timestamp": "string",
      "notification_sent": "boolean"
    }
  ]
}
```

#### Se désister d'une liste d'attente

```http
DELETE /waitlist/{id}
```

## Types de données

### FormationType

```typescript
enum FormationType {
  ONLINE = "online",
  IN_PERSON = "in_person",
  HYBRID = "hybrid"
}
```

### WaitlistStatus

```typescript
enum WaitlistStatus {
  WAITING = "waiting",
  PROMOTED = "promoted",
  DROPPED = "dropped"
}
```

### EnrollmentStatus

```typescript
enum EnrollmentStatus {
  ACTIVE = "active",
  COMPLETED = "completed",
  DROPPED = "dropped"
}
```

## Exemples d'utilisation

### Création d'une formation

```javascript
const createFormation = async (formationData) => {
  const response = await fetch('https://api.alyrasign.com/v1/formations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formationData)
  });
  return await response.json();
};
```

### Inscription à une formation

```javascript
const enrollInFormation = async (formationId) => {
  const response = await fetch(`https://api.alyrasign.com/v1/formations/${formationId}/enroll`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

### Gestion de la liste d'attente

```javascript
const joinWaitlist = async (formationId) => {
  const response = await fetch(`https://api.alyrasign.com/v1/formations/${formationId}/waitlist`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

const getWaitlist = async (formationId) => {
  const response = await fetch(`https://api.alyrasign.com/v1/formations/${formationId}/waitlist`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
``` 