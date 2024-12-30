import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

const Header = props => {
  const {history} = props

  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  return (
    <nav className="nav-header">
      <div className="logo-container">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dngzbeidb/image/upload/v1726555320/yopwzcgc1kpql7ziztm7.png"
            className="header-logo"
            alt="website logo"
          />
        </Link>
        <p className="nxt-head">
          NXT <span className="assess">Assess</span>
        </p>
      </div>
      <button
        className="logout-btn"
        type="button"
        data-testid="logoutButton"
        onClick={onClickLogout}
      >
        Logout
      </button>
    </nav>
  )
}

export default withRouter(Header)
