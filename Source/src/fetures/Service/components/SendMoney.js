import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
export default class SendMoney extends Component {
    constructor(props) {
        super(props)
        this.state = {
            sendAccount: "",
            sendMoney: ""
        }
    }
    render() {
        return (
            <SendMoneyDiv className="row">
                <div id="bank" className="col-md-6 col-md-offset-3">
                    <div className="panel panel-default">
                    <div className="panel-heading text-center lead">Bank Account:</div>
                        <div className="panel-body">
                            <form id="add-account">
                                <div className="form-group">
                                    <label htmlFor="initial-deposit">Send Id Account</label>
                                    <div className="input-group">
                                        <div className="input-group-addon">ID</div>
                                        <input type="number" min="0" name="initial-deposit" id="initial-deposit" className="form-control" autoFocus required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="initial-deposit">Initial deposit</label>
                                    <div className="input-group">
                                        <div className="input-group-addon">WON</div>
                                        <input type="number" min="0" name="initial-deposit" id="initial-deposit" className="form-control" autoFocus required />
                                        <div className="input-group-addon">.00</div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary">확인!</button><br/><br/>
                                <div className = "infor">
                                {/* <div class="spinner-border text-primary"></div> */}
                                <label>받은 사람 성명 : </label>
                                <p>홍길도</p>
                                <label>보내는 돈 :</label>
                                <p>2.000.000원</p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
        </SendMoneyDiv>
        )
    }
}

const SendMoneyDiv = styled.div`
`