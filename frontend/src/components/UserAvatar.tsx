interface UserAvatarProps {
  profilePic?: string;
  fullName: string;
  size?: "sm" | "md" | "lg";
  isOnline?: boolean;
}

const SIZE_CLASSES: Record<NonNullable<UserAvatarProps["size"]>, string> = {
  sm: "size-10",
  md: "size-12",
  lg: "size-32",
};

const UserAvatar = ({ profilePic, fullName, size = "sm", isOnline }: UserAvatarProps) => {
  return (
    <div className="relative">
      <img
        src={profilePic || "/avatar.png"}
        alt={fullName}
        className={`${SIZE_CLASSES[size]} rounded-full object-cover`}
      />
      {isOnline && (
        <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
      )}
    </div>
  );
};

export default UserAvatar;
