import React, { Component } from 'react'
import PropTypes from 'prop-types'
export default class MainPage extends Component {
    static propTypes = {
        prop: PropTypes
    }
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-auto text-center">
                        <p className="display-4 ">Voice Biometrics for User Authentication</p>
                        <img  id="maintenance-gif" class="banner-graphic animation" src="images/maintenance-animation-trim.gif"></img>
                    </div>
                </div>
            </div>
        )
    }
}
