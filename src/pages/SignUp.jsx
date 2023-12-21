import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import axios from 'axios';
import { url } from '../const';
import Compressor from 'compressorjs';
import { Header } from '../components/Header'

export const SignUp = () => {
  const { register, formState: { errors }, handleSubmit, reset } = useForm();
  const [ errorMessage, setErrorMessage ] = useState('');

  const onSubmit = async (data) => {
    try {
      const userResponse = await axios.post(`${url}/users`, {
        name: data.name,
        email: data.email,
        password: data.password
      });

      const authToken = userResponse.data.token;
      
      if (data.icon && data.icon.length > 0) {

        new Compressor(data.icon[0], {
          quality: 0.6,
          success(result) {
            const formData = new FormData();
            formData.append('icon', result);

            axios.post(`${url}/uploads`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${authToken}`
              }
            });
          },
          error(error) {
            setErrorMessage('画像圧縮に失敗しました。');
          }
        });
      }
      console.log('Success:', data)
      reset();
    } catch (error) {
      setErrorMessage('ユーザー作成に失敗しました。');
    }
  }

  return (
    <>
      <Header />
      <main className="main">
        <hgroup className="hgroup">
          <h2>ユーザー作成画面</h2>
          <Link to="/login">ログイン画面へ</Link>
        </hgroup>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <fieldset className="fieldset">
            <legend className="fieldset__legend">基本情報</legend>
            <div className="field">
              <label htmlFor="username" className="field__label">名前</label>
              <input
                type="text"
                id="username"
                className="field__input"
                name="username"
                {...register("name", {
                  required: '名前は必須です。',
                  maxLength: {
                    value: 4,
                    message: '4文字以内で入力してください。'
                  },
                })}
              />
              <ErrorMessage errors={errors} name="name" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
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
          <fieldset className="fieldset">
            <legend className="fieldset__legend">アイコン画像</legend>
            <div className="field">
              <label htmlFor="icon" className="field__label">アップロードするファイルを選択してください。</label>
              <input type="file" id="icon" className="field__file" name="icon" accept=".jpg, .jpeg, .png" {...register("icon")} />
            </div>
          </fieldset>
          <div className="form-button">
            <input type="submit" value="ユーザーを作成する" className="button" />
          </div>
        </form>
      </main>
    </>
  );
};
