import { ObjectBuilder } from '../utils/object-builder';

export interface TeamI {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  photo: string | null;
  initials: string;
  github?: string;
  twitter?: string;
  email?: string;
}

const TEAM_FORMAT = {
  name: 'name',
  role: 'role',
  bio: 'bio',
  linkedin: 'linkedin',
  photo: 'photo',
  initials: 'initials',
  github: 'github',
  twitter: 'twitter',
  email: 'email',
};

export const getAboutTeam = (t: (key: string) => string): TeamI[] => [
  ObjectBuilder<TeamI>(
    {
      name: t('founder.amal.name'),
      role: t('founder.amal.role'),
      bio: t('founder.amal.bio'),
      linkedin: 'https://www.linkedin.com/in/aitoukhraz/',
      photo: '/media/images/people/amal-ait-oukharaz-founder.png',
      initials: 'AA',
    },
    TEAM_FORMAT
  ),
  ObjectBuilder<TeamI>(
    {
      name: t('founder.mo.name'),
      role: t('founder.mo.role'),
      bio: t('founder.mo.bio'),
      linkedin: 'https://www.linkedin.com/in/moughamir/',
      github: 'https://github.com/moughamir',
      twitter: 'https://x.com/omnizya',
      photo: '/media/images/people/mohamed-moughamir-cofounder.png',
      initials: 'MM',
    },
    TEAM_FORMAT
  ),
  ObjectBuilder<TeamI>(
    {
      name: t('founder.chaimae.name'),
      role: t('founder.chaimae.role'),
      bio: t('founder.chaimae.bio'),
      linkedin: 'https://shazo.anaqio.com',
      email: 'marketing@anaqio.com',
      photo: null,
      initials: 'ZC',
    },
    TEAM_FORMAT
  ),
];
