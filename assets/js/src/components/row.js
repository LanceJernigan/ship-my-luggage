import React from 'react'

const _style = {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between'
}

const Row = ({className = '', style = {}, children = null}) => {

    return (

        <div className={'sml_row ' + className} style={{..._style, ...style}}>

            {children}

        </div>

    )

}

export default Row