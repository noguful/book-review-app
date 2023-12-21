import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import axios from 'axios';
import { url } from '../const';
import { Header } from '../components/Header'

export const LogIn = () => {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [ errorMessage, setErrorMessage ] = useState('');

  const onSubmit = async (data) => {
    try {
      await axios.post(`${url}/signin`, {
        email: data.email,
        password: data.password
      });
      console.log('Success:', data)
    } catch (error) {
      setErrorMessage('ログインに失敗しました。');
    }
  }

  return (
    <>
      <Header />
      <main className="main">
        <hgroup className="hgroup">
          <h2>ログイン画面</h2>
          <Link to="/signup">ユーザー作成画面へ</Link>
        </hgroup>
        <p className="errorMessage">{errorMessage}</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <legend className="fieldset__legend">ログイン情報の入力</legend>
            <div className="field">
              <label htmlFor="email" className="field__label">メールアドレス</label>
              <input type="email" id="email" className="field__input" {...register("email", { required: "メールアドレスは必須です。" })}  aria-invalid={errors.email ? "true" : "false"} />
              <ErrorMessage errors={errors} name="email" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
            <div className="field">
              <label htmlFor="pass" className="field__label">パスワード</label>
              <input type="password" name="password" id="pass" className="field__input" {...register("password")}  />
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
