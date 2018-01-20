/*
 * Copyright (c) 2017 Tom Keffer <tkeffer@gmail.com>
 *
 *  See the file LICENSE for your full rights.
 *
 */
// Render and format a packet
import React from 'react';
import PropTypes from 'prop-types';

import ObsLabel from './ObsLabel';
import ObsValue from './ObsValue';

class ObsRow extends React.Component {
    render() {
        return (<tr>
            <ObsLabel componentClass={'td'} {...this.props}/>
            <ObsValue componentClass={'td'} {...this.props}/>
        </tr>);
    }
}

export default class PacketGroup extends React.Component {
    render() {
        const {obsTypes, header, ...props} = this.props;
        return (
            <div>
                {header}
                <table>
                    <tbody>
                    {/* Include a key. See https://reactjs.org/docs/reconciliation.html#keys */}
                    {obsTypes.map((obsType, i) => <ObsRow key={i} obsType={obsType} {...props}/>)}
                    </tbody>
                </table>
            </div>
        );
    }
}

PacketGroup.propTypes = {
    header  : PropTypes.string,
    obsTypes: PropTypes.arrayOf(PropTypes.string).isRequired
};

PacketGroup.defaultProps = {
    header: "Current Values"
};