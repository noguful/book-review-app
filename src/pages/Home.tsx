import React from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { Header } from '../components/Header';
import axios from 'axios';
import useSWR from 'swr';
import { useRecoilState } from "recoil";
import { paginationState } from "../state";
import { url } from '../const';
import { Pagination } from '../components/Pagination';
import { Link } from 'react-router-dom';
import './home.scss';

export const Home = () => {
  const auth = useSelector((state: any) => state.auth.isSignIn);
  const [cookies] = useCookies();
  const [offset] = useRecoilState(paginationState);
  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => res.data);

  const { data, error, isLoading } = useSWR( auth ? `${url}/books?offset=${offset}` : `${url}/public/books?offset=${offset}`, fetcher)

  if (isLoading) return <div className="loading">loading...</div>

  const handleClick = async (bookId: string) => {
    try {
      await axios.post(`${url}/logs`, {
          selectBookId: bookId,
        },
        {
          headers: {
            authorization: `Bearer ${cookies.token}`
          }
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <main className="main">
        <hgroup className="hgroup">
          <h2>書籍レビュー一覧</h2>
          {auth && <Link to="/new" className="button">レビュー登録</Link>}
        </hgroup>
        {error && <p className="error-message">リストの取得に失敗しました。</p>}
        <ul className="book-list">
          {data?.map((list, key) => {
            return (
              <li key={key} className="book-list__item book-item">
                {auth ? (
                  <>
                    <Link to={`/detail/${list.id}`} className="book-item__link" onClick={() => handleClick(list.id)}>
                      <p className="book-item__title">
                        {list.title}
                      </p>
                      <p className="book-item__body">{list.detail}</p>
                    </Link>
                    {list.isMine && <Link to={`/edit/${list.id}`} className="book-item__edit">編集</Link>}
                  </>
                ) : (
                  <>
                    <p className="book-item__title">{list.title}</p>
                    <p className="book-item__body">{list.detail}</p>
                  </>
                )}
              </li>
            );
          })}
        </ul>
        {data && <Pagination />}
      </main>
    </>
  );
};
