import React from 'react'

import Row from './row'

const Total = ({display = false, total = 0}) => {

    return (

        <Row className={'sml_total ' + (display ? 'active' : 'deactive')}>

            <h4>Total: ${total}</h4>

        </Row>

    )

}

export default Total