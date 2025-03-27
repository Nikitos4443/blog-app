import useAuth from "../../hooks/useAuth.js";
import logo from "../../assets/logo.png";
import '../../styles/navbar.scss'
import {useNavigate} from "react-router-dom";
import {_logout} from "../../redux/reducers/authReducer.js";
import {useDispatch} from "react-redux";

const NavBar = () => {
    const {status: statusUser} = useAuth();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogOut = () => {
        dispatch(_logout())
        navigate("/");
        window.location.reload();
    }

    return (
        <div className="navBar-main-container">
            <img className='logo' src={logo} alt="logo" />
            <ul className="navigations-container">
                <li onClick={() => {navigate('/')}}>Home</li>
                {statusUser === 'resolved' ?
                    <>
                        <li onClick={() => {
                            navigate('/profile')
                        }}>Profile
                        </li>
                        <li onClick={handleLogOut}>LogOut</li>
                    </> : statusUser === 'rejected' ? <li onClick={() => {navigate('/auth')}}>LogIn</li> : null}
            </ul>
        </div>
    )
}

export default NavBar;