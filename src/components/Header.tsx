import React from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../authSlice';
import axios from 'axios';
import useSWR from 'swr';
import { url } from '../const';
import { Link } from 'react-router-dom';
import './header.scss'

export const Header = () => {
  const auth = useSelector((state: any) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const history = useNavigate();
  const [cookies, , removeCookie] = useCookies();
  const handleSignOut = () => {
    dispatch(signOut());
    removeCookie('token');
    history('/login');
  };

  const fetcher = (url) =>
    axios
      .get(url, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => res.data);
  const { data } = useSWR( auth ? `${url}/users` : null, fetcher)

  return (
    <header className="header">
      <h1 className="header__title">
        <Link to="/">書籍レビューアプリ</Link>
      </h1>
      <div className="header__control">
        {auth ? (
          <>
            <p className="header__user">{data?.name}さん<Link to="/profile" className="header__edit">（編集）</Link></p>
            <button onClick={handleSignOut} className="button button--white">
              ログアウト
            </button>
          </>
        ) : (
          <p>
            <Link to="/login" className="button button--white">ログイン画面へ</Link>
          </p>
        )}
      </div>
    </header>
  );
};
