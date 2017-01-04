import React from 'react'

import Row from './row'
import Column from './column'
import Content from './content'
import Card from './card'

const Checkout = ({checkout, updateCheckout}) => {

    console.log(checkout)

    return (

        <Row>

            <Row style={{padding: '2px 0', alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' title="First Name">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.name.first} placeholder="First Name" onChange={e => updateCheckout({type: 'name', name: 'first', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' title="Last Name">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.name.last} placeholder="Last Name" onChange={e => updateCheckout({type: 'name', name: 'last', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

            <Row style={{padding: '2px 0', alignItems: 'flex-start'}}>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' title="Email">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.email} placeholder="Email" onChange={e => updateCheckout({type: 'email', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

                <Column columns={2} width={1} gutter={.2}>

                    <Card accent='#2b9bd2' title="Phone">

                        <div className="footer" style={{background: 'rgba(0, 0, 0, .05)', padding: '10px'}}>

                            <input type="text" value={checkout.phone} placeholder="Phone" onChange={e => updateCheckout({type: 'phone', value: e.currentTarget.value})} />

                        </div>

                    </Card>

                </Column>

            </Row>

        </Row>

    )

}

export default Checkout