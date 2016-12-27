import React from 'react'

import Row from './row'
import Column from './column'
import Card from './card'

const productCard = product => {

    return (

        <Card className='sml_product' style={{marginTop: '1px'}}>

            <Row className="header">

                <h3>{product.title}</h3>

            </Row>

            <Row className="image">

                <img src={product.thumbnail} />

            </Row>

            <Row className="content">

                <div dangerouslySetInnerHTML={{__html: product.content}}>

                </div>

            </Row>

            <Row className="price">

                <Column className='label' columns={2} minWidth={0}>

                    <h3>Starting At:</h3>

                </Column>

                <Column className='value' columns={2} minWidth={0}>

                    <h3>{product.starting}</h3>

                </Column>

            </Row>

            <Row className="quantity">

                <Column className='label' columns={2} minWidth={0}>

                    <h3>Quantity:</h3>

                </Column>

                <Column className='value' columns={2} minWidth={0}>

                    <h3>{product.quantity}</h3>

                </Column>

            </Row>

        </Card>

    )

}

const Products = ({products = []}) => {

    return (

        <Row className="sml_products">

            {products.map(productCard)}

        </Row>

    )

}

export default Products