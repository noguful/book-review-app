import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { ErrorMessage } from '@hookform/error-message';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Navigate } from 'react-router-dom';
import { signIn } from '../authSlice';
import axios from 'axios';
import { url } from '../const';
import Compressor from 'compressorjs';
import { Header } from '../components/Header'

export const SignUp = () => {
  const history = useNavigate();
  const auth = useSelector((state: any) => state.auth.isSignIn);
  const dispatch = useDispatch();
  const { register, formState: { errors }, handleSubmit, reset } = useForm();
  const [ errorMessage, setErrorMessage ] = useState('');
  const [, setCookie] = useCookies(['token']);
  const [imageData, setImageData] = useState("");
  const fileInput = useRef(null);
  const deployment = (files) => {
    const file = files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setImageData(fileReader.result as any);
    };
    fileReader.readAsDataURL(file);
  }
  const onChange = (e) => {
    const files = e.target.files;
    if (!files || files.length <= 0) return;
    deployment(files);
  }
  const { ref, ...rest } = register("file", {
    onChange,
    required: "アイコン画像は必須です。",
  });

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
      dispatch(signIn());
      setCookie('token', authToken);
      reset();
      history('/');
    } catch (error) {
      setErrorMessage('ユーザー作成に失敗しました。');
    }
  };

  if (auth) return <Navigate to="/" />;

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
                id="pass"
                className="field__input"
                {...register("password", {
                  required: "パスワードは必須です。"
                })}
              />
              <ErrorMessage errors={errors} name="password" render={({message}) => <p className="field__error">{message}</p>} />
            </div>
          </fieldset>
          <fieldset className="fieldset">
            <legend className="fieldset__legend">アイコン画像</legend>
            <div className="field">
              <label htmlFor="icon" className="field__label">アップロードするファイルを選択してください。</label>
              <input
                type="file"
                id="icon"
                className="field__file"
                accept=".jpg, .jpeg, .png"
                ref={(e) => {
                  ref(e);
                  fileInput.current = e as any;
                }}
                {...rest}
              />
              {imageData &&
                <p>
                  <img src={imageData} alt="画像プレビュー" width="200" />
                </p>
              }
              <ErrorMessage errors={errors} name="file" render={({message}) => <p className="field__error">{message}</p>} />
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
