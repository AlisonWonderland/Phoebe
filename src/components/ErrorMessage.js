const ErrorMessage = ({ error }) => {
    return (
        <>  
            {
                error ?
                    <div className="errorContainer">
                        {error}
                    </div>
                : null
            }   
        </>
    )
}

export default ErrorMessage