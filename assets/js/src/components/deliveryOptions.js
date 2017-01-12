import React from 'react'

import Row from './row'
import Card from './card'
import Column from './column'
import Content from './content'

import moment from 'moment'

const timeString = date => {

    const hours = date.getHours() % 12
    const minutes = date.getMinutes()
    const meridiem = date.getHours() < 12 ? 'am' : 'pm'

    return (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + meridiem

}

const DateLine = ({rate = {}, date}) => {

    if (date !== false) {

        return (

            <Content>

                <p>{date.format('dddd, MMMM D YYYY - h:mm a')}</p>

            </Content>

        )

    }

    return <Content><p>Unknown</p></Content>

}

const DeliveryOptions = ({products, calculateTotal, updateDelivery, deliveryType, deliveryDate}) => {

    if (products[0].hasOwnProperty('rates')) {

        const rates = products[0].rates

        return (

            <Card accent='#2b9bd2' title='Delivery Options' onClick="toggle" style={{marginTop: '10px'}} toggle='toggle' active={true}>

                <Content>

                    <p>Available shipping options.</p>

                </Content>

                <Row>

                    {Object.keys(rates).map( key => {

                        const rate = rates[key]
                        const date = rate.delivery !== null ? moment(rate.delivery) : false

                        if (key == 'FEDEX_GROUND' || date.isBefore(deliveryDate)) {

                            return (

                                <Row className={'delivery_option ' + (rate.type === deliveryType ? 'active' : 'deactive')} style={{background: '#eeeff0', borderTop: 'solid 1px rgba(0, 0, 0, .1)'}} key={key}>

                                    <Column columns={6} width={5} minWidth={0} style={{flexWrap: 'wrap'}} >

                                        <Card accent="#2b9bd2" title={rate.title} style={{background: '#eeeff0'}} onClick={() => updateDelivery(rate.type)}>

                                            <DateLine rate={rate} date={date} />

                                        </Card>

                                    </Column>

                                    <Column columns={6} width={1} minWidth={0} className='delivery_option--price' style={{background: (rate.type === deliveryType ? '#2b9bd2' : 'rgba(0, 0, 0, .05)'), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                                        <h4 onClick={() => updateDelivery(rate.type)}>${calculateTotal(rate.type)}</h4>

                                    </Column>

                                </Row>

                            )
                        }

                        return null

                    })}

                </Row>

            </Card>

        )

    }

    return null

}

export default DeliveryOptions