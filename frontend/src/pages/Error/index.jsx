//style this Error page up nicely (:
const Error = ({error, resetErrorBoundary}) => {
  return (
    <div>
      {error.message}
      <button onClick={resetErrorBoundary}>Reset</button>
    </div>
  )
}

export default Error;
