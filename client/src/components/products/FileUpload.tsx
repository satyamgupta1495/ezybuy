import { useRef, useState } from 'react';
import { Button, Image } from 'react-bootstrap';

function FileUpload({ imageUrl, imageTitle, handleFileChange, action }: any) {
    const fileRef = useRef<any>(null);

    const [editBtn, setEditBtn] = useState<boolean>(action === 'add' ? true : false);

    return (
        <form className="file-upload w-100">
            {editBtn ? <div className='flex flex-col'>
                <label htmlFor="file-input" className="drop-container">
                    <span className="drop-title">Drop files here</span>
                    or
                    <input
                        type="file"
                        accept="image/*"
                        required
                        id="file-input"
                        onChange={(e: React.ChangeEvent<HTMLInputElement> | any) => {
                            handleFileChange(e)
                            fileRef.current = e.target.files[0];
                        }}
                    />
                </label>
                {fileRef.current && (
                    <div className="file-details">
                        <p>Selected file: {fileRef.current.name}</p>
                    </div>
                )}
                <Button className='w-20 mt-3' variant='danger' onClick={() => {
                    if (action !== 'add') {
                        setEditBtn((prev) => !prev)
                    }
                }}>Cancel</Button>

            </div> :
                <div className="image-container w-50 h-50">
                    <div className="image-wrapper">
                        <Image src={imageUrl} alt={imageTitle} />
                        <div className="hover-text w-100 h-100 flex items-center justify-center cursor-pointer" onClick={() => setEditBtn((prev) => !prev)}>Replace Image</div>
                    </div>
                </div>
            }
        </form >
    );
};

export default FileUpload;
