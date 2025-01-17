import React, { Component, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import authService from '../appwrite/config';
import { Container } from '../components';
import PostForm from '../components/PostForm';

function EditPost() {
    const[post, setPosts] = useState(null)
    const{slug} = useParams()
    const navigate = useNavigate() 

    useEffect(() => {
        if(slug) {
            authService.getPost(slug).then((post) =>  {
                if(post) {
                    setPosts(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])

    return post?  (
        <div className='py-8'>
            <Container>
                <PostForm post={post}/>
            </Container>
        </div>
    ) : null

}

export default EditPost;