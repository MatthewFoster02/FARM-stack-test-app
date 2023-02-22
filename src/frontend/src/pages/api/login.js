import cookie from 'cookie';

export default async (req, res) =>
{
    if(req.method != 'POST')
    {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({message: `Method ${req.method} not allowed`});
        return;
    }

    const {email, password} = req.body;
    const result = await fetch('http://localhost:8000/users/login',
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    });

    const data = await result.json();
    if(!result.ok)
    {
        data['error'] = data['detail'];
        res.status(401);
        res.json(data);
        return;
    }

    const jwt = data.token;
    res.status(200).setHeader('Set-Cookie', cookie.serialize('jwt', jwt,
    {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 30
    })).json(
    {
        'username': data['user']['username'],
        'email': data['user']['email'],
        'role': data['user']['role'],
        'jwt': jwt    
    });
}
