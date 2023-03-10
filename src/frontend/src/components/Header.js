import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

const Header = () =>
{
    const { user, setUser, loading, setLoading } = useAuth();

    useEffect(() =>
    {
        setLoading(true);
        (
            async () =>
            {
                const userData = await fetch(`${process.env.NEXT_PUBLIC_WEB_URL}/api/user`);
                try
                {
                    const user = await userData.json();
                    setUser(user);
                }
                catch (err)
                {
                    setUser(null);
                    console.log(err);
                }
            }
        )();
        setLoading(false);
    }, []);

    return (
        <div className="text-orange-600 p-2 font-bold flex flex-row justify-between items-center">
            <div>
                {
                    loading ? <span>Loading...</span> : ''
                }
                <Link href='/'>
                    Cars
                    {
                        user ? (
                            <span className="mx-2 text-gray-500">
                                {user.username} ({user.role})
                            </span>
                        ) : (
                            ''
                        )
                    }
                </Link>
            </div>
            <ul className="flex flex-row space-x-4">
                <li>
                    <Link href="/cars">
                        Cars
                    </Link>
                </li>
                {
                    user && user.role === 'ADMIN' ? (
                        <li>
                            <Link href="/cars/add">
                                Add Car
                            </Link>
                        </li>
                    ) : (
                        ''
                    )
                }
                {
                    user ? (
                        <>
                            <li>
                                <Link href="/account/logout">
                                    Logout {user.username}
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
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
                        </>
                    )
                }
            </ul>
        </div>
    );
}
export default Header;
