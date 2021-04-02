import { PayloadAction, PayloadActionCreator } from '@reduxjs/toolkit'

export type PayloadActionFromCreator<C extends PayloadActionCreator<any, any>> = C extends PayloadActionCreator<
  infer T,
  infer U
>
  ? PayloadAction<T>
  : unknown
