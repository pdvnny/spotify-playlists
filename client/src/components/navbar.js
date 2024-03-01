// components/navbar.js

import "../App.css";
import { Link, useMatch, useResolvedPath } from "react-router-dom";

import voloLogo from "../volo_logo.png";

// import 'bootstrap/dist/css/bootstrap.min.css';

// import Container from 'react-bootstrap/Container';
// import Nav from 'react-bootstrap/Nav';
// import Navbar from 'react-bootstrap/Navbar';
// import { LinkContainer } from 'react-router-bootstrap';

/*
    NOTE

    "/" = <Home>
    "/search" = <Search>
    "/manage" = <Manage>
*/

// I THINK THERE IS A DIFFERENT WAY TO DO THIS
// IN REACT-BOOTSTRAP
// REF: https://www.youtube.com/watch?v=SLfhMt5OUPI
function CustomLink({ to, children, ...props }) {  // ...props => allows you to pass other things like "className"
    // Changes in the method overall
    // href ==> to (above)
    
    // this works when the app is reloading when you change pages
    // const path = window.location.pathname;

    // Approach with react-router
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        // <li className={path === href ? "active" : ""}>
        <li className={isActive ? "active" : ""}>
            {/* <a href={href} {...props}>{children}</a> */}
            {/* <Link to={href}>{children}</Link> */}
            <Link to={to} {...props}>{children}</Link>
        </li>
    )
}

function MyNavBar() {

    return (

        <nav className="nav">
            <Link to="/" className="site-title">
                Parker's Volo Playlists
            </Link>
            <ul>
                <CustomLink to="/">Home</CustomLink>
                <CustomLink to="/search">Search</CustomLink>
                <CustomLink to="/manage">Manage</CustomLink>
            </ul>
            <div className="nav-image">
                <a href="https://www.volosports.com">
                <img 
                    src={voloLogo}
                    alt="Volo Sports Logo"
                />
                </a>
            </div>
        </nav>

        // ---- OLD VERSIONS ----
        // BOOTSTRAP REACT APPROACH THAT I DECIDED NOT TO USE
        // <Navbar className="nav" bg="dark" expand="lg" sticky="top" data-bs-theme="dark">
        //     <Container>
        //         <Navbar.Brand href="/">Parker's Volo Playlists</Navbar.Brand>
        //         <Navbar.Toggle aria-controls="basic-navbar-nav" />
        //         <Navbar.Collapse id="basic-navbar-nav">
        //             <Nav className="me-auto" variant="underline">
        //             {/* https://stackoverflow.com/questions/35687353/react-bootstrap-link-item-in-a-navitem */}
        //                 <LinkContainer to="/">
        //                     {/* <Nav.Link href="/">Home</Nav.Link> */}
        //                     <Nav.Link>Home</Nav.Link>
        //                 </LinkContainer>
        //                 <LinkContainer to="/search">
        //                     {/* <Nav.Link href="/search">Search</Nav.Link> */}
        //                     <Nav.Link>Search</Nav.Link>
        //                 </LinkContainer>
        //                 <LinkContainer to="/manage">
        //                     {/* <Nav.Link href="/manage">Manage</Nav.Link> */}
        //                     <Nav.Link>Manage</Nav.Link>
        //                 </LinkContainer>
        //             </Nav>
        //         </Navbar.Collapse>
        //         {/* <Navbar.Text>Parker's Volo Playlists</Navbar.Text> */}
        //         <Navbar.Text className="ms-auto">
        //             {/* Signed in as: <a href="#login">Parker</a> */}
        //             Siged in as: <i>Will complete this later</i>
        //         </Navbar.Text>
        //     </Container>
        // </Navbar>


    // <nav expand='lg' class="navbar navbar-expand-lg bg-dark bg-body-tertiary" data-bs-theme="dark">
    //     <div class="container-fluid">
    //         <a class="navbar-brand" href="/">Parker's Volo Playlists</a>
    //         <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
    //             <span class="navbar-toggler-icon"></span>
    //         </button>
    //         <div class="collapse navbar-collapse" id="navOptionsText">
    //             <ul class="navbar-nav me-auto mb-2 mb-lg-0">
    //                 {/* <li class="nav-item">
    //                     <a class="nav-link active"  href="/#">Home</a>
    //                 </li> */}
    //                 <li class="nav-item">
    //                     <a class="nav-link active" href="/search">Search</a>
    //                 </li>
    //                 <li class="nav-item">
    //                     <a class="nav-link active" href="/manage">Manage</a>
    //                 </li>
    //             </ul>
    //             <span class="navbar-text">
    //                 Parker's Volo Playlists
    //             </span>
    //         </div>
    //     </div>
    // </nav>
    )
};

export default MyNavBar;
