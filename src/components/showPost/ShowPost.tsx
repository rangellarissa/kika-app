import React, { useState } from 'react';
import { ImageProps } from '../carousel/homeCarousel/HomeCarousel';
import SideNav from '../sideNav/SideNav';
import './showPost.css';

export interface PostProps {
    title: string,
    date: number,
    institution: string,
    city: string,
    description: string,
    images: ImageProps,
}

const ShowPost: React.FC = () => {
    const [selectedPost, setSelectedPost] = useState<PostProps | null>(null);
  
    const handlePostClick = (post: PostProps) => {
      setSelectedPost(post);
    };
  
    return (
      <div>
        <SideNav posts={posts} handlePostClick={handlePostClick} />
        {selectedPost && (
          <div>
            <h2>{selectedPost.title}</h2>
            <p>{selectedPost.date}</p>
            <p>{selectedPost.institution}</p>
            <p>{selectedPost.city}</p>
            <p>{selectedPost.description}</p>
            <img
                src={selectedPost.images.url}
                alt=""
                />
          </div>
        )}
      </div>
    );
  };

export default ShowPost