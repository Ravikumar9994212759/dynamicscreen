import React from 'react';
import Link from 'next/link';

const MenuCard = ({ screenname }) => {
  const slug = screenname
    ? screenname.toLowerCase().replace(/\s+/g, '-') // Convert spaces to hyphens and make lowercase
    : 'unknown'; // Fallback for unknown screenname

  return (
    <Link href={`/${slug}`} passHref>
      <div className="menu-card">
        <h3>{screenname || 'No Name'}</h3>
      </div>
    </Link>
  );
};

export default MenuCard;
