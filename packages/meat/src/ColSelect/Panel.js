/* eslint-disable react/require-default-props */
import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Select from "./Select";

function noop() {}

class Panel extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
    itemClassName: PropTypes.string,
    activeClassName: PropTypes.string,
    colStyle: PropTypes.object,
    value: PropTypes.array,
    onChange: PropTypes.func,
    onEsc: PropTypes.func,
    addon: PropTypes.func
  };

  static defaultProps = {
    prefixCls: "rc-time-picker-panel",
    onChange: noop,
    colStyle: {},
    addon: noop
  };

  onChange = newValue => {
    const { onChange } = this.props;
    onChange(newValue);
  };

  // https://github.com/ant-design/ant-design/issues/5829
  close() {
    const { onEsc } = this.props;
    onEsc();
  }

  onItemChange = (index, itemValue) => {
    const { onChange, value } = this.props;
    const val = value.map((ele, i) => (i === index ? itemValue : ele));

    onChange(val);
  };

  getOptions(options, index, value) {
    const {
      prefixCls,
      onEsc,
      activeClassName,
      itemClassName,
      colClassName,
      colStyle
    } = this.props;

    return (
      <Select
        key={index}
        prefixCls={prefixCls}
        colStyle={colStyle}
        options={options}
        selectedIndex={options.findIndex(opt => opt.value === value[index])}
        index={index}
        onSelect={this.onItemChange}
        onEsc={onEsc}
        colClassName={colClassName}
        itemClassName={itemClassName}
        activeClassName={activeClassName}
      />
    );
  }

  render() {
    const { prefixCls, className, addon, value, optionsList } = this.props;

    return (
      <div className={classNames(className, `${prefixCls}-inner`)}>
        <div className={`${prefixCls}-combobox`}>
          {optionsList.map((options, index) =>
            this.getOptions(options, index, value)
          )}
        </div>
        {addon(this)}
      </div>
    );
  }
}

export default Panel;
