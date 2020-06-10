import React from 'react'
import PropTypes from 'prop-types'
import { useRouteMatch, Switch, Route } from 'react-router-dom'
import Service from './pages/Service/Service';

function ServiceMain(props) {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route exact path = {match.url} component = {Service}/>
        </Switch>
    )  
}

ServiceMain.propTypes = {

}
export default ServiceMain

