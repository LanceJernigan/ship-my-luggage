import React from 'react'

import Row from './row'
import Column from './column'
import Card from './card'

const Content = ({product, deliveryType}) => {

    const {price} = product.hasOwnProperty('rates') && product.rates.hasOwnProperty(deliveryType) ? product.rates[deliveryType] : product

    return (

        <Row>

            <Column>

                <p><strong>{product.price ? 'Price:' : 'Starting:'}</strong> ${Math.round(price)}</p>

            </Column>

        </Row>

    )

}

const Footer = ({product, updateQuantity}) => {

    return (

        <Row>

            <Column columns={12} width={9} minWidth={0}>

                <p><strong>Quantity:</strong></p>

            </Column>

            <Column columns={12} width={1} minWidth={0}>

                <p>{product.quantity}</p>

            </Column>

            <Column columns={12} width={2} minWidth={0}>

                <p onClick={e => updateQuantity(product.id, (product.quantity > 0 ? product.quantity - 1 : product.quantity))}>-</p>
                <p onClick={e => updateQuantity(product.id, (product.quantity + 1))}>+</p>

            </Column>

        </Row>

    )

}

const Products = ({products = [], updateQuantity, deliveryType}) => {

    return (

        <Row className="sml_products">

            {products.map((product) => {

                return (

                    <Card className='sml_product' accent='#2b9bd2' title={product.title} content={<Content product={product} deliveryType={deliveryType} />} footer={<Footer updateQuantity={updateQuantity} product={product} />} style={{marginBottom: '1px'}} onClick={'toggle'} toggle="toggle" key={product.id}>

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