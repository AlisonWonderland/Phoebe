import {
    Link
} from 'react-router-dom'

function Navbar() {
    return (
        <div className="navbar">
            <div id="navLeft">
                <Link to="/">
                    Phoebe
                </Link>
            </div>
            <div id="navRight">
                <Link to="/scan">
                    Scan document
                </Link>
            </div>
        </div>
    );
}

export default Navbar;