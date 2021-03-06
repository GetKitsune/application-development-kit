import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BaseChild from "./child";
import Triangle from '../../../../images/triangle_dropdown-grey.svg';

class BaseGroup extends Component {
	constructor (props) {
		super(props);
		this.renderNodes = this.renderNodes.bind(this);
		this.toggleCollapse = this.toggleCollapse.bind(this);
		this.state = {
			isCollapsed: false
		}
	}

	toggleCollapse() {
		const { isCollapsed } = this.state;
		this.setState({ isCollapsed: !isCollapsed });
	}

	renderNodes(props, name) {
		const { helpers, readOnly, parent } = this.props;
		// when node doesn't belong to any property-group
		if(name === 'unnamed') {
			return (
				<ul className='node-collection'>
					{
						props.map((property, index) =>
							<BaseChild parent={parent} property={property} key={index} helpers={helpers} readOnly={readOnly} />)
					}
				</ul>
			);
		} else {
			const { isCollapsed } = this.state;
			if(isCollapsed && props.length === 1) {
				this.toggleCollapse();
			}
			const isCollapsible = props.length > 1;
			return (
				<ul className={`node-group${isCollapsed ? ' collapsed' : ''}`}
					onClick={isCollapsed && isCollapsible? this.toggleCollapse : null}
					title={isCollapsed && isCollapsible ? 'click to expand' : null}>
					<div className='group-meta'
						onClick={isCollapsible ? this.toggleCollapse : null}
						title={isCollapsible? (isCollapsed ? 'click to expand' : 'click to collapse') : null}>
						<p>
							<span className='group-name'>{name} </span>
							{/* <span className='group-length'>
							({props.length} {props.length > 1 ? 'properties' : 'property'})</span> */
							}
						</p>
						{isCollapsible ? <img src={Triangle} /> : null}
					</div>
					{
						props.map((property, index) => (
							(!isCollapsed || (isCollapsed && !index)) ?
								<BaseChild parent={parent} property={property} key={index} helpers={helpers} readOnly={readOnly} />
								:  null
						))
					}
				</ul>
			);
		}
	}

	render() {
		const { groupProps, groupName } = this.props;
		return this.renderNodes(groupProps, groupName);
	}
}

BaseGroup.propTypes = {
	parent: PropTypes.string,
	groupProps: PropTypes.array,
	groupName: PropTypes.string,
	helpers: PropTypes.object,
	readOnly: PropTypes.bool
};

export default BaseGroup;
