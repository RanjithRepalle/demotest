import { api, LightningElement, wire } from 'lwc';
import checkField from '@salesforce/apex/DisplayErrorMessageHandler.checkField';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class DisplayErrorMessage extends LightningElement {
    @api recordId;
    error;
   /* @wire (checkField,{objId:'$recordId'})
    retriveContacts({error,data}){
      console.log('@@@@:'+data);
      if(data){
        console.log('data check')
        
        const evt =  new ShowToastEvent({
            title : 'Field!',
            message : 'please fill AccountId',
            variant : 'warning',
        });
        this.dispatchEvent(evt);
        data = false;
       // location.reload();
      }else if(error){
     console.log(error);
      }
    }*/
    connectedCallback(){
      checkField({objId:this.recordId})
        .then(result=>{
          if(result == true){
            const evt =  new ShowToastEvent({
              title : 'Field!',
              message : 'please fill AccountId',
              variant : 'warning',
            });
        
             this.dispatchEvent(evt);    
          }
          
        })
        .catch(error=>{
            this.error = error.message;
        }); 
        //location.reload();  
    }
    
}