/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/require-default-props */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable no-return-assign */
/* eslint-disable no-underscore-dangle */
import React from "react";
import { throttle, debounce } from "lodash";
import ResizeObserver from "resize-observer-polyfill";
import PropTypes from "prop-types";
import "./styles/less/image-gallery.less";

export default class ImageGallery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentIndex: props.startIndex,
      isTransitioning: false,
      thumbnailsWrapperWidth: 0,
      thumbnailsWrapperHeight: 0
    };

    // Used to update the throttle if slideDuration changes
    this._unthrottledSlideToIndex = this.slideToIndex;
    this.slideToIndex = throttle(
      this._unthrottledSlideToIndex,
      props.slideDuration,
      { trailing: false }
    );
    this.preStep = props.step;
    this.nextStep = props.step;
  }

  static propTypes = {
    items: PropTypes.array.isRequired,
    infinite: PropTypes.bool,
    defaultImage: PropTypes.string,
    thumbnailPosition: PropTypes.string,
    startIndex: PropTypes.number,
    onThumbnailError: PropTypes.func,
    onThumbnailClick: PropTypes.func,
    renderLeftNav: PropTypes.func,
    renderRightNav: PropTypes.func,
    additionalClass: PropTypes.string,
    useTranslate3D: PropTypes.bool,
    isRTL: PropTypes.bool,
    step: PropTypes.number
  };

  static defaultProps = {
    items: [],
    infinite: false,
    useTranslate3D: true,
    isRTL: false,
    thumbnailPosition: "bottom",
    startIndex: 0,
    step: 1,
    renderLeftNav: (onClick, disabled) => (
      <button
        type="button"
        className="image-gallery-left-nav"
        disabled={disabled}
        onClick={onClick}
        aria-label="Previous Slide"
      />
    ),
    renderRightNav: (onClick, disabled) => (
      <button
        type="button"
        className="image-gallery-right-nav"
        disabled={disabled}
        onClick={onClick}
        aria-label="Next Slide"
      />
    )
  };

  componentDidUpdate(prevProps) {
    const itemsChanged = prevProps.items.length !== this.props.items.length;
    if (itemsChanged) {
      this._handleResize();
    }

    if (prevProps.slideDuration !== this.props.slideDuration) {
      this.slideToIndex = throttle(
        this._unthrottledSlideToIndex,
        this.props.slideDuration,
        { trailing: false }
      );
    }
  }

  componentWillUnmount() {
    if (this._intervalId) {
      window.clearInterval(this._intervalId);
      this._intervalId = null;
    }

    if (this.resizeObserver && this._imageGallerySlideWrapper) {
      this.resizeObserver.unobserve(this._imageGallerySlideWrapper);
    }

    if (this._transitionTimer) {
      window.clearTimeout(this._transitionTimer);
    }

    if (this._createResizeObserver) {
      this._createResizeObserver();
    }
  }

  getCurrentIndex() {
    return this.state.currentIndex;
  }

  slideToIndex = index => {
    const { currentIndex, isTransitioning } = this.state;

    if (!isTransitioning) {
      const slideCount = this.props.items.length - 1;
      let nextIndex = index;

      if (index < 0) {
        nextIndex = slideCount;
      } else if (index > slideCount) {
        nextIndex = 0;
      }

      this.setState(
        {
          currentIndex: nextIndex,
          isTransitioning: nextIndex !== currentIndex,
          style: {
            transition: `all ${this.props.slideDuration}ms ease-out`
          }
        },
        this._onSliding
      );
    }
  };

  _onSliding = () => {
    const { isTransitioning } = this.state;
    this._transitionTimer = window.setTimeout(() => {
      if (isTransitioning) {
        this.setState({ isTransitioning: !isTransitioning });
        if (this.props.onSlide) {
          this.props.onSlide(this.state.currentIndex);
        }
      }
    }, this.props.slideDuration + 50);
  };

  _initGalleryResizing = element => {
    /*
      When image-gallery-slide-wrapper unmounts and mounts when thumbnail bar position is changed
      ref is called twice, once with null and another with the element.
      Make sure element is available before calling observe.
    */
    if (element) {
      this._imageGallerySlideWrapper = element;
      this.resizeObserver = new ResizeObserver(this._createResizeObserver);
      this.resizeObserver.observe(element);
    }
  };

  _createResizeObserver = debounce(entries => {
    if (!entries) return;
    entries.forEach(() => {
      this._handleResize();
    });
  }, 300);

  _handleResize = () => {
    if (this._imageGallerySlideWrapper) {
      this.setState({
        gallerySlideWrapperHeight: this._imageGallerySlideWrapper.offsetHeight
      });
    }

    if (this._thumbnailsWrapper) {
      if (this._isThumbnailVertical()) {
        this.setState({
          thumbnailsWrapperHeight: this._thumbnailsWrapper.offsetHeight
        });
      } else {
        this.setState({
          thumbnailsWrapperWidth: this._thumbnailsWrapper.offsetWidth
        });
      }
    }

    // Adjust thumbnail container when thumbnail width or height is adjusted
    this.forceUpdate();
  };

  _isThumbnailVertical() {
    const { thumbnailPosition } = this.props;
    return thumbnailPosition === "left" || thumbnailPosition === "right";
  }

  _handleImageError = event => {
    if (
      this.props.defaultImage &&
      event.target.src.indexOf(this.props.defaultImage) === -1
    ) {
      event.target.src = this.props.defaultImage;
    }
  };

  canNavigate() {
    const { thumbnailsWrapperWidth, thumbnailsWrapperHeight } = this.state;
    if (this._thumbnails) {
      if (this._isThumbnailVertical()) {
        return this._thumbnails.scrollHeight > thumbnailsWrapperHeight;
      }
      return this._thumbnails.scrollWidth > thumbnailsWrapperWidth;
    }
    return false;
  }

  _canSlideLeft() {
    return (
      this.props.infinite ||
      (this.props.isRTL ? this._canSlideNext() : this._canSlidePrevious())
    );
  }

  _canSlideRight() {
    return (
      this.props.infinite ||
      (this.props.isRTL ? this._canSlidePrevious() : this._canSlideNext())
    );
  }

  _canSlidePrevious() {
    return this.state.currentIndex - this.preStep > -1;
  }

  _canSlideNext() {
    return this.state.currentIndex + this.nextStep < this.props.items.length;
  }

  _getThumbsTranslate(currentIndex) {
    const { thumbnailsWrapperWidth, thumbnailsWrapperHeight } = this.state;
    let totalScroll;

    if (this._thumbnails) {
      const { items, step } = this.props;
      const len = items.length;
      const current = this._thumbnails.children[currentIndex];
      // total scroll required to see the last thumbnail
      if (this._isThumbnailVertical()) {
        if (this._thumbnails.scrollHeight <= thumbnailsWrapperHeight) {
          return 0;
        }
        totalScroll = -current.offsetTop;
      } else {
        const scrollWidth = this._thumbnails.scrollWidth;
        if (
          scrollWidth <= thumbnailsWrapperWidth ||
          thumbnailsWrapperWidth <= 0
        ) {
          return 0;
        }

        if (current.offsetLeft + thumbnailsWrapperWidth > scrollWidth) {
          totalScroll = scrollWidth - thumbnailsWrapperWidth;
          const preItemIndex =
            len -
            Array.prototype.slice
              .call(this._thumbnails.children)
              .reverse()
              .findIndex(
                item => item.offsetLeft + thumbnailsWrapperWidth <= scrollWidth
              ) -
            1;
          this.preStep = currentIndex - preItemIndex;
          this.nextStep = len - currentIndex;
        } else {
          totalScroll = current.offsetLeft;
          this.preStep = step;
          this.nextStep = step;
        }
      }

      return -totalScroll;
    }
  }

  _getThumbnailBarHeight() {
    if (this._isThumbnailVertical()) {
      return {
        height: this.state.gallerySlideWrapperHeight
      };
    }
    return {};
  }

  _getThumbnailStyle() {
    let translate;
    const { useTranslate3D, isRTL } = this.props;
    const { currentIndex } = this.state;
    const thumbsTranslate = this._getThumbsTranslate(currentIndex);
    const verticalTranslateValue = isRTL
      ? thumbsTranslate * -1
      : thumbsTranslate;

    if (this._isThumbnailVertical()) {
      translate = `translate(0, ${thumbsTranslate}px)`;
      if (useTranslate3D) {
        translate = `translate3d(0, ${thumbsTranslate}px, 0)`;
      }
    } else {
      translate = `translate(${verticalTranslateValue}px, 0)`;
      if (useTranslate3D) {
        translate = `translate3d(${verticalTranslateValue}px, 0, 0)`;
      }
    }
    return {
      WebkitTransform: translate,
      MozTransform: translate,
      msTransform: translate,
      OTransform: translate,
      transform: translate
    };
  }

  _slideLeft = () => {
    this.props.isRTL ? this._slideNext() : this._slidePrevious();
  };

  _slideRight = () => {
    this.props.isRTL ? this._slidePrevious() : this._slideNext();
  };

  _slidePrevious = event => {
    this.slideToIndex(this.state.currentIndex - this.preStep, event);
  };

  _slideNext = event => {
    this.slideToIndex(this.state.currentIndex + this.nextStep, event);
  };

  _renderThumbInner = item => {
    const onThumbnailError =
      this.props.onThumbnailError || this._handleImageError;

    return (
      <div className="image-gallery-thumbnail-inner">
        <img
          src={item.thumbnail}
          alt={item.thumbnailAlt}
          title={item.thumbnailTitle}
          onError={onThumbnailError}
        />
        {item.thumbnailLabel && (
          <div className="image-gallery-thumbnail-label">
            {item.thumbnailLabel}
          </div>
        )}
      </div>
    );
  };

  _onThumbnailClick = (event, index) => {
    this.slideToIndex(index, event);
    if (this.props.onThumbnailClick) {
      this.props.onThumbnailClick(event, index);
    }
  };

  render() {
    const { isRTL, thumbnailClass } = this.props;

    const thumbnailStyle = this._getThumbnailStyle();

    const slideLeft = this._slideLeft;
    const slideRight = this._slideRight;

    const thumbnails = [];

    this.props.items.forEach((item, index) => {
      const tc = item.thumbnailClass || thumbnailClass;
      const thumbnailClazz = tc ? ` ${tc}` : "";

      const renderThumbInner =
        item.renderThumbInner ||
        this.props.renderThumbInner ||
        this._renderThumbInner;

      thumbnails.push(
        <div
          key={index}
          className={"image-gallery-thumbnail" + thumbnailClazz}
          onClick={event => this._onThumbnailClick(event, index)}
        >
          {renderThumbInner(item)}
        </div>
      );
    });

    const classNames = ["image-gallery", this.props.additionalClass]
      .filter(name => typeof name === "string")
      .join(" ");

    return (
      <div className={classNames} aria-live="polite">
        <div
          ref={this._initGalleryResizing}
          className={`image-gallery-thumbnails-wrapper ${!this._isThumbnailVertical() &&
          isRTL
            ? "thumbnails-wrapper-rtl"
            : ""}`}
          style={this._getThumbnailBarHeight()}
        >
          {this.canNavigate() &&
            this.props.renderLeftNav(slideLeft, !this._canSlideLeft())}
          <div
            className="image-gallery-thumbnails"
            ref={i => (this._thumbnailsWrapper = i)}
          >
            <div
              ref={t => (this._thumbnails = t)}
              className="image-gallery-thumbnails-container"
              style={thumbnailStyle}
              aria-label="Thumbnail Navigation"
            >
              {thumbnails}
            </div>
          </div>
          {this.canNavigate() &&
            this.props.renderRightNav(slideRight, !this._canSlideRight())}
        </div>
      </div>
    );
  }
}
