import "../styles/PreviewComplaint.css";

import React, { useEffect, useState } from "react";
import { getMedia } from "../../firebase";
import Loader from "./Loader";

export default function PreviewComplaint({ complaint }) {
  const [mediaUrl, setMediaUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  function get_url_extension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }
  console.log("yes");
  function get_media_type(ext) {
    switch (ext.trim().toLowerCase()) {
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "image";
        break;
      case "mp4":
        return "video";
        break;
      case "mp3":
      case "wav":
        return "audio";
        break;
      default:
        return null;
    }
  }

  let mediaExt = get_url_extension(mediaUrl);
  let mediaType = get_media_type(mediaExt);

  async function getMediaUrl() {
   let mm =  await getMedia(complaint.mediaSrc);



    setMediaUrl(mm);
    setIsLoading(false);
  }
  getMediaUrl();

  return (
    <div className="preview_complaint">
      <form>
        <h1>Preview Raised Complaint</h1>

        <div className="inputBox status">
          <span>Status</span>
          <div className="status_text">
            <span
              className={`status_indicator ${
                complaint.status ? complaint.status : ""
              }`}
            ></span>
            {complaint.status.charAt(0).toUpperCase() +
              complaint.status.slice(1).toLowerCase()}
          </div>
        </div>

        <div className="inputBox">
          <span>Title</span>
          <input type="text" name="title" value={complaint.title} />
        </div>

        {complaint.datetime && (
          <div className="inputBox">
            <span>Date and Time of the Incident</span>
            <input
              type="datetime-local"
              value={complaint.datetime}
              name="datetime"
              disabled="disabled"
            />
          </div>
        )}

        <div className="inputBox">
          <span>Message</span>
          <textarea
            name="message"
            rows="6"
            value={complaint.message}
            disabled="disabled"
          />
        </div>

        <div className="inputBox">
          <span>Attached File</span>
          
          {isLoading ? (
        <Loader /> // Show Loader while content is loading
      ) : mediaUrl.trim() !== '' ? (
        mediaType === 'image' ? (
          <img src={mediaUrl} alt="See Uploaded content" />
        ) : mediaType === 'video' ? (
          <video controls="controls">
            <source src={mediaUrl} type={`video/${mediaExt}`} />
          </video>
        ) : mediaType === 'audio' ? (
          <audio controls="controls">
            <source src={mediaUrl} type={`audio/${mediaExt}`} />
          </audio>
        ) : null
      ) : null}
        </div>
      </form>
    </div>
  );
}