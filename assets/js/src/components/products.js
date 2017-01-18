import React from 'react'

import Row from './row'
import Column from './column'
import Card from './card'

const Content = ({product, shipping}) => {

    let price = 0

    const deliveryMethod = shipping.filter( rate => rate.hasOwnProperty('active') && rate.active === true).shift()

    if (deliveryMethod) {

        const rate = deliveryMethod.products.filter( _product => parseInt(_product.id) === parseInt(product.id)).shift()
        price = rate.price

    } else {

        price = parseFloat(product.price)

    }

    return (

        <Row>

            <Column>

                <p><strong>Price: </strong> ${Math.round(price)}</p>

            </Column>

        </Row>

    )

}

const Footer = ({product, updateQuantity}) => {

    return (

        <Row>

            <Column columns={10} width={8} minWidth={0}>

                <p><strong>Quantity:</strong></p>

            </Column>

            <Column columns={10} width={2} minWidth={0}>

                <input value={product.quantity} min='0' type="number" onChange={e => updateQuantity(product.id, e.currentTarget.value)} />

            </Column>

        </Row>

    )

}

const Products = ({products = [], updateQuantity, shipping = []}) => {

    return (

        <Row className="sml_products">

            {products.map((product) => {

                return (

                    <Card className='sml_product' accent='#2b9bd2' title={product.title} content={<Content product={product} shipping={shipping} />} footer={<Footer updateQuantity={updateQuantity} product={product} />} style={{marginBottom: '1px'}} onClick={'toggle'} toggle="toggle" key={product.id}>

                        <Row className="thumbnail">

                            <img src={product.thumbnail[0]} />

                        </Row>

                        <div className="description" dangerouslySetInnerHTML={{__html: product.content}}>

                        </div>

                    </Card>

                )

            })}

        </Row>

    )

}

export default Products