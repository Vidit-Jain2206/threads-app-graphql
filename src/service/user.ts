import { prismaclient } from "../lib/db";
import { compare, genSaltSync, hashSync } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";

export interface CreateUserPayload {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}

class UserService {
  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);
    return prismaclient.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        salt,
      },
    });
  }

  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await prismaclient.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error("Invalid Email");
    }
    const hashedPassword = user.password;

    const res = await compare(password, hashedPassword);
    if (res) {
      const token = this.createJWTToken({
        firstName: user.firstName,
        lastName: user.lastName || undefined,
        email: user.email,
        id: user.id,
      });
      return token;
    } else {
      throw new Error("Invalid Password");
    }
  }

  public static createJWTToken(payload: any) {
    return sign(payload, "Threads_clone", { expiresIn: "1h" });
  }

  public static decodeJWTToken(token: string) {
    return verify(token, "Threads_clone");
  }
}

export default UserService;
