import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

export const getServerSideProps = ({req, res}) =>
{
    const jwt = getCookie('jwt', {req, res});
    return {props: {jwt}};
}

const add = ({jwt}) =>
{
    const [brand, setBrand] = useState('');
    const [make, setMake] = useState('');
    const [year, setYear] = useState('');
    const [cm3, setCm3] = useState('');
    const [price, setPrice] = useState('');
    const [km, setKm] = useState('');
    const [picture, setPicture] = useState(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e) =>
    {
        e.preventDefault();
        const formData = new FormData();
        formData.append('brand', brand);
        formData.append('make', make);
        formData.append('year', year);
        formData.append('cm3', cm3);
        formData.append('price', price);
        formData.append('km', km);
        formData.append('picutre', picture);
        setLoading(true);

        console.log([...formData]);
        try
        {
            const response = await axios(
            {
                method: 'POST',
                url: `${process.env.NEXT_PUBLIC_API_URL}/cars/`,
                headers: {
                    'Authorization': `Bearer ${jwt}`
                },
                data: formData
            }
            );
        }
        catch (err)
        {
            console.log(err);
        }
        setLoading(false);
        router.push('/cars');
    }

    return (
        <div className="flex flex-col justify-center items-center h-full">
            <div className="shadow-lg p-5">
                <h2 className="text-orange-600 font-bold text-xl text-center my-3">
                    Add new car
                </h2>

                {
                    !loading ? (
                        <form className="max-w-lg flex flex-col justify-center items-center" onSubmit={handleSubmit}>
                            <label className="block">
                                <span className="text-gray-700">Brand</span>
                                <input 
                                    name="brand"
                                    id="brand"
                                    type="text"
                                    className="mt-1 block w-full"
                                    placeholder="car brand"
                                    required
                                    onChange={(e) => setBrand(e.target.value)}
                                    value={brand}
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Make</span>
                                <input 
                                    name="make"
                                    id="make"
                                    type="text"
                                    className="mt-1 block w-full"
                                    placeholder="car make"
                                    required
                                    onChange={(e) => setMake(e.target.value)}
                                    value={make}
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Year</span>
                                <input 
                                    name="year"
                                    id="year"
                                    type="number"
                                    className="mt-1 block w-full"
                                    placeholder="production year"
                                    required
                                    onChange={(e) => setYear(e.target.value)}
                                    value={year}
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Cm3</span>
                                <input 
                                    name="cm3"
                                    id="cm3"
                                    type="number"
                                    className="mt-1 block w-full"
                                    placeholder="Cm3"
                                    required
                                    onChange={(e) => setCm3(e.target.value)}
                                    value={cm3}
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Price</span>
                                <input 
                                    name="price"
                                    id="price"
                                    type="number"
                                    className="mt-1 block w-full"
                                    placeholder="price"
                                    required
                                    onChange={(e) => setPrice(e.target.value)}
                                    value={price}
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Km</span>
                                <input 
                                    name="km"
                                    id="km"
                                    type="number"
                                    className="mt-1 block w-full"
                                    placeholder="km"
                                    required
                                    onChange={(e) => setKm(e.target.value)}
                                    value={km}
                                />
                            </label>
                            <label className="block">
                                <span className="text-gray-700">Picture</span>
                                <input 
                                    name="picture"
                                    id="picture"
                                    type="file"
                                    className="mt-1 block w-full"
                                    placeholder="Picture"
                                    required
                                    onChange={(e) => setPicture(e.target.files[0])}
                                />
                            </label>
                            <button className="bg-orange-500 text-white p-2 m-3 w-full rounded-lg">
                                Submit
                            </button>
                        </form>
                    ) : (
                        <></>
                    )
                }
                {
                    loading && (
                        <div className="bg-orange-600 w-full min-h-full text-white flex flex-col justify-center items-center">
                            <p className="text-xl">Inserting new car</p>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
export default add;
