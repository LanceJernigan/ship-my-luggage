import React from 'react'

import Row from './row'
import Card from './card'
import Column from './column'
import Content from './content'

const DateLine = ({rate = {}}) => {

    if (rate.delivery !== null) {

        const date = new Date(rate.delivery)

        return (

            <Content>

                <p><strong>{date.toDateString()}</strong> - {date.toTimeString()}</p>

            </Content>

        )

    }

    return <Content><p>Unknown</p></Content>

}

const DeliveryOptions = ({products, calculateTotal, updateDelivery, deliveryType}) => {

    if (products[0].hasOwnProperty('rates')) {

        const rates = products[0].rates

        return (

            <Card accent='#2b9bd2' title='Delivery Options' onClick="toggle" style={{marginTop: '10px'}}>

                <Content>

                    <p>Available shipping options.</p>

                </Content>

                <Row>

                    {Object.keys(rates).map( key => {

                        const rate = rates[key]

                        return (

                            <Row className={'delivery_option ' + (rate.type === deliveryType ? 'active' : 'deactive')} style={{background: '#eeeff0', borderTop: 'solid 1px rgba(0, 0, 0, .1)'}} key={key}>

                                <Column columns={6} width={5} minWidth={0} style={{flexWrap: 'wrap'}} >

                                    <Card accent="#2b9bd2" title={rate.title} style={{background: '#eeeff0'}} onClick={() => updateDelivery(rate.type)}>

                                        <DateLine rate={rate} />

                                    </Card>

                                </Column>

                                <Column columns={6} width={1} minWidth={0} style={{background: (rate.type === deliveryType ? '#2b9bd2' : 'rgba(0, 0, 0, .05)'), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                                    <h3 onClick={() => updateDelivery(rate.type)}>{calculateTotal(rate.type)}</h3>

                                </Column>

                            </Row>

                        )

                    })}

                </Row>

            </Card>

        )

    }

    return null

}

export default DeliveryOptions