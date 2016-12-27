import React from 'react'

import Row from './row'
import Column from './column'
import Card from './card'
import Products from './products'

const Order = ({products = []}) => {

    return (

        <Row>

            <Row style={{paddingTop: '15px'}}>

                <Column columns={1} width={1}>

                    <Card style={{background: '#2b9bd2', width: '100%', textAlign: 'right', padding: '10px'}}>

                        <h3>Total:  $144</h3>

                    </Card>

                </Column>

            </Row>

            <Row style={{paddingTop: '10px', alignItems: 'flex-start'}}>

                <Column columns={3} width={1}>

                    <Row>

                        <Card className="getting_started">

                            <h3>Origin</h3>

                            <div className="content">

                                <p>Where your shipment will begin.</p>

                            </div>

                            <div className="footer" style={{background: '#2b9bd2', padding: '10px'}}>

                                <h4>Address</h4>

                            </div>

                        </Card>

                        <Card className="getting_started">

                            <h3>Destination</h3>

                            <div className="content">

                                <p>Where your shipment will end.</p>

                            </div>

                            <div className="footer" style={{background: '#2b9bd2', padding: '10px'}}>

                                <h4>Address</h4>

                            </div>

                        </Card>

                    </Row>

                </Column>

                <Column columns={3} width={1} style={{padding: '0px 10px'}}>

                    <Products products={products} />

                </Column>

                <Column columns={3} width={1}>

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

        </Row>

    )

}

export default Order