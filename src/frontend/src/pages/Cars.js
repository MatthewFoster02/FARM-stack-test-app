import { useState, useEffect } from "react";
import Card from "../components/Card";
import useAuth from "../hooks/useAuth";


const Cars = () => 
{
    const { auth } = useAuth();
    const [cars, setCars] = useState([]);
    const [brand, setBrand] = useState('');
    const [isPending, setIsPending] = useState(true);

    useEffect(() =>
    {
        fetch(`http://localhost:8000/cars?brand=${brand}`,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${auth.token}`
            }
        }).then(res => res.json()).then(data =>
        {
            setCars(data);
        });
        setIsPending(false);
    }, [brand, auth.token]);

    const onChangeBrand = (e) =>
    {
        setCars([]);
        setBrand(e.target.value);
        setIsPending(true);
    }

    return (
        <div>
            <h2 className="text-xl text-primary text-center font-bold my-5">Cars - {brand ? brand : 'All Brands'}</h2>
            <div className="mx-8">
                <label htmlFor="cars">Choose a brand: </label>
                <select name="cars" id="cars" onChange={onChangeBrand}>
                    <option value=''>All Brands</option>
                    <option value='Fiat'>Fiat</option>
                    <option value="Citroen">Citroen</option>
                    <option value="Renault">Renault</option>                   
                    <option value="Opel">Opel</option> 
                </select>
            </div>
            {
                isPending && <div>
                    <h2>Loading cars, brand: {brand}...</h2>
                </div>
            }
            <div className="mx-8 grid grid-cols-1 md:grid-cols-2 gap-5 p-4">
                {
                    cars && cars.map((el) =>
                    {
                        return (
                            <Card key={el._id} car = {el} />
                        )
                    }
                    )
                }
            </div>
        </div>
    );
}

export default Cars;
