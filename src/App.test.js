import { render, screen } from '@testing-library/react';
import App from './App';

test('Greeting ページに必要な要素が存在するか確認する', () => {
  render(<App />);
  const textBoxElement = screen.getByRole('textbox');
  const buttonElement = screen.getByRole('button');
  expect(textBoxElement).toBeInTheDocument();
  expect(buttonElement).toBeInTheDocument();
});
