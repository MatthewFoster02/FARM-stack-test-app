const FormInput = (props) => {
    const {label, placeholder, type, onChange, name} = props;
    return (
        <div className="formInput my-2 flex flex-row items-center">
            <label className="font-small">{label}</label>
            <input
                className="input input-bordered input-accent w-full max-w-xs m-3"
                placeholder={placeholder}
                type={type}
                name={name}
                onChange={onChange}
                autoComplete='off'
                />
        </div>
    );
}

export default FormInput;
