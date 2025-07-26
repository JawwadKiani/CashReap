export interface LocationData {
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
}

export interface FilterOptions {
  annualFee?: 'any' | '0' | '100';
  creditScore?: number;
}

export interface UserSession {
  id: string;
}
