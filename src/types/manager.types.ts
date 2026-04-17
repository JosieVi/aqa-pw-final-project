export interface ICreateManagerPayload {
  username: string;
  password?: string; // Можно сделать необязательным, если в контроллере зададим дефолтный
  firstName: string;
  lastName: string;
}

export interface IManager {
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdOn: string;
  _id: string;
}

// Интерфейс ответа при создании (использует базовую модель)
export interface ICreateManagerResponse {
  IsSuccess: boolean;
  ErrorMessage: string | null;
  User: IManager;
}
