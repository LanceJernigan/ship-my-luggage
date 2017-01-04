import React from 'react'

import Row from './row'

const _style = {
    width: '100%',
    boxShadow: '0px 2px 3px rgba(0, 0, 0, .2)',
    background: '#fafbfc',
    overflow: 'hidden',
    zIndex: '1',
}

const Title = ({title, children}) => title.length > 0 ? children : null

const Content = ({content}) => content ? <Row className="content">{content}</Row> : null

const Footer = ({footer}) => footer ? <Row className="footer">{footer}</Row> : null

const slugger = str => str.replace(' ', '_').toLowerCase()

class Card extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            active: props.active || false
        }

    }

    toggleActive = e => {

        this.setState({
            active: ! this.state.active
        })

    }

    render() {

        const title = this.props.title || '',
              content = this.props.content || '',
              className = this.props.className || '',
              style = this.props.style || {},
              children = this.props.children || null,
              toggle = this.props.toggle || false,
              accent = this.props.accent || false,
              footer = this.props.footer || false,
              onClick = this.props.onClick || false

        const actions = {
            toggle: this.toggleActive
        }

        return (

            <div className={'sml_card ' + slugger(title) + (this.state.active ? ' expanded' : ' condensed') + ' ' + className} style={{..._style, ...style}}>

                <div className="tap-target" onClick={actions.hasOwnProperty(onClick) ? actions[onClick] : onClick}>

                    <Title title={title}>

                        <Row className="title">

                            <h4 style={accent && accent.length ? {color: accent} : {}}>{title}</h4>

                        </Row>

                    </Title>

                    <Content content={content} />

                    {children}

                </div>

                <Footer footer={footer} />

            </div>

        )

    }

}

export default Card