import React from 'react'

import Row from './row'
import Column from './column'
import Content from './content'
import Card from './card'

const CheckoutButton = ({checkoutValid = false, processCheckout}) => {

    if (checkoutValid === true) {

        return (

            <Row style={{alignItems: 'flex-start'}}>

                <Column>

                    <Card onClick={processCheckout} accent='#fff' title="Checkout" className="sml_center" style={{background: '#2b9bd2', marginTop: '10px'}}>

                    </Card>

                </Column>

            </Row>

        )

    }

    return null

}

const Checkout = ({checkout, updateCheckout, processCheckout, checkoutValid = false}) => {

    return (

        <Row style={{marginTop: '45px'}}>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="First Name">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.first_name.value} placeholder="First Name" onChange={e => updateCheckout({type: 'first_name', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Last Name">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.last_name.value} placeholder="Last Name" onChange={e => updateCheckout({type: 'last_name', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Email">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.email.value} placeholder="Email" onChange={e => updateCheckout({type: 'email', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Phone">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.phone.value} placeholder="Phone" onChange={e => updateCheckout({type: 'phone', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Address">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.address_1.value} placeholder="Address" onChange={e => updateCheckout({type: 'address_1', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Apartment, suite, unit, etc.">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.address_2.value} placeholder="Apartment, suite, unit, etc" onChange={e => updateCheckout({type: 'address_2', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Country">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.country.value} placeholder="Country" onChange={e => updateCheckout({type: 'country', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="City">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.city.value} placeholder="City" onChange={e => updateCheckout({type: 'city', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="State">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.state.value} placeholder="State" onChange={e => updateCheckout({type: 'state', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Postcode">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.postcode.value} placeholder="Postcode" onChange={e => updateCheckout({type: 'postcode', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start', marginTop: '10px'}}>

                <Column>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Credit Card">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.creditCard.value} placeholder="Card Number" onChange={e => updateCheckout({type: 'creditCard', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column columns={3} width={1}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="CVC">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.cvc.value} placeholder="CVC" onChange={e => updateCheckout({type: 'cvc', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={3} width={1}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Expiration Month">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.expMonth.value} placeholder="00" onChange={e => updateCheckout({type: 'expMonth', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={3} width={1}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Expiration Year">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <input type="text" value={checkout.fields.expYear.value} placeholder="00" onChange={e => updateCheckout({type: 'expYear', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <CheckoutButton checkoutValid={checkoutValid} processCheckout={processCheckout} />

        </Row>

    )

}

export default Checkout