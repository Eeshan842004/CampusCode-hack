import { Link } from "react-router";
import { Empty } from "../components/ui";

export default function NotFound() {
  return (
    <div className="view-in">
      <p className="eyebrow" style={{ margin: 0 }}>Error / 404</p>
      <h1 className="page-title" tabIndex={-1}>LOST <span className="ol-text">LINK.</span></h1>
      <Empty title="This page doesn't exist." wm="404" action={<Link to="/" className="btn btn-dark">Back to overview <span className="arrow" aria-hidden="true">↗</span></Link>}>
        The link may be old or mistyped. Everything you need is one click away in the sidebar.
      </Empty>
    </div>
  );
}
