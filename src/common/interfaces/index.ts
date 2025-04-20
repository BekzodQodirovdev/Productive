export interface IPayload {
  sub: string;
  email: string;
  is_active: boolean;
}

export class TokenResponse {
  accessToken: string;
  refreshToken: string;
}
