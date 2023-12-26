import React from 'react';
import { Header } from '../components/Header';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import useSWR from 'swr';
import { useCookies } from 'react-cookie';
import { url } from '../const';

export const Detail = () => {
  const { detailId } = useParams();
  const [cookies] = useCookies();
  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => res.data);

  const { data, error, isLoading } = useSWR(`${url}/books/${detailId}`, fetcher);

  if (isLoading) return <div className="loading">loading...</div>

  return (
    <>
      <Header />
      <main className="main">
        <hgroup className="hgroup">
          <h2>書籍レビュー詳細</h2>
        </hgroup>
        {error && <p className="error-message">リストの取得に失敗しました。</p>}
        <ul className="book-list">
          <li className="book-list__item book-item">
            <p className="book-item__title">{data.title}</p>
            <div className="book-item__body">
              <p>{data.detail}</p>
              <p><a href={data.url}>{data.url}</a></p>
              <p>{data.review}</p>
              <p>{data.reviewer}さん</p>
            </div>
          </li>
        </ul>
      </main>
    </>
  );
};
