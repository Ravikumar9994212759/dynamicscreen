import React from 'react';
import Link from 'next/link';

const MenuCard = ({ screenname, onAddClick }) => {
  const slug = screenname
    ? screenname.toLowerCase().replace(/\s+/g, '-')
    : 'unknown';
  console.log("Generated slug:", slug);

  return (
    <div className="menu-card">
      <Link href={`/${slug}`} passHref>
        <h3>{screenname || 'No Name'}</h3>
      </Link>
      <button onClick={() => onAddClick(slug)} className="add-button">
        Add
      </button>
      <style jsx>{`
        .menu-card {
          background-color: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
          cursor: pointer;
          text-align: center;
          padding: 20px;
          margin: 10px;
          width: 100%;
          max-width: 350px;
          min-height: 100px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
          overflow: hidden;
        }

        .menu-card:hover {
          transform: translateY(-5px);
          box-shadow: 0px 8px 16px rgba(0, 0, 255, 0.3);
          border-color: #3a75b8;
          background-color: #227dab;
        }

        .menu-card:active {
          transform: translateY(0px);
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
        }

        .menu-card h3 {
          font-size: 20px;
          font-weight: 700;
          color: #333333;
          margin: 0;
          text-transform: capitalize;
        }

        .add-button {
          margin-top: 8px;
          background-color: #0070f3;
          color: white;
          border: none;
          padding: 8px 16px;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.2s ease-in-out;
        }

        .add-button:hover {
          background-color: #005bb5;
        }
      `}</style>
    </div>
  );
};

export default MenuCard;
