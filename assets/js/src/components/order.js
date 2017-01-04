import React from 'react'

import Row from './row'
import Column from './column'
import Content from './content'
import Card from './card'
import Products from './products'

const Order = ({addresses = {origin: {val: ''}, destination: {val: ''}}, date = new Date(), products = [], updateAddress, validateAddresses, updateQuantity, submit}) => {

    return (

        <Row>

            <Row style={{paddingTop: '15px'}}>

                <Column columns={2} width={1} gutter={.2}>

                        <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Origin" content={<p>Where your shipment will begin.</p>}>

                            <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                                <input type="text" value={addresses.origin.val} placeholder="Address" onChange={e => updateAddress('origin', e.currentTarget.value)} onBlur={validateAddresses} />

                            </div>

                        </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' title="Destination" content={<p>Where your shipment will end.</p>}>

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={addresses.destination.val} placeholder="Address" onChange={e => updateAddress('destination', e.currentTarget.value)} onBlur={validateAddresses} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column style={{marginTop: '10px'}} columns={2} width={1} gutter={.2}>

                    <Products updateQuantity={updateQuantity} products={products} />

                </Column>

                <Column style={{marginTop: '10px'}} columns={2} width={1} gutter={.3}>

                    <Card accent='#2b9bd2' title="Delivery Date" style={{marginBottom: '1px'}}>

                        <Content>

                            <p>When your shipment will be delivered.</p>

                        </Content>

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" placeholder="Date" value={date.toDateString()} onChange={e => updateAddress('origin', e.currentTarget.value)} />

                        </div>

                    </Card>

                    <Card onClick={submit} accent='#fff' title="Continue" className="checkout" style={{background: '#2b9bd2', marginTop: '10px'}}>

                    </Card>

                </Column>

            </Row>

        </Row>

    )

}

export default Order