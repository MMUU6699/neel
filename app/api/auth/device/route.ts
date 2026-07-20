import { db, deviceCodes, users, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { action, deviceCode, userCode, userId } = await req.json();

    if (action === "generate") {
      // Generate a new device code and user code
      const newDeviceCode = crypto.randomBytes(32).toString("hex");
      // Generate 6 character alphanumeric code
      const newUserCode = crypto.randomBytes(4).toString("hex").substring(0, 6).toUpperCase();
      
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Valid for 15 minutes

      await db.insert(deviceCodes).values({
        deviceCode: newDeviceCode,
        userCode: newUserCode,
        expiresAt,
      });

      return NextResponse.json({
        deviceCode: newDeviceCode,
        userCode: newUserCode,
        expiresIn: 900,
        interval: 5,
      });
    }

    if (action === "poll") {
      if (!deviceCode) return NextResponse.json({ error: "Missing deviceCode" }, { status: 400 });

      const record = await db.query.deviceCodes.findFirst({
        where: eq(deviceCodes.deviceCode, deviceCode),
      });

      if (!record) {
        return NextResponse.json({ error: "invalid_grant" }, { status: 400 });
      }

      if (record.expiresAt < new Date()) {
        return NextResponse.json({ error: "expired_token" }, { status: 400 });
      }

      if (!record.userId) {
        return NextResponse.json({ error: "authorization_pending" }, { status: 400 });
      }

      // User has authorized, create a session
      const sessionToken = crypto.randomBytes(32).toString("hex");
      const sessionExpires = new Date();
      sessionExpires.setDate(sessionExpires.getDate() + 30); // 30 days session

      await db.insert(sessions).values({
        sessionToken,
        userId: record.userId,
        expires: sessionExpires,
      });

      // Cleanup device code
      await db.delete(deviceCodes).where(eq(deviceCodes.deviceCode, deviceCode));

      return NextResponse.json({ sessionToken });
    }

    if (action === "authorize") {
      if (!userCode || !userId) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

      const record = await db.query.deviceCodes.findFirst({
        where: eq(deviceCodes.userCode, userCode.toUpperCase()),
      });

      if (!record) {
        return NextResponse.json({ error: "Invalid code" }, { status: 400 });
      }

      if (record.expiresAt < new Date()) {
        return NextResponse.json({ error: "Code expired" }, { status: 400 });
      }

      // Update the record with the userId
      await db.update(deviceCodes)
        .set({ userId })
        .where(eq(deviceCodes.userCode, userCode.toUpperCase()));

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    console.error("Device Auth Error:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
