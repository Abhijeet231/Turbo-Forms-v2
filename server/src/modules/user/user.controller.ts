import { type Request, type Response } from "express";
import { createUser, getUserByClerkId } from "./user.service.js"
import { clerkClient } from "@clerk/express";

export const getCurrentUser = async (req: Request, res: Response) => {

    const clerkId = res.locals.userId;

    let user = await getUserByClerkId(clerkId)

    if (!user) {
        const clerkUser = await clerkClient.users.getUser(clerkId);

        if (!clerkUser.emailAddresses[0]?.emailAddress) {
            return res.status(400).json({
                error: "User does not have an email address"
            })
        }

        user = await createUser({
            clerk_id: clerkId,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim()
        })
    }

    res.json(user)

}
