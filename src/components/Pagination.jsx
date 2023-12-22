import React from 'react';
import './pagination.scss';

export const Pagination = ({ offset, setOffset }) => {

  return (
    <div className="pagination">
      <button onClick={() => setOffset(offset - 10)} className="button" disabled={offset <= 1}>前へ</button>
      <button onClick={() => setOffset(offset + 10)} className="button">次へ</button>
    </div>
  );
};
