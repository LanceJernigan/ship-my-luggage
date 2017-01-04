import React from 'react'

import Row from './row'
import Column from './column'
import Content from './content'
import Card from './card'

const Checkout = ({checkout, updateCheckout}) => {

    return (

        <Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="First Name">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.name.first} placeholder="First Name" onChange={e => updateCheckout({type: 'name', name: 'first', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Last Name">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.name.last} placeholder="Last Name" onChange={e => updateCheckout({type: 'name', name: 'last', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Email">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.email} placeholder="Email" onChange={e => updateCheckout({type: 'email', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Phone">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.phone} placeholder="Phone" onChange={e => updateCheckout({type: 'phone', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Address">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.address.line1} placeholder="Address" onChange={e => updateCheckout({type: 'address', line: 1, value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Apartment, suite, unit, etc.">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.address.line2} placeholder="Apartment, suite, unit, etc" onChange={e => updateCheckout({type: 'address', line: 2, value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Country">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.country} placeholder="Country" onChange={e => updateCheckout({type: 'country', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="City">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.city} placeholder="City" onChange={e => updateCheckout({type: 'city', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="State">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.state} placeholder="State" onChange={e => updateCheckout({type: 'state', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Zip">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.zip} placeholder="Zip" onChange={e => updateCheckout({type: 'zip', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

        </Row>

    )

}

export default Checkout