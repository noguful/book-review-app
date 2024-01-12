import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { url } from '../const';
import { Header } from '../components/Header'

export const Edit = () => {
  const { detailId } = useParams();
  const [cookies] = useCookies();
  const history = useNavigate();
  const { register, formState: { errors }, handleSubmit, setValue } = useForm();
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    axios
      .get(`${url}/books/${detailId}`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setValue('title', res.data.title);
        setValue('url', res.data.url);
        setValue('detail', res.data.detail);
        setValue('review', res.data.review);
      })
      .catch((error) => {
        setErrorMessage(`情報の取得に失敗しました。`);
      });
  }, [cookies.token, detailId, setValue]);

  const onSubmit = async (data) => {
    try {
      await axios.put(`${url}/books/${detailId}`, {
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
      console.log(data);
      history('/');
    } catch (error) {
      setErrorMessage('書籍レビューの編集に失敗しました。');
    }
  };

  const handleClick = async () => {
    try {
      await axios.delete(`${url}/books/${detailId}`,
        {
          headers: {
            authorization: `Bearer ${cookies.token}`
          }
        }
      );
      history('/');
    } catch (error) {
      setErrorMessage('書籍レビューの削除に失敗しました。');
    }
  };

  return (
    <>
      <Header />
      <main className="main">
        <hgroup className="hgroup">
          <h2>書籍レビュー編集</h2>
          <button type="button" onClick={handleClick} className="button">削除</button>
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
                {...register("title", {
                  required: 'タイトルは必須です。',
                  maxLength: {
                    value: 4,
                    message: '4文字以内で入力してください。'
                  },
                })}
              />
              <ErrorMessage errors={errors} name="title" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
            <div className="field">
              <label htmlFor="url" className="field__label">URL</label>
              <input
                type="url"
                id="url"
                className="field__input"
                {...register("url", {
                  required: 'URLは必須です。'
                })}
              />
              <ErrorMessage errors={errors} name="url" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
            <div className="field">
              <label htmlFor="title" className="field__label">書籍詳細</label>
              <textarea
                id="detail"
                className="field__input"
                {...register("detail", {
                  required: '書籍詳細は必須です。'
                })}
              />
              <ErrorMessage errors={errors} name="detail" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
            <div className="field">
              <label htmlFor="title" className="field__label">レビュー</label>
              <textarea
                id="review"
                className="field__input"
                {...register("review", {
                  required: 'レビューは必須です。'
                })}
              />
              <ErrorMessage errors={errors} name="review" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
          </fieldset>
          <div className="form-button">
            <input type="submit" value="書籍レビューを更新する" className="button" />
          </div>
        </form>
      </main>
    </>
  );
};
