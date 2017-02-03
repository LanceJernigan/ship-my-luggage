import React from 'react'

import Row from './row'
import Card from './card'
import Column from './column'
import Content from './content'

import moment from 'moment'

const DeliveryOptions = ({calculateTotal, updateDelivery, shipping, deliveryDate}) => {

    if (shipping.length) {

        const today = moment(new Date()).startOf('day')
        const delivery = moment(deliveryDate)

        if (today.day() === 5) {
            today.add(2, 'days')
        } else if (today.day() === 6) {
            today.add(1, 'days')
        }

        return (

            <Card accent='#2b9bd2' title='Delivery Options' onClick="toggle" style={{marginTop: '10px'}} toggle='toggle' active={true}>

                <Content>

                    <p>Available shipping options.</p>

                </Content>

                <Row>

                    {shipping.map( rate => {

                        const date = moment(rate.deliveryDate)
                        const duration = Math.ceil(moment.duration(date.diff(today)).asDays())
                        const pickup = moment(delivery).subtract(duration, 'days')

                        if (! pickup.isBefore(today)) {

                            return (

                                <Row className={'delivery_option ' + (rate.active === true ? 'active' : 'deactive')} style={{background: '#eeeff0', borderTop: 'solid 1px rgba(0, 0, 0, .1)'}} key={rate.type}>

                                    <Column columns={6} width={5} minWidth={0} style={{flexWrap: 'wrap'}} >

                                        <Card accent="#2b9bd2" title={rate.name} style={{background: '#eeeff0'}} onClick={() => updateDelivery(rate.type)}>

                                            <Content>

                                                <p><strong>Estimated Pickup: </strong>{pickup.format('dddd, MMMM D')}</p>

                                            </Content>

                                        </Card>

                                    </Column>

                                    <Column columns={6} width={1} minWidth={0} className='delivery_option--price' style={{background: (rate.hasOwnProperty('active') && rate.active === true ? '#2b9bd2' : 'rgba(0, 0, 0, .05)'), display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

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