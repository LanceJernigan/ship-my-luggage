import React from 'react'

import Row from './row'
import Column from './column'
import Card from './card'

const Footer = ({product, updateQuantity}) => {

    return (

        <Row>

            <Column columns={12} width={10} minWidth={0}>

                <p><strong>Quantity:</strong></p>

            </Column>

            <Column columns={12} width={1} minWidth={0}>

                <p>{product.quantity}</p>

            </Column>

            <Column columns={12} width={1} minWidth={0}>

                <p onClick={e => updateQuantity(product.id, (product.quantity + 1))}>+</p>
                <p onClick={e => updateQuantity(product.id, (product.quantity > 0 ? product.quantity - 1 : product.quantity))}>-</p>

            </Column>

        </Row>

    )

}

const Products = ({products = [], updateQuantity}) => {

    return (

        <Row className="sml_products">

            {products.map((product) => {

                return (

                    <Card className='sml_product' accent='#2b9bd2' title={product.title} content={product.price ? <p><strong>Price:</strong> ${product.price}</p> : <p><strong>Starting:</strong> ${product.starting}</p>} footer={<Footer updateQuantity={updateQuantity} product={product} />} style={{marginBottom: '1px'}} onClick={'toggle'} key={product.id}>

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