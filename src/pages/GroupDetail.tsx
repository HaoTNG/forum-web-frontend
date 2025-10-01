import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { joinGroup, leaveGroup } from "../services/group";
export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<any | null>(null);
  const [isMember, setIsMember] = useState(false);

  useEffect(() => {
    api.get(`/group/${id}`).then((res) => {
      setGroup(res.data);
      const me = localStorage.getItem("userId");
      setIsMember(res.data.members.includes(me));
    });
  }, [id]);

  const JoinGroup = async () => {
    await joinGroup;
    setIsMember(true);
    setGroup({ ...group, members: [...group.members, localStorage.getItem("userId")] });
  };

  const LeaveGroup = async () => {
    await leaveGroup;
    setIsMember(false);
    setGroup({
      ...group,
      members: group.members.filter((m: string) => m !== localStorage.getItem("userId")),
    });
  };

  if (!group) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">{group.name}</h1>
      <p className="mb-4 text-gray-700">{group.description}</p>

      {isMember ? (
        <button
          onClick={LeaveGroup}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Leave Group
        </button>
      ) : (
        <button
          onClick={JoinGroup}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Join Group
        </button>
      )}

      <h2 className="mt-6 text-xl font-semibold">Members</h2>
      <p>{group.members.length} members</p>
    </div>
  );
}
