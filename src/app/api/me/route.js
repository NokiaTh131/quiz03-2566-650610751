import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Jakkapong Jinasen",
    studentId: "650610751",
  });
};
