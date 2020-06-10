import React, { useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

function Header(props) {
    const [user, setUser] = useState({});
    console.log('I am Header')
    return (
        <HeaderWarapper className="navbar navbar-expand-lg px-sm-5">
            <Link to="/">
                <img src="https://media-exp1.licdn.com/dms/image/C4E0BAQHMfiIlfjYpkQ/company-logo_200_200/0?e=2159024400&v=beta&t=rNdA57yGa_S9fw81aTbRbLMdvmVOcTfdwQ4aeKfVL2c" 
                />
            </Link>
            <ul className="navbar-nav align-items-center">
                <li className="nav-item ml-5">
                    <Link to="/">
                        How it Works
                    </Link>
                </li>
                <li className="nav-item ml-5">
                    <Link to="/">
                        Future Plans
                    </Link>
                </li>
                <li className="nav-item ml-5">
                    <Link to="/">
                        About Us
                    </Link>
                </li>
                <li className="nav-item ml-5">
                    <Link to="/">
                        Github
                    </Link>
                </li>
            </ul>
            <div className="ml-auto">
                <Link to = "/join" className="">
                        <span className="mr-2">
                            <i className="fa fa-registered"/>
                        </span>
                        Join
                </Link>
                <Link to = "/login" className="ml-2">
                        <span className="mr-2">
                            <i className="fa fa-user"/>
                        </span>
                        Login
                </Link>
            </div>
        </HeaderWarapper>
    )
}
Header.propTypes = {

}
const HeaderWarapper = styled.div`
    background: var(--mainBlue);
    height: 150px;
    img{
        width: 150px;
        height: 150px;
    }
    a{
        color: var(--mainWhite)
    }
`
export default Header

