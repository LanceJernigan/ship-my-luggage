import React from 'react'

const _style = {
    boxShadow: '0px 2px 3px rgba(0, 0, 0, .2)',
    background: '#fafbfc',
    overflow: 'hidden',
}

const Card = ({children, className = '', style = {}}) => {

    return (

        <div className={'sml_card ' + className} style={{..._style, ...style}}>

            {children}

        </div>

    )

}

export default Card