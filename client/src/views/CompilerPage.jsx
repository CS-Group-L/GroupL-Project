import './CompilerPage.scss';
import axios from 'axios';
import { useCallback, useRef, useState } from 'react';

const CompilerPage = () => {
    const fileUploadBoxRef = useRef();
    const errorBoxRef = useRef();
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
            });
    };

    const getFileToUpload = useCallback(() => {
        const input = fileUploadBoxRef.current;
        return input?.files?.length >= 1 ? input.files[0] : null;
    }, [fileUploadBoxRef.current]);

    const handleSumbit = (e) => {
        e.preventDefault();

        const errorBox = errorBoxRef.current;
        const fileToUpload = getFileToUpload();

        if (!fileToUpload) {
            errorBox.style.display = "block";
            return; //return to prevent errors
        }

        errorBox.style.display = "none";
        const formData = new FormData();

        formData.append("file", fileToUpload);

        axios.post("http://localhost:3000/cluster/push", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });

        getOutput(); //gives the current/last output
    };



    return (
        <div className='container'>
            <div className='wrapper'>
                <form method="post" onSubmit={handleSumbit}>
                    <div className='left'>
                        <header>File uploader Python</header>
                        <input ref={fileUploadBoxRef} type="file" name='filename' accept='.py' />
                        <div ref={errorBoxRef} className='errorMessageBox'>
                            <p id='errorMessage' hidden>Error: You have to choose a .py file</p>
                        </div>
                        <button type="submit" className='buttonExecute'>Execute</button>
                    </div>
                </form>
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