import { LightningElement, track } from 'lwc';
import CONTACT_FIRSTNAME  from '@salesforce/schema/Contact.FirstName';
import CONTACT_LASTNAME  from '@salesforce/schema/Contact.LastName';
import CONTACT_EMAIL  from '@salesforce/schema/Contact.Email';
import CONTACT_MobilePhone  from '@salesforce/schema/Contact.MobilePhone';
import CONTACT_BIRTHDATE  from '@salesforce/schema/Contact.Birthdate';
import CONTACT_Department  from '@salesforce/schema/Contact.Department';
import CONTACT_Percentage__c  from '@salesforce/schema/Contact.Percentage__c';
import CONTACT_Qualification__c  from '@salesforce/schema/Contact.Qualification__c';
import CONTACT_Address__c  from '@salesforce/schema/Contact.Address__c';
import CONTACT_College__c  from '@salesforce/schema/Contact.College__c';
//import CONTACT_AccountId  from '@salesforce/schema/Contact.AccountId';

import createContact from '@salesforce/apex/ContactCreationController.createContact';
import uploadFile from '@salesforce/apex/FileUploaderClass.uploadFile';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class HiringStudents extends LightningElement {
    recordId;
    fileData;
    error;
    file;
    value;
    fileName;
    @track contactRecord = {
        FirstName:CONTACT_FIRSTNAME,
        LastName:CONTACT_LASTNAME,
        Email:CONTACT_EMAIL,
        MobilePhone:CONTACT_MobilePhone,
        Birthdate:CONTACT_BIRTHDATE,
        Department:CONTACT_Department,
        Percentage__c:CONTACT_Percentage__c,
        Qualification__c:CONTACT_Qualification__c,
       // AccountId:CONTACT_AccountId,
       // MailingAddress:CONTACT_MailingAddress,
        College__c:CONTACT_College__c,
        Address__c:CONTACT_Address__c
     }
     //this for handle click
    handleChange(event){
        if(event.target.name === 'firstName'){
            this.contactRecord.FirstName = event.target.value;
        }else if(event.target.name === 'lastName'){
            this.contactRecord.LastName = event.target.value;
        }else if(event.target.name === 'email'){
            this.contactRecord.Email = event.target.value;
        }else if(event.target.name === 'mobilephone'){
            this.contactRecord.MobilePhone = event.target.value;
        }else if(event.target.name === 'birthdate'){
            this.contactRecord.Birthdate = event.target.value;
        }else if(event.target.name === 'branch'){
            this.contactRecord.Department = event.target.value;
        }else if(event.target.name === 'percentage'){
            this.contactRecord.Percentage__c = event.target.value; 
        }else if(event.target.name === 'qualification'){
            this.contactRecord.Qualification__c = event.target.value;
        }/*else if(event.target.name === 'account'){
           this.contactRecord.AccountId = event.target.value;
        }*/else if(event.target.name === 'address'){
            this.contactRecord.Address__c = event.target.value;
        }else if(event.target.name === 'college'){
            this.contactRecord.College__c = event.detail.value;
            this.value = event.detail.value;
        }
    }

   
   
    openFileUpload(event){
        this.file = event.target.files[0];
        this.fileName =  'Selected File: '+this.file.name;
    }
    handleClick(){

        createContact({conObj:this.contactRecord})
        .then(result=>{
            this.contactRecord = {};
            this.recordId = result; 

            var reader = new FileReader();
            reader.readAsDataURL(this.file);
            reader.onload =()=>{
               var base64 = reader.result.split(',')[1];
               this.fileData = {
                  'filename':this.file.name,
                  'base64':base64,
                  'recordId':this.recordId
               }

             this.uploadFile();
             console.log(this.fileData);
            }

            
            console.log('this.recordId:'+ this.recordId);
           // window.alert('Your Response is Saved');
           // location.reload();
            const evt =  new ShowToastEvent({
                title : 'Success!',
                message : 'Contact Record Created Successful',
                variant : 'success',
            });
            this.dispatchEvent(evt);
            window.open("https://digitalcheckonline-developer-edition.ap27.force.com/","_self");
        })
        .catch(error=>{
            this.error = error.body.message;
            console.log(this.error);
            window.alert('Server Error or Required fields missing.Please refresh this page and Try again');
        });
     
    }
    uploadFile(){
        const { base64,filename,recordId } = this.fileData;
        uploadFile({ base64,filename,recordId }).then(result=>{
          console.log(`${result} file uploaded successfully`);
        })
    }

   

    get options() {
        return [
            { label: 'Sri Vivekananda Degree College', value: 'Sri Vivekananda Degree College' },
            { label: 'S.V.L. Kranthi Degree College', value: 'SVL KRANTHI Degree college' },
            { label: 'Govt. Degree College, Avanigadda', value: 'Govt. Degree College Avanigadda' },
            { label: 'Sri Sunflower College of Engineering & Technology', value: 'Sri Sunflower College of Engineering & Technology' },
            { label: 'DMHS Engineering College', value: 'DMHS Engineering College' },
            { label: 'Govt. Degree College, Movva', value: 'Govt. Degree College Movva' },
            { label: 'Govt. Degree College, Pamarru', value: 'Govt. Degree College Pamarru' },
           
        ];
    }

}