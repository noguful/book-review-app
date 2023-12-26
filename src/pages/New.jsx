import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../const';

import { Header } from '../components/Header'

export const New = () => {
  const [cookies] = useCookies();
  const history = useNavigate();
  const { register, formState: { errors }, handleSubmit } = useForm();
  const [ errorMessage, setErrorMessage ] = useState('');

  const onSubmit = async (data) => {
    try {
      await axios.post(`${url}/books`, {
          title: data.title,
          url: data.url,
          detail: data.detail,
          review: data.review
        },
        {
          headers: {
            authorization: `Bearer ${cookies.token}`
          }
        }
      );
      history('/');
    } catch (error) {
      setErrorMessage('書籍レビュー登録に失敗しました。');
    }
  };

  return (
    <>
      <Header />
      <main className="main">
        <hgroup className="hgroup">
          <h2>書籍レビュー登録画面</h2>
        </hgroup>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <legend className="fieldset__legend">レビュー情報</legend>
            <div className="field">
              <label htmlFor="title" className="field__label">タイトル</label>
              <input
                type="text"
                id="title"
                className="field__input"
                name="title"
                {...register("title", {
                  required: 'タイトルは必須です。',
                  maxLength: {
                    value: 4,
                    message: '4文字以内で入力してください。'
                  },
                })}
              />
              <ErrorMessage errors={errors} name="name" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
            <div className="field">
              <label htmlFor="url" className="field__label">URL</label>
              <input
                type="url"
                id="url"
                className="field__input"
                name="url"
                {...register("url", {
                  required: 'URLは必須です。'
                })}
              />
              <ErrorMessage errors={errors} name="name" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
            <div className="field">
              <label htmlFor="title" className="field__label">書籍詳細</label>
              <textarea
                rows="4"
                id="detail"
                className="field__input"
                name="detail"
                {...register("detail", {
                  required: '書籍詳細は必須です。'
                })}
              />
              <ErrorMessage errors={errors} name="name" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
            <div className="field">
              <label htmlFor="title" className="field__label">レビュー</label>
              <textarea
                rows="4"
                id="review"
                className="field__input"
                name="review"
                {...register("review", {
                  required: 'レビューは必須です。'
                })}
              />
              <ErrorMessage errors={errors} name="name" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
          </fieldset>
          <div className="form-button">
            <input type="submit" value="レビューを登録する" className="button" />
          </div>
        </form>
      </main>
    </>
  );
};
