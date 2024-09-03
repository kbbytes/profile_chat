import React, { useState } from 'react';
import { edit_avatar } from '../../UserFunctions/UserFunctions';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import _Conf from '../../../configs/global.js';
import './Avatar.css';  

const Avatar = (decoded) => {
    var _decoded = decoded.decoded;
    const fileUpload = React.createRef();
    const [photo, setPhoto] = useState(null);
    const [fileName, setFileName] = useState("");
    const [show, setShow] = useState(true);

    const handleSubmit = async evt => {
        evt.preventDefault();
        try {
            
            let bodyFormData = new FormData();
            bodyFormData.set("id", _decoded.id);
            bodyFormData.append("photo", photo);
            console.log(_decoded.id + ' ' + photo);
            await edit_avatar(bodyFormData).then(res => {
                if(res.data.avatar !== _decoded.avatar)
                {
                    localStorage.clear();
                    this.props.history.push('/login');
                    window.location.reload(false);
                }
            })
        } catch (error) {
            return console.log({error})
        }
    };

    function ValidateSize(file) {
        var FileSize = 0;
        if(_Conf.avatar_size_suffix === 'KB')
            FileSize = file.files[0].size / 1024; // in KB
        if(_Conf.avatar_size_suffix === 'MB')
            FileSize = file.files[0].size / 1024 / 1024; // in MB
        if (FileSize > _Conf.avatar_size) {
            alert(`File size exceeds ${_Conf.avatar_size} ${_Conf.avatar_size_suffix}`);
            return false;
        } else {
            return true;
        }
    }
        
    const setFile = evt => {
        if(ValidateSize(evt.target))
        {
            setPhoto(evt.target.files[0]);
            setFileName(evt.target.files[0].name);
        }
    };

    function closeAvatarBox() {  
        setShow(false);
    }

    const openUploadDialog = () => {
        fileUpload.current.click();
    };

    const editor = (
      <div id="popup1" className="overlay">
        <div className="popup-edit-avatar">
          <h2>Edit Avatar</h2>
          <button className="close" onClick={() => closeAvatarBox()}>&times;</button>
          <div className="content">
            <div className="avatar-form">
                <div className="avatar-img">
                    <img alt="avatar" src={`/uploads/avatars/${_decoded.avatar}`} width="100px" height="100px"></img>
                </div>
                <Form noValidate onSubmit={handleSubmit}>
                    <input
                        type="file"
                        ref={fileUpload}
                        name="photo"
                        accept=".jpg,.jpeg,.png"
                        style={{ display: "none" }}
                        onChange={setFile}
                    />
                    <div className="file-box">
                    <Button type="button" onClick={openUploadDialog}>
                        Select Avatar
                    </Button>
                        <span style={{ paddingLeft: "10px", marginTop: "5px" }}>
                            {fileName}
                        </span>
                    </div>
                    <Button type="submit" onClick={handleSubmit} style={{ marginRight: "10px" }}>
                        Save
                    </Button>
                </Form>
            </div>
          </div>
        </div>
      </div> 
    );
    return (show ? editor : null);
}

export default Avatar;