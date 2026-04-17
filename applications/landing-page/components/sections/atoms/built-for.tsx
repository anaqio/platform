'use client'

import styles from './builtfor.module.css'

export function BuiltFor() {
  return (
    <div className={`pointer-events-none ${styles['police-tape']}`}>
      <div className="flex flex-col items-center text-sm font-bold text-black sm:flex-row md:text-base">
        <span className="mb-4 font-display uppercase tracking-widest sm:mb-0 sm:mr-3">
          Built for
        </span>
        <div className={styles['dropping-texts']}>
          <div className="font-body font-black uppercase tracking-widest text-black">Brands</div>
          <div className="font-body font-black uppercase tracking-widest text-black">Designers</div>
          <div className="font-body font-black uppercase tracking-widest text-black">Fashion</div>
          <div className="font-body font-black uppercase tracking-widest text-black">Commerce</div>
          <div className="font-body font-black uppercase tracking-widest text-black">Models</div>
          <div className="font-body font-black uppercase tracking-widest text-black">Studios</div>
          <div className="font-body font-black uppercase tracking-widest text-black">EVERYONE!</div>
        </div>
      </div>
    </div>
  )
}
