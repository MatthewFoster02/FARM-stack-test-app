import Image from "next/image";
import Link from "next/link";
import { buildImageUrl } from "cloudinary-build-url";

const transformedUrl = (id) => buildImageUrl(id, {
    cloud: {
        cloudName: 'dphekriyz'
    },
    transformations: {
        effect: {
            name: 'grayscale'
        },
        effect: {
            name: 'tint',
            value: '60:blue:white'
        }
    }
});

const Card = ({brand, make, year, url, km, price, cm3, id}) => {
    return (
        <Link href={'cars/' + id}>
            <div className="max-w-sm rounded overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200">
                {
                    url != null && <div className="w-full"><Image src={transformedUrl(url)} alt={brand} height={300} width={600} /></div>
                }
                <div className="px-6 py-4">
                    <div className="font-bold text-xl mb-2">{brand} {make}</div>
                    <p className="text-orange-600 font-bold">Price: €{price}</p>
                    <p className="text-gray-700 text-base">
                        Detailed description of the current car.
                    </p>
                </div>
                <div className="px-6 pt-4 pb-2">
                    <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">made in {year}</span>
                    <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Cm3: {cm3}</span>
                    <span className="inline-block bg-gray-200 rounded-full px-2 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">Km: {km}</span>
                </div>
            </div>
        </Link>
    );
}

export default Card;