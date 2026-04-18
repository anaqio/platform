/** Centralized error messages for server actions and forms. */
export const ERROR_MESSAGES = {
  GENERIC: 'Une erreur est survenue. Veuillez réessayer plus tard.',
  GENERIC_SHORT: "Erreur lors de l'envoi.",
  AUTH: "Erreur d'authentification.",
  VALID_EMAIL: 'Veuillez fournir une adresse e-mail valide.',
  ALREADY_JOINED: 'Cette adresse e-mail est déjà sur la liste !',
  NAME_REQUIRED: 'Le nom est requis (min 2 caractères).',
  ROLE_REQUIRED: 'Veuillez sélectionner votre rôle.',
} as const
