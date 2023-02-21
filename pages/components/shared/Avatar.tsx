import React from "react";
import classnames from "classnames";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, className, ...prop }) => {
  return (
    <div className={classnames("rounded-full w-10 h-10", className)}>
      <img className="rounded-full w-full" src={src || ""} alt="avatar" />
    </div>
  );
};

export default React.memo(Avatar);
