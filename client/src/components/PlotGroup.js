/*
 * Copyright (c) 2016-2018 Tom Keffer <tkeffer@gmail.com>
 *
 * See the file LICENSE for your full rights.
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/moment';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer} from 'recharts';

import * as units from '../units';

const propTypes = {
    isFetching       : PropTypes.bool.isRequired,
    packets          : PropTypes.arrayOf(PropTypes.object).isRequired,
    obsTypes         : PropTypes.arrayOf(PropTypes.string),
    header           : PropTypes.string,
    xDomain          : PropTypes.array,
    xTicks           : PropTypes.arrayOf(PropTypes.number),
    xTickFormat      : PropTypes.string,
    animationDuration: PropTypes.number,
    dot              : PropTypes.bool,
    width            : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height           : PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    margin           : PropTypes.shape({
                                           top   : PropTypes.number,
                                           right : PropTypes.number,
                                           left  : PropTypes.number,
                                           bottom: PropTypes.number,
                                       }),
    stroke           : PropTypes.string,
    strokeWidth      : PropTypes.number,
    debounce         : PropTypes.number,
    componentClass   : PropTypes.string,
};

const defaultProps = {
    obsTypes         : ["wind_speed", "out_temperature", "in_temperature", "radiation_radiation", "sealevel_pressure",],
    header           : "Need a header!",
    xDomain          : ['auto', 'auto'],
    xTickFormat      : 'lll',
    animationDuration: 500,
    dot              : false,
    width            : "95%",
    height           : 200,
    margin           : {top: 5, right: 10, left: 10, bottom: 5},
    stroke           : '#8884d8',
    strokeWidth      : 2,
    debounce         : 200,
    componentClass   : 'div',
};

export default class PlotGroup extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state        = {selectedDetail: 5};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(nextSelectedDetail) {
        this.setState({selectedDetail: nextSelectedDetail});
    }

    render() {
        const {
                  isFetching,
                  packets,
                  obsTypes,
                  header,
                  xDomain,
                  xTicks,
                  xTickFormat,
                  animationDuration,
                  dot,
                  width,
                  height,
                  margin,
                  stroke,
                  strokeWidth,
                  debounce,
                  componentClass: Component,
              } = this.props;


        const timeFormatter = (tick) => {return moment(tick).format(xTickFormat);};

        return (
            <Component>
                {isFetching && !packets && <h3>Loading...</h3>}
                {!isFetching && !packets && <h3>Empty.</h3>}
                {packets &&
                 <div style={{opacity: isFetching ? 0.5 : 1}}>

                     <h3>{header}</h3>

                     {obsTypes.map((obsType, i) => {
                         return (
                             <div key={obsType}>
                                 <h4>{units.getLabel(obsType)}</h4>
                                 <ResponsiveContainer width={width} height={height} debounce={debounce}>
                                     <LineChart
                                         data={packets}
                                         margin={margin}>
                                         <XAxis
                                             dataKey='timestamp'
                                             domain={xDomain}
                                             scale='time'
                                             type='number'
                                             ticks={xTicks}
                                             tickFormatter={timeFormatter}
                                         />
                                         <YAxis
                                             domain={['auto', 'auto']}
                                         />
                                         <CartesianGrid
                                             strokeDasharray='3 3'
                                         />
                                         <Tooltip
                                             labelFormatter={timeFormatter}
                                         />
                                         <Line type='linear'
                                               dataKey={obsType}
                                               stroke={stroke}
                                               dot={dot}
                                               isAnimationActive={false}
                                               animationDuration={animationDuration}
                                               animationEasing='linear'
                                               strokeWidth={strokeWidth}
                                         />
                                     </LineChart>
                                 </ResponsiveContainer>
                             </div>
                         );
                     })}
                 </div>}
            </Component>
        );
    }
}

PlotGroup.propTypes    = propTypes;
PlotGroup.defaultProps = defaultProps;
