import { api, LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CREATEINFOS from '@salesforce/apex/SearchInfoController.createInfos';
export default class CreateInfo extends LightningElement {

    @track keyIndex = 0;  
    @track error;
    @track message;
    @track infoRecList = [
        {                      
            Name__c: '',
            Email_Address__c: '',
            Contact_Number__c: ''
        }
    ];
    //Add Row 
    addRow() {
        this.keyIndex+1;   
        this.infoRecList.push ({            
            Name__c: '',
            Email_Address__c: '',
            Contact_Number__c: ''
        });
       // console.log('Enter ',this.infoRecList);
       //  console.log('Enter ',this.infoRecList);
    }
    changeHandler(event){       
       // alert(event.target.id.split('-'));
        console.log('Access key2:'+event.target.accessKey);
        console.log('id:'+event.target.id);
        console.log('value:'+event.target.value);       
        if(event.target.name==='name')
            this.infoRecList[event.target.accessKey].Name__c = event.target.value;
        else if(event.target.name==='email'){
            this.infoRecList[event.target.accessKey].Email_Address__c = event.target.value;
        }
        else if(event.target.name==='contactNumber'){
            this.infoRecList[event.target.accessKey].Contact_Number__c = event.target.value;
        }
    }
    //Save Accounts
    saveMultipleInfos() {

        console.log("infolist"+JSON.stringify(this.infoRecList));
        CREATEINFOS({ infoLst : this.infoRecList })
            .then(result => {
                this.message = result;
                this.error = undefined;                
                this.infoRecList.forEach(function(item){                   
                    item.Name__c='';
                    item.Email_Address__c='';
                    item.Contact_Number__c='';                   
                });

                //this.infoRecList = [];
                if(this.message !== undefined) {
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Info Records Created!',
                            variant: 'success',
                        }),
                    );
                }
                
                console.log(JSON.stringify(result));
                console.log("result", this.message);
            })
            .catch(error => {
                this.message = undefined;
                this.error = error;
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error creating records',
                        message: error.body.message,
                        variant: 'error',
                    }),
                );
                console.log("error", JSON.stringify(this.error));
            });
    }
    removeRow(event){       
        console.log('Access key2:'+event.target.accessKey);
        console.log(event.target.id.split('-')[0]);
        if(this.infoRecList.length>=1){             
             this.infoRecList.splice(event.target.accessKey,1);
             this.keyIndex-1;
        }
    }  

    @api objectApiName = 'Account';

    fields = [NAME_FIELD, REVENUE_FIELD, INDUSTRY_FIELD];

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: 'Account created',
            message: 'Record ID: ' + event.detail.id,
            variant: 'success',
        });
        this.dispatchEvent(evt);
    }
}