import './CompilerPage.scss' 

const CompilerPage = () => {

    function uploadFile() {
        var input = document.getElementById("chosenFile");

        if (input.value.length == 0) {
            document.getElementById("errorMessage").style.display="block";
            
        } else {
            document.getElementById("errorMessage").style.display="none";
        } 
    }

    return (
        <div className='container'>
            <div className='wrapper'>
                <div className='left'>
                <header>File uploader Python</header>
                    <form>
                        <input type="file" id='chosenFile' name='filename' accept='.py'></input>
                    </form>
                <div className='errorMessageBox'>
                <p id='errorMessage' hidden>Error: You have to choose a .py file</p>
                </div>
                <button onClick={uploadFile} className='buttonExecute'>Execute</button>
                </div>
                <div className='right'>
                <header>Output</header>
                <h3 id='output' hidden>Your output will displayed here!</h3>
                </div>
            </div>
        </div>
        
    );
};

export default CompilerPage;