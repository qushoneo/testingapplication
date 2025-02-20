interface UserProps {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export default function UserRow({ user }: UserProps) {
  return (
    <div key={user.id} className="flex pl-[32px]  pr-[24px] gap-[12px]">
      <p className="flex items-center h-[28px] w-[15%] min-w-[230px] text-sm text-textPrimary">
        {user.name}
      </p>
      <p className="flex items-center h-[28px] w-[15%] min-w-[210px] text-sm text-textPrimary">
        {user.email}
      </p>
      <p className="flex items-center h-[28px] w-[10%] flex-1 text-sm text-textPrimary">
        {user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()}
      </p>
    </div>
  );
}
