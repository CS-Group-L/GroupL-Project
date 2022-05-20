import './CompilerPage.scss' 

const CompilerPage = () => {
    return (
        
    <div>

        <div className='wrapper'> 
            <header>File uploader Python</header>
            <form>
                <i className='fas fa-cloud-upload-alt' id='icon'></i>
            </form>
            <section className='progress-area'></section>
            <section className='uploaded-area'></section>

        </div>
        
    </div>
        
    );
};

export default CompilerPage;