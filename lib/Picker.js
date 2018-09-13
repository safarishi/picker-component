'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _betterScroll = require('better-scroll');

var _betterScroll2 = _interopRequireDefault(_betterScroll);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _immer = require('immer');

var _immer2 = _interopRequireDefault(_immer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * props.isLinkage 是否为省[市[区]]三级联动
 * props.defualts 当 props.isLinkage = true 时有效，省[市[区]]三级联动外部传入的值 { province, city, district }
 */
var Picker = function (_React$Component) {
  _inherits(Picker, _React$Component);

  function Picker(props) {
    _classCallCheck(this, Picker);

    var _this = _possibleConstructorReturn(this, (Picker.__proto__ || Object.getPrototypeOf(Picker)).call(this, props));

    _initialiseProps.call(_this);

    var _props$defaultIndex = props.defaultIndex,
        selectedIndex = _props$defaultIndex === undefined ? [] : _props$defaultIndex,
        isLinkage = props.isLinkage,
        _props$linkageList = props.linkageList,
        linkageList = _props$linkageList === undefined ? [] : _props$linkageList,
        _props$defaults = props.defaults,
        defaults = _props$defaults === undefined ? {} : _props$defaults;

    if (isLinkage) {
      var province = defaults.province,
          city = defaults.city,
          district = defaults.district,
          level = defaults.level;

      _this.level = level;
      var provinceIndex = linkageList.map(function (_ref) {
        var name = _ref.name;
        return name === province;
      }).indexOf(true);
      if (provinceIndex !== -1) {
        selectedIndex[0] = provinceIndex;
        var _linkageList$province = linkageList[provinceIndex].cityList,
            provinceCityList = _linkageList$province === undefined ? [] : _linkageList$province;

        var cityIndex = provinceCityList.map(function (_ref2) {
          var name = _ref2.name;
          return name === city;
        }).indexOf(true);
        if (cityIndex !== -1) {
          selectedIndex[1] = cityIndex;
          var districtIndex = provinceCityList[cityIndex].districtList.map(function (_ref3) {
            var name = _ref3.name;
            return name === district;
          }).indexOf(true);
          if (districtIndex !== -1) {
            selectedIndex[2] = districtIndex;
          }
        }
      }
    }
    // 滚动对象
    _this.wheels = [];
    _this.state = {
      selectedIndex: selectedIndex
    };
    return _this;
  }

  _createClass(Picker, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.createWheel();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props = this.props,
          _props$okText = _props.okText,
          okText = _props$okText === undefined ? '确定' : _props$okText,
          _props$cancelText = _props.cancelText,
          cancelText = _props$cancelText === undefined ? '取消' : _props$cancelText,
          _props$title = _props.title,
          title = _props$title === undefined ? '选择所在地区' : _props$title,
          _props$style = _props.style,
          style = _props$style === undefined ? {} : _props$style;
      var _state$selectedIndex = this.state.selectedIndex,
          selectedIndex = _state$selectedIndex === undefined ? [] : _state$selectedIndex;
      // 等分宽度

      var len = this.level || this.list.length;
      var width = 100 / len;
      var _style$height = style.height,
          height = _style$height === undefined ? '220px' : _style$height,
          _style$marginTop = style.marginTop,
          marginTop = _style$marginTop === undefined ? '89px' : _style$marginTop;

      return _react2.default.createElement(
        'div',
        {
          className: 'cui-view cui-layer cui-warning plugin_city',
          id: 'cui-1413166411259'
        },
        _react2.default.createElement(
          'div',
          { className: 'cui-pop-box' },
          _react2.default.createElement(
            'div',
            { className: 'cui-hd' },
            _react2.default.createElement(
              'div',
              { className: 'cui-text-center' },
              title
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'cui-bd ' },
            _react2.default.createElement(
              'div',
              { className: 'cui-roller scrollWrapper', ref: this.getRef },
              this.list.map(function (item, index) {
                return _react2.default.createElement(
                  'div',
                  {
                    key: index,
                    className: 'cui-roller-bd cui-flex2',
                    style: {
                      maxWidth: width + '%',
                      minWidth: width + '%',
                      height: height
                    }
                  },
                  _react2.default.createElement(
                    'ul',
                    {
                      className: 'ul-list wheel-scroll',
                      ref: _this2.getRef,
                      style: {
                        position: 'relative',
                        width: '100%',
                        lineHeight: '44px',
                        height: 'auto',
                        marginTop: marginTop
                      }
                    },
                    item.map(function (value, subIndex) {
                      return _react2.default.createElement(
                        'li',
                        {
                          key: value,
                          className: (0, _classnames2.default)('wheel-item', {
                            current: (selectedIndex[index] || 0) === subIndex
                          })
                        },
                        value
                      );
                    })
                  )
                );
              }),
              _react2.default.createElement('div', { className: 'cui-mask-gray' }),
              _react2.default.createElement(
                'div',
                { className: 'cui-lines' },
                '\xA0'
              )
            ),
            _react2.default.createElement('p', { className: 'cui-roller-tips' }),
            _react2.default.createElement(
              'div',
              { className: 'cui-roller-btns' },
              _react2.default.createElement(
                'div',
                {
                  className: 'cui-btns-cancel cui-flexbd',
                  onClick: this.onCancel
                },
                cancelText
              ),
              _react2.default.createElement(
                'div',
                { className: 'cui-btns-sure cui-flexbd', onClick: this.onOk },
                okText
              )
            )
          )
        )
      );
    }
  }, {
    key: 'list',
    get: function get() {
      var _props2 = this.props,
          _props2$linkageList = _props2.linkageList,
          linkageList = _props2$linkageList === undefined ? [] : _props2$linkageList,
          isLinkage = _props2.isLinkage,
          _props2$list = _props2.list,
          list = _props2$list === undefined ? [] : _props2$list;

      if (!isLinkage) {
        return list;
      }
      var _state$selectedIndex2 = this.state.selectedIndex,
          selectedIndex = _state$selectedIndex2 === undefined ? [] : _state$selectedIndex2;

      var _selectedIndex = _slicedToArray(selectedIndex, 2),
          _selectedIndex$ = _selectedIndex[0],
          provinceIndex = _selectedIndex$ === undefined ? 0 : _selectedIndex$,
          _selectedIndex$2 = _selectedIndex[1],
          cityIndex = _selectedIndex$2 === undefined ? 0 : _selectedIndex$2;

      var provinceList = linkageList.map(function (_ref4) {
        var name = _ref4.name;
        return name;
      });
      var cityList = [];
      var districtList = [];
      var currentProvince = linkageList.filter(function (item) {
        return item.name === provinceList[provinceIndex];
      })[0];
      if (currentProvince && currentProvince.cityList instanceof Array) {
        var currentCityList = currentProvince.cityList;

        cityList = currentCityList.map(function (_ref5) {
          var name = _ref5.name;
          return name;
        });
        var currentCity = currentCityList.filter(function (item) {
          return item.name === cityList[cityIndex];
        })[0];
        if (currentCity && currentCity.districtList instanceof Array) {
          districtList = currentCity.districtList.map(function (_ref6) {
            var name = _ref6.name;
            return name;
          });
        }
      }
      return [provinceList, cityList, districtList];
    }
  }]);

  return Picker;
}(_react2.default.Component);

var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this.createWheel = function () {
    var _state$selectedIndex3 = _this3.state.selectedIndex,
        selectedIndex = _state$selectedIndex3 === undefined ? [] : _state$selectedIndex3;

    _this3.list.forEach(function (_, index) {
      _this3.wheels[index] = new _betterScroll2.default(_this3.wrapper.children[index], {
        wheel: {
          selectedIndex: selectedIndex[index] || 0,
          /** 默认值就是下面配置的两个，为了展示二者的作用，这里再配置一下 */
          wheelWrapperClass: 'wheel-scroll',
          wheelItemClass: 'wheel-item',
          rotate: 0
        },
        click: true,
        probeType: 3
      });
      _this3.wheels[index].on('scrollEnd', function () {
        var pickerSelectedIndex = _this3.wheels[index].getSelectedIndex();
        var currentIndex = _this3.state.selectedIndex[index] || 0;
        if (currentIndex == pickerSelectedIndex) {
          return;
        }
        _this3.wheelToIfNeeded({ currentIndex: index });
        var list = _this3.wrapper.children[index].querySelectorAll('li');
        if (!list.length) {
          return;
        }
        Array.prototype.slice.call(list).map(function (_, subIndex) {
          if (subIndex === pickerSelectedIndex) {
            var nextSelectedIndex = (0, _immer2.default)(_this3.state.selectedIndex, function (draft) {
              draft[index] = pickerSelectedIndex;
            });
            _this3.setState({
              selectedIndex: nextSelectedIndex
            });
          }
        });
      });
    });
  };

  this.wheelToIfNeeded = function () {
    var args = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var currentIndex = args.currentIndex;
    var _props3 = _this3.props,
        isLinkage = _props3.isLinkage,
        isLinkageList = _props3.isLinkageList;

    if (!isLinkage && !isLinkageList) {
      return;
    }
    _this3.list.forEach(function (_, index) {
      if (index > currentIndex) {
        _this3.wheels[index].wheelTo(0);
        var nextSelectedIndex = (0, _immer2.default)(_this3.state.selectedIndex, function (draft) {
          draft[index] = 0;
        });
        _this3.setState({ selectedIndex: nextSelectedIndex });
      }
    });
  };

  this.getRef = function (ref) {
    _this3.wrapper = ref;
  };

  this.onOk = function () {
    var result = _this3.list.map(function (item, index) {
      var selectedIndex = _this3.wheels[index].getSelectedIndex();
      return item[selectedIndex || 0];
    });
    if (_this3.level) {
      result = result.slice(0, _this3.level);
    }
    _this3.props.onOk && _this3.props.onOk(result);
  };

  this.onCancel = function () {
    _this3.props.onCancel && _this3.props.onCancel();
  };
};

exports.default = Picker;