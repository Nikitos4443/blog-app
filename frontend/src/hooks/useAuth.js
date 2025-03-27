import { useSelector } from 'react-redux';

const useAuth = () => {
    const userData = useSelector((state) => state.auth.userData);
    const status = useSelector((state) => state.auth.status);
    return {userData, status};
};

export default useAuth;
