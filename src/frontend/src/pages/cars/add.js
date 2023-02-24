import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

export const getServerSideProps = ({req, res}) =>
{
    const jwt = getCookie('jwt', {req, res});
    return {props: {jwt}};
}