import UserService, {
  CreateUserPayload,
  GetUserTokenPayload,
} from "../../service/user";

const queries = {
  getUserToken: async (_: any, payload: GetUserTokenPayload) => {
    const res = await UserService.getUserToken(payload);
    return res;
  },
  getCurrentLoggedUser: (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      return context.user;
    }
    throw new Error("Wrong");
  },
};

const mutations = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolvers = {
  queries,
  mutations,
};
