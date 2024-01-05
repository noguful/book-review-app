import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { useCookies } from 'react-cookie';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signIn } from '../authSlice';
import { ErrorMessage } from '@hookform/error-message';
import axios from 'axios';
import { url } from '../const';
import { Header } from '../components/Header'

export const LogIn = () => {
  const auth = useSelector((state) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const history = useNavigate();
  const [, setCookie] = useCookies();
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [ errorMessage, setErrorMessage ] = useState('');

  const onSubmit = async (data) => {
    try {
      const loginResponse = await axios.post(`${url}/signin`, {
        email: data.email,
        password: data.password
      });
      console.log('Success:', loginResponse)
      setCookie('token', loginResponse.data.token);
      dispatch(signIn());
      history('/');
    } catch (error) {
      setErrorMessage('ログインに失敗しました。');
    }
  };

  if (auth) return <Navigate to="/" />;

  return (
    <>
      <Header />
      <main className="main">
        <hgroup className="hgroup">
          <h2>ログイン画面</h2>
          <Link to="/signup">ユーザー作成画面へ</Link>
        </hgroup>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <legend className="fieldset__legend">ログイン情報の入力</legend>
            <div className="field">
              <label htmlFor="email" className="field__label">メールアドレス</label>
              <input
                type="email"
                id="email"
                className="field__input"
                {...register("email", {
                  required: "メールアドレスは必須です。"
                })}
                aria-invalid={errors.email ? "true" : "false"}
              />
              <ErrorMessage errors={errors} name="email" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
            <div className="field">
              <label htmlFor="pass" className="field__label">パスワード</label>
              <input
                type="password"
                name="password"
                id="pass"
                className="field__input"
                {...register("password", {
                  required: "パスワードは必須です。"
                })}
              />
              <ErrorMessage errors={errors} name="password" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
          </fieldset>
          <div className="form-button">
            <input type="submit" value="ログインする" className="button" />
          </div>
        </form>
      </main>
    </>
  );
};
