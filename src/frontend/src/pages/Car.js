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
    const [error, setError] = useState([]);
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
            setError('Error fetching car');
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
            const data = await res.json();
            let errArray = data.detail.map(el =>
            {
                return `${el.loc[1]} -${el.msg}`;
            });
            setError(errArray);
        }
        else 
        {
            setError([]);
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

        const data = await res.json();
        if(!res.ok)
        {
            let errArray = data.detail.map(el =>
            {
                return `${el.loc[1]} -${el.msg}`;
            });
            setError(errArray);
        }
        else
        {
            setError([]);
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
                isPending && <div className="bg-red-500 w-full text-white h-10 text-lg">
                    <h2>Loadingcar...</h2>
                </div>
            }
            {
                error && <ul className="flex flex-col mx-auto text-center">
                    {
                        error && error.map((el, index) =>
                        (
                            <li key={index} className="my-2 p-1 border-2 border-red-700 max-w-md mx-auto">{el}</li>
                        ))
                    }
                </ul>
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
