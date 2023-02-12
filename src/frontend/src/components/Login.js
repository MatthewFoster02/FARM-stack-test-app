import { useForm } from 'react-hook-form'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const Login = () => {
    const [apiError, setApiError] = useState();
    const {setAuth} = useAuth();
    let navigate = useNavigate();

    const {
        register, handleSubmit, formState: { errors }, 
    } = useForm();

    const onFormSubmit = async (data) =>
    {
        const res = await fetch('http://localhost:8000/users/login', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if(res.ok)
        {
            const token = await res.json();
            await getUserData(token['token']);
        }
        else
        {
            let errorRes = await res.json();
            setApiError(errorRes['detail']);
            setAuth(null);
        }
    }

    const onErrors = (errors) => console.error(errors);

    const getUserData = async (token) =>
    {
        const res = await fetch('http://localhost:8000/users/me',
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });

        if(res.ok)
        {
            let userData = await res.json();
            userData['token'] = token;
            setAuth(userData);
            setApiError(null);
            navigate('/', { replace: true });
        }
    }

    return (
        <div className='mx-auto p-10 rounded-lg shadow-2xl'>
            <h2 className='text-xl text-primary text-center font-bold my-2'>
                Login page
            </h2>

            <form onSubmit={handleSubmit(onFormSubmit, onErrors)}>
                <div className='flex flex-col justify-center items-center'>
                    <input 
                        type="text"
                        placeholder="email@email.com"
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="email"
                        autoComplete="off"
                        {...register("email", { required: "The email is required" })}
                    />
                    {
                        errors?.email && errors.email.message
                    }

                    <input 
                        type="password"
                        placeholder="your password"
                        className="input input-bordered input-accent w-full max-w-xs m-3"
                        name="password"
                        {...register("password", { required: "The password is required" })}
                    />
                    {
                        errors?.password && errors.password.message
                    }

                    <button className='btn btn-outline btn-accent m-3 btn-block'>
                        Login
                    </button>
                </div>
            </form>

            {
                apiError && (
                    <div className='alert alert-error shadow-lg'>
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="stroke-current flex-shrink-0 h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span>{apiError}</span>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

export default Login;