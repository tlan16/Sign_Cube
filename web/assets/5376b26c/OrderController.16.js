/**
 * The page Js file
 */
var PageJs = new Class.create();
PageJs.prototype = Object.extend(new BPCPageJs(), {
	resultDivId: '' //the html id of the result div
	,searchDivId: '' //the html id of the search div
	,totalNoOfItemsId: '' //the html if of the total no of items
	,_pagination: {'pageNo': 1, 'pageSize': 10} //the pagination details
	,_searchCriteria: {} //the searching criteria
	,_infoTypes:{} //the infotype ids
	,orderStatuses: [] //the order statuses object
	
	
});