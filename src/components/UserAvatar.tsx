"use client";

import { User } from "src/types/User";

type UserAvatarProps = {
  user: User;
};

export default function UserAvatar({ user }: UserAvatarProps) {
  const userInitials = user.name.split(" ");

  return (
    <div className="w-[22px] h-[22px] rounded-[50%] bg-textPrimary flex justify-center items-center select-none">
      <p className="text-[12px] text-white uppercase flex-row ">
        {" "}
        {userInitials[0][0] + (userInitials[1] ? userInitials[1][0] : "")}
      </p>
    </div>
  );
}
