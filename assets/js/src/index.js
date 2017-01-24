import React from 'react'
import ReactDOM from 'react-dom'

import Total from './components/total'
import Errors from './components/errors'
import Lead from './components/lead'
import Order from './components/order'
import Checkout from './components/checkout'
import SaveAddress from './components/saveAddress'

import moment from 'moment'

class App extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            lead: true,
            order: {
                date: null,
                addresses: {
                    origin: {},
                    destination: {}
                },
                products: window.sml.products.map( product => {

                    if (! product.hasOwnProperty('quantity'))
                        product.quantity = 0

                    return product

                }),
                shipping: [],
                total: 0,
            },
            stripe: {
                publishableKey: window.sml.stripePublishableKey || false
            },
            displayTotal: false,
            checkout: this.prePopulateDefaults('checkout'),
            errors: [],
            quickPay: false,
            savedLocations: window.sml.savedLocations
        }

    }

    componentDidMount() {

        window.onpopstate = this.popState
        window.onscroll = this.onScroll

    }

    popState = e => {

        this.setState({
            ...JSON.parse(e.state)
        })

    }

    prePopulateDefaults = key => {

        const _defaults = {
            checkout: {
                active: false,
                valid: false,
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
                    },
                    creditCard: {
                        value: '',
                        required: true,
                        removeBeforeSend: true
                    },
                    cvc: {
                        value: '',
                        required: true,
                        removeBeforeSend: true
                    },
                    expMonth: {
                        value: '',
                        required: true,
                        removeBeforeSend: true
                    },
                    expYear: {
                        value: '',
                        required: true,
                        removeBeforeSend: true
                    }
                }
            }
        }

        const defaults = _defaults[key]
        const prePopulate = window.sml[key]

        for (let k = 0; k < Object.keys(prePopulate).length; k++) {

            const key = Object.keys(prePopulate)[k]
            const val = prePopulate[key]

            if (key === '_active') {

                defaults.active = val === 'true'

                continue

            }

            defaults.fields[key].value = val

        }

        return defaults

    }

    updateAddress = (target, value, key) => {

        if (value === '') {

            this.setState({
                order: {
                    ...this.state.order,
                    addresses: {
                        ...this.state.order.addresses,
                        [target]: {}
                    }
                }
            })

        } else if (key === 'all') {

            this.setState({
                order: {
                    ...this.state.order,
                    addresses: {
                        ...this.state.order.addresses,
                        [target]: {
                            ...value
                        }
                    }
                }
            })

        } else if (this.state.order.addresses[target].value !== value) {

            this.setState({
                order: {
                    ...this.state.order,
                    addresses: {
                        ...this.state.order.addresses,
                        [target]: {
                            ...this.state.order.addresses[target],
                            ...this.formatAddress(value, key)
                        }
                    }
                }
            })

        }

        setTimeout(this.validateAddresses, 0)

    }

    formatAddress = (value, key = 'value') => {

        if (typeof value === 'string')
            return {[key]: value}

        const getValueByType = type => value.address_components.filter( ac => ac.types.indexOf(type) > -1).shift()

        return {
            value: value.formatted_address,
            address_1: getValueByType('street_number').long_name + ' ' + getValueByType('route').long_name,
            city: getValueByType('locality').long_name,
            state: getValueByType('administrative_area_level_1') ? getValueByType('administrative_area_level_1').long_name : getValueByType('locality').long_name,
            postcode: getValueByType('postal_code').long_name,
            country: getValueByType('country').long_name,
            countryCode: getValueByType('country').short_name
        }

    }

    validateAddresses = () => {

        const validated = Object.keys(this.state.order.addresses.origin).length > 2 && Object.keys(this.state.order.addresses.destination).length > 2

        if (validated)
            this.requestProductRates()
    }


    requestProductRates = () => {

        this.setState({
            ...this.state,
            fetching: true
        })

        this.sml_ajax({
            data: {
                action: 'sml_product_pricing',
                products: this.state.order.products,
                addresses: this.state.order.addresses
            },
            success: ({shipping}) => {

                this.setState({
                    ...this.state,
                    fetching: false,
                    order: {
                        ...this.state.order,
                        shipping: Object.keys(shipping).map( type => shipping[type])
                    }
                })

                setTimeout(this.updateTotal, 0)

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

    calculateTotal = (type = false) => {

        const rates = this.state.order.shipping.filter( rate => type !== false ? rate.type === type : rate.hasOwnProperty('active') && rate.active === true).shift()

        if (this.state.order.shipping.length && rates) {

            return Math.round(this.state.order.products.reduce( (total, product) => {

                const rate = rates.products.filter( _product => parseInt(_product.id) === parseInt(product.id)).shift()
                const price = rate ? rate.price : 0
                const {quantity} = product

                total += parseFloat(price) * quantity

                return total

            }, 0))

        } else {

            return Math.round(this.state.order.products.reduce( (total, product) => {

                const {price} = product
                const {quantity} = product

                total += parseFloat(price) * quantity

                return total

            }, 0))

        }

    }

    updateDelivery = (type) => {

        this.setState({
            ...this.state,
            order: {
                ...this.state.order,
                shipping: this.state.order.shipping.map( rate => { return {...rate, active: rate.type === type}})
            }
        })

        setTimeout(this.updateTotal, 0)

    }

    updateCheckout = props => {

        this.setState({
            ...this.state,
            checkout: {
                ...this.state.checkout,
                fields: {
                    ...this.state.checkout.fields,
                    [props.type]: {
                        ...this.state.checkout.fields[props.type],
                        ...props
                    }
                },
                valid: this.validateCheckout(props.type, props.value)
            }
        })

        setTimeout(this.validateCheckout, 0)

    }

    submit = () => {

        window.history.pushState(JSON.stringify(this.state), null, 'checkout')

        this.sml_ajax({
            data: {
                action: 'sml_order',
                order: this.state.order,
            },
            success: ({errors}) => {

                if (errors && errors.length) {

                    this.setState({
                        ...this.state,
                        errors: errors
                    })

                } else {

                    if(this.state.quickPay === true) {

                        this.processCheckout()

                    } else {

                        this.setState({
                            ...this.state,
                            checkout: {
                                ...this.state.checkout,
                                active: true
                            }
                        })

                    }
                }

            }
        })

    }

    quickPay = () => {

        this.setState({
            ...this.state,
            quickPay: true
        })

        setTimeout(this.submit, 0)

    }

    setupStripe = () => {

        Stripe.setPublishableKey(this.state.stripe.publishableKey)

        this.setState({
            ...this.state,
            stripe: {
                ...this.state.stripe,
                setup: true
            }
        })

        setTimeout(this.createStripeToken, 0)

    }

    createStripeToken = () => {

        if (this.state.stripe.setup !== true) {

            if (this.state.stripe.publishableKey === false) {

                this.setState({
                    ...this.state,
                    errors: [
                        'There was an error with Stripe, please try again and contact us if the problem persists.'
                    ]
                })

                return

            }

            this.setupStripe()
            return

        }

        Stripe.createToken({
            number: this.state.checkout.fields.creditCard.value,
            cvc: this.state.checkout.fields.cvc.value,
            exp_month: this.state.checkout.fields.expMonth.value,
            exp_year: this.state.checkout.fields.expYear.value
        }, this.updateStripeToken)

    }

    updateStripeToken = (status, response) => {

        if (response.error) {

            this.setState({
                ...this.state,
                errors: response.error
            })

        } else {

            this.setState({
                ...this.state,
                order: {
                    ...this.state.order,
                    stripeToken: response.id
                }
            })

            setTimeout(this.processCheckout, 0)

        }

    }

    processCheckout = () => {

        if (! this.state.order.stripeToken) {

            this.createStripeToken()
            return

        }

        this.sml_ajax({
            data: {
                action: 'sml_checkout',
                checkout: this.filterCheckoutBeforeSend(),
                order: this.state.order,
                stripe_token: this.state.order.stripeToken
            },
            success: ({errors}) => {

                this.setState({errors: errors})

                if (errors && errors.length) {

                } else {

                    window.location = '/my-account/orders/'

                }

            }
        })

    }

    filterCheckoutBeforeSend = () => {

        return {
            ...this.state.checkout,
            fields: Object.keys(this.state.checkout.fields).reduce( (pre, key) => {

                const field = this.state.checkout.fields[key]

                if (! field.hasOwnProperty('removeBeforeSend')) {

                    pre[key] = field

                }

                return pre

            }, {})
        }

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

    updateDeliveryDate = val => {

        this.setState({
            ...this.state,
            order: {
                ...this.state.order,
                date: val !== null ? val.toISOString() : null
            }
        })

    }

    validateCheckout = (key, value) => {

        return Object.keys(this.state.checkout.fields).filter( k => {

                const field = this.state.checkout.fields[k]

                if (key === k) {
                    field.value = value
                }

                return (field.hasOwnProperty('required') && field.required === true) ? field.value.length === 0 : false

            }).length === 0

    }

    saveLocation = (location, value = false, close = false) => {

        const address = this.state.order.addresses[location] || false

        this.setState({
            ...this.state,
            order: {
                ...this.state.order,
                addresses: {
                    ...this.state.order.addresses,
                    [location]: {
                        ...this.state.order.addresses[location],
                        name: value !== false ? value : this.state.order.addresses[location].name,
                        retrieving: ! close
                    }
                }
            }
        })

    }

    render() {

        window.history.replaceState(JSON.stringify(this.state), null, '')

        return (

            <div id="sml_wrapper">

                <Total display={this.state.displayTotal} total={this.state.order.total} />

                <Errors errors={this.state.errors} />

                <Lead dismiss={this.dismissLead} active={this.state.lead} />

                <SaveAddress addresses={this.state.order.addresses} onChange={this.saveLocation} />

                {this.state.checkout.active && ! this.state.fetching && this.state.order.shipping ? <Checkout checkout={this.state.checkout} updateCheckout={this.updateCheckout} processCheckout={this.processCheckout} checkoutValid={this.state.checkout.valid} /> : <Order shipping={this.state.order.shipping} updateAddress={this.updateAddress} validateAddresses={this.validateAddresses} updateQuantity={this.updateQuantity} processCheckout={this.processCheckout} submit={this.submit} addresses={this.state.order.addresses} products={this.state.order.products} deliveryDate={this.state.order.date} checkout={this.state.checkout} calculateTotal={this.calculateTotal} updateDelivery={this.updateDelivery} deliveryType={this.state.order.delivery} quickPay={this.quickPay} fetching={this.state.fetching} leadActive={this.state.lead} updateDeliveryDate={this.updateDeliveryDate} checkoutValid={this.state.checkout.valid} saveLocation={this.saveLocation} savedLocations={this.state.savedLocations} />}

            </div>

        )

    }

}

ReactDOM.render(<App />, document.getElementById('mount'))