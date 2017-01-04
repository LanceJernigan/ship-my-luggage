import React from 'react'
import ReactDOM from 'react-dom'

import Errors from './components/errors'
import Lead from './components/lead'
import Order from './components/order'
import Checkout from './components/checkout'

const style = {
    width: '100%',
    margin: 'auto',
    padding: '1% 5px',
    maxWidth: '1080px'
}

class App extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            lead: true,
            order: {
                date: new Date(),
                addresses: {
                    origin: {
                        val: '5800 Central Avenue Pike, Knoxville, TN, 37912'
                    },
                    destination: {
                        val: '1630 Downtown West Blvd Suite 116, Knoxville, TN, 37919'
                    }
                },
                products: window.sml.products.map( product => {

                    if (! product.hasOwnProperty('quantity'))
                        product.quantity = 0

                    return product

                })
            },
            checkout: Object.assign({
                active: false,
                address: {
                    line1: '',
                    line2: ''
                },
                name: {
                    first: '',
                    last: ''
                },
            }, window.sml.checkout),
            errors: []
        }

    }

    updateAddress = (target, value) => {

        this.setState({
            order: {
                ...this.state.order,
                addresses: {
                    ...this.state.order.addresses,
                    [target]: {
                        val: value
                    }
                }
            }
        })

    }

    updateQuantity = (productId, quantity) => {

        this.setState({
            order: {
                ...this.state.order,
                products: this.state.order.products.map( product => {

                    if (product.id === productId)
                        product.quantity = quantity

                    return product

                })
            }
        })

    }

    updateCheckout = props => {

        const actions = {
            address: props => {
                return {
                    ...this.state.checkout.address,
                    ['line' + props.line]: props.value
                }
            },
            name: props => {
                return {
                    ...this.state.checkout.name,
                    [props.name]: props.value
                }
            }
        }

        this.setState({
            ...this.state,
            checkout: {
                ...this.state.checkout,
                [props.type]: actions[props.type](props)
            }
        })

    }

    submit = () => {

        const orderData = this.state.order

        jQuery.ajax({
            url: sml.ajax_url,
            type: 'post',
            data: {
                action: 'sml_order',
                orderData: orderData
            },
            success: ({errors}) => {

                if (errors && errors.length) {

                    this.setState({errors: errors})

                } else {

                    this.setState({
                        checkout: {
                            ...this.state.checkout,
                            active: true
                        }
                    })

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

                {this.state.checkout.active ? <Checkout checkout={this.state.checkout} updateCheckout={this.updateCheckout} /> : <Order updateAddress={this.updateAddress} updateQuantity={this.updateQuantity} submit={this.submit} addresses={this.state.order.addresses} products={this.state.order.products} date={this.state.order.date} />}

            </div>

        )

    }

}

ReactDOM.render(<App />, document.getElementById('mount'))