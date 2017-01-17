import React from 'react'

import Row from './row'
import Column from './column'
import Content from './content'
import Card from './card'
import Products from './products'
import DeliveryOptions from './deliveryOptions'

import Autocomplete from 'react-google-autocomplete'
import DatePicker from 'react-datepicker'
import moment from 'moment'

require('../../../css/react-datepicker.css')

const AfterCalc = ({fetching, rates, children, deliveryDate}) => {

    if (! fetching && rates) {

        if (deliveryDate) {

            return (

                <div style={{width: '100%'}}>

                    {children}

                </div>

            )

        } else {

            return (

                <Card accent='#2b9bd2' title='Delivery Options' onClick="toggle" style={{marginTop: '10px'}}>

                    <Content>

                        <p>Please choose a delivery date to proceed.</p>

                    </Content>

                </Card>

            )

        }

    } else if (fetching) {

        return (

            <Card accent='#fff' title="Calculating lowest prices..." className="sml_center" style={{background: '#2b9bd2', marginTop: '10px'}}>

            </Card>

        )

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

const Order = ({addresses = {origin: {val: ''}, destination: {val: ''}}, deliveryDate, checkout = {}, products = [], deliveryType = 'FEDEX_GROUND', updateAddress, validateAddresses, updateQuantity, submit, quickPay, calculateTotal, updateDelivery, updateDeliveryDate, fetching = false, rates = false}) => {

    return (

        <Row>

            <Row style={{paddingTop: '45px'}}>

                <Column columns={2} width={1} gutter={.2}>

                        <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Origin" content={<p>Where your shipment will begin.</p>}>

                            <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                                <Autocomplete value={addresses.origin.value} onChange={e => updateAddress('origin', e.currentTarget.value, 'value')} placeholder='Address' types={['geocode']} onPlaceSelected={place => updateAddress('origin', place)} />
                                <input type="text" value={addresses.origin.address_2} onChange={e => updateAddress('origin', e.currentTarget.value, 'address_2')} placeholder="Apt, suite, etc."  />

                            </div>

                        </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Destination" content={<p>Where your shipment will end.</p>}>

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <Autocomplete value={addresses.destination.value} placeholder='Address' types={['geocode']} onPlaceSelected={place => updateAddress('destination', place)} />
                            <input type="text" value={addresses.destination.address_2} onChange={e => updateAddress('destination', e.currentTarget.value, 'address_2')} placeholder="Apt, suite, etc."  />

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

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <DatePicker placeholderText='Date' withPortal selected={deliveryDate === null ? null : moment(deliveryDate)} dateFormat={'dddd, MMMM D YYYY'} minDate={moment().add(1, 'days')} onChange={updateDeliveryDate} />

                        </div>

                    </Card>

                    <AfterCalc fetching={fetching} rates={rates} deliveryDate={deliveryDate}>

                        <DeliveryOptions products={products} calculateTotal={calculateTotal} deliveryType={deliveryType} updateDelivery={updateDelivery} deliveryDate={deliveryDate} />

                        <Continue onClick={submit} />

                        {/*<Quickpay checkout={checkout} quickPay={quickPay} />*/}

                    </AfterCalc>

                </Column>

            </Row>

        </Row>

    )

}

export default Order