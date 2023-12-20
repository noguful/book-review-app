import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import axios from 'axios';
import { url } from '../const';
import Compressor from 'compressorjs';

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
    <div>
      <p>ユーザー作成画面</p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p className="errorMessage">{errorMessage}</p>
        <div>
          <label htmlFor="username">名前</label>
          <input
            type="text"
            id="username"
            name="username"
            {...register("name", {
              required: '名前を入力してください。',
              maxLength: {
                value: 4,
                message: '4文字以内で入力してください。'
              },
            })}
          />
          <ErrorMessage errors={errors} name="name" render={({message}) => <p>{message}</p>} />
        </div>
        <div>
          <label htmlFor="email">メールアドレス: </label>
          <input type="email" id="email" {...register("email", { required: "Email Address is required" })}  aria-invalid={errors.email ? "true" : "false"} />
          <ErrorMessage errors={errors} name="email" render={({message}) => <p>{message}</p>} />
        </div>
        <div>
          <label htmlFor="pass">パスワード: </label>
          <input type="password" name="password" id="pass" {...register("password")}  />
        </div>
        <div>
          <label htmlFor="icon">アップロードするファイルを選択してください: </label>
          <input type="file" id="icon" name="icon" accept=".jpg, .jpeg, .png" {...register("icon")} />
        </div>
        <input type="submit" value="作成する" />
      </form>
      <Link to="/login">ログイン</Link>
    </div>
  );
};
