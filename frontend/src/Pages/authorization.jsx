import {useEffect, useState} from "react";
import '../styles/authorization.scss'
import axiosInstance from "../../config/axiosConfig.js";
import {useNavigate} from "react-router-dom";

const Auth = () => {

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rules, setRules] = useState({len: false, ual: false, nd: false});
    const [colorInput, setColorInput] = useState({email: 'red', password: 'red'});
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [isUserExist, setIsUserExist] = useState(true);

    const handleChangeEmail = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);

        setColorInput(prevState => ({
            ...prevState,
            email: /^[a-zA-Z0-9_.]+@(gmail\.com|ukr\.net)$/.test(newEmail) ? 'green' : 'red'
        }));
    }

    const handleChangePassword = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);

        setRules({
            len: newPassword.length >= 8 && newPassword.length <= 12,
            ual: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword),
            nd: /\d/.test(newPassword)
        });
    }

    useEffect(() => {
        if (rules.len && rules.ual && rules.nd) {
            setColorInput(prevState => ({
                ...prevState,
                password: 'green'
            }));
        } else {
            setColorInput((prevState) => ({
                ...prevState,
                password: 'red'
            }));
        }
    }, [rules]);

    useEffect(() => {
        if (colorInput.email === 'green' && colorInput.password === 'green') {
            setIsButtonDisabled(false);
        } else {
            setIsButtonDisabled(true);
        }
    }, [colorInput])
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            axiosInstance.post('/users/login', {
                email: email,
                password: password
            })
                .then(res => {
                    console.log(res)
                    if (!res.data.user) {
                        setIsUserExist(false);
                    } else {
                        setIsUserExist(true);
                    }
                    const token = res.headers['authorization'];

                    if (token) {
                        localStorage.setItem('token', token);
                        navigate('/')
                        window.location.reload();
                    } else {
                        setIsUserExist(false);
                    }
                })
        } catch (e) {
            console.log(e);
            setIsUserExist(false);
        }
    }

    return (
        <div className="auth-main-container">
            <div className="sub-main-container">
                <form onSubmit={onSubmit}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={handleChangeEmail}
                        style={{borderColor: colorInput.email}}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={handleChangePassword}
                        style={{borderColor: colorInput.password}}
                    />

                    <button id="submit" type="submit" disabled={isButtonDisabled}>Submit</button>
                    <div hidden={isUserExist}>User was not found</div>
                </form>

                <span onClick={() => navigate('/reg')} className="no-acc">Have no account ?</span>
            </div>
        </div>
    )
}

export default Auth;