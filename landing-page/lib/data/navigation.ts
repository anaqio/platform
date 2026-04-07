/**
 * Footer and Navigation Content
 * Centralized for DRY principles and easy maintenance.
 */

import InstagramIcon from '@/components/ui/icons/instagram';
import LinkedinIcon from '@/components/ui/icons/linkedin';
import _NewTwitterIcon from '@/components/ui/icons/NewTwitter';
import PinterestIcon from '@/components/ui/icons/pinterest';
import TiktokIcon from '@/components/ui/icons/tiktok';
import YoutubeIcon from '@/components/ui/icons/youtube';

export const socialLinks = [
  {
    href: 'https://www.instagram.com/anaqio_official/',
    label: 'Instagram',
    Icon: InstagramIcon,
  },
  {
    href: 'https://www.linkedin.com/company/anaqio',
    label: 'LinkedIn',
    Icon: LinkedinIcon,
  },
  {
    href: 'https://www.youtube.com/@anaqio-studio',
    label: 'YouTube',
    Icon: YoutubeIcon,
  },
  {
    href: 'https://www.pinterest.com/anaqioVFS/',
    label: 'Pinterest',
    Icon: PinterestIcon,
  },
  {
    href: 'https://tiktok.com/@anaqio',
    label: 'TikTok',
    Icon: TiktokIcon,
  },
];

export const footerColumns = [
  {
    title: 'Platform',
    links: [
      { label: 'AI Studio', href: '/early-access' },
      { label: 'Lookbook Generator', href: '/early-access' },
      { label: 'Virtual Try-On', href: '/early-access' },
      { label: 'Pricing', href: '/early-access' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Brand', href: '/brand' },
      { label: 'Blog', href: '/blog' },
      { label: 'Help Center', href: '/help' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Early Access', href: '/early-access', badge: 'JOIN' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Legal Mentions', href: '/legal-mentions' },
      { label: 'Cookies', href: '/cookies' },
    ],
  },
];

export const footerContent = {
  description:
    'Your Digital Atelier. Create stunning lookbooks, swap backgrounds, and generate editorial visuals — powered by AI, designed for Moroccan fashion brands.',
  copyright: `\u00A9 ${new Date().getFullYear()} Anaqio`,
  allRightsReserved: 'All rights reserved.',
};
