/** Centralized error messages for server actions and forms. */
export const ERROR_MESSAGES = {
  // Common
  GENERIC: 'Une erreur est survenue. Veuillez réessayer plus tard.',
  GENERIC_SHORT: "Erreur lors de l'envoi.",
  AUTH: "Erreur d'authentification.",
  VALID_EMAIL: 'Veuillez fournir une adresse e-mail valide.',

  // Waitlist / Landing
  ALREADY_JOINED: 'Cette adresse e-mail est déjà sur la liste !',
  NAME_REQUIRED: 'Le nom est requis (min 2 caractères).',
  ROLE_REQUIRED: 'Veuillez sélectionner votre rôle.',

  // Studio
  UPLOAD_FAILED: "L'envoi de l'image a échoué.",
  GENERATION_FAILED: "La génération de l'image a échoué.",
  FILE_TOO_LARGE: 'Le fichier est trop volumineux (max 10 Mo).',
  INVALID_FILE_TYPE: 'Type de fichier invalide. Utilisez JPEG, PNG ou WebP.',
} as const
