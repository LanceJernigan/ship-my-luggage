import React from 'react'
import ReactDOM from 'react-dom'

import Errors from './components/errors'
import Lead from './components/lead'
import Order from './components/order'

const style = {
    width: '100%',
    margin: 'auto',
    padding: '1% 5px',
    maxWidth: '1080px'
}

const products = [
    {
        title: 'Standard Golf Bag',
        thumbnail: '/wp-content/uploads/2016/01/small-golf-bag.png',
        content: '<strong>Max Weight:</strong> 40 lbs / 18 kg <br /><strong>Max Dimensions (in.):</strong> 50x12x10 <br /><strong>Max Dimensions (cm.):</strong> 127x30x25 <br />',
        starting: 144,
        quantity: 0,
        id: 1
    },
    {
        title: 'Standard Golf Bag',
        thumbnail: '/wp-content/uploads/2016/01/small-golf-bag.png',
        content: '<strong>Max Weight:</strong> 40 lbs / 18 kg <br /><strong>Max Dimensions (in.):</strong> 50x12x10 <br /><strong>Max Dimensions (cm.):</strong> 127x30x25 <br />',
        starting: 144,
        quantity: 0,
        id: 2
    }
]

class App extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            lead: true,
            order: {},
            errors: []
        }

    }

    submit = () => {

        const orderData = {
            products: [
                {
                    id: 61,
                    price: 100,
                    quantity: 1
                }
            ]
        }

        jQuery.ajax({
            url: sml.ajax_url,
            type: 'post',
            data: {
                action: 'sml_order',
                orderData: orderData
            },
            success: ({errors}) => {

                this.setState({errors: errors})

                if (errors.length) {

                    console.log(errors)

                } else {

                    console.log('success')

                }

            }
        })

    }

    dismissLead = () => {
        this.setState({
            lead: false
        })
    }

    render() {

        return (

            <div id="sml_wrapper" style={style}>

                <Errors errors={this.state.errors} />

                <Lead dismiss={this.dismissLead} active={this.state.lead} />

                <Order products={window.sml.products} />

            </div>

        )

    }

}

ReactDOM.render(<App />, document.getElementById('mount'))