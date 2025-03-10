/* eslint-disable react/prop-types */
export function Loader() {
  return (
    <div className="loader-container">
      <div className="loader"></div>
      <p>Loading...</p>
    </div>
  );
}

export function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>💥</span> {message}.
    </p>
  );
}
