import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { Header } from '../components/Header';
import axios from 'axios';
import { url } from '../const';
import './home.scss'

export const Home = () => {
  const [cookies] = useCookies();
  const [lists, setLists] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect (() => {
    axios
      .get(`${url}/books?offset=0`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        }
      })
      .then((res) => {
        setLists(res.data);
      })
      .catch((err) => {
        setErrorMessage('リストの取得に失敗しました。');
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Header />
      <main className="main">
        <hgroup className="hgroup">
          <h2>書籍レビュー一覧</h2>
        </hgroup>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <ul className="book-list">
          {lists.map((list, key) => {
            return (
              <li key={key} className="book-list__item book-item">
                <p className="book-item__title">{list.title}</p>
                <p className="book-item__body">{list.detail}</p>
              </li>
            );
          })}
        </ul>
      </main>
    </>
  );
};
