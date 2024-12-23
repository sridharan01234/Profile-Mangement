import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import { JWTPayload } from "@/types/jwt";

export async function getUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (!token) {
    return null;
  }

  try {
    const verified = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return verified.payload as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getUser();
  return !!user;
}
