import React from 'react'
import ReactDOM from 'react-dom'

import Errors from './components/errors'
import Lead from './components/lead'

const style = {
    width: '100%',
    maxWidth: '1080px',
    margin: 'auto',
    paddingTop: '15px'
}

class App extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
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

    render() {

        return (

            <div id="sml_wrapper" style={style}>

                <Errors errors={this.state.errors} />

                <Lead />

            </div>

        )

    }

}

ReactDOM.render(<App />, document.getElementById('mount'))