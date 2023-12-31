"use client";
import { WEBSOCKET_URL } from "@/constant";
import httpRequest from "@/helper/axios";
import { AuthContext } from "@/modules/auth_provider";
import { WebsocketContext } from "@/modules/websocket_provider";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const Page = () => {
  const [roomName, setRoomName] = useState("");
  const [rooms, setRooms] = useState<{ id: string; name: string }[]>([]);
  const { user } = useContext(AuthContext);
  const { setConn } = useContext(WebsocketContext);
  const router = useRouter();

  const getRooms = async () => {
    try {
      const response = await httpRequest.get("/ws/getRooms");
      if (response.data) {
        setRooms(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleClick = async () => {
    try {
      const response = await httpRequest.post("/ws/createRoom", {
        id: uuidv4(),
        name: roomName,
      });

      if (response.data) {
        getRooms();
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const joinRoom = (roomId: string) => {
    console.log("roomId", roomId);
    const ws = new WebSocket(
      `${WEBSOCKET_URL}/ws/joinRoom/${roomId}?userId=${user.id}&username=${user.username}`
    );

    if (ws.OPEN) {
      setConn(ws);
      router.push("/app");
      return;
    }
  };

  useEffect(() => {
    getRooms();
  }, []);

  return (
    <>
      <div className="my-8 px-4 md:mx-32 w-full h-full">
        <div className="flex justify-center mt-3 p-5">
          <input
            type="text"
            className="border border-grey p-2 rounded-md focus:outline-none focus:border-blue"
            placeholder="Enter room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
          />
          <button
            className="bg-blue border text-white rounded-md p-2 md:ml-4"
            onClick={handleClick}
          >
            Create room
          </button>
        </div>
        <div className="mt-6">
          <div className="font-bold">Available Rooms</div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
            {rooms.map((room, index) => (
              <div
                key={index}
                className="border border-blue p-4 flex items-center rounded-md w-full"
              >
                <div className="w-full">
                  <div className="text-sm">Room</div>
                  <div className="text-blue font-bold text-lg">{room.name}</div>
                </div>
                <div className="">
                  <button
                    className="px-4 text-white bg-blue rounded-md"
                    onClick={() => joinRoom(room.id)}
                  >
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
