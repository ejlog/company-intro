'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { company, navItems } from '@/data/site';

/**
 * Sticky header. Client-side for two reasons: the mobile drawer holds open
 * state, and the active link is derived from the current route rather than
 * hardcoded per page as it was in the source HTML.
 */
export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the drawer on navigation — App Router keeps this component mounted
  // across route changes, so it would otherwise stay open.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <Link className="brand" href="/">
          <span className="brand-name">{company.brand}</span>
          <span className="brand-sub">{company.brandSub}</span>
        </Link>
        <nav
          className={`nav-links${open ? ' is-open' : ''}`}
          id="navLinks"
          aria-label="주요 메뉴"
        >
          {navItems.map((item) => {
            // Hash links point back into the home page and never count as the
            // active section.
            const isActive = !item.href.includes('#') && pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? 'is-active' : undefined}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </Link>
            );
          })}
          <span className="nav-lang">KR / EN</span>
        </nav>
        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? '메뉴 닫기' : '메뉴 열기'}
          aria-expanded={open}
          aria-controls="navLinks"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
