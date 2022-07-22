import { api, LightningElement } from 'lwc';
import uploadFile from '@salesforce/apex/FileUploaderClass.uploadFile';
export default class FileUpload extends LightningElement {
    recordId ='0015j00000ZcDAXAA3';
    fileData;
    openFileUpload(event){
       const file = event.target.files[0];
       var reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload =()=>{
          var base64 = reader.result.split(',')[1];
          this.fileData = {
             'filename':file.name,
             'base64':base64,
             'recordId':this.recordId
          }
        console.log(this.fileData);
        console.log('changes made successfully');
       }
    }

    handleClick(){
        const { base64,filename,recordId } = this.fileData;
        uploadFile({ base64,filename,recordId }).then(result=>{
           console.log(`${result} file uploaded successfully`);
        })
    }
}