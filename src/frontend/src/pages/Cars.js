import Layout from "../components/Layout";
import Card from "../components/Card";
import { useState, useEffect } from "react";

const Cars = () => 
{
    const [cars, setCars] = useState([]);
    const [brand, setBrand] = useState('');
    const [isPending, setIsPending] = useState(true);

    useEffect(() =>
    {
        fetch(`http://localhost:8000/cars?brand={brand}`).then(res => res.json()).then(data =>
        {
            setCars(data);
        });
        setIsPending(false);
    }, [brand]);

    const onChangeBrand = (e) =>
    {
        setCars([]);
        setBrand(e.target.value);
        setIsPending(true);
    }

    return (
        <Layout>
            <h2 className="font-bold font-mono text-lg text-center my-4">Cars - {brand ? brand : 'All Brands'}</h2>
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
            <div className="mx-8">
                {
                    isPending && <div>
                        <h2>Loading cars, brand: {brand}...</h2>
                    </div>
                }
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
        </Layout>
    );
}

export default Cars;
