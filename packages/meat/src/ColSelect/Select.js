/* eslint-disable no-param-reassign */
/* eslint-disable react/require-default-props */
/* eslint jsx-a11y/no-noninteractive-element-to-interactive-role: 0 */
import React, { Component } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import PropTypes from "prop-types";
import classNames from "classnames";
import raf from "raf";

const scrollTo = (element, to, duration) => {
  // jump to target if duration zero
  if (duration <= 0) {
    raf(() => {
      element.scrollTop = to;
    });
    return;
  }
  const difference = to - element.scrollTop;
  const perTick = difference / duration * 10;

  raf(() => {
    element.scrollTop += perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  });
};

class Select extends Component {
  static propTypes = {
    itemClassName: PropTypes.string,
    activeClassName: PropTypes.string,
    colStyle: PropTypes.object,
    prefixCls: PropTypes.string,
    options: PropTypes.array,
    selectedIndex: PropTypes.number,
    index: PropTypes.number,
    onSelect: PropTypes.func,
    onEsc: PropTypes.func
  };

  state = {
    active: false
  };

  componentDidMount() {
    // jump to selected option
    this.scrollToSelected(0);
  }

  componentDidUpdate(prevProps) {
    const { selectedIndex } = this.props;
    // smooth scroll to selected option
    if (prevProps.selectedIndex !== selectedIndex) {
      this.scrollToSelected(120);
    }
  }

  onSelect = value => () => {
    const { onSelect, index } = this.props;
    onSelect(index, value);
  };

  getOptions() {
    const {
      options,
      selectedIndex,
      prefixCls,
      onEsc,
      itemClassName,
      activeClassName
    } = this.props;
    return options.map((item, index) => {
      const cls = classNames(itemClassName, {
        [`${prefixCls}-select-option-selected`]: selectedIndex === index,
        [activeClassName]: selectedIndex === index,
        [`${prefixCls}-select-option-disabled`]: item.disabled
      });
      const onClick = item.disabled ? undefined : this.onSelect(item.value);
      const onKeyDown = e => {
        if (e.keyCode === 13) onClick();
        else if (e.keyCode === 27) onEsc();
      };

      return (
        <li
          role="button"
          onClick={onClick}
          className={cls}
          key={index}
          disabled={item.disabled}
          tabIndex="0"
          onKeyDown={onKeyDown}
        >
          {item.label || item.value}
        </li>
      );
    });
  }

  saveList = node => {
    this.list = node;
  };

  saveContainer = node => {
    this.container = node;
  };

  scrollToSelected(duration) {
    // move to selected item
    const { selectedIndex } = this.props;
    const select = this.container;
    const list = this.list;
    if (!list) {
      return;
    }
    let index = selectedIndex;
    if (index < 0) {
      index = 0;
    }
    const topOption = list.children[index];
    const to = topOption.offsetTop;
    scrollTo(select, to, duration);
  }

  render() {
    const { prefixCls, options, colClassName, colStyle } = this.props;
    const { active } = this.state;
    if (options.length === 0) {
      return null;
    }
    const cls = classNames(colClassName, `${prefixCls}-select`, {
      [`${prefixCls}-select-active`]: active
    });
    return (
      <div ref={this.saveContainer} className={cls}>
        <Scrollbars autoHeight style={colStyle}>
          <ul ref={this.saveList}>{this.getOptions()}</ul>
        </Scrollbars>
      </div>
    );
  }
}

export default Select;
