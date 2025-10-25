export interface RegisterMutation {
  email: string;
  password: string;
  displayName: string;
  image: File | string | null;
}

export interface LoginMutation {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  email: string;
  token: string;
  role: string;
  displayName: string;
  image?: string;
}

export interface RegisterResponse {
  message: string;
  user: User;
  displayName: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      name: string;
      message: string;
    };
  };
  message: string;
  name: string;
  _message: string;
}

export interface GlobalError {
  error: string;
}

export interface Glacier {
  glacier_id: number;
  humidity: number; // Влажность
  wind_velocity: number; // Скорость ветра
  temperature: number; // Температура
  water_volume: number; // Объем воды
  mass: number; // Масса ледника
  real_mass: number;
}

export interface WaterLossInCanal {
  totalLength: number; // Ориентировочная длина всех каналов
  averageWidth: number; // Ориентировочная средняя ширина каналов
  soilType: 'sand' | 'clay' | 'gravel' | 'rocky' | 'loam'; // Тип почвы
}

export interface AnimalWaterConsumption {
  cattle: number; // Крупный рогатый
  sheep: number; // Овцы, козы
  horses: number; // Лошади
  poultry: number; // Птицы
  climate: 'cold' | 'moderate' | 'hot'; // Выбор климата
}

export interface IrrigationWaterConsumption {
  grassArea: number; // Площадь для травы
  wheatArea: number; // Площадь для пшеницы
  climate: 'cold' | 'moderate' | 'hot'; // Выбор климата
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface WaterConsumption {
  _id: string;
  waterLossInCanal: WaterLossInCanal;
  animalWaterConsumption: AnimalWaterConsumption;
  irrigationWaterConsumption: IrrigationWaterConsumption;
  glacierCount: number;
  coordinates?: Coordinates;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WaterConsumptionMutation extends Omit<WaterConsumption, '_id'> {}

