import { UploadButton } from "@/lib/uploadthing";
import React from "react";

const ImageUpload = () => {
  return (
    <>
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
    </>
  );
};

export default ImageUpload;
