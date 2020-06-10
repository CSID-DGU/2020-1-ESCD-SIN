import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

function AccountHistory(props) {
    return (
        <AccountHistoryDiv className="panel panel-info" id="history-panel">
            <div className="panel-heading text-center lead" id="history-header">Account History</div>
            <table className="table table-striped" id="history">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Bank Name</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th>2020.02.03</th>
                        <th>1.000.000원</th>
                        <th>신한은행</th>
                    </tr>
                </tbody>
            </table>
    </AccountHistoryDiv>
    )
}
const AccountHistoryDiv = styled.div`
    margin-bottom: 5rem
`
AccountHistory.propTypes = {

}

export default AccountHistory

