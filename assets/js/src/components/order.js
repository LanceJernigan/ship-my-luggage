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

const AfterCalc = ({fetching, shipping, children, deliveryDate}) => {

    if (! fetching && shipping.length) {

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

const AddressFooter = ({address, savedLocations, addresses, updateAddress}) => {

    return (

        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

            <div>

                <div className="send"><SavedLocations savedLocations={savedLocations} target={address} address={addresses[address]} updateAddress={updateAddress} /></div>

                <Autocomplete value={addresses[address].value} onChange={e => updateAddress(address, e.currentTarget.value, 'value')} placeholder='Address' types={['geocode']} onPlaceSelected={place => updateAddress(address, place)} />

            </div>

            <input type="text" value={addresses[address].address_2 || ''} onChange={e => updateAddress(address, e.currentTarget.value, 'address_2')} placeholder="Apt, suite, etc."  />

        </div>

    )

}

const SavedLocations = ({savedLocations = [], target, address = false, updateAddress}) => {

    if (address.hasOwnProperty('name') && address.name)
        return <p><strong>{address.name}</strong></p>

    if (! savedLocations.length)
        return null

    if (! address.hasOwnProperty('value') || ! address.value)
        return null

    const filter = address.value.toLowerCase() || ''
    const savedLocation = savedLocations.filter( location => location.value.toLowerCase().indexOf(filter) > -1 || location.name.toLowerCase().indexOf(filter) > -1).shift()

    if (savedLocation)
        return <p onClick={ e => updateAddress(target, savedLocation, 'all')}>Use <strong>{savedLocation.name}</strong></p>

    return null

}

const Order = ({shipping = [], addresses = {origin: {val: ''}, destination: {val: ''}}, deliveryDate, checkout = {}, products = [], deliveryType = false, updateAddress, validateAddresses, updateQuantity, submit, quickPay, calculateTotal, updateDelivery, updateDeliveryDate, fetching = false, rates = false, saveLocation, savedLocations}) => {

    return (

        <Row>

            <Row style={{paddingTop: '45px'}}>

                <Column columns={2} width={1} gutter={.2}>

                        <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Origin" content={<p>Where your shipment will start.</p>} options={[{value: 'Save Location', onClick: () => saveLocation('origin')}]}>

                            <AddressFooter address='origin' savedLocations={savedLocations} addresses={addresses} updateAddress={updateAddress} />

                        </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' style={{marginBottom: '1px'}} title="Destination" content={<p>Where your shipment will end.</p>} options={[{value: 'Save Location', onClick: () => saveLocation('destination')}]}>

                        <AddressFooter address='destination' savedLocations={savedLocations} addresses={addresses} updateAddress={updateAddress} />

                    </Card>

                </Column>

            </Row>

            <Row style={{alignItems: 'flex-start'}}>

                <Column style={{marginTop: '10px'}} columns={2} width={1} gutter={.2}>

                    <Products updateQuantity={updateQuantity} products={products} shipping={shipping} />

                </Column>

                <Column style={{marginTop: '10px'}} columns={2} width={1} gutter={.3}>

                    <Card accent='#2b9bd2' title="Delivery Date" style={{marginBottom: '1px'}}>

                        <Content>

                            <p>When your shipment will be delivered.</p>

                        </Content>

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)'}}>

                            <DatePicker placeholderText='Date' withPortal selected={deliveryDate === null ? null : moment(deliveryDate)} dateFormat={'dddd, MMMM D, YYYY'} minDate={moment().add(1, 'days')} onChange={updateDeliveryDate} />

                        </div>

                    </Card>

                    <AfterCalc fetching={fetching} shipping={shipping} deliveryDate={deliveryDate}>

                        <DeliveryOptions calculateTotal={calculateTotal} shipping={shipping} updateDelivery={updateDelivery} deliveryDate={deliveryDate} />

                        <Continue onClick={submit} />

                        {/*<Quickpay checkout={checkout} quickPay={quickPay} />*/}

                    </AfterCalc>

                </Column>

            </Row>

        </Row>

    )

}

export default Order