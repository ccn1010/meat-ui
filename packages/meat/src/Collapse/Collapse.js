import React from "react";
import injectSheet from 'react-jss'

export default class ImageGallery extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.defaultShow
        };
    }

    render(){
        const {component: Component, header, children, show, defaultShow} = this.props;
        const ifShow = show === undefined ? this.state.show : show;
        <Component>
            {header}
            <div>
            {
                children
            }
            </div>
        </Component>
    }
}