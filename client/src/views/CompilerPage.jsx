import './CompilerPage.scss';
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import { useCallback, useEffect, useRef, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { apiUrl } from "../config";

const CompilerPage = () => {
    const fileUploadBoxRef = useRef();
    const errorBoxRef = useRef();

    const [output, setOutput] = useState([]);

    const [loading, setLoading] = useState(false);
    const [isRunning, setIsRunning] = useState(false);
    const [authState, checkAuth] = useAuth();

    const getFileToUpload = useCallback(() => {
        const input = fileUploadBoxRef.current;
        return input?.files?.length >= 1 ? input.files[0] : null;
    }, [fileUploadBoxRef.current]);

    const handleSumbit = (e) => {
        e.preventDefault();
        setOutput([]);

        const errorBox = errorBoxRef.current;
        const fileToUpload = getFileToUpload();

        if (!fileToUpload) {
            errorBox.style.display = "block";
            return; //return to prevent errors
        }

        errorBox.style.display = "none";
        const formData = new FormData();

        formData.append("file", fileToUpload);

        axios.post(`${apiUrl}/cluster/push`, formData, {
            headers: {
                'Authorization': 'Bearer ' + authState.jwt,
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            setIsRunning(true);
            setLoading(true);
        }).catch((err) => console.log(err));
    };

    const requestOutput = useCallback(() => {
        return axios
            .get(`${apiUrl}/cluster/output`, {
                headers: {
                    'Authorization': 'Bearer ' + authState.jwt
                }
            })
            .then((res) => {
                if (res.data.error) {
                    console.log(res.data.error);
                }
                return res.data.output;
            });
    }, [authState]);

    const requestRunningState = useCallback(() => {
        return axios
            .get(`${apiUrl}/cluster/isRunning`, {
                headers: {
                    'Authorization': 'Bearer ' + authState.jwt
                }
            })
            .then((res) => {
                if (res.data?.error) {
                    console.log(res.data.error);
                }
                return res.data.isRunning;
            });
    }, [authState]);

    useEffect(() => {
        requestRunningState()
            .then((running) => {
                if (running) setLoading(true);
                setIsRunning(running);
            });
    }, []);

    useEffect(() => {
        if (!checkAuth()) return () => null;
        //Logs into the admin account
        if (isRunning) {
            const onOutputRecieved = (log) => {
                setOutput(log);
                if (log?.length > 0) setLoading(false);
            };

            const interval = setInterval(() => {
                requestOutput()
                    .then(onOutputRecieved);
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [isRunning]);

    return (
        <div className='container'>
            <div className='uploader-page-wrapper'>
                <form className="uploader-actions" method="post" onSubmit={handleSumbit}>
                    <div className="upload-action">
                        <header>File uploader Python</header>
                        <input ref={fileUploadBoxRef} type="file" name='filename' accept='.py' />
                        <div ref={errorBoxRef} style={{ display: "none" }} className='errorMessageBox'>
                            <p id='errorMessage'>Error: Choose a .py file</p>
                        </div>
                    </div>
                    <button type="submit" className='btn-execute'>Execute</button>
                </form>
                <div className='output-container'>
                    <header>Output</header>
                    {!loading ?
                        <div className="output-content"><pre>{output}</pre></div> :
                        (<div className="output-spinner-container"><ReactBootStrap.Spinner animation="border" variant="primary" /></div>)
                    }
                </div>
            </div>
        </div >

    );
};

export default CompilerPage;