import { NextResponse } from "next/server";

export function middleware(req)
{
    const url = req.url;
    const cookie = req.cookies.get('jwt');
    if(url.includes('/cars/add') && (cookie===undefined))
    {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_WEB_URL}/account/login`);
    }
    return NextResponse.next();
}