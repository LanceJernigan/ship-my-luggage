import React from 'react'

import Row from './row'
import Column from './column'
import Content from './content'
import Card from './card'
import Products from './products'
import DeliveryOptions from './deliveryOptions'

const AfterCalc = ({fetching, rates, children}) => {

    if (! fetching && rates) {

        return children

    }

    return null

}

const Quickpay = ({checkout, quickPay}) => {

    const inValid = Object.keys(checkout.fields).filter( key => {

        const field = checkout.fields[key]

        if (! field.hasOwnProperty() || field.required === false)
            return false

        return field.value.length === 0

    }).length > 0

    if (! inValid && window.sml.isLoggedIn === 'true') {

        return (

            <Card onClick={quickPay} accent='#fff' title="Quick Pay" className="sml_center" style={{background: '#76b110', marginTop: '10px'}}>

            </Card>

        )

    }

    return null

}

const Continue = ({onClick}) => {

    return (

        <Card onClick={onClick} accent='#fff' title="Continue" className="sml_center" style={{background: '#2b9bd2', marginTop: '10px'}}>

        </Card>

    )

}

const Order = ({addresses = {origin: {val: ''}, destination: {val: ''}}, date = new Date(), checkout = {}, products = [], deliveryType = 'FEDEX_GROUND', updateAddress, validateAddresses, updateQuantity, submit, processCheckout, quickPay, calculateTotal, updateDelivery, fetching = false, rates = false}) => {

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

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Destination" content={<p>Where your shipment will end.</p>}>

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={addresses.destination.val} placeholder="Address" onChange={e => updateAddress('destination', e.currentTarget.value)} onBlur={validateAddresses} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column style={{marginTop: '10px'}} columns={2} width={1} gutter={.2}>

                    <Products updateQuantity={updateQuantity} products={products} deliveryType={deliveryType} />

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

                    <AfterCalc fetching={fetching} rates={rates}>

                        <DeliveryOptions products={products} calculateTotal={calculateTotal} deliveryType={deliveryType} updateDelivery={updateDelivery} />

                        <Continue onClick={submit} />

                        <Quickpay checkout={checkout} quickPay={quickPay} />

                    </AfterCalc>

                </Column>

            </Row>

        </Row>

    )

}

export default Order