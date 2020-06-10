import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Http from '../../../component/Http'
export default class SendMoney extends Component {
    constructor(props) {
        super(props)
        this.state = {
            receiveUser: "",
            sendMoney: "",
            bankName: "신한 은행",

            checkLoading: false,
            resultCheck: [],
        }
    }
    handleChange = (e) =>{
        const { name, value } = e.target;
        this.setState({
            [name] : value
        })
    }
    handleChangeCheck = (e) => {
        e.preventDefault();
        this.setState({checkLoading : !this.state.checkLoading})

        const { receiveUser, bankName} = this.state
        Http.post({
            path: `/checkuser`,
            payload: {
                receiveUser,
                bankName
            }
        }).then(({data}) => {
            const { message } = data;
            if(message === 'exists')
            {
                let resultCheck = {
                    name: this.state.receiveUser,
                    money: this.state.sendMoney
                }
                this.setState({
                    checkLoading : !this.state.checkLoading,
                    resultCheck: [resultCheck]
                })
            }else{
                this.setState({
                    checkLoading : !this.state.checkLoading,
                })
            }
        }).catch(err => {
            console.log(err)
        })
    }
    render() {
        const { checkLoading, resultCheck } = this.state
        return (
            <SendMoneyDiv className="row">
                <div id="bank" className="col-md-6 col-md-offset-3">
                    <div className="panel panel-default">
                    <div className="panel-heading text-center lead">Bank Account:</div>
                        <div className="panel-body">
                            <form id="add-account"onSubmit ={e => this.handleChangeCheck(e)} >
                                <div className="form-group">
                                    <label htmlFor="initial-deposit">Send Id Account</label>
                                    <div className="input-group">
                                        <div className="input-group-addon">ID</div>
                                        <input type="number" min="0" name="receiveUser" id="initial-deposit" className="form-control" autoFocus required  onChange = {e => this.handleChange(e)}/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="initial-deposit">Bank Name</label>
                                    <div className="input-group">
                                        <div className="input-group-addon">Name</div>
                                        <select className="form-control" name ="bankName" value = {this.state.bankName} onChange = {e => this.handleChange(e)} >
                                            <option value = "신한은행">신한 은행</option>
                                            <option value = "우리은행">우리 은행</option>
                                            <option value = "농합은행">농합 은행</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label htmlFor="initial-deposit">Initial deposit</label>
                                    <div className="input-group">
                                        <div className="input-group-addon">WON</div>
                                        <input type="number" min="0" name="sendMoney" id="initial-deposit" className="form-control" autoFocus required onChange = {e => this.handleChange(e)} />
                                        <div className="input-group-addon">.00</div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" onClick = {e => this.handleChangeCheck(e)}>확인!</button><br/><br/>
                                {
                                    checkLoading && 
                                        <div className ="spinner-border text-primary d-flex" style = {{margin: '0 auto'}}></div>
                                }   
                                {
                                    resultCheck.length !== 0 &&
                                        <div className = "infor">
                                            <label>받은 사람 성명 : </label>
                                                <p>{resultCheck[0].name}</p>
                                            <label>보내는 돈 :</label>
                                                <p>{resultCheck[0].money}</p>
                                        </div>
                                }
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