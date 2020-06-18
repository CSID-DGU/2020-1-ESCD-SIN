import React from 'react'
import PropTypes from 'prop-types'
import { useRouteMatch, Switch, Route } from 'react-router-dom'

function ServiceMain(props) {
    const match = useRouteMatch();
    return (
        <Switch>
            <Route exact path = {match.url} component = {ServiceMain}/>
        </Switch>
    )  
}

ServiceMain.propTypes = {

}
export default ServiceMain

