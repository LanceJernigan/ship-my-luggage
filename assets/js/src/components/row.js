import React from 'react'

const style = {
    display: 'flex',
    flexWrap: 'wrap',
}

const Row = ({children = null}) => {

    return (

        <div className="sml_row" style={style}>

            {children}

        </div>

    )

}

export default Row