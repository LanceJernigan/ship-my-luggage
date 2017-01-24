import React from 'react'

import Row from './row'

const _style = {

}

const Title = ({title, children}) => title.length > 0 ? children : null

const Content = ({content}) => content ? <Row className="content">{content}</Row> : null

const Footer = ({footer}) => footer ? <Row className="footer">{footer}</Row> : null

const slugger = str => str.replace(/ /g, '_').toLowerCase()

class Options extends React.Component {

    constructor(props) {

        super(props)

        this.state = {
            active: false
        }

    }

    toggleMenu = e => {

        this.setState({
            active: ! this.state.active
        })

    }

    call = option => {

        this.setState({
            active: false
        })

        option.onClick()

    }

    render() {

        const options = this.props.options

        if (options === false || options.constructor !== Array || ! options.length)
            return null

        return (

            <div className={'options' + (this.state.active ? ' options-active' : ' options-inactive')}>

                <div className="close" onClick={this.toggleMenu}></div>

                <div className="icon" onClick={this.toggleMenu}>

                    <div></div>
                    <div></div>
                    <div></div>

                </div>

                <div className='menu'>

                    {options.map( option => {

                        if (! option.hasOwnProperty('onClick'))
                            return null

                        return <div className="menu-item" key={slugger(option.value)} onClick={ e => this.call(option)}>{option.value}</div>

                    })}

                </div>

            </div>

        )

    }

}

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
              onClick = this.props.onClick || false,
              options = this.props.options || false

        const actions = {
            toggle: this.toggleActive
        }

        return (

            <div className={'sml_card ' + slugger(title) + (toggle !== false ? (this.state.active ? ' toggle expanded' : ' toggle condensed') : '') + ' ' + className} style={{..._style, ...style}}>

                <Options options={options} />

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