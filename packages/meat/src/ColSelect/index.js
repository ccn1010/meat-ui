/* eslint-disable react/require-default-props */
/* eslint jsx-a11y/no-autofocus: 0 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import Trigger from "rc-trigger";
import classNames from "classnames";
import Panel from "./Panel";
import placements from "./placements";
import "./assets/index.global.less";

function noop() {}

function refFn(field, component) {
  this[field] = component;
}

export default class Picker extends Component {
  static propTypes = {
    prefixCls: PropTypes.string,
    clearText: PropTypes.string,
    value: PropTypes.array,
    optionsList: PropTypes.array,
    notMatch: PropTypes.array,
    inputReadOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    allowEmpty: PropTypes.bool,
    defaultValue: PropTypes.array,
    open: PropTypes.bool,
    defaultOpen: PropTypes.bool,
    align: PropTypes.object,
    placement: PropTypes.any,
    transitionName: PropTypes.string,
    getPopupContainer: PropTypes.func,
    placeholder: PropTypes.string,
    style: PropTypes.object,
    colStyle: PropTypes.object,
    className: PropTypes.string,
    openClassName: PropTypes.string,
    popupClassName: PropTypes.string,
    hideDisabledOptions: PropTypes.bool,
    onChange: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    addon: PropTypes.func,
    name: PropTypes.string,
    focusOnOpen: PropTypes.bool,
    onKeyDown: PropTypes.func,
    autoFocus: PropTypes.bool,
    id: PropTypes.string,
    inputIcon: PropTypes.node,
    clearIcon: PropTypes.node,
    disableClear: PropTypes.bool,
    itemClassName: PropTypes.string,
    activeClassName: PropTypes.string,
    colClassName: PropTypes.string
  };

  static defaultProps = {
    clearText: "clear",
    prefixCls: "rc-time-picker",
    defaultOpen: false,
    inputReadOnly: false,
    style: {},
    colStyle: {},
    className: "",
    popupClassName: "",
    id: "",
    align: {},
    optionsList: [],
    notMatch: [],
    allowEmpty: true,
    hideDisabledOptions: false,
    placement: "bottomLeft",
    onChange: noop,
    onOpen: noop,
    onClose: noop,
    onFocus: noop,
    onBlur: noop,
    addon: noop,
    focusOnOpen: false,
    onKeyDown: noop,
    disableClear: true,
    itemClassName: "",
    activeClassName: "",
    openClassName: "",
    colClassName: ""
  };

  constructor(props) {
    super(props);
    this.saveInputRef = refFn.bind(this, "picker");
    this.savePanelRef = refFn.bind(this, "panelInstance");
    const {
      defaultOpen,
      defaultValue,
      open = defaultOpen,
      value = defaultValue
    } = props;
    this.state = {
      open,
      value
    };
  }

  componentWillReceiveProps(nextProps) {
    const { value, open } = nextProps;
    if ("value" in nextProps) {
      this.setState({
        value
      });
    }
    if (open !== undefined) {
      this.setState({ open });
    }
  }

  onPanelChange = value => {
    this.setValue(value);
  };

  onClear = event => {
    event.stopPropagation();
    this.setValue(null);
    this.setOpen(false);
  };

  onVisibleChange = open => {
    this.setOpen(open);
  };

  onEsc = () => {
    this.setOpen(false);
    this.focus();
  };

  onKeyDown = e => {
    if (e.keyCode === 40) {
      this.setOpen(true);
    }
  };

  setValue(value) {
    const { onChange } = this.props;
    if (!("value" in this.props)) {
      this.setState({
        value
      });
    }
    onChange(value);
  }

  getPanelElement() {
    const {
      prefixCls,
      placeholder,
      hideDisabledOptions,
      inputReadOnly,
      optionsList,
      addon,
      focusOnOpen,
      onKeyDown,
      itemClassName,
      activeClassName,
      colStyle,
      colClassName
    } = this.props;
    const { value } = this.state;
    return (
      <Panel
        prefixCls={`${prefixCls}-panel`}
        ref={this.savePanelRef}
        value={value}
        optionsList={optionsList}
        inputReadOnly={inputReadOnly}
        onChange={this.onPanelChange}
        onEsc={this.onEsc}
        placeholder={placeholder}
        hideDisabledOptions={hideDisabledOptions}
        addon={addon}
        focusOnOpen={focusOnOpen}
        onKeyDown={onKeyDown}
        colStyle={colStyle}
        colClassName={colClassName}
        itemClassName={itemClassName}
        activeClassName={activeClassName}
      />
    );
  }

  getPopupClassName() {
    const { prefixCls, popupClassName, optionsList } = this.props;
    const selectColumnCount = optionsList.length;
    // Keep it for old compatibility
    return classNames(
      popupClassName,
      `${prefixCls}-panel-column-${selectColumnCount}`
    );
  }

  setOpen(open) {
    const { onOpen, onClose } = this.props;
    const { open: currentOpen } = this.state;
    if (currentOpen !== open) {
      if (!("open" in this.props)) {
        this.setState({ open });
      }
      if (open) {
        onOpen({ open });
      } else {
        onClose({ open });
      }
    }
  }

  focus() {
    this.picker.focus();
  }

  blur() {
    this.picker.blur();
  }

  renderClearButton() {
    const { value } = this.state;
    const {
      prefixCls,
      allowEmpty,
      clearIcon,
      clearText,
      disabled,
      disableClear
    } = this.props;
    if (!allowEmpty || !value || disabled || disableClear) {
      return null;
    }

    if (React.isValidElement(clearIcon)) {
      const { onClick } = clearIcon.props || {};
      return React.cloneElement(clearIcon, {
        onClick: (...args) => {
          if (onClick) onClick(...args);
          this.onClear(...args);
        }
      });
    }

    return (
      <a
        role="button"
        className={`${prefixCls}-clear`}
        title={clearText}
        onClick={this.onClear}
        tabIndex={0}
      >
        {clearIcon || <i className={`${prefixCls}-clear-icon`} />}
      </a>
    );
  }

  render() {
    const {
      prefixCls,
      placeholder,
      placement,
      align,
      id,
      disabled,
      transitionName,
      style,
      className,
      openClassName,
      getPopupContainer,
      name,
      onFocus,
      onBlur,
      autoFocus,
      inputReadOnly,
      inputIcon,
      optionsList,
      notMatch
    } = this.props;
    const { open, value = [] } = this.state;
    const popupClassName = this.getPopupClassName();
    let labels = [...value];
    value.forEach((item, index) => {
      const opts = optionsList[index] || [];
      const option = opts.find(opt => opt.value === item);
      if (option) {
        if (option.label) {
          labels[index] = option.label;
        }
      } else if (notMatch && notMatch[index]) {
        labels[index] = notMatch[index];
      }
    });
    labels = labels.filter(label => label !== undefined && label !== null);

    return (
      <Trigger
        prefixCls={`${prefixCls}-panel`}
        popupClassName={popupClassName}
        popup={this.getPanelElement()}
        popupAlign={align}
        builtinPlacements={placements}
        popupPlacement={placement}
        action={disabled ? [] : ["click"]}
        destroyPopupOnHide
        getPopupContainer={getPopupContainer}
        popupTransitionName={transitionName}
        popupVisible={open}
        onPopupVisibleChange={this.onVisibleChange}
      >
        <span className={prefixCls} style={style}>
          <input
            className={classNames(`${prefixCls}-input`, className, {
              [openClassName]: open
            })}
            ref={this.saveInputRef}
            type="text"
            placeholder={placeholder}
            name={name}
            onKeyDown={this.onKeyDown}
            disabled={disabled}
            value={labels.join(" ")}
            onFocus={onFocus}
            onBlur={onBlur}
            autoFocus={autoFocus}
            onChange={noop}
            readOnly={!!inputReadOnly}
            id={id}
          />
          {inputIcon || <span className={`${prefixCls}-icon`} />}
          {this.renderClearButton()}
        </span>
      </Trigger>
    );
  }
}

// XXX 测试用代码

// import TagsInput from 'react-tagsinput'
// import 'react-tagsinput/react-tagsinput.css'
// class Example extends React.Component {
//   constructor() {
//     super()
//     this.state = {tags: []}
//   }

//   handleChange(tags) {
//     this.setState({tags})
//   }

//   render() {
//     return <TagsInput value={this.state.tags} onChange={::this.handleChange} />
//   }
// }

// export default Example;
