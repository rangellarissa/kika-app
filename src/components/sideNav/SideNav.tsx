import React from "react";
import { PostProps } from "../showPost/ShowPost";

export interface SideNavProps {
    posts: PostProps[];
};

const SideNav: React.FC<SideNavProps> = ({ posts }) => {

    const handlePostClick = (post: PostProps) => {
    };

    return (
      <nav>
        <ul>
          {posts.map((post, index) => (
            <li key={index} onClick={() => handlePostClick(post)}>
              {post.title}
            </li>
          ))}
        </ul>
      </nav>
    );
  };
  
  export default SideNav;