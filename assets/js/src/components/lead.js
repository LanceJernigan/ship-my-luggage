import React from 'react'

import Row from './row'
import Column from './column'
import Card from './card'

const Lead = () => {

    return (

        <Row>

            <Column columns={3} width={1}>

                <Card className="lead_image">

                    <img src="/wp-content/uploads/2016/12/lead.jpg" />

                </Card>

            </Column>

            <Column columns={3} width={2}>

                <Card className="getting_started">

                    <h3>Getting Started</h3>

                    <div className="content">

                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et orci at odio luctus laoreet eget ac ante. Integer laoreet turpis suscipit luctus tincidunt. Quisque enim augue, consectetur a arcu vel, elementum convallis justo. Phasellus aliquam turpis eu justo luctus, egestas lacinia odio ultrices. Nunc et quam in eros consectetur fringilla. Integer pulvinar, tortor et scelerisque ultricies, ipsum nisl accumsan urna, eu iaculis massa enim vel mauris. Nunc sit amet mauris tincidunt, consectetur urna a, imperdiet ipsum. Donec ut massa vitae orci mattis maximus at at enim. Donec ultricies elit nec hendrerit finibus. In posuere, mauris eget ultricies rhoncus, justo justo tristique ipsum, a ornare diam libero non eros. Mauris consequat maximus massa. Aenean id elit eu nisl accumsan laoreet.</p>

                    </div>

                    <div className="footer">

                        <div className="action">

                            <p>Learn More</p>

                        </div>

                        <div className="action">

                            <p>Get Started</p>

                        </div>

                    </div>

                </Card>

            </Column>

        </Row>

    )

}

export default Lead