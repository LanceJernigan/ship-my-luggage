import React from 'react'

import Row from './row'
import Column from './column'
import Card from './card'

const productCard = product => {

    return (

        <Card className='sml_product' accent='#2b9bd2' title={product.title} content={<p><strong>Starting:</strong> ${product.starting}</p>} style={{marginBottom: '1px'}} toggle={true} key={product.id}>

            <Row className="thumbnail">

                <img src={product.thumbnail[0]} />

            </Row>

            <div className="description" dangerouslySetInnerHTML={{__html: product.content}}>

            </div>

            <Row className="footer">

                <Column columns={2}>

                    <p>Quantity:</p>

                </Column>

                <Column columns={2}>

                    <p>0</p>

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