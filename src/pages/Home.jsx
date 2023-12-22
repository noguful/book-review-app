import React, { useState } from 'react';
import { useCookies } from 'react-cookie';
import { Header } from '../components/Header';
import axios from 'axios';
import useSWR from 'swr';
import { url } from '../const';
import { Pagination } from '../components/Pagination';
import './home.scss';

export const Home = () => {
  const [cookies] = useCookies();
  const [offset, setOffset] = useState(0);
  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => res.data);

  const { data, error, isLoading } = useSWR(`${url}/books?offset=${offset}`, fetcher)

  if (isLoading) return <div className="loading">loading...</div>

  return (
    <>
      <Header />
      <main className="main">
        <hgroup className="hgroup">
          <h2>書籍レビュー一覧</h2>
        </hgroup>
        {error && <p className="error-message">リストの取得に失敗しました。</p>}
        <ul className="book-list">
          {data?.map((list, key) => {
            return (
              <li key={key} className="book-list__item book-item">
                <p className="book-item__title">{list.title}</p>
                <p className="book-item__body">{list.detail}</p>
              </li>
            );
          })}
        </ul>
        {data && <Pagination offset={offset} setOffset={setOffset} />}
      </main>
    </>
  );
};
