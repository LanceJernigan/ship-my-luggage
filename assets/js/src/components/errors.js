import React from 'react'

const build_errors = (errors) => {

    if (errors.length) {

        let errorList = errors.map( (err, i) => {

            return (

                <div className="sml_error" key={'sml_err_' + i}>

                    <p>{err}</p>

                </div>

            )

        })

        return (

            <div className="sml_errors">

                {errorList}

            </div>

        )

    } else {

        return null

    }

}

const Errors = ({errors}) => build_errors(errors)

export default Errors