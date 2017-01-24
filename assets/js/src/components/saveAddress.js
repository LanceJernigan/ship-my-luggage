import React from 'react'

import Card from './card'
import Row from './row'
import Column from './column'

const SaveAddress = ({addresses, onChange}) => {

    const retrieving = Object.keys(addresses).filter( key => {

        const address = addresses[key]

        return (address.hasOwnProperty('retrieving') && (address.retrieving !== false && address.retrieving !== 'false'))

    })

    if (retrieving.length === 0)
        return null

    const key = retrieving.shift()
    const address = addresses[key]

    return (

        <div className="save_address" onClick={e => e.target === e.currentTarget ? onChange(key, address.name, true) : false}>

            <Card accent="#2b9bd2" title="Location Name" content={<p>The name of this location.</p>} style={{maxWidth: '400px', margin: 'auto'}}>

                <div className="footer">

                    <input autoFocus placeholder="Name" type="text" value={address.name} onChange={e => onChange(key, e.currentTarget.value)} onKeyPress={e => e.key === 'Enter' ? onChange(key, address.name, true) : false} />

                    <div className="send" onClick={e => onChange(key, address.name, true)} ><p>Save</p></div>

                </div>

            </Card>

        </div>

    )

}

export default SaveAddress