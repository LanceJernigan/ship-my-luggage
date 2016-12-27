import React from 'react'

const get_column_percent = cols => 100 / cols

const Column = ({className = '', columns = 1, width = 1, minWidth = 300, children = null, style = {}}) => {

    const _width = document.body.clientWidth
    let percent = get_column_percent(columns)

    if (minWidth !== 0 && (percent / 100) * _width < minWidth) {

        percent = 100

    }

    return (

        <div className={'sml_col ' + className} style={{width: percent * width + '%', display: 'flex', ...style}}>

            {children}

        </div>

    )

}

export default Column