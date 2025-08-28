export interface User {
  id: number;
  firstName: string;
  lastName: string;
}

export interface Todo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface Cart {
  id: number;
  products: any[];
  userId: number;
  total: number,
  totalProducts: number,
  totalQuantity: number
}

export interface UserData {
  userId: number;
  cart: Cart;
  todo: Todo[];
}

export interface State {
  data: UserData[];
  loading: boolean;
  error: string | null;
}