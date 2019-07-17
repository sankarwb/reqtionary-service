var sql = require('../config/sqlconfig'),
	RoleDAO = require('./RoleDAO');

var orgDAO = function (router) {
	router.post('/getOrgDetails',(req,res) => {
		getOrgDetails(req).then(results => res.json(results),error =>res.json({error:error}));
	});
	router.post('/updateOrgDetails',(req,res) => {
		updateOrgDetails(req).then(results => res.json(results),error => res.json({error:error}));
	});
	router.post('/orgChart',(req,res) => {
		getOrgChart(req).then(results => res.json(results),error => res.json({error:error}));
	});
}
function getOrgDetails(req){
	return new Promise((resolve,reject) => {
		var columns = ['LO.id_org','LRE.id_role','LRE.id_employee','name_role','LRE.active','LO.modified_by','fname_employee','lname_employee',
						'name_org','desc_org','sname_org','logopath_org','url_org'],
		qry = "SELECT ?? FROM light_org LO LEFT JOIN light_role_emp LRE ON LO.id_org=LRE.id_org AND id_div=0 AND "+
			  "id_appgrp=0 AND id_app=0 AND id_project=0 AND id_access=0 LEFT JOIN light_role LR ON "+
			  "LR.id_role=LRE.id_role LEFT JOIN light_employee LE ON LE.id_employee=LRE.id_employee WHERE LO.id_org=?;";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [],orgVO = {};
			if(err){
				console.log("\nget org details Failed: ",err);
				reject({error:"get user org details Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach((rowData, index) => {
					if(orgVO.id === rowData['id_org']){
						if(rowData['name_role'] !== null) orgVO.roles.push(RoleDAO.getRoleEmpObj(rowData));
					} else {
						orgVO = {};orgVO.roles = [];
						orgVO.id = rowData['id_org'];
						orgVO.name = rowData['name_org'];
						orgVO.desc = rowData['desc_org'];
						orgVO.sName = rowData['sname_org'];
						orgVO.logopath = rowData['logopath_org'];
						orgVO.url = rowData['url_org'];
						orgVO.modifiedByID = rowData['modified_by'];
						if(rowData['name_role'] !== null) orgVO.roles.push(RoleDAO.getRoleEmpObj(rowData));
						response.push(orgVO);
					}
				});
				resolve(orgVO);
			} else {
				console.log("\nNo organization found: ",rows);
				resolve({error:"No organization found"});
			}
		}
	})
}

function updateOrgDetails(req){
	return new Promise((resolve,reject) => {
		var qry = "SET @status=0;CALL sp_updateOrganisation(?,?,?,?,?,?,1,?,now(),@status);SELECT @status;";
		sql.multiQuery(qry, [req.body.id,req.body.name,req.body.desc,req.body.sName,req.body.logopath,
					req.body.url,req.body.modifiedByID], callback);
		function callback(err, rows, fields) {
			if(err){
				console.log("\nOrganization failed to update: ",err);
				reject({error:"Organization failed to update"});
			} else if(rows && rows.length > 0){
				RoleDAO.updateBulkRoleEmp( req, req.body.id, 'orgId' )
					.then( result => resolve({success:`${req.body.name} updated successfully`}),
							err =>  resolve({success:`${req.body.name} update failed`}) );
			} else {
				console.log("\nOrganization failed to update: ",rows);
				resolve({success:`${req.body.name} updated successfully`});
			}
		}
	})
}

function getOrgChart(req){
	return new Promise((resolve,reject) => {
		var columns = ['name_div', 'name_appgrp', 'name_app', 'name_project','active_app','type_project'],
		qry = "SELECT ?? FROM light_division LD LEFT JOIN light_appgrp LAG ON LD.id_div=LAG.id_div LEFT JOIN light_app LA ON "+
				"LAG.id_appgrp=LA.id_appgrp LEFT JOIN light_project LP ON LA.id_app=LP.id_app WHERE "+
				"LD.id_org=4";
		sql.query(qry, [columns,req.body.orgId], callback);
		function callback(err, rows, fields) {
			var response = [],orgVO = {name:'Org',children:[]},child = {};
			if(err){
				console.log("\nget org chart Failed: ",err);
				reject({error:"get org chart Failed"});
			} else if(rows && rows.length > 0){
				rows.forEach((rowData, index) => {
					if(child.name === rowData['name_div']) {
						child.children.push(rowData);
					} else {
						child = {name: rowData['name_div']};
						if(!child.children)
							child.children = [rowData];
						orgVO.children.push(child);
					}
				});
				appGrpChildren(orgVO.children,'name_appgrp');
				appChildren(orgVO.children,'name_app');
				projectChildren(orgVO.children,'name_project');
				resolve(orgVO);
			} else {
				console.log("\nNo organization found: ",rows);
				resolve({error:"No organization found"});
			}
		}
	})
}

function appGrpChildren(children,type) {
	if(children && children.length > 0) {
		children.forEach((child) => {
			let newChildren = [], newChild = {};
			child.children.forEach((subChild) => {
				if(newChild.name === subChild[type]) {
					if(subChild['active_app'] == 1)
						newChild.children.push(subChild);
				} else {
					newChild = {name: subChild[type]};
					if(!newChild.children)
						newChild.children = (subChild['active_app'] == 1)?[subChild]:[];
					if(newChild.name !== null)
						newChildren.push(newChild);
				}
			});
			child.children = newChildren;
		})
	}
}
function appChildren(children,type) {
	if(children && children.length > 0) {
		children.forEach((child) => {
			child.children.forEach((subChild) => {
				let newChildren = [], newChild = {};
				subChild.children.forEach((nodeChild) => {
					if(newChild.name === nodeChild[type]) {
						newChild.children.push(nodeChild);
					} else {
						newChild = {name: nodeChild[type]};
						if(!newChild.children)
							newChild.children = [nodeChild];
						if(newChild.name !== null)
							newChildren.push(newChild);
					}
				});
				subChild.children = newChildren;
			});
		})
	}
}
function projectChildren(children,type) {
	if(children && children.length > 0) {
		children.forEach((child) => {
			child.children.forEach((subChild) => {
				subChild.children.forEach((appChild) => {
					let newChildren = [], newChild = {};
					appChild.children.forEach((nodeChild) => {
						if(parseInt(nodeChild['type_project']) === 0) {
							newChild = {name: nodeChild[type]};
							if(newChild.name !== null)
								newChildren.push(newChild);
						}
					});
					appChild.children = newChildren;
				});
			});
		})
	}
}

module.exports = orgDAO;