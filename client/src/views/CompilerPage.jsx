import './CompilerPage.scss';
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import { io } from "socket.io-client";
import { useCallback, useEffect, useRef, useState } from 'react';

const CompilerPage = () => {
    const fileUploadBoxRef = useRef();
    const errorBoxRef = useRef();

    const [output, setOutput] = useState([]);
    const outputRef = useRef(output);

    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(loading);
    loadingRef.current = loading;

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

        axios.post("http://localhost:3000/cluster/push", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            setLoading(true);
        }).catch((err) => console.log(err));
    };

    useEffect(() => {
        outputRef.current = output;
    }, [output]);

    useEffect(() => {
        //Logs into the admin account
        const placeholderjwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiJDJiJDEwJFNaajZtcENRWW5WbWMyZFpvdzlienVTY1VzbWprQjFSdk5TV0JGUDRGVm5HMlFRZ1FPaDFTIiwiaWF0IjoxNjU0NjA5Mjk3LCJleHAiOjE2NTQ2OTU2OTd9.jkDP3jewZpBj_DnxGapuPuh4pjmhDCdQEd5DEC2RPfY";

        const queryParams = new URLSearchParams();
        queryParams.append("token", placeholderjwt);

        const socket = io("ws://localhost:3000", {
            path: "/cluster/output",
            autoConnect: false,
            transports: ["websocket"],
            query: queryParams.toString()
        });

        const onOutputRecieved = (log) => {
            outputRef.current.push(log);
            setOutput(outputRef.current);
            if (loadingRef.current) setLoading(false);
        };

        socket.on("connect", () => {
            socket.emit("getrunningstatus", (isRunning) => {
                console.log(isRunning);
                if (isRunning) {
                    setLoading(true);
                    outputRef.current = [];
                    socket.emit("getall", onOutputRecieved);
                }
            });
        });

        socket.on("exit", () => setLoading(false));
        socket.on("output", onOutputRecieved);

        socket.connect();
        return () => socket.close();
    }, []);

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
                        <div className="output-content"><pre>{output}</pre>
                        </div> :
                        (<div className="output-spinner-container"><ReactBootStrap.Spinner animation="border" variant="primary" /></div>)
                    }
                </div>
            </div>
        </div >

    );
};

export default CompilerPage;