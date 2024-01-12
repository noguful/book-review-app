import React from 'react';
import './pagination.scss';
import { useRecoilState } from "recoil";
import { paginationState } from "../state";

export const Pagination = () => {

  const [offset, setOffset] = useRecoilState(paginationState);

  return (
    <div className="pagination">
      <button onClick={() => setOffset(offset - 10)} className="button" disabled={offset <= 1}>前へ</button>
      <button onClick={() => setOffset(offset + 10)} className="button">次へ</button>
    </div>
  );
};
