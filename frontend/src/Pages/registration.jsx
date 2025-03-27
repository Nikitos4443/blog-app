import {useEffect, useState} from "react";
import '../styles/registration.scss'
import {useNavigate} from "react-router-dom";
import axiosInstance from "../../config/axiosConfig.js";

const Registration = () => {

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [colorRules, setColorRules] = useState({len: 'red', ual: 'red', nd: 'red'});
    const [colorInput, setColorInput] = useState({name: 'red', email: 'red', password: 'red'})
    const [isButtonDisabled, setIsButtonDisabled] = useState(true)
    const [isUserExist, setIsUserExist] = useState(true);
    const [isServerError, setIsServerError] = useState(false);

    const handleChangeName = (event) => {
        const newName = event.target.value;
        setName(newName);

        setColorInput(prevState => ({
            ...prevState,
            name: newName.length > 0 && newName.length < 50 ? 'green': 'red'
        }));
    }

    const handleChangeEmail = (event) => {
        const newEmail = event.target.value;
        setEmail(newEmail);

        setColorInput(prevState => ({
            ...prevState,
            email: /^[a-zA-Z0-9_.]+@(gmail\.com|ukr\.net)$/.test(newEmail) ? 'green': 'red'
        }));
    }

    const handleChangePassword = (event) => {
        const newPassword = event.target.value;
        setPassword(newPassword);

        setColorRules({
            len: newPassword.length >= 8 && newPassword.length <= 12 ? 'green' : 'red',
            ual: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) ? 'green' : 'red',
            nd: /\d/.test(newPassword) ? 'green' : 'red'
        });
    }

    useEffect(() => {
        if (colorRules.len === 'green' && colorRules.ual === 'green' && colorRules.nd === 'green') {
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
    }, [colorRules]);

    useEffect(() => {
        if(colorInput.name === 'green' && colorInput.email === 'green' && colorInput.password === 'green') {
            setIsButtonDisabled(false);
        }else{
            setIsButtonDisabled(true);
        }
    }, [colorInput])
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            axiosInstance.post('/users/create', {
                name: name,
                email: email,
                password: password
            })
                .then(res => {
                    if(res.status === 201) {
                        navigate('/auth')
                    } else if(res.status === 409) {
                        setIsUserExist(true);
                    } else {
                        setIsServerError(true);
                    }
                })
        }catch (e) {
            console.log(e);
            setIsServerError(true);
        }
    }

    return (
        <div className="reg-main-container">
            <div className="sub-container">
            <form onSubmit={onSubmit}>

                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    className="input-register"
                    type="text"
                    value={name}
                    onChange={handleChangeName}
                    style={{borderColor: colorInput.name}}
                />

                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    className="input-register"
                    type="email"
                    value={email}
                    onChange={handleChangeEmail}
                    style={{borderColor: colorInput.email}}
                />

                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    className="input-register"
                    type="password"
                    value={password}
                    onChange={handleChangePassword}
                    style={{borderColor: colorInput.password}}
                />

                <div className="pass-rules">
                    <span style={{ color: colorRules.len }}>Password should be between 8 and 12 characters long</span>
                    <span style={{ color: colorRules.ual }}>Password must contain both uppercase and lowercase letters</span>
                    <span style={{ color: colorRules.nd }}>Password must include at least one numerical digit</span>
                </div>
                <button id="submit" type="submit" disabled={isButtonDisabled}>Submit</button>
                <div hidden={isUserExist}>User with such email was found</div>
                <div hidden={!isServerError}>Server Error</div>
            </form>
            <span onClick={() => navigate('/auth')} className="no-acc">Have an account ?</span>
            </div>
        </div>
    )
}

export default Registration;