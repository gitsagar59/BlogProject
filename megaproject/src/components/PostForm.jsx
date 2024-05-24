import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import RTE from './RTE';
import Select from './Select'
import authService from '../appwrite/config';

export default function PostForm({post}) {                                             
    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues: {
            title: post?.title || '',
            slug: post?.$id || '',
            content: post?.content || '',
            status: post?.status || 'active',
        }
    })   

    const navigate = useNavigate()
    const userData = useSelector((state) => state.auth.userData);

    console.log("^^^^^"+userData+"*****");

    const submit = async(data) => {  //when user submit form 2 situations arise either post hy ya fir nai hy
        if(post) {
           const file =  data.image[0] ? await authService.uploadFile(data.image[0]) : null

            if(file) {
                authService.deleteFile(post.featuredImage)
            }
            const dbPost = await authService.updatePost(post.$id, {
                ...data,
                featuredImage: file ? file.$id : undefined  
            })
            if(dbPost) {
                navigate(`/post/${dbPost.$id}`)
            }
        } else {
                const file = await authService.uploadFile(data.image[0]);
                // TODO: //improve better way handle file hy to kykarna hy ya nai hy toh
                console.log("--"+JSON.stringify(file)+"--");
                if(file) {
                    const fileId = file.$id
                    console.log("--"+JSON.stringify(fileId)+"--");
                    data.featuredImage = fileId
                    const dbPost = await authService.createPost({
                        ...data, userId: userData.$id
                    });
                    if(dbPost) {
                        navigate(`/post/${dbPost.$id}`)
                    }
                }
        }
    }

    const slugTransform = useCallback((value) =>  {
        if(value && typeof value=== 'string') 
            return value
            .trim()
            .toLowerCase()
            .replace(/\s/g, '-');
        return "";
    },[])  

    React.useEffect(() => {
            const subscription = watch((value, {name}) => {
                if(name === 'title') {
                    setValue('slug', slugTransform(value.title), {shouldValidate: true})
                }
            })
            return () => {
                subscription.unsubscribe()
            }
    }, [watch, slugTransform, setValue])


    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={authService.filePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );

}