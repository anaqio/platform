'use client';

import { motion } from 'framer-motion';
import { Linkedin } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

import { useAnimationReady } from '@/hooks/use-animation-ready';

const TEAM_STATIC = [
  {
    name: 'Amal AIT OUKHARAZ',
    linkedin: 'https://www.linkedin.com/in/aitoukhraz/',
    photo: '/media/images/people/amal-founder.png',
    initials: 'AA',
  },
  {
    name: 'Mohamed MOUGHAMIR',
    linkedin: 'https://www.linkedin.com/in/moughamir/',
    photo: 'https://avatars.githubusercontent.com/u/8163598?v=4',
    initials: 'MM',
  },
];

export function TeamSection() {
  const t = useTranslations('landing.team');
  const { animated } = useAnimationReady();

  const members = t.raw('members') as Array<{ role: string; bio: string }>;

  return (
    <section
      id="team"
      aria-labelledby="team-heading"
      className="vb-blue relative flex min-h-[100dvh] flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="relative z-10 px-8 pb-10 pt-16 text-center md:px-16">
        <motion.span
          initial={animated ? { opacity: 0, y: 10 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3 block text-[10px] font-bold uppercase tracking-[0.3em] text-white/40"
        >
          {t('eyebrow')}
        </motion.span>
        <motion.h2
          id="team-heading"
          initial={animated ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display font-black tracking-tight text-white"
          style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}
        >
          {t('heading')}
        </motion.h2>
      </div>

      {/* Cards — fill remaining height */}
      <div className="grid flex-1 grid-cols-1 sm:grid-cols-2">
        {TEAM_STATIC.map((member, i) => (
          <motion.div
            key={member.name}
            initial={animated ? { opacity: 0 } : false}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: i * 0.15 }}
            className="group relative min-h-[50dvh] overflow-hidden sm:min-h-0"
          >
            {/* Photo */}
            {member.photo ? (
              <Image
                src={member.photo}
                alt={member.name}
                fill
                className="object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-white/5 font-display text-6xl font-black text-white/10">
                {member.initials}
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

            {/* Gold accent bar */}
            <div
              className="absolute left-0 top-0 h-1 w-16 bg-[#D4AF37] transition-all duration-500 group-hover:w-32"
              aria-hidden="true"
            />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-8">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
                {members[i]?.role}
              </p>
              <h3 className="mb-3 font-display text-2xl font-bold text-white md:text-3xl">
                {member.name}
              </h3>
              <p className="mb-5 max-w-xs text-sm leading-relaxed text-white/60">
                {members[i]?.bio}
              </p>
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/50 transition-colors hover:text-[#D4AF37]"
              >
                <Linkedin size={14} />
                {t('linkedin')}
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
