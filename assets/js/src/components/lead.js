import React from 'react'

import Row from './row'
import Column from './column'
import Card from './card'

const Lead = ({dismiss, active = true}) => {

    if (!active || window.sml.isLoggedIn === 'true')
        return null

    return (

        <Row className='sml_lead' style={document.body.clientWidth < 600 ? {padding: '3px 0 10px'} : {padding: '25px 0'}}>

            <Column columns={3} width={1}>

                <Card className="lead_image">

                    <img src="/wp-content/uploads/2016/12/lead.jpg" />

                </Card>

            </Column>

            <Column columns={3} width={2}>

                <Card title="Getting Started" content={<p>{window.sml.gettingStarted.post_excerpt}</p>}>

                    <div className="footer">

                        <a className="action" href={window.sml.gettingStarted.guid}>

                            <p>Learn More</p>

                        </a>

                        <div className="action">

                            <p onClick={dismiss}>Dismiss</p>

                        </div>

                    </div>

                </Card>

            </Column>

        </Row>

    )

}

export default Lead