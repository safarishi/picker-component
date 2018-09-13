import React from 'react'
import BScroll from 'better-scroll'
import classnames from 'classnames'
import produce from 'immer'

/**
 * props.isLinkage 是否为省[市[区]]三级联动
 * props.defualts 当 props.isLinkage = true 时有效，省[市[区]]三级联动外部传入的值 { province, city, district }
 */
export default class Picker extends React.Component {
  constructor(props) {
    super(props)
    let { defaultIndex: selectedIndex = [], isLinkage, linkageList = [], defaults = {} } = props
    if (isLinkage) {
      let {
        province,
        city,
        district,
        level
      } = defaults
      this.level = level
      let provinceIndex = linkageList.map(({ name }) => name === province).indexOf(true)
      if (provinceIndex !== -1) {
        selectedIndex[0] = provinceIndex
        let { cityList: provinceCityList = [] } = linkageList[provinceIndex]
        let cityIndex = provinceCityList.map(({ name }) => name === city).indexOf(true)
        if (cityIndex !== -1) {
          selectedIndex[1] = cityIndex
          let districtIndex = provinceCityList[cityIndex].districtList.map(({ name }) => name === district).indexOf(true)
          if (districtIndex !== -1) {
            selectedIndex[2] = districtIndex
          }
        }
      }
    }
    // 滚动对象
    this.wheels = []
    this.state = {
      selectedIndex
    }
  }
  componentDidMount() {
    this.createWheel()
  }
  get list() {
    let { linkageList = [], isLinkage, list = [] } = this.props
    if (!isLinkage) {
      return list
    }
    let { selectedIndex = [] } = this.state
    let [provinceIndex = 0, cityIndex = 0] = selectedIndex
    let provinceList = linkageList.map(({ name }) => name)
    let cityList = []
    let districtList = []
    let currentProvince = linkageList.filter(item => item.name === provinceList[provinceIndex])[0]
    if (currentProvince && currentProvince.cityList instanceof Array) {
      let { cityList: currentCityList } = currentProvince
      cityList = currentCityList.map(({ name }) => name)
      let currentCity = currentCityList.filter(item => item.name === cityList[cityIndex])[0]
      if (currentCity && currentCity.districtList instanceof Array) {
        districtList = currentCity.districtList.map(({ name }) => name)
      }
    }
    return [
      provinceList,
      cityList,
      districtList
    ]
  }
  createWheel = () => {
    let { selectedIndex = [] } = this.state
    this.list.forEach((_, index) => {
      this.wheels[index] = new BScroll(this.wrapper.children[index], {
        wheel: {
          selectedIndex: selectedIndex[index] || 0,
          /** 默认值就是下面配置的两个，为了展示二者的作用，这里再配置一下 */
          wheelWrapperClass: 'wheel-scroll',
          wheelItemClass: 'wheel-item',
          rotate: 0
        },
        click: true,
        probeType: 3
      })
      this.wheels[index].on('scrollEnd', () => {
        let pickerSelectedIndex = this.wheels[index].getSelectedIndex()
        let currentIndex = this.state.selectedIndex[index] || 0
        if (currentIndex == pickerSelectedIndex) {
          return
        }
        this.wheelToIfNeeded({ currentIndex: index })
        let list = this.wrapper.children[index].querySelectorAll('li')
        if (!list.length) {
          return
        }
        Array.prototype.slice.call(list).map((_, subIndex) => {
          if (subIndex === pickerSelectedIndex) {
            let nextSelectedIndex = produce(this.state.selectedIndex, draft => {
              draft[index] = pickerSelectedIndex
            })
            this.setState({
              selectedIndex: nextSelectedIndex
            })
          }
        })
      })
    })
  }
  wheelToIfNeeded = (args = {}) => {
    let { currentIndex } = args
    let { isLinkage, isLinkageList } = this.props
    if (!isLinkage && !isLinkageList) {
      return
    }
    this.list.forEach((_, index) => {
      if (index > currentIndex) {
        this.wheels[index].wheelTo(0)
        let nextSelectedIndex = produce(this.state.selectedIndex, draft => {
          draft[index] = 0
        })
        this.setState({ selectedIndex: nextSelectedIndex })
      }
    })
  }
  render() {
    let {
      okText = '确定',
      cancelText = '取消',
      title = '选择所在地区',
      style = {}
    } = this.props
    let { selectedIndex = [] } = this.state
    // 等分宽度
    let len = this.level || this.list.length
    let width = 100 / len
    let { height = '220px', marginTop = '89px' } = style
    return (
      <div
        className="cui-view cui-layer cui-warning plugin_city"
        id="cui-1413166411259"
      >
        <div className="cui-pop-box">
          <div className="cui-hd">
            <div className="cui-text-center">{title}</div>
          </div>
          <div className="cui-bd ">
            <div className="cui-roller scrollWrapper" ref={this.getRef}>
              {this.list.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="cui-roller-bd cui-flex2"
                    style={{
                      maxWidth: `${width}%`,
                      minWidth: `${width}%`,
                      height
                    }}
                  >
                    <ul
                      className="ul-list wheel-scroll"
                      ref={this.getRef}
                      style={{
                        position: 'relative',
                        width: '100%',
                        lineHeight: '44px',
                        height: 'auto',
                        marginTop
                      }}
                    >
                      {item.map((value, subIndex) => {
                        return (
                          <li
                            key={value}
                            className={classnames('wheel-item', {
                              current: (selectedIndex[index] || 0) === subIndex
                            })}
                          >
                            {value}
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                )
              })}
              <div className="cui-mask-gray" />
              <div className="cui-lines">&nbsp;</div>
            </div>
            <p className="cui-roller-tips" />
            <div className="cui-roller-btns">
              <div
                className="cui-btns-cancel cui-flexbd"
                onClick={this.onCancel}
              >
                {cancelText}
              </div>
              <div className="cui-btns-sure cui-flexbd" onClick={this.onOk}>
                {okText}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  getRef = ref => {
    this.wrapper = ref
  }
  onOk = () => {
    let result = this.list.map((item, index) => {
      let selectedIndex = this.wheels[index].getSelectedIndex()
      return item[selectedIndex || 0]
    })
    if (this.level) {
      result = result.slice(0, this.level)
    }
    this.props.onOk && this.props.onOk(result)
  }
  onCancel = () => {
    this.props.onCancel && this.props.onCancel()
  }
}
