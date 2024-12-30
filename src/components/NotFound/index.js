import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      className="not-found-img"
      src="https://res.cloudinary.com/dngzbeidb/image/upload/v1727146314/eq0kqn9cc2os7uqovc2e.png"
      alt="not found"
    />
    <h1 className="not-found-head">Page Not Found</h1>
    <p className="not-found-txt">
      We are sorry, the page you requested could not be found
    </p>
  </div>
)

export default NotFound
