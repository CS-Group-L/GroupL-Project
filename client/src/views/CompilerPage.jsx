import './CompilerPage.scss';
import axios from 'axios';
import { useCallback, useRef, useState } from 'react';

const CompilerPage = () => {
    const fileUploadBoxRef = useRef();
    const errorBoxRef = useRef();
    const outputPlaceholderRef = useRef();
    const [output, setOutput] = useState();

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
        setOutput(null);

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
            setTimeout(() => getOutput(), 1000);
        }).catch((err) => {
            console.log(err);
        });
    };

    return (
        <div className='container'>
            <div className='uploader-page-wrapper'>
                <form className="uploader-actions" method="post" onSubmit={handleSumbit}>
                    <div className="upload-action">
                        <header>File uploader Python</header>
                        <input ref={fileUploadBoxRef} type="file" name='filename' accept='.py' />
                        <div ref={errorBoxRef} style={{ display: "none" }} className='errorMessageBox'>
                            <p id='errorMessage'>Error: You have to choose a .py file</p>
                        </div>
                    </div>
                    <button type="submit" className='btn-execute'>Execute</button>
                </form>
                <div className='output-container'>
                    <header>Output</header>
                    {!output && <h3 ref={outputPlaceholderRef} style={{ display: "block" }}>Your output will displayed here!</h3>}
                    <pre>{output}</pre>
                </div>
            </div>
        </div>

    );
};

export default CompilerPage;