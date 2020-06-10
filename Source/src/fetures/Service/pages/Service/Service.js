import React, { Component } from 'react'
import './Service.scss'
import SendMoney from '../../components/SendMoney'
import AccountHistory from '../../components/AccountHistory'

export default class Service extends Component {
    constructor(props) {
        super(props)
        this.state = {
            myMoney: "",
            sendAccount : "",
            sendMoney : "",
        }
    }
    handleChange = (e) => {
        
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="panel panel-default" id="page-header">
                            <div className="panel-body" id="page-title">
                                <h1 className="text-center" id="title">SIN Bank System !</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <SendMoney />
                <div id="account" className="col-md-6 col-md-offset-3">
                    <div className="panel panel-default">
                        <div className="panel-heading text-center lead">Your Account</div>
                        <div className="panel-body">
                            <div className="form-group">
                                <label htmlFor="initial-deposit">잔액</label>
                                <div className="input-group">
                                    <div className="input-group-addon">ID</div>
                                    <input type="text" min="0" name="initial-deposit" id="initial-deposit" className="form-control" autoFocus required  value = "1.000.000"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="account" className="col-md-6 col-md-offset-3">
                    <AccountHistory />
                </div>
            </div>
        )
    }
}
