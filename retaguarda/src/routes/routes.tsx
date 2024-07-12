import {
    Routes,
    Route,
    Navigate
} from 'react-router-dom';
import App from '../pages/App/App';
import { Login } from '../pages/login/login';
import { getUser } from '../supabase/user';
import { useEffect, useState } from 'react';

const Private = (children: any) => {
    const [isLogged, setIsLogged] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        const logged = await getUser();

        if (logged){
            setIsLogged(true);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Carregando...</div>; // ou algum componente de carregamento
    }

    return (isLogged) ? children.children : <Navigate to="/" />;
}

export const Router = () => {
    return (
        <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/retaguarda' element={
                <Private>
                    <App />
                </Private>
            } />
        </Routes>
    )
}