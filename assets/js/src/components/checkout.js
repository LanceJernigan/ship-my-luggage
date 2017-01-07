import React from 'react'

import Row from './row'
import Column from './column'
import Content from './content'
import Card from './card'

const Checkout = ({checkout, updateCheckout, processCheckout}) => {

    return (

        <Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="First Name">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.fields.first_name.value} placeholder="First Name" onChange={e => updateCheckout({type: 'name', name: 'first', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Last Name">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.fields.last_name.value} placeholder="Last Name" onChange={e => updateCheckout({type: 'name', name: 'last', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Email">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.fields.email.value} placeholder="Email" onChange={e => updateCheckout({type: 'email', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Phone">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.fields.phone.value} placeholder="Phone" onChange={e => updateCheckout({type: 'phone', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Address">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.fields.address_1.value} placeholder="Address" onChange={e => updateCheckout({type: 'address', line: 1, value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Apartment, suite, unit, etc.">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.fields.address_2.value} placeholder="Apartment, suite, unit, etc" onChange={e => updateCheckout({type: 'address', line: 2, value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Country">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.fields.country.value} placeholder="Country" onChange={e => updateCheckout({type: 'country', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="City">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.fields.city.value} placeholder="City" onChange={e => updateCheckout({type: 'city', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="State">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.fields.state.value} placeholder="State" onChange={e => updateCheckout({type: 'state', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Postcode">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.fields.postcode.value} placeholder="Postcode" onChange={e => updateCheckout({type: 'zip', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column>

                    <Card onClick={processCheckout} accent='#fff' title="Checkout" className="sml_center" style={{background: '#2b9bd2', marginTop: '10px'}}>

                    </Card>

                </Column>

            </Row>

        </Row>

    )

}

export default Checkout