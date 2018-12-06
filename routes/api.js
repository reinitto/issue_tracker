/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var mongoose = require('mongoose')
const CONNECTION_STRING = process.env.DB; 
const db = mongoose.connect(CONNECTION_STRING,{useNewUrlParser:true}, function(err, db) {return db});
const Schema = mongoose.Schema

const issueSchema = new Schema({
issue_title: {type: String, required: true},
issue_text: {type: String, required: true},
created_on: {type: Date, default: Date.now()},
updated_on: Date,
created_by: {type: String, required: true},
assigned_to: String,
open: Boolean,
status_text: String,
project: String
})

const Issue = mongoose.model('issue', issueSchema)
function hasProps(obj){
  var arr = []
for(var i in obj){
    if(obj[i] !== "" ) { arr.push(i)}
    }
  if(arr.length > 0){ 
    return true }
  return false

}


module.exports = function (app) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
     
  Issue.find(req.params, "-project",(err, doc)=>{
      if(err) res.send('Project does not exist')
      else{
          res.json(doc)
      }
    })  
      
    })
    
    .post(function (req, res){
    var project = req.params.project;
    var issue = new Issue({
     project: project,
      open: true,
     issue_title: req.body.issue_title,
     issue_text: req.body.issue_text, 
     created_by: req.body.created_by,
     assigned_to: req.body.assigned_to || "",
     status_text: req.body.status_text || "",
     created_on: Date.now(),
      updated_on: Date.now()
      }).save((err,issue)=>{
          if(err) {           
            res.json(err.message)}
      else {
        res.json(issue)
      }
    })
   })
  
    
    .put(function (req, res){
      var project = req.params.project;
      var id = req.body._id;
    var props = {...req.body};
    delete props._id 
       if(!hasProps(props)){ 
         res.send("no updated field sent")
        } else {
    var nonEmptyProps = {}
    for(var i in props){
    if(props[i] !== "") { nonEmptyProps[i] = props[i]}
    }
    nonEmptyProps.updated_on = Date.now()
    Issue.findOneAndUpdate({_id: id},nonEmptyProps,{new:true}, (err,doc)=>{
      if(err) res.send('Could not find ' + id)
        else {
          res.send("Succesfully updated")
        }
      } )
    }
    })
  
    
    .delete(function (req, res){
      var project = req.params.project;
      var id = req.body._id
      if(!id){res.send( "No id provided")}
        else {
      Issue.findByIdAndDelete(id, (err)=>{
      if(err) {
        res.send("User not Found")}
        else {
          res.send("Issue deleted and forgotten about")
         // res.status(200).json({success:"Issue deleted and forgotten about"})
        }
      })
      }
    });
    
};
