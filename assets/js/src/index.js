import React from 'react'
import ReactDOM from 'react-dom'

import Total from './components/total'
import Errors from './components/errors'
import Lead from './components/lead'
import Order from './components/order'
import Checkout from './components/checkout'

class App extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            lead: true,
            order: {
                date: new Date(),
                addresses: {
                    origin: {
                        val: '5800 Central Avenue Pike, Knoxville, TN, 37912',
                        address_1: '5800 Central Avenue Pike',
                        address_2: 'Apt 5402',
                        city: 'Knoxville',
                        state: 'Tennessee',
                        postcode: '37912',
                        country: 'United States',
                        countryCode: 'US'
                    },
                    destination: {
                        val: '1630 Downtown West Blvd Suite 116, Knoxville, TN, 37919',
                        address_1: '1630 Downtown West Blvd',
                        address_2: 'Suite 116',
                        city: 'Knoxville',
                        state: 'Tennessee',
                        postcode: '37919',
                        country: 'United States',
                        countryCode: 'US'
                    }
                },
                products: window.sml.products.map( product => {

                    if (! product.hasOwnProperty('quantity'))
                        product.quantity = 0

                    return product

                }),
                delivery: 'FEDEX_GROUND',
                total: 0,
            },
            displayTotal: false,
            checkout: this.prePopulateDefaults('checkout'),
            errors: []
        }

    }

    componentDidMount() {

        window.onpopstate = this.popState
        window.onscroll = this.onScroll

    }

    popState = e => {

        this.setState({
            ...e.state
        })

    }

    prePopulateDefaults = key => {

        const _defaults = {
            checkout: {
                active: false,
                fields: {
                    first_name: {
                        value: '',
                        required: true
                    },
                    last_name: {
                        value: '',
                        required: true
                    },
                    email: {
                        value: '',
                        required: true
                    },
                    phone: {
                        value: '',
                        required: true
                    },
                    address_1: {
                        value: '',
                        required: true
                    },
                    address_2: {
                        value: '',
                        required: false
                    },
                    city: {
                        value: '',
                        required: true
                    },
                    state: {
                        value: '',
                        required: true
                    },
                    postcode: {
                        value: '',
                        required: true
                    },
                    country: {
                        value: '',
                        required: true
                    }
                }
            }
        }

        const defaults = _defaults[key]
        const prePopulate = window.sml[key]

        for (let k = 0; k < Object.keys(prePopulate).length; k++) {

            const key = Object.keys(prePopulate)[k]
            const val = prePopulate[key]

            defaults.fields[key].value = val

        }

        return defaults

    }

    updateAddress = (target, value) => {

        if (this.state.order.addresses[target].val !== value) {

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

    }

    validateAddresses = () => {

        const addresses = Object.assign(this.state.order.addresses)
        const validated = Object.keys(addresses).filter( key => addresses[key].val.length > 0).length === 2

        if (validated)
            this.requestProductRates()
    }


    requestProductRates = () => {

        console.time('ProductRates')

        this.sml_ajax({
            data: {
                action: 'sml_product_pricing',
                products: this.state.order.products,
                addresses: this.state.order.addresses
            },
            success: ({rates}) => {

                this.setState({
                    ...this.state,
                    order: {
                        ...this.state.order,
                        products: this.state.order.products.map( (product, i) => {

                            product.rates = rates[i]

                            return product

                        })
                    }
                })

                setTimeout(this.updateTotal, 0)

                console.timeEnd('ProductRates')

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

        setTimeout(this.updateTotal, 0)

    }

    updateTotal = () => {

        const total = this.calculateTotal(this.state.order.delivery)

        this.setState({
            ...this.state,
            order: {
                ...this.state.order,
                total: total
            }
        })

    }

    calculateTotal = (delivery = 'FEDEX_GROUND') => {

        return this.state.order.products.reduce( (tot, product) => {

            const price = product.hasOwnProperty('rates') ? product.rates[delivery].price : product.starting
            const quantity = product.quantity

            tot += parseFloat(price) * quantity

            return tot

        }, 0).toFixed(2)

    }

    updateDelivery = (delivery) => {

        console.log(delivery)

        this.setState({
            ...this.state,
            order: {
                ...this.state.order,
                delivery: delivery
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
            },
            default: props => {
                return props.value
            }
        }

        this.setState({
            ...this.state,
            checkout: {
                ...this.state.checkout,
                [props.type]: actions.hasOwnProperty(props.type) ? actions[props.type](props) : actions.default(props)
            }
        })

    }

    submit = () => {

        const orderData = this.state.order
        const hasPricing = this.state.order.products.filter( product => product.hasOwnProperty('rates')).length > 0

        window.history.pushState(this.state, null, 'checkout')

        this.sml_ajax({
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

    processCheckout = () => {

        this.sml_ajax({
            data: {
                action: 'sml_checkout',
                checkout: this.state.checkout,
                order: this.state.order
            },
            success: ({errors}) => {

                this.setState({errors: errors})

                if (errors && errors.length) {

                    console.log('errors')

                } else {

                    window.location = '/my-account/orders/'

                }

            }
        })

    }

    sml_ajax = (props) => {

        jQuery.ajax(Object.assign({
            url: sml.ajax_url,
            type: 'post'
        }, {...props}))

    }

    dismissLead = () => {
        this.setState({
            lead: false
        })
    }

    onScroll = e => {

        const lead = document.querySelector('.sml_lead')

        if (! lead) {

            window.onScroll = null

            this.setState({
                ...this.state,
                displayTotal: true
            })

        } else {

            const bounds = lead.getBoundingClientRect()

            if (bounds.bottom < 100 && ! this.state.displayTotal) {

                this.setState({
                    ...this.state,
                    displayTotal: true
                })

            } else if (bounds.bottom >= 100 && this.state.displayTotal) {

                this.setState({
                    ...this.state,
                    displayTotal: false
                })

            }

        }

    }

    render() {

        window.history.replaceState(this.state, null, '')

        return (

            <div id="sml_wrapper">

                <Total display={this.state.displayTotal} total={this.state.order.total} />

                <Errors errors={this.state.errors} />

                <Lead dismiss={this.dismissLead} active={this.state.lead} />

                {this.state.checkout.active ? <Checkout checkout={this.state.checkout} updateCheckout={this.updateCheckout} processCheckout={this.processCheckout} /> : <Order updateAddress={this.updateAddress} validateAddresses={this.validateAddresses} updateQuantity={this.updateQuantity} processCheckout={this.processCheckout} submit={this.submit} addresses={this.state.order.addresses} products={this.state.order.products} date={this.state.order.date} checkout={this.state.checkout} calculateTotal={this.calculateTotal} updateDelivery={this.updateDelivery} deliveryType={this.state.order.delivery} />}

            </div>

        )

    }

}

ReactDOM.render(<App />, document.getElementById('mount'))