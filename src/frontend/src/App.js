import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
import HomePage from "./components/HomePage";
import RequireAuthentication from "./components/RequireAuthentication";
import Cars from "./pages/Cars";

function App() 
{
	return (
		<Routes>
			<Route path="/" element={<Layout />}>
				<Route path="/" element={<HomePage />} />
				<Route path="login" element={<Login />} />
				<Route path="register" element={<Register />} />
				<Route element={<RequireAuthentication />}>
					<Route path="cars" element={<Cars />} />
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
