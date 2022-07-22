import { LightningElement, track } from 'lwc';
import createAccount from '@salesforce/apex/AccountCreationController.createAccount';
import ACCOUNT_NAME  from '@salesforce/schema/Account.Name';
import ACCOUNT_TYPE  from '@salesforce/schema/Account.Type';
import ACCOUNT_PHONE from '@salesforce/schema/Account.Phone';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class Hiring extends LightningElement {
    @track accountId;
    @track error;
    @track accountRecord = {
       Name:ACCOUNT_NAME,
       Type:ACCOUNT_TYPE,
       Phone:ACCOUNT_PHONE
    }
    handleNameChange(event){
        this.accountRecord.Name =  event.target.value;
    }
    handleTypeChange(event){
        this.accountRecord.Type = event.target.value;
    }
    handlePhoneChange(event){
        this.accountRecord.Phone = event.target.value;
    }
    handleSaveAccount(){
        createAccount({accObj:this.accountRecord})
        .then(result=>{
            this.accountRecord = {};
            this.accountId = result.id; 
            const evt =  new ShowToastEvent({
                title : 'Success!',
                message : 'Account Record Created Successful',
                variant : 'success',
            });
            this.dispatchEvent(evt);
        })
        .catch(error=>{
            this.error = error.message;
        });
    }
}