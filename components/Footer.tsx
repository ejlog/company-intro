import Link from 'next/link';
import { company, footerColumns } from '@/data/site';

/** Site footer. Static — no client JS needed. */
export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-top">
        <div>
          <div className="brand-name">{company.brand}</div>
          <div className="brand-sub">{company.footerSub}</div>
          <p className="foot-addr">
            {company.address}
            <br />
            {`T. ${company.tel} · `}
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
        </div>
        <nav className="foot-cols" aria-label="푸터 메뉴">
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <span className="foot-h">{col.heading}</span>
              {col.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
      <div className="foot-bot">
        <div className="wrap">{company.copyright}</div>
      </div>
    </footer>
  );
}
