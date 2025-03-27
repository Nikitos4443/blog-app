import {Profile, Registration, Home, Auth, Error404Page} from './Pages/index.js'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {getMe} from "./redux/reducers/authReducer.js";
import NavBar from "./Components/general/navBar.jsx";

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    return (
        <div>
            <NavBar />
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/reg" element={<Registration/>}/>
                <Route path="/auth" element={<Auth/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/profile/:userId" element={<Profile />} />
                <Route path="*" element={<Error404Page />} />
            </Routes>
        </div>
    )
}

export default function AppWrapper() {
    return (
        <Router>
            <App/>
        </Router>
    );
}
