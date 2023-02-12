import {Link} from 'react-router-dom';

const Card = ({car}) => {
    let {brand, price, make, year, km, cm3, _id} = car;
    return (
        <Link to={`/cars/${_id}`}>
            <div className='card card-compact w-full bg-base-100 shadow-xl hover:scale-105 transition-transform'>
                <figure>
                    <img src="https://api.lorem.space/image/car?w=400&h=225" alt="Shoes" />
                </figure>  
                <div className='card-body'>
                    <h2 className='card-title'>
                        {brand} {make}
                    </h2>
                    <div className='flex flex-col justify-between items-center'>
                        <div className='my-1'>
                            Year: {year} / Cm3: {cm3} / Km: {km}
                        </div>
                        <div className='my-1'>
                            Price: <span className='text-primary font-extrabold'>€{price}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default Card;
