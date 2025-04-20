import React from 'react';
import logo from './logo.svg';
import './styles/App.css';

function App() {
    return (
        <div className="text-center h-full">
            <header className="bg-[#282c34] min-h-[100vh] flex flex-col items-center justify-center text-white">
                <img
                    src={logo}
                    className="h-[20vmin] App-logo"
                    alt="logo"
                />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
