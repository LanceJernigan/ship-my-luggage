import React from 'react'

import Row from './row'

const Content = props => <Row {...props} className={'content' + (props.className ? ' ' + props.className : '')}></Row>

export default Content