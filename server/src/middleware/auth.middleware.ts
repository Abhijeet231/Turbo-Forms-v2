// verify clerk token, attach user to req
import { type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const { userId } = getAuth(req)

    if (!userId) {
        return res.status(401).json({
            error: "Unauthorized"
        })
    }

    res.locals.userId = userId;

    next();
}

//  controllers/user.controller.ts

// export const getMe = async (req: Request, res: Response) => {
//   const userId = res.locals.userId; // 📦 pick it out of the bag
  
//   const user = await userService.getUserByClerkId(userId);
//   res.json(user);
// };