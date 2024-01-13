import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorMessage } from '@hookform/error-message';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { url } from '../const';
import { Header } from '../components/Header'

type FormValues = {
  name: string;
};

export const Profile = () => {
  const [cookies] = useCookies();
  const history = useNavigate();
  const { register, formState: { errors }, handleSubmit, setValue } = useForm<FormValues>();
  const [ errorMessage, setErrorMessage ] = useState('');

  useEffect(() => {
    axios
      .get(`${url}/users`, {
        headers: {
          authorization: `Bearer ${cookies.token}`,
        },
      })
      .then((res) => {
        setValue('name', res.data.name);
      })
      .catch((error) => {
        setErrorMessage(`情報の取得に失敗しました。`);
      });
  }, [cookies.token, setValue]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      await axios.put(`${url}/users`, {
          name: data.name
        },
        {
          headers: {
            authorization: `Bearer ${cookies.token}`
          }
        }
      );
      history('/');
    } catch (error) {
      setErrorMessage('ユーザー情報の編集に失敗しました。');
    }
  };

  return (
    <>
      <Header />
      <main className="main">
        <hgroup className="hgroup">
          <h2>ユーザー情報編集画面</h2>
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
                {...register("name", {
                  required: '名前は必須です。',
                  maxLength: {
                    value: 10,
                    message: '10文字以内で入力してください。'
                  },
                })}
              />
              <ErrorMessage errors={errors} name="name" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
          </fieldset>
          <div className="form-button">
            <input type="submit" value="ユーザー情報を更新する" className="button" />
          </div>
        </form>
      </main>
    </>
  )
}
