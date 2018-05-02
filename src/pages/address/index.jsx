

import React from 'react'
import { connect } from 'react-redux'
import Toast from 'components/toast'
import SvgIcon from 'components/icon-svg'
import Scroll from 'components/scroll'
import NabBar from '../common-components/nav-bar'
import NoData from '../common-components/no-data'
import AuthError from '../common-components/auth-err'
import AddressRow from './address-row'
import { getAddress } from '../../api'
import styles from './index.less'

@connect(({ globalState }) => ({
  isLogin: globalState.isLogin,
}))
export default class Address extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
    }
    this.loading = false
  }

  componentDidMount() {
    this.props.isLogin && this.getAddress()    // eslint-disable-line
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLogin && !this.state.loading) {
      this.getAddress()
    }
  }

  getAddress = async () => {
    try {
      Toast.loading('加载中...', 0)
      this.loading = true
      const { data } = await getAddress()
      Toast.hide()
      this.loading = false
      this.setState({
        list: data,
      })
    } catch ({ err }) {
      this.loading = false
      Toast.info(err)
    }
  }

  render() {
    const { isLogin } = this.props
    const { list } = this.state
    console.log(list)
    return !isLogin ? <AuthError /> : (
      <div className={styles.address}>
        <NabBar
          title="我的地址"
          iconLeft="#back"
          leftClick={() => this.props.history.goBack()} />
        {
          list.length ? (
            <div className={styles.list}>
              <Scroll dataSource={list} className={styles.scroll}>
                {
                  list.map(v => (
                    <AddressRow key={v.id} data={v} />
                  ))
                }
              </Scroll>
            </div>
          ) : <NoData />
        }
        <button className={styles.add}>
          <div className={styles.icon}>
            <SvgIcon name="#round_add" />
          </div>
          <span>新增收获地址</span>
        </button>
      </div>
    )
  }
}