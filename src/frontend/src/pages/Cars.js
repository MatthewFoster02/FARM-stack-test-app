import { useState, useEffect } from "react";
import Card from "../components/Card";
import useAuth from "../hooks/useAuth";


const Cars = () => 
{
    const { auth } = useAuth();
    const [cars, setCars] = useState([]);
    const [brand, setBrand] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [allBrands, setAllBrands] = useState([]);
    const [isPending, setIsPending] = useState(true);

    useEffect(() =>
    {
        fetch('http://localhost:8000/cars/brands').then(res => res.json()).then(data =>
        {
            setAllBrands(data['brands']);
        });
    }, []);

    useEffect(() =>
    {
        fetch(`http://localhost:8000/cars/pages?brand=${brand}`).then(res => res.json()).then(data =>
        {
            setTotalPages(data['pages']);
        });
        
    }, [brand]);

    useEffect(() =>
    {
        fetch(`http://localhost:8000/cars?page=${page}&brand=${brand}`,
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
    }, [brand, auth.token, page]);

    const onChangeBrand = (brand) =>
    {
        setCars([]);
        setPage(1);
        setBrand(brand);
        setIsPending(true);
    }

    const nextPage = () =>
    {
        if(page == totalPages) return;

        setPage(page + 1);
    }

    const previousPage = () =>
    {
        if(page == 1) return;

        setPage(page - 1);
    }

    return (
        <div className="grid">
            <h2 className="text-xl text-primary text-center font-bold my-5">Cars - {brand ? brand : 'All Brands'}</h2>
            
            <div className="dropdown dropdown-hover">
                <label tabIndex={0} className="btn m-1">Filter by Brand</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                    <li><a onClick={() => onChangeBrand('')}>All Brands</a></li>
                    {
                        allBrands && allBrands.map((brand) =>
                        {
                            return (
                                <li key={brand}><a onClick={() => onChangeBrand(brand)}>{brand}</a></li>
                            )
                        })
                    }
                </ul>
            </div>
            {
                isPending && <div>
                    <h2>Loading cars, brand: {brand}...</h2>
                </div>
            }
            <div className="mx-8 grid grid-cols-1 md:grid-cols-2 gap-5 p-4 mb-5">
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
            <div className="my-1">
                <h4>Showing page <span className="text-primary font-extrabold">{page}</span> of <span className="font-bold">{totalPages}</span>.</h4>
            </div>
            <div className="btn-group grid grid-cols-2 mb-5">
                <button className="btn btn-outline btn-accent" onClick={previousPage}>Previous Page</button>
                <button className="btn btn-outline btn-accent" onClick={nextPage}>Next Page</button>
            </div>
        </div>
    );
}

export default Cars;
