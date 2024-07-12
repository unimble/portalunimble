import supa from './client';

export const getUser = async () => {
    const { data, error } = await supa.auth.getUser();

    console.log(data);

    if (error != null) return false;

    return data.user;
}