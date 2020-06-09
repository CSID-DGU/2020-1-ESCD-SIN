import React, { Component } from 'react'
import './Service.scss'

export default class Service extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div class="panel panel-default" id="page-header">
                            <div className="panel-body" id="page-title">
                                <h1 className="text-center" id="title">SIN Bank System !</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div id="bank" className="col-md-6 col-md-offset-3">
                        <div className="panel panel-default">
                        <div class="panel-heading text-center lead">Bank Account:</div>
                            <div className="panel-body">
                                <form id="add-account">
                                    <div className="form-group">
                                        <label for="initial-deposit">Send Id Account</label>
                                        <div className="input-group">
                                            <div className="input-group-addon">ID</div>
                                            <input type="number" min="0" name="initial-deposit" id="initial-deposit" className="form-control" autofocus required />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label for="initial-deposit">Initial deposit</label>
                                        <div className="input-group">
                                            <div className="input-group-addon">WON</div>
                                            <input type="number" min="0" name="initial-deposit" id="initial-deposit" className="form-control" autofocus required />
                                            <div className="input-group-addon">.00</div>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-primary">확인!</button><br/><br/>
                                    <div className = "infor">
                                    {/* <div class="spinner-border text-primary"></div> */}
                                    <label>받은 사람 성명 : </label>
                                    <p>as</p>
                                    <label>보내는 돈 :</label>
                                    <p>as</p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div id="account" class="col-md-6 col-md-offset-3">
                    <div class="panel panel-default">
                        <div class="panel-heading text-center lead">Your Account</div>
                        <div class="panel-body">
                            <form id="deposit">
                                <div class="form-group">
                                    <label for="deposit-amount">Deposit:</label>
                                    <div class="input-group">
                                        <div class="input-group-addon">WON</div>
                                        <input type="number" min="0" name="deposit-amount" id="deposit-amount" class="form-control" required />
                                        <div class="input-group-addon">.00</div>
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-success">Deposit!</button>
                            </form>

                            <form id="withdraw">
                                <div class="form-group">
                                <label for="withdrawl-amount">Withdraw:</label>
                                    <div class="input-group">
                                        <div class="input-group-addon">WON</div>
                                        <input type="number" min="0" name="withdrawal-amount" id="withdrawal-amount" class="form-control" required />
                                            <div class="input-group-addon">.00</div>
                                        </div>
                                    </div>
                                    <div id="no-button">
                                        <fieldset disabled>
                                            <button type="submit" class="btn btn-danger">Withdraw!</button>
                                        </fieldset>
                                    </div>
                                    <div id="go-button">
                                        <button type="submit" class="btn btn-danger">Withdraw!</button>
                                    </div>
                            </form>
                        </div>
                    </div>

                    <div class="panel panel-info" id="history-panel">
                        <div class="panel-heading text-center lead" id="history-header">Account History</div>
                        <table class="table table-striped" id="history">
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Balance</th>
                        </tr>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}
