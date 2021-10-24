import jwtDecode from 'jwt-decode';
import * as jwt from 'jsonwebtoken';
import { BackendMethod, Remult } from 'remult';
import { Roles } from './Roles';

const AUTH_TOKEN_KEY = "authToken";

export class AuthService {
  constructor(private remult: Remult) {
     let token = AuthService.fromStorage();
     if (token) {
         this.setAuthToken(token);
     }
  }

  async signIn(username: string) {
    this.setAuthToken(await AuthService.signIn(username));
  }
  @BackendMethod({ allowed: true })
  static async signIn(username: string) {
    let validUsers = [
      { id: "1", name: "Jane", roles: [Roles.admin] },
      { id: "2", name: "Steve", roles: [] }
    ];
    let user = validUsers.find(user => user.name === username);
    if (!user)
      throw new Error("Invalid User");
    return jwt.sign(user, getJwtTokenSignKey());
  }

  setAuthToken(token: string) {
    this.remult.setUser(jwtDecode(token));
    sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  }
  static fromStorage(): string {
    return sessionStorage.getItem(AUTH_TOKEN_KEY)!;
  }

  signOut() {
    this.remult.setUser(undefined!);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
  }
}

export function getJwtTokenSignKey() {
  if (process.env.NODE_ENV === "production")
    return process.env.TOKEN_SIGN_KEY!;
  return "my secret key";
}
