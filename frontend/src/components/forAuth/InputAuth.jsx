const InputAuth = ({ ref, type, placeholder, onChange }) => {
  return (
    <input ref={ref} type={type} placeholder={placeholder} onChange={onChange}/>
  )
}

export default InputAuth