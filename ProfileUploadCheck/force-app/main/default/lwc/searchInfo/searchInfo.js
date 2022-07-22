import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import GETINFO from '@salesforce/apex/SearchInfoController.getInfo';
import DELETEINFOS from '@salesforce/apex/SearchInfoController.deleteInfos';
export default class SearchInfo extends LightningElement {
    selectedValue = 'Name__c';
    data;
    searchText='';
    error;
    visibleObjects;
    totalRecords =  0;
    recordSize = '5';
    infoList;
    columns = [
        { label: 'Name', fieldName: 'Name__c' },
        { label: 'Email Address', fieldName: 'Email_Address__c'},
        { label: 'Contact Number', fieldName: 'Contact_Number__c'},
        { label: 'Personal LinkedIn Profile', fieldName: 'Personal_LinkedIn_Profile__c'},
        { label: 'Designation', fieldName: 'Designation__c' },
        { label: 'Company Name', fieldName: 'Company_Name__c'},
        { label: 'Company Number', fieldName: 'Company_Number__c'},
        { label: 'Website', fieldName: 'Website__c', type: 'url' },
        { label: 'Domain', fieldName: 'Domain__c', type: 'url' },
        { label: 'Facebook Url', fieldName: 'Facebook_Url__c', type: 'url' },
        { label: 'Twitter Url', fieldName: 'Twitter_Url__c', type: 'url' },
        { label: 'LinkedIn Url', fieldName: 'LinkedIn_Url__c', type: 'url' },
        { label: 'Country', fieldName: 'Country__c' },       
        /*{ label: 'Balance', fieldName: 'amount', type: 'currency' },
        { label: 'Close At', fieldName: 'closeAt', type: 'date' },*/
    ];

    get searchOptions() {
        return [
            { label: 'Name', value: 'Name__c' },
            { label: 'Email', value: 'Email_Address__c' },
            { label: 'Contact Number', value: 'Contact_Number__c' },
            { label: 'Company Name', value: 'Company_Name__c' },
            { label: 'Company Number', value: 'Company_Number__c'},
        ];
    }

    get sizeOptions() {
        return [
            { label: '5', value: '5' },
            { label: '10', value: '10' },
            { label: '15', value: '15' },
            { label: '20', value: '20' },
            { label: '25', value: '25'},
            { label: '40', value: '40'},
        ];
    }

    handleChange(event) {
        this.selectedValue = event.detail.value;
    }

    handleSizeChange(event) {
        this.recordSize = event.detail.value;
        this.handleClick();
    }

    onChange(event){
        this.searchText = event.target.value;
    }

    handleClick(){
        GETINFO({searchText:this.searchText,fieldName:this.selectedValue})
        .then(result=>{
            this.data = result;
            console.log(this.data.length);
            this.totalRecords = this.data.length;
         })
         .catch(error=>{
            this.error = undefined;
         });
    }
 
    prepareSelectedRows(event){
        const selectedRows=event.detail.selectedRows; 
        this.infoList = []; 
        for (let i = 0; i < selectedRows.length; i++){           
          this.infoList.push(selectedRows[i]);
        }
    }

    deleteSelRecords(){
        DELETEINFOS({infoLst:this.infoList})
        
           .then(result=>{
               
               const evt =  new ShowToastEvent({
                   title : 'Success!',
                   message : 'Selected Records Deleted',
                   variant : 'success',
               });
               this.dispatchEvent(evt);
               this.infoList = []; 
               this.handleClick();
            })
            .catch(error=>{
              // this.error = undefined;
            });
            
       }

    updatePaginationHandler(event){
        this.visibleObjects=[...event.detail.records];
        console.log(':::::::::::'+event.detail.records);
   }
    
}