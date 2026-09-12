/// <reference types="vite/client" />
import type {Dispatch,SetStateAction} from 'react';
declare global {
 type AppDispatch<A>=Dispatch<A>;
 type AppSetStateAction<S>=SetStateAction<S>;
}
export {};
