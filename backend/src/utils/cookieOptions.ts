const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "None" : "Lax") as "None" | "Lax" | "Strict",
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export default cookieOptions