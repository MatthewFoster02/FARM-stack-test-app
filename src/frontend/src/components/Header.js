import Link from "next/link";

const Header = () => {
    return (
        <div className="text-orange-600 p-2 font-bold flex flex-row justify-between items-center">
            <div>
                <Link href='/'>
                    Cars
                </Link>
            </div>
            <ul className="flex flex-row space-x-4">
                <li>
                    <Link href="/cars">
                        Cars
                    </Link>
                </li>
                <li>
                    <Link href="/about">
                        About
                    </Link>
                </li>
                <li>
                    <Link href="/account/register">
                        Register
                    </Link>
                </li>
                <li>
                    <Link href="/account/login">
                        Login
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Header;
