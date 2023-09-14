import { DB, readDB, writeDB } from "@/app/libs/DB";
import { checkToken } from "@/app/libs/checkToken";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: DB.rooms.length,
  });
};

export const POST = async (request) => {
  const payload = checkToken();

  if (payload === null) {
    return NextResponse.json(
      {
        ok: false,
        message: "Invalid token",
      },
      { status: 401 }
    );
  }

  let role = payload.role;
  readDB();
  const body = await request.json();
  const { roomName } = body;
  if (role === "ADMIN" || role === "SUPER_ADMIN") {
    const foundRoom = DB.rooms.find((x) => x.roomName === roomName);
    if (foundRoom) {
      return NextResponse.json(
        {
          ok: false,
          message: `Room ${roomName} already exists`,
        },
        { status: 400 }
      );
    }
    const roomId = nanoid();

    //call writeDB after modifying Database
    DB.rooms.push({ roomId, roomName });
    writeDB();

    return NextResponse.json({
      ok: true,
      roomId: roomId,
      message: `Room ${roomName} has been created`,
    });
  }
};
