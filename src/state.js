import { atom } from 'recoil';

const paginationState = atom({
  key: "paginationState",
  default: 0
});

export {
  paginationState
};
