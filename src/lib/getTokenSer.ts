import { headers } from "next/headers"
import { auth } from "./auth"

export const getTokenSer = async () => {
  try {
    const jwtToken = await auth.api.getToken({
      headers: await headers(),
    });
    return jwtToken?.token ?? null;
  } catch {
    return null;
  }
};
