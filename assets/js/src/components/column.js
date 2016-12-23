import React from 'react'

const get_column_percent = cols => 100 / cols

const Column = ({columns = 1, width = 1, children = null, style = {}}) => {

    const _width = document.body.clientWidth
    let percent = get_column_percent(columns)

    if ((percent / 100) * _width < 300) {

        percent = 100

    }

    return (

        <div className="sml_col" style={{width: percent * width + '%', display: 'flex', ...style}}>

            {children}

        </div>

    )

}

export default Column