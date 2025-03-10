import { useNavigate } from "react-router-dom";

export const UserCard = ({ user, className }) => {
  const navigate = useNavigate();

  return (
    <div
      className={className}
      onClick={() => navigate(`/user/${user.username}`)}
    >
      <img src={user.profileImage} alt={user.username} className="h-30 rounded-full border-primary50 border-2 hover:shadow-stone-600 shadow-md" />
      <div className="flex flex-col">
        <p className="text-primary80 font-bold hover:underline text-center">{user.user ? "Você" : `@${user.username ? user.username : 'Anonimo' }`}</p>
      </div>
    </div>
  );
};
