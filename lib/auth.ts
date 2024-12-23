import { cookies } from "next/headers";
import { jwtVerify } from "jose";

interface JWTPayload {
  id: string;
  username: string;
  email: string;
  iat: number;
  exp: number;
}

export async function getUser() {
  const cookieStore = await cookies(); // Await the cookies promise
  const token = cookieStore.get("token");

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return verified.payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getUser();
  return !!user;
}
