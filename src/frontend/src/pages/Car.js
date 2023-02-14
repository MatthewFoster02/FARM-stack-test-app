import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import useAuth from '../hooks/useAuth.js';


const Car = () => {
    const { auth } = useAuth();
    const {id} = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [price, setPrice] = useState(null);
    const [apiError, setApiError] = useState();
    const [successful, setSuccessful] = useState();
    const [isPending, setIsPending] = useState(true);

    const onPriceChange = (e) =>
    {
        setPrice(e.target.value);
    }

    const getCar = async() =>
    {
        const res = await fetch(`http://localhost:8000/cars/${id}`);
        if(!res.ok)
        {
            setApiError('Error fetching car');
        }
        else
        {
            const data = await res.json();
            setCar(data);
            setPrice(data.price);
        }
        setIsPending(false);
    }

    const deleteCar = async() =>
    {
        const res = await fetch(`http://localhost:8000/cars/${id}`, 
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'aplication/json',
                Authorization: `Bearer ${auth.token}`
            }
        });

        if(!res.ok)
        {
            const errorRes = await res.json();
            setApiError(errorRes['detail']);
        }
        else 
        {
            setApiError();
            setSuccessful('Deletion successful');
            navigate('/cars');
        }
    }

    const updatePrice = async() =>
    {
        const res = await fetch(`http://localhost:8000/cars/${id}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`
            },
            body: JSON.stringify({price})
        });

        if(!res.ok)
        {
            const errorRes = await res.json();
            setApiError(errorRes['detail']);
        }
        else
        {
            setApiError();
            setSuccessful('Update Successful');
            getCar();
        }
    }

    useEffect(() =>
    {
        getCar();
    }, []);

    return (
        <div>
            {
                apiError && <div class="alert alert-error shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>Error! {apiError}</span>
                    </div>
                </div>
            }
            {
                successful && <div class="alert alert-success shadow-lg">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span>{successful}</span>
                    </div>
                </div>
            }
            {
                isPending && <div className="bg-red-500 w-full text-white h-10 text-lg">
                    <h2>Loadingcar...</h2>
                </div>
            }
            {
                car && <div>
                    <div className="flex flex-col justify-between min-h-full items-center">
                        <div className="font-bold text-xl text-gray-600 my-3">
                            {car.brand} {car.make}
                        </div>
                        <div className="max-w-xl">
                            <img alt="A car!" src="https://api.lorem.space/image/car?w=400&h=225" />
                        </div>
                        <div className="flex flex-col items-center font-normal text-lg">
                            <div>Price: <span className="text-primary font-extrabold">€{car.price}</span></div>
                            <div>Year: {car.year}</div>
                            <div>Km: {car.km}</div>
                        </div>
                        <div className="flex flex-row">
                            <FormInput
                                label='Change Price'
                                placeholder={price}
                                type="number"
                                value={price}
                                onChange={onPriceChange}
                                required />
            
                        </div>
                        <div className="flex justify-between">
                            <button className="btn btn-outline btn-warning m-3" onClick={updatePrice}>Update Price</button>
                            <button className="btn btn-outline btn-error m-3" onClick={deleteCar}>Delete Car</button>
                        </div>
                        <p>Warning: Deletion is PERMANENT!</p>
                    </div>
                </div>
            }
        </div>
    );
}

export default Car;
