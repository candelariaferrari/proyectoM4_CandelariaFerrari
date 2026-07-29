import "./NotFound.css";

function NotFound() {
  return (
    <div className="notfound-page">
      <div>
        <p className="notfound-page__code">404</p>
        <div className="notfound-page__rule" />
        <h1 className="notfound-page__title">Esta página se escapó de tu lista</h1>
        <p className="notfound-page__text">No encontramos lo que buscabas.</p>
      </div>
    </div>
  );
}

export default NotFound;
