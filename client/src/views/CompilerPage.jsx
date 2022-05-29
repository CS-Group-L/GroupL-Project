import './CompilerPage.scss'
import axios from 'axios';
import { useEffect, useState } from 'react';

const CompilerPage = () => {
    const [file, setFile] = useState(null);
    const [output, setOutput] = useState();

    // useEffect(() => {
    //     getOutput();
    // })

    const getOutput = () => {
        axios
            .get("http://localhost:3000/cluster/output")
            .then((res) => {
                if (res.data.error) {
                    console.log(res.data);
                } else {
                    setOutput(res.data);
                }
            })
    }

    function uploadFile() {
        var input = document.getElementById("chosenFile");

        if (input.value.length == 0) {
            document.getElementById("errorMessage").style.display = "block";

        } else {
            document.getElementById("errorMessage").style.display = "none";
        }

        setFile(input);
    }



    const handleSumbit = (e) => {
        e.preventDefault();

        uploadFile();

        const formData = new FormData();

        formData.append("key", file);

        axios
            .post("http://localhost:3000/cluster/push", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
            
            getOutput();
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
                    <button onClick={handleSumbit} className='buttonExecute'>Execute</button>
                </div>
                <div className='right'>
                    <header>Output</header>
                    <h3 id='output' hidden>Your output will displayed here!</h3>
                    <p>{output}</p>
                </div>
            </div>
        </div>

    );
};

export default CompilerPage;