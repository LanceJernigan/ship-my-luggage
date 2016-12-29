import React from 'react'

import Row from './row'
import Column from './column'
import Card from './card'
import Products from './products'

const Order = ({products = []}) => {

    return (

        <Row>

            <Row style={{padding: '15px 0'}}>

                <Column style={{paddingTop: '.4%', paddingBottom: '2px'}} columns={2} width={1} gutter={.2}>

                        <Card accent='#2b9bd2' title="Origin" content={<p>Where your shipment will begin.</p>}>

                            <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                                <input type="text" placeholder="Address" />

                            </div>

                        </Card>

                </Column>

                <Column style={{paddingTop: '.4%', paddingBottom: '2px'}} columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' title="Destination" content={<p>Where your shipment will end.</p>}>

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" placeholder="Address" />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{paddingTop: '.3%', alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Products products={products} />

                </Column>

                <Column columns={2} width={1}  gutter={.3}>

                    <Card title="Lorem Ipsum" content={<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc et orci at odio luctus laoreet eget ac ante. Integer laoreet turpis suscipit luctus tincidunt. Quisque enim augue, consectetur a arcu vel, elementum convallis justo. Phasellus aliquam turpis eu justo luctus, egestas lacinia odio ultrices. Nunc et quam in eros consectetur fringilla. Integer pulvinar, tortor et scelerisque ultricies, ipsum nisl accumsan urna, eu iaculis massa enim vel mauris. Nunc sit amet mauris tincidunt, consectetur urna a, imperdiet ipsum. Donec ut massa vitae orci mattis maximus at at enim. Donec ultricies elit nec hendrerit finibus. In posuere, mauris eget ultricies rhoncus, justo justo tristique ipsum, a ornare diam libero non eros. Mauris consequat maximus massa. Aenean id elit eu nisl accumsan laoreet.</p>}>

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