import React from 'react'
import ReactDOM from 'react-dom'

import Errors from './components/errors'

class App extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            order: {},
            errors: []
        }

    }

    submit = () => {

        const orderData = 'Ye ye'

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

            <div id="sml_wrapper">

                <Errors errors={this.state.errors} />

                <h1 onClick={this.submit}>Submit</h1>

            </div>

        )

    }

}

ReactDOM.render(<App />, document.getElementById('mount'))