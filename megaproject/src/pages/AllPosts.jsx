import React, { useEffect, useState } from 'react';
import { Container } from '../components';
import authService from '../appwrite/config';
import PostCard from '../components/PostCard';

function AllPosts() {
    const[posts, setPosts] = useState([])
    useEffect(() => {
        authService.getPosts([]).then((posts) => {
            if(posts) {
                setPosts(posts.documents)
            }
        })
    }, [])

    return ( 
        <div className='flex flex-wrap'>
            <Container>
                <div className='flex flex-wrap'>
                    {posts.map((post) => (
                        <div key={post.$id} className='p-2 w-1/4'>
                            <PostCard {...post}/>
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default AllPosts;